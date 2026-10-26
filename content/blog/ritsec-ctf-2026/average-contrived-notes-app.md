---
title: average contrived notes app
category: web
---

(i apologize. this is more of a braindump than a writeup. im so scared of the AI purges lmao)

okay im going to be so fr idek where to start. however there is a large chance that it has to do with reportURL, because that gives us a cookie. 

actually nvm im stupid its the same cookie across the site no duh

okay `RS{meow_meow_fake_flag}` was obviously a fake flag but yknow what i just had to try it like just in case

 Index.js has nothing really sticking out to me. Except for DOMPurify, replacing separators. Most common vectors here are covered. However, you can see that the URL uses `/?search=<search>`, which could point to URL injection. However, `<script>alert('XSS')</script>` doesn't do anything. Doing more research with DOMPurify tells me that all basic stuff is covered. Lets look into bot.js more

it looks like it:
1. Opens up the site
2. main() runs renderNotes, sees no notes, sets localStorage to ""
3. bot types flag and saves
4. That triggers add note, which creates the note and sends it to /api/notes
5. Bot goes to submitted URL, sits on it, then closes it after timeout, which is set to 120 seconds

okay it basically looks like the flag is in localstorage?? but im highkey lost on how to get it

lets open a webhook and see what it gets. it at least looks like it queries it. which means we can try to do something with that??? report site just seems weird to have, and its GOTTA be something

here are the endpoints:

POST /api/notes
GET /api/notes?search=x returns notes containing x
POST /api/bot accepts a URL and sends puppeteer bot to visit it for 120 seconds
GET / is the static page

here is what the bot does:
1. launches chromium with specific flags
	  --disable-features=ThirdPartyStoragePartitioning
--disable-features=BlockInsecurePrivateNetworkRequests
--disable-features=IsolateOrigins
--disable-site-isolation-trials
--disable-features=LazyFrameLoading

why these flags???

2.  Opens the challenge site, types the flag into the note input, clicks save, and waits for idle
3. closes that tab
4. opens a new tab to the attacker-supplied URL in the report box
5. Waits 120 seconds, then shuts down

looking at it, the flag should be in a server-side session and localStorage. on page load, it runs

```
async function main() {
    renderNotes(localStorage.getItem('notes')
        ? localStorage.getItem('notes')
        : await fetchNotes())
}
```

so if we already have notes cached, the page uses those instead of a network req. not sure if there's a different way, but it looks like we need to get it from clientside not network

renderNotes does this:
```
for (const [i, n] of (getQuery()
    ? new_notes_split.filter((n) => { return n.includes(getQuery()) }).sort()
    : new_notes_split).entries()) {
    const card = document.createElement('a')
    card.className = 'note-card'
    card.id = `note-${i}`
    card.href = `/?search=${n}`
    card.textContent = n
    notes.appendChild(card)
}
```
when a search is there and matches a note, function creates `<a>` elements and n+1's their ids.

sooooo i know all that but what tf am i doing with it... the flags are probably important though. google says:

> ## What is storage partitioning?
To prevent certain types of side-channel cross-site tracking, Chrome partitions storage and communications APIs in third-party contexts.
Without storage partitioning, a site can join data across different sites to track the user across the web. Also, it allows the embedded site to infer specific states about the user in the top-level site using side-channel techniques such as [Timing Attacks](https://dl.acm.org/doi/10.1145/352600.352606), [XS-Leaks](https://github.com/xsleaks/xsleaks), and [COSI](https://arxiv.org/pdf/1908.02204.pdf).

so lets look into these three?>??? maybe???

Timing attack no becauyse i can measure but it doesnt seem that helpful?? like im sooooooo not inferring times and if this is the way to go you beat me

ITS GOTTA BE AN XS-LEAK BECAUSE ITS about sites interacting with eachother and you would not have a report that sends a request to a webhook without smth like this im lookin into it

XS-Leaks wiki:
>## Cross-site oracles [#](https://xsleaks.dev/#cross-site-oracles)
The pieces of information used for an XS-Leak usually have a binary form and are referred to as “oracles”. Oracles generally answer with _YES_ or _NO_ to cleverly prepared questions in a way that is visible to an attacker. For example, an oracle can be asked:
> Does the word _secret_ appear in the user’s search results in another web application?
This question might be equivalent to asking:
> Does the query _?query=secret_ return an _HTTP 200_ status code?
Since it is possible to detect the _HTTP 200_ status code with [Error Events](https://xsleaks.dev/docs/attacks/error-events/), this has the same effect as asking:
> Does loading a resource from _?query=secret_ in the application trigger the _onload_ event?
The above query could be repeated by an attacker for many different keywords, and as a result the answers could be used to infer sensitive information about the user’s data.
Browsers provide a wide range of different APIs that, while well-intended, can end up leaking small amounts of cross-origin information. They are described in detail throughout this wiki.

okay. the `<a>` tags are focusable elements (they have href) so when we load /search=GUESS#note-0, the browser tries to find the element and then focuses it. `document.activeElement === iframe` tells us that. soooo it looks like that's the oracle. by looking at XS-leaks info, the oracle gives us yes or no. so we can just enumerate the flag in note-0 slowly and alphanumerically, and if the prefix `RS{`+ candidate alphanumeric values are in there and match, it can work! but like how do i get that on another website....

okay finished. since the bot goes to another webpage, I can create a exploit.html file, start a http server with python on my kali vm and then localhost.run to make that an accessible tunnel to connect to. i just put the code in the html, have it check each focused frame for YES, then send that info to a public webhook. was successfully able to get each request 

![](/blog-files/ritsec-ctf-2026/img/20260405161253.png)
