'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { h: '/', t: 'home' },
  { h: '/projects', t: 'projects' },
  { h: '/tools', t: 'tools' },
  { h: '/blog', t: 'blog' },
  { h: '/contact', t: 'contact' },
]

export default function Navbar() {
  const p = usePathname()
  // blog subpages should still light up the blog tab
  const on = (h) => (h === '/' ? p === '/' : p.startsWith(h))
  return (
    <nav className="nav">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="wordmark sm text-[30px] leading-none">ghaw.net</Link>
        <ul className="flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.h}>
              <Link href={l.h} className="gel" aria-current={on(l.h) ? 'page' : undefined}>{l.t}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
