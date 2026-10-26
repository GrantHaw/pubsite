# how the blog works

every folder in here is one post. the folder name becomes the url (/blog/<folder>).

- `index.md` is the big overview text. put frontmatter at the top:

```
---
title: My post title
date: 2026-10-26
summary: one line that shows in the folder list
draft: false
---
```

- every other file in the folder (.md, .pdf, images) shows up as a file you can click.
  .md files can have their own `title:` frontmatter too.
- set `draft: true` to hide a post.
- file and folder names: letters, numbers, dashes, dots, underscores. no spaces.
