'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Pixel from './Pixel'
import { NowMini } from './NowPlaying'

const nav = [
  { h: '/', t: 'home', ico: 'home' },
  { h: '/projects', t: 'projects', ico: 'floppy' },
  { h: '/blog', t: 'blog', ico: 'folder' },
  { h: '/music', t: 'my music', ico: 'note' },
  { h: '/contact', t: 'contact', ico: 'mail' },
]

// the whole chrome housing. children render on the dark screen in the middle
export default function Rig({ folders, children }) {
  const p = usePathname() || '/'
  const on = (h) => (h === '/' ? p === '/' : p.startsWith(h))
  const idx = nav.findIndex((n) => on(n.h))

  // sub links change per section, like the old portal sites
  let sub = []
  if (p === '/') sub = [{ h: '#about', t: 'about' }, { h: '#shell', t: 'shell' }, { h: '#gitlog', t: 'git log' }, { h: '#latest', t: 'latest' }]
  else if (p.startsWith('/projects')) sub = [{ h: '/projects#mallard', t: 'mallard' }, { h: '/projects#homelab', t: 'homelab' }, { h: '/projects#ctf', t: 'ctfs' }, { h: '/projects#tools', t: 'tools' }]
  else if (p.startsWith('/blog')) sub = [{ h: '/blog', t: 'all posts' }].concat((folders || []).slice(0, 5).map((f) => ({ h: '/blog/' + f.slug, t: f.slug })))
  else if (p.startsWith('/music')) sub = [{ h: '/music#player', t: 'now playing' }, { h: '/music#playlist', t: 'playlist' }, { h: '/music#rotation', t: 'current rotation' }]
  else if (p.startsWith('/contact')) sub = [{ h: 'mailto:contactme@ghaw.net', t: 'email' }, { h: 'https://www.linkedin.com/in/grant-hawerlander/', t: 'linkedin' }, { h: 'https://github.com/GrantHaw', t: 'github' }]

  return (
    <div className="rig">
      <span className="rivet" style={{ left: 14, top: 14 }} aria-hidden="true" />
      <span className="rivet" style={{ right: 14, top: 14 }} aria-hidden="true" />
      <span className="rivet" style={{ left: 14, bottom: 14 }} aria-hidden="true" />
      <span className="rivet" style={{ right: 14, bottom: 14 }} aria-hidden="true" />

      <header className="rig-top">
        <svg className="swoosh swoosh-deco hidden md:block" viewBox="0 0 1130 132" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="sw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" /><stop offset=".45" stopColor="#dfe2ea" /><stop offset=".5" stopColor="#9a9fb0" /><stop offset=".55" stopColor="#f4f5fa" /><stop offset="1" stopColor="#c3c7d4" />
            </linearGradient>
          </defs>
          <path d="M0 132 V30 Q0 6 24 6 H420 C560 6 600 64 730 64 H1106 Q1130 64 1130 88 V132 Z" fill="url(#sw)" stroke="#2a0822" strokeWidth="2" />
          <path d="M14 22 H420 C552 22 598 80 730 80 H1116" fill="none" stroke="#ff3ea5" strokeWidth="2" opacity=".8" />
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={i} x={470 + i * 10} y={18 + Math.pow(i / 23, 1.4) * 50} width="4" height="8" fill="#2a0822" opacity=".5" />
          ))}
        </svg>
        <Link href="/" className="rig-brand wordmark text-[clamp(30px,4.4vw,52px)]" aria-label="ghaw.net home">ghaw.net</Link>
        <div className="hidden md:flex absolute right-8 top-[104px] items-center gap-4" aria-hidden="true">
          <div className="leds">{nav.map((n, i) => <span key={n.h} className={'led' + (i === idx ? ' on' : '')} />)}</div>
          <div className="hazard w-40" />
        </div>
        <nav aria-label="Main" className="md:-mt-[34px] relative">
          <div className="navbar">
            {nav.map((n) => (
              <Link key={n.h} href={n.h} aria-current={on(n.h) ? 'page' : undefined}>
                <Pixel name={n.ico} size={2} />{n.t}
              </Link>
            ))}
          </div>
          {sub.length ? (
            <div className="subnav">
              {sub.map((s, i) => (
                <span key={s.h} className="flex items-center gap-[14px]">
                  {i ? <span className="sep" aria-hidden="true">|</span> : null}
                  <a href={s.h} target={s.h.startsWith('http') ? '_blank' : undefined} rel={s.h.startsWith('http') ? 'noopener noreferrer' : undefined}>{s.t}</a>
                </span>
              ))}
            </div>
          ) : null}
        </nav>
      </header>

      <main className="screen" id="top">{children}</main>

      <footer className="rig-bottom">
        <span className="grille hidden sm:block" aria-hidden="true" />
        <div className="flex flex-col items-center gap-2">
          <NowMini />
          <p className="text-[13px]">&copy; {new Date().getFullYear()} Grant Hawerlander</p>
        </div>
        <span className="knob hidden sm:block justify-self-end" aria-hidden="true" />
      </footer>
    </div>
  )
}
