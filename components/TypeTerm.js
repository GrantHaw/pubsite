'use client'
import { useEffect, useState } from 'react'

// plays the lines out once on load. everything renders up front for no-js / reduced motion
export default function TypeTerm({ lines }) {
  const [n, setN] = useState(lines.length)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setN(0)
    let i = 0
    const t = setInterval(() => {
      i++
      setN(i)
      // console.log('typed', i)
      if (i >= lines.length) clearInterval(t)
    }, 650)
    return () => clearInterval(t)
  }, [lines.length])

  return (
    <div>
      {lines.slice(0, n).map((l, i) => (
        <p key={i} className={l.k}>
          {l.who ? <span className="dim">{l.who + '> '}</span> : null}{l.t}
        </p>
      ))}
      <p><span className="dim">user&gt; </span><span className="cursor" /></p>
    </div>
  )
}
