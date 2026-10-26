---
title: Ocean Wildlife Revenge
category: forensics
---

`metadata.yaml`  shows us that we're looking at a ROS2 bag file. Google:

>In ROS 2, a **bag file** is a storage container used to record and play back messages published on topics, as well as service and action data. It allows developers to capture real-time data from a robot or simulation and reproduce it later for debugging, testing, or offline analysis. 

The metadata gives us some info:
- **Storage format:** SQLite3
- **Message count:** 1,412 messages
- **Duration:** ~8.9 seconds
- **Topics recorded:**
    - `/draw_commands` (295 messages, `std_msgs/msg/String`)
    - `/turtle1/pose` (558 messages, `turtlesim/msg/Pose`)
    - `/turtle1/color_sensor` (558 messages, `turtlesim/msg/Color`)
    - `/parameter_events` (1 message)

`/draw_commands ` topic stands out as most interesting, especially seeing how the last image was drawn out. It also uses `string` messages, so we decode it pretty easily.

the `.db3` file is a standard SQLite bd with a `messages` table. it looks like the `data` column is a CDR serialized blob that looks pretty straightforward with first 4 bytes being the encap header, next 4 being string length and a null terminated string data. We can  pull them out with python

```
import sqlite3, struct, json

db = sqlite3.connect('mystery_message_0.db3')
c = db.cursor()
# draw_commands is topic_id 4
rows = c.execute('SELECT data FROM messages WHERE topic_id=4 ORDER BY timestamp').fetchall()

for row in rows:
    raw = row[0]
    # cdr encoding: 4 byte header, 4 byte strlen, then the string
    slen = struct.unpack_from('<I', raw, 4)[0]
    txt = raw[8:8+slen-1].decode('utf-8')
    print(json.loads(txt))
```

then, there are two different commands. pen, which copntrols wether the turtle is drawing or not plus color and width. teleport just moves the turtle

then, we can use these commands to retrace the turtle
```
import json, sqlite3, struct
from PIL import Image, ImageDraw

conn = sqlite3.connect('mystery_message_0.db3')
cur = conn.cursor()
rows = cur.execute(
    'SELECT data FROM messages WHERE topic_id=4 ORDER BY timestamp'
).fetchall()

# parse all the commands out
cmds = []
for r in rows:
    blob = r[0]
    slen = struct.unpack_from('<I', blob, 4)[0]
    txt = blob[8 : 8+slen-1].decode()
    cmds.append(json.loads(txt))

# replay
drawing = False
x, y = 0.0, 0.0
segs = []

for c in cmds:
    if c['cmd'] == 'pen':
        drawing = (c['off'] == 0)  # off=0 means pen is down i guess
    elif c['cmd'] == 'teleport':
        nx, ny = c['x'], c['y']
        if drawing:
            segs.append(((x,y),(nx,ny)))
        x, y = nx, ny

#print("got " + str(len(segs)) + " line segments")

# draw it
sc = 140  # scale factor, turtlesim is like 11x8 units
w = int(10.5 * sc)
h = int(7.5 * sc)
img = Image.new('RGB', (w,h), (69,86,135))  # turtlesim default bg color
d = ImageDraw.Draw(img)

for s in segs:
    x1 = int(s[0][0] * sc)
    y1 = int((7.0 - s[0][1]) * sc)  # flip y, turtlesim has 0 at bottom
    x2 = int(s[1][0] * sc)
    y2 = int((7.0 - s[1][1]) * sc)
    d.line([(x1,y1),(x2,y2)], fill=(255,255,255), width=4)

img.save('mystery_message_decoded.png')
#img.show() # uncomment if u wanna see it right away
```

![](file:///C:/Users/tenni/Downloads/mystery_message/mystery_message/mystery_message_decoded.png)
