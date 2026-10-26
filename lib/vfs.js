// builds the fake filesystem the shell walks around in. its all real site content tho
import fs from 'fs'
import path from 'path'
import projects from '../data/projects'
import tools from '../data/tools'
import { listFolders, BASE } from './blog'

const about = "hiii, I'm Grant! I'm a cybersecurity student at RIT and a penetration testing intern at Coalfire's Division Hex. My current specialty is AI/LLM penetration testing, particularly prompt injection, data and model poisoning, and system prompt leakage.\n\nI also run management operations for the RIT ITS Tech Center, building the internal tools that keep the repair shop running! Off the clock I'm playing CTFs, emulating retro Wii games, or getting yelled at by my cat, Pinto.\n"

const safe = (x) => x.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

export function buildTree(pl) {
  const proj = {}
  projects.forEach((p) => {
    proj[p.id + '.txt'] = { t: 'f', body: p.title + '\n\n' + p.desc + (p.link ? '\n\n' + p.link : '') + '\n', go: '/projects#' + p.id }
  })
  const tl = {}
  tools.forEach((x) => {
    tl[x.id + '.txt'] = { t: 'f', body: x.name + '\n\n' + x.what + '\n' + x.tech + (x.link ? '\n' + x.link : '') + '\n', go: '/projects#tools' }
  })
  proj.tools = { t: 'd', kids: tl, go: '/projects#tools' }

  const blog = {}
  listFolders().forEach((f) => {
    const kids = {}
    const dir = path.join(BASE, f.slug)
    kids['index.md'] = { t: 'f', body: fs.readFileSync(path.join(dir, 'index.md'), 'utf8'), go: '/blog/' + f.slug }
    f.files.forEach((x) => {
      kids[x.name] = x.kind === 'md'
        ? { t: 'f', body: fs.readFileSync(path.join(dir, x.name), 'utf8'), go: '/blog/' + f.slug + '/' + x.name }
        : { t: 'f', bin: true, go: '/blog/' + f.slug + '/' + x.name }
    })
    blog[f.slug] = { t: 'd', kids: kids, go: '/blog/' + f.slug }
  })

  return {
    t: 'd',
    kids: {
      'about.txt': { t: 'f', body: about, go: '/' },
      'contact.txt': { t: 'f', body: 'email:    contactme@ghaw.net\nlinkedin: https://www.linkedin.com/in/grant-hawerlander/\ngithub:   https://github.com/GrantHaw\n', go: '/contact' },
      projects: { t: 'd', kids: proj, go: '/projects' },
      blog: { t: 'd', kids: blog, go: '/blog' },
      music: { t: 'd', kids: musicKids(pl), go: '/music' },
    },
  }
}

// playlist tracks as files. cat gives the info, open goes to spotify
function musicKids(pl) {
  const k = {}
  if (!pl) { k['not-connected.txt'] = { t: 'f', body: 'spotify isnt hooked up yet.\n', go: '/music' }; return k }
  pl.tracks.forEach((t, i) => {
    const n = String(i + 1).padStart(2, '0') + '-' + safe(t.artist + ' ' + t.title) + '.txt'
    const mm = Math.floor(t.dur / 60000) + ':' + String(Math.floor(t.dur / 1000) % 60).padStart(2, '0')
    k[n] = { t: 'f', body: t.title + '\n' + t.artist + '\n' + t.album + ' (' + mm + ')\n' + (t.url || '') + '\n', go: t.url || '/music' }
  })
  return k
}
