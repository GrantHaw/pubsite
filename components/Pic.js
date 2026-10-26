'use client'
import { useEffect, useRef, useState } from 'react'

// img that stays hidden (no alt text flash, no half loaded jpeg) until its fully loaded, then fades in
export default function Pic({ className, wrap, ...p }) {
  const r = useRef(null)
  const [ok, setOk] = useState(false)
  useEffect(() => {
    // already loaded before react hydrated? onLoad wont fire, so check by hand
    if (r.current && r.current.complete && r.current.naturalWidth) setOk(true)
  }, [])
  return (
    <span className={'pic ' + (ok ? 'in ' : '') + (wrap || '')}>
      <img ref={r} {...p} className={className} onLoad={() => setOk(true)} onError={() => setOk(true)} />
    </span>
  )
}
