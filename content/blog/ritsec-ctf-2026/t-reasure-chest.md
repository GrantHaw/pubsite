---
title: T-reasure Chest
category: rev
---

just by opening this thing up i can see that it's an ELF file by the header. By running strings on the binary, we can see `tiny_encH` / `rypt_keyH`. Also success/failure messages, so it looks like it reads input, encrypts then doublechecks.

I literally just looked up "Tiny Encryption Key". And I got Tiny Encryption Algothithm. There, I found that it usually uses 32 runs. checking objdump, we can see that the constant `0x9e3779b9` did that.

Then, I traced to main to see where the expected cyphertext that it's checked against lives (0x404080)

then, I found a C decoder script on gh (https://github.com/coderarjob/tea-c) and adapted it
```
import struct

DATA_SIZE = 8

# decode() from https://github.com/coderarjob/tea-c/blob/master/tea.c
def decode(v, k):
    v0 = v[0]
    v1 = v[1]
    delta = 0x9e3779b9
    n = 32
    sum = (delta * 32) & 0xFFFFFFFF

    while n > 0:
        v1 = (v1 - (((v0<<4) + k[2]) ^ (v0 + sum) ^ ((v0>>5) + k[3]))) & 0xFFFFFFFF
        v0 = (v0 - (((v1<<4) + k[0]) ^ (v1 + sum) ^ ((v1>>5) + k[1]))) & 0xFFFFFFFF
        sum = (sum - delta) & 0xFFFFFFFF
        n -= 1

    v[0] = v0
    v[1] = v1

# code() from same file, dont actually need this but keeping it
def code(v, k):
    v0 = v[0]
    v1 = v[1]
    delta = 0x9e3779b9
    n = 32
    sum = 0

    while n > 0:
        sum = (sum + delta) & 0xFFFFFFFF
        v0 = (v0 + (((v1<<4) + k[0]) ^ (v1 + sum) ^ ((v1>>5) + k[1]))) & 0xFFFFFFFF
        v1 = (v1 + (((v0<<4) + k[2]) ^ (v0 + sum) ^ ((v0>>5) + k[3]))) & 0xFFFFFFFF
        n -= 1

    v[0] = v0
    v[1] = v1


# ciphertext from objdump, lives at 0x404080
ct = bytes.fromhex('38755bcb44d2be5d969c5643ea9806754a4813e6d4e88e4f72708bffdc99f876')
# key from running strings on the binary
key = list(struct.unpack('<4I', b'tiny_encrypt_key'))

# just loop through 8 bytes at a time and decrypt each block
out = b''
for i in range(0, len(ct), DATA_SIZE):
    d = list(struct.unpack('<2I', ct[i:i+DATA_SIZE]))
    decode(d, key)
    out += struct.pack('<2I', d[0], d[1])
    #print(out)

flag = out.rstrip(b'\x00').decode()
print(flag)
```
