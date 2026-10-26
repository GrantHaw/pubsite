// blog = folders in content/blog. each folder has index.md (the overview) + whatever other files
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

export const BASE = path.join(process.cwd(), 'content', 'blog')
const ok = (s) => /^[a-zA-Z0-9][\w.-]*$/.test(s) && !s.includes('..') // no sneaky paths

// tiny frontmatter parser, prob dont need gray-matter for this
function front(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { data: {}, body: src }
  const data = {}
  m[1].split(/\r?\n/).forEach((l) => {
    const i = l.indexOf(':')
    if (i > 0) data[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  })
  return { data: data, body: src.slice(m[0].length) }
}

function kind(f) {
  const e = path.extname(f).toLowerCase()
  if (e === '.md') return 'md'
  if (e === '.pdf') return 'pdf'
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(e)) return 'img'
  return 'file'
}

// obsidian style ![[Pasted image 123.png]] -> img/<slugged name>. lets me paste notes straight from obsidian
const slugify = (x) => x.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
function md(slug, body) {
  const b = body.replace(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (m, n) => {
    const f = slugify(n.replace(/^Pasted image /i, ''))
    return '![](/blog-files/' + slug + '/img/' + f + ')'
  })
  return marked.parse(b)
}

export function listFolders() {
  if (!fs.existsSync(BASE)) return []
  return fs.readdirSync(BASE, { withFileTypes: true })
    .filter((d) => d.isDirectory() && ok(d.name))
    .map((d) => getFolder(d.name))
    .filter(Boolean)
    .filter((f) => f.draft !== 'true')
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export function getFolder(slug) {
  if (!ok(slug)) return null
  const dir = path.join(BASE, slug)
  if (!fs.existsSync(dir)) return null
  const idx = path.join(dir, 'index.md')
  const fm = fs.existsSync(idx) ? front(fs.readFileSync(idx, 'utf8')) : { data: {}, body: '' }
  const files = fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name !== 'index.md' && ok(d.name))
    .map((d) => {
      const p = path.join(dir, d.name)
      const st = fs.statSync(p)
      const o = { name: d.name, kind: kind(d.name), size: st.size }
      if (o.kind === 'md') {
        const h = front(fs.readFileSync(p, 'utf8')).data
        if (h.title) o.title = h.title
        if (h.category) o.cat = h.category
      }
      return o
    })
    .sort((a, b) => (a.cat || '~').localeCompare(b.cat || '~') || (a.title || a.name).localeCompare(b.title || b.name))
  return {
    slug: slug,
    title: fm.data.title || slug,
    date: fm.data.date || '',
    summary: fm.data.summary || '',
    draft: fm.data.draft || 'false',
    html: md(slug, fm.body),
    files: files,
  }
}

export function getFile(slug, name) {
  const f = getFolder(slug)
  if (!f || !ok(name)) return null
  const hit = f.files.find((x) => x.name === name)
  if (!hit) return null
  const out = { folder: f, file: hit }
  if (hit.kind === 'md') {
    const fm = front(fs.readFileSync(path.join(BASE, slug, name), 'utf8'))
    out.title = fm.data.title || name
    out.html = md(slug, fm.body)
  }
  return out
}

export function rawPath(slug, name, sub) {
  if (!ok(slug) || !ok(name) || (sub && sub !== 'img')) return null
  const p = sub ? path.join(BASE, slug, sub, name) : path.join(BASE, slug, name)
  if (!p.startsWith(BASE + path.sep) || !fs.existsSync(p)) return null
  return p
}

export function prettySize(n) {
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB'
  return (n / 1024 / 1024).toFixed(1) + ' MB'
}

export function prettyDate(d) {
  if (!d) return ''
  const x = new Date(d + 'T12:00:00')
  if (isNaN(x)) return d
  return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
