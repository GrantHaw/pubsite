---
title: not quite optimal
category: rev
---

first I ran strings and found RITSEC{ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL_...}. Like i know this isnt the flag but its so smart to put something in to just stop claude i hope it worked well lol

running the binary gives a chatbot style program, where if you put in the correct answers "looking for the flag", "please", "PLEASE MAY I HAVE THE FLAG" starts eating up a whole heck ton of ram, and doesnt look like it'll finish any time soon soooooo we're gonna actually reverse the reverse challenge ig

(yes, i use objdump instead of ghidra my beHATED)

it looks like the flag is 84 characters, and calls a function at 0x1800 per character. this function looks like it sleeps for index * 300 millis, loads two values from a lookup table, then calls a recursive function with those values. this function looks like 

```
f(result_mpz, a, b):
    if b == 0: result = 1
    if b == 1: result = a
    if a == 0: result = 0
    if a == 1: result = 1
    otherwise:
        temp = f(temp_mpz, a, b - 1)     // recurse
        result = a ^ temp                 // GMP exponentiation
    return (result mod 256 + 1) >> 1      // final byte
```

It looks like a binary square and multiply loop using GMP. I can see `gmpz_mul`, `gmpz_fdiv_q_2exp` (right shift), and a bit test for odd/even. But the recurse is the key because it computes `a` raised to the power of `f(a, b-1)`, which is raised to the power of `f(a, b-2)`, and so on. My first thought was "ok it's some kind of recursive exponentiation, maybe modular exponentiation done weirdly?" I was trying to figure out if the mod 256 at the return affected the recursive calls (it doesn't, the GMP bignum holds the full value, the mod is only for the final character output). Once I realized the GMP variable carries the _entire_ unmodified result up through the recursion (and through some more research into recursive functions) i found that it wasx tetration:
`a ↑↑ b = a^(a^(a^(a^...)))    b copies of a`

sooo i dumped the rodata section to extract the lookup table and got
```
Indices 0-20:   (706619, 2), (1649525, 2), ...     large a, b=2
Indices 21-41:  (153, 3), (315, 3), (245, 3), ...  small a, b=3
Indices 42-62:  (37821, 4), (378893, 4), ...        medium a, b=4
Indices 63-83:  (54159, 149342), ...                 large a, large b
```

This is why it OOMs. For the b=2 group, `a ↑↑ 2 = a^a`, which is big but technically computable. For b=3 though, take entry 21: `153 ↑↑ 3 = 153^(153^153)`. `153^153` alone is a ~334 digit number. then you raise 153 to THAT power. The result would have roughly 10^334 digits. You would need more storage than atoms in the observable universe. and the b=4 entries are even worse. my computer is good but not that good and i highkey dont think any computer iun the world could do this lol

so for the actual solve, we only need the result mod 256 for each character. we dont need the whole entire tower. since the `a` values are all add, they're all coprime (their only common positive factor is 1) to 256, which means we can use Euler's! Wikipedia:

>In [number theory](https://en.wikipedia.org/wiki/Number_theory "Number theory"), **Euler's theorem** (also known as the **Fermat–Euler theorem** or **Euler's totient theorem**) states that, if _n_ and _a_ are [coprime](https://en.wikipedia.org/wiki/Coprime "Coprime") positive integers, then aφ(n)![{\displaystyle a^{\varphi (n)}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/bb559a70a1b64bfa864fcb458ef9ebd027dc734e) is congruent to 1![{\displaystyle 1}](https://wikimedia.org/api/rest_v1/media/math/render/svg/92d98b82a3778f043108d4e20960a9193df57cbf) [modulo](https://en.wikipedia.org/wiki/Modular_arithmetic "Modular arithmetic") _n_, where φ![{\displaystyle \varphi }](https://wikimedia.org/api/rest_v1/media/math/render/svg/33ee699558d09cf9d653f6351f9fda0b2f4aaa3e) denotes [Euler's totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function "Euler's totient function"); that is

>aφ(n)≡1(modn).![{\displaystyle a^{\varphi (n)}\equiv 1{\pmod {n}}.}](https://wikimedia.org/api/rest_v1/media/math/render/svg/6a8462fedd83478425cea1c06dbb60c14c08c2bb)


And anything mod 1 is 0, so the recursion bottoms out after at most 8 levels regardless of how absurdly large `b` is. Instead of materializing a number with 10^334 digits, we're doing like eight calls to Python's `pow(a, exp, mod)`. The whole thing finishes instantly.

I sanity-checked this by computing the first character manually. Entry 0 is `(706619, 2)`:

- `tetration_mod(706619, 2, 256)`: need exp = `706619 mod 128 = 59`, then `pow(706619, 59, 256)` which is `pow(59, 59, 256) = 163`
- Character: `(163 + 1) >> 1 = 82 = 'R'` YIPPEEEE THIS IS THE FIRST CHARACTER OF THE FLAG!!!!!

```
import struct

with open('not_quite_optimal', 'rb') as f:
    data = f.read()

marker = bytes.fromhex('3bc80a00000000000200000000000000')
table_offset = data.find(marker)

entries = []
for i in range(84):
    off = table_offset + i * 16
    a = struct.unpack('<Q', data[off:off+8])[0]
    b = struct.unpack('<Q', data[off+8:off+16])[0]
    entries.append((a, b))

def tetration_mod(a, b, m):
    if m == 1:
        return 0
    if b == 0:
        return 1 % m
    if b == 1:
        return a % m
    if a == 0:
        return 0
    if a == 1:
        return 1
    phi = m // 2
    exp = tetration_mod(a, b - 1, phi)
    return pow(a, exp, m)

flag = ""
for a, b in entries:
    val = tetration_mod(a, b, 256)
    ch = (val + 1) >> 1
    flag += chr(ch)

print(flag)
```

![](/blog-files/ritsec-ctf-2026/img/20260405164135.png)
