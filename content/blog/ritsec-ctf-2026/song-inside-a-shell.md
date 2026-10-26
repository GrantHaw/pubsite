---
title: Song Inside a Shell
category: forensics
---

Sound file!!! Using audacity, I looked at the spectrogram, lsb extraction and found nothing. Other than the little exiftool "For the last time, you gotta do more than run exiftool on files...' quip

Then, I listened to it. For the most part, it sounded normal until about 90 seconds in, when I could almost hear something else in the background. Additionally, it was weird that we were given a stereo file. Usually in CTFs, you only get a mono file, so it was worth checking the differences in channels. With help from this article:
https://forum.audacityteam.org/t/how-to-determine-if-l-and-r-channels-of-a-stereo-track-are-t/46888

I was able to split it into two mono tracks, invert one of them, then re-mix them back together. There, I found slight quips from around 80 seconds to 100.

![](/blog-files/ritsec-ctf-2026/img/20260404214819.png)

Listening, they sounded reversed. Reversing the track gave the flag split down the center.
