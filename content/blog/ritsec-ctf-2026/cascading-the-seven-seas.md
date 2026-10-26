---
title: Cascading the Seven Seas
category: web
---

why is this a whole entire x86 emulator in a website im here to do like xss not this stuff


`@property --mN` is like one byte of RAM. You know this because you can see `--AX`, `--BX`, `--CX`, `--DX`, `--SP`, `--IP`, `--SI`, `--DI` (shoutout to Rob Olsen for teaching me that one). `--IP` is at `769` (0x301). `--SP` starts at `1560`. Then you see hundreds of `--m0`, `--m1`, `--m2`... each with an `initial-value` integer.

We can write a simple little python script using re.findall to pull out all initial values

```
import re

f = open('index.txt').read()
# grab all the @property --mN declarations
hits = re.findall(r'@property --m(\d+) \{[^}]*initial-value: ([^;]+);', f)
mem = {}
for h in hits:
    mem[int(h[0])] = int(h[1])

# dump it all as raw bytes
out = b''
for i in range(1568):
    out += bytes([mem.get(i, 0)])

open('prog.bin','wb').write(out)
```

Then, we can disassemble as 16-bit x86 beginning at the instruction pointer using capstone

```
from capstone import *

raw = open('prog.bin','rb').read()
md = Cs(CS_ARCH_X86, CS_MODE_16)
for i in md.disasm(raw[0x100:], 0x100):
    print(f"0x{i.address:04x}: {i.mnemonic} {i.op_str}")
    # if i.address > 0x500: break  # was using this to not flood terminal
```

Then we can see a bunch of different things, such as the main function that runs 3 rounds and the validator. we realllllly just want the validator. 

The core loop goes from `0x01b4` to `0x0207`. So what happens is `0x01ce` loads the second word out of the table entry at `[cx+2]`, then uses that as an index into our input buffer to get `input[p2]`. `0x01d7` is literally the same thing but with `[cx+4]` for p3 instead. Add those two together at `0x01dd`. After that it grabs p1 from `[cx]` at `0x01e1`, xors the sum with p1 at `0x01e6`, then at `0x01eb` it compares that against whatever the expected value is in the table.

If the cmp doesn't match it bails to `0x01f3` and returns 1, so, wrong answer. If it does match, `0x0206` just bumps the counter and we go back to the top of the loop. Once everything checks out and there's nothing left to compare, we fall through to `0x01b9` and return 0.

so in other words:

```
(input[p2] + input[p3]) XOR input[p1] == expected
```

so we can now use one script to get it all in one fell swoop using z3:

```
import re
from z3 import *

#rip all the css @property declarations out of the html
# --mN is basically one byte of RAM in this nonsense
def load_mem(path):
    f = open(path).read()
    hits = re.findall(r'@property --m(\d+) \{[^}]*initial-value: ([^;]+);', f)
    mem = {}
    for h in hits:
        mem[int(h[0])] = int(h[1])
    return mem

#helper to read 16bit little-endian words
#the css cpu is 16 bit so everything is stored as word pairs
def w(mem, addr):
    lo = mem.get(addr, 0)
    hi = mem.get(addr+1, 0)
    return lo | (hi << 8)

#pull the constraint tables out of memory
#each entry is 8 bytes: (p1, p2, p3, expected)
#validator checks: (input[p2] + input[p3]) XOR input[p1] == expected
def get_table(mem, base, cnt):
    tbl = []
    for i in range(cnt):
        off = base + i*8
        p1 = w(mem, off)
        p2 = w(mem, off+2)
        p3 = w(mem, off+4)
        exp = w(mem, off+6)
        tbl.append((p1, p2, p3, exp))
        #print("  constraint " + str(i) + ": (" + str(p1) + "," + str(p2) + "," + str(p3) + ") -> " + str(exp))
    return tbl

#throw the constraints at z3 and let it figure it out
#z3 finds the only set of printable ascii chars that satisfies every single xor equation simultaneously

def solve(tbl, n):
    slv = Solver()
    # n unknown characters as 16bit bitvectors
    c = [BitVec('c' + str(i), 16) for i in range(n)]
    # constrain to printable ascii range
    for x in c:
        slv.add(x >= 32, x <= 126)
    # add the actual constraints from the table
    for (p1, p2, p3, exp) in tbl:
        slv.add((c[p2] + c[p3]) ^ c[p1] == exp)
    slv.check()
    m = slv.model()
    return ''.join(chr(m[x].as_long()) for x in c)

# --- main ---
mem = load_mem('index.txt')

# there are 2 quiz questions before the flag
# found these addresses from the disassembly
q1_tbl = get_table(mem, 0x470, 10)
q2_tbl = get_table(mem, 0x420, 10)
flag_tbl = get_table(mem, 0x320, 32)

print("Q1:", solve(q1_tbl, 7))
print("Q2:", solve(q2_tbl, 5))
print("Flag:", solve(flag_tbl, 32))
```

Z3 is a constraint solver. so we have 
- The unknowns are the 32 flag characters
- The rules come from the constraint table in the binary
- Z3 finds the one combination of characters where every single `(input[p2] + input[p3]) XOR input[p1] == expected` check passes simultaneously

So this big file:
1. Loads the HTML file
2. Reads 16 bit words from memory
3. Read a constraint table
4. Solve with Z3
![](/blog-files/ritsec-ctf-2026/img/20260405161110.png)
