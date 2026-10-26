---
title: Buried Treasure
category: rev
---

First, we can see its an ELF file. Running the binary, it asks "enter the flag:" and says "no :(" if wrong. 

![](/blog-files/ritsec-ctf-2026/img/20260405161434.png)

buttt if we file it, then it's a 384KB string checker??? and hey im not a CS student but thats pretty huge

statically, I couldn't find much. i ran `strings` on the whole binary hoping to find some interesting constants but just found libc garbo. I saw some references to `/dev/null` or `__vdso_clock_gettime` that made me think it may do some debugging checks, so i wasted time looking into that before doing more research and finding out that those are standard TinyGo runtime things.

I also tried searching for embedded ELF headers inside the binary, thinking maybe the nested layers were just concatenated in there and I could carve them out with `binwalk` or a quick grep for `\x7fELF` (shoutout to Wicys CTF where half the challenges used binwalk). Only found the one at offset 0. The nested binaries aren't stored statically at all, they're constructed at runtime, which I only figured out after moving on to dynamic analysis.

running it and using `strace` to watch the syscalls, it calls `memfd_create` to make an anonymous in-memory file, then `write`s an entire new ELF binary into it, then `execve`s that new binary via `/proc/self/fd/3`. So literally just making it smaller and smaller and smaller 30 layers deep. 

```
16098 memfd_create("", MFD_CLOEXEC)     = 3
16098 getpid()                          = 16098
16098 write(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\2\0>\0\1\0\0\0\300x%\0\0\0\0\0"..., 367016) = 367016
16098 prlimit64(0, RLIMIT_NOFILE, {rlim_cur=1024, rlim_max=512*1024}, NULL) = 0
16098 execve("/proc/16098/fd/3", [], 0x7f731725a670 /* 20 vars */) = 0
```

Since the binary is statically linked, things like LD_PRELOAD didn't work, so I had to use GDB with a write syscall breakpoint. my first attempt was actually trying to grab the data from `/proc/pid/fd/3` with a shell script that polled in a loop, but the window between write and execve is basically instant so I never caught anything useful. The GDB approach was way more reliable. Every time fd 3 got written to, GDB dumped contents into a file, letting me separate every layer into different binaries.

![](/blog-files/ritsec-ctf-2026/img/20260405162649.png)

The innermost layer is the one that checks the flag. there, we can see "enter the flag:", "meow :D" and "no :(".

![](/blog-files/ritsec-ctf-2026/img/20260405162718.png)


It also showed that TinyGo compiled it, meaning we can just decompile it and remove some oif the TinyGo boilerplate.

The core loop looks like:
`result = input[i] * (13 * (i + 1)) + (38 + i)`
which reads against hardcoded values. but i took calc 2 i know how to do basic algebra

`flag[i] = (expected[i] - (38 + i)) / (13 * (i + 1))` is the reverse. Pulled each one out of the binary, plughged them into my formula and it gave me the flag.

![](/blog-files/ritsec-ctf-2026/img/20260405163348.png)
