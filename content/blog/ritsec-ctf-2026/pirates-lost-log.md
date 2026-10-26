---
title: Pirate's Lost Log
category: osint
---

Okay so just looking at the words "each leading to the next like a chain of clues on a treasure map." screams NSEC zone walking. Basically, NSEC zone walking is a DNS enumeration method that was phased out with NSEC3, but this one is just NSEC. each record points alphabetically to the next name in the zone, so we just need to go through each zone.

It has become clear to me there are a heck ton of zones in this thing. We can automate zone enum using a simple little bash script

```
CURRENT="linksnsec.stellasec.com"
   while true; do
     NEXT=$(dig +tcp +short @1.1.1.1 "$CURRENT" NSEC | awk '{print $1}')
     TXT=$(dig +tcp +short @1.1.1.1 "$CURRENT" TXT)
     echo "$CURRENT says $TXT"
     [ "$NEXT" = "linksnsec.stellasec.com." ] && break
     CURRENT="$NEXT"
   done
```

basically, set current to the start zone, dig its NSEC values and TXT values and just go down the line. while my script kept going past numbers and to zones starting with a, `67ljie.linksnsec.stellasec.com` had a txt record of "thebartentersawcaptainjackwalkintothebarwiththeshipswheelaroundhisnutsthebartenderaskedhimwhatwasgoingoncaptainjackrepliedyaaritsdrivingmenuts" which is a pirate joke and fits the theme. wrapped RS{} around it and submitted.
