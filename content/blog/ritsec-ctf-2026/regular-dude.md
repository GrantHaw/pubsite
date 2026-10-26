---
title: Regular Dude
category: web
---

"regular dude" like def points to regex. looking at the file, we can see usernames are checked for 'admin' using this line: `re.match(r'^admin$', ...)` but we can sign ourselves up as admin\n to bypass the registration check. `re.match('^admin$')` still matches because `$` in Python regex matches before a trailing newline by default. that was the easy part

looking at the code, we're expected to upload a .h5 file. google says:

>An .h5 (or HDF5) file is an open-source binary format designed to store and manage large, complex, heterogeneous, and numerical datasets, such as machine learning models or scientific simulation results

but what really caught my eye was this line:
`model = keras.models.load_model(model_path, safe_mode=False)`

I've never ever used a .h5 model, but safe mode HAD to be set to false for a reason. After some more research, it looked like it prevents the execution of arbitrary python code embedded within lambda layers.

In my research, I found this GH repo: https://github.com/Splinter0/tensorflow-rce

Basing my h5 file on that, I was successfully able to achieve RCE with the .h5. the most important line in the file was 
`tf.keras.layers.Lambda(lambda x: __import__("os").environ.get("FLAG", "NOT_FOUND"))`

Basically, grabbing the FLAG environment variable and returning it as the output in predictions.

(by the way, I worked on this for two hours before Owen sent the announcement saying it was broken. thanks guys.)
![](/blog-files/ritsec-ctf-2026/img/20260405165240.png)
