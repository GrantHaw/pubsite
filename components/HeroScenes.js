'use client'
import { useEffect, useState } from 'react'

// background loops for the hero. swaps scene every ~14s with a crossfade
const SCENES = ['slick', 'grid', 'stars', 'bubbles', 'rain']

export default function HeroScenes() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return // stays on scene 1, no motion
    const t = setInterval(() => setI((x) => (x + 1) % SCENES.length), 14000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
    <div className="scenes" aria-hidden="true">
      {SCENES.map((s, k) => (
        <div key={s} className={'scene scene-' + s + (k === i ? ' on' : '')}>
          {s === 'stars' ? Array.from({ length: 40 }).map((_, j) => (
            <i key={j} style={{ left: ((j * 37) % 100) + '%', top: ((j * 53) % 100) + '%', animationDelay: ((j * 0.37) % 3) + 's' }} />
          )) : null}
          {s === 'bubbles' ? Array.from({ length: 16 }).map((_, j) => (
            <i key={j} style={{ left: ((j * 23) % 100) + '%', width: 18 + ((j * 17) % 50), height: 18 + ((j * 17) % 50), animationDelay: -((j * 1.3) % 12) + 's', animationDuration: 9 + (j % 5) * 2 + 's' }} />
          )) : null}
          {s === 'rain' ? Array.from({ length: 28 }).map((_, j) => (
            <i key={j} style={{ left: ((j * 3.7) % 100) + '%', animationDelay: -((j * 0.71) % 4) + 's', animationDuration: 2.5 + (j % 4) * 0.6 + 's' }} />
          )) : null}
        </div>
      ))}
    </div>
    {/* static hud on top: dot grid + corner brackets stay put while the scene changes underneath */}
    <div className="hud" aria-hidden="true"><i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" /></div>
    <div className="scene-pick" role="group" aria-label="Background">
      {SCENES.map((s, k) => (
        <button key={s} type="button" aria-label={'Show ' + s + ' background'} aria-pressed={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)} />
      ))}
    </div>
    </>
  )
}
