'use client'
import { useState } from 'react'

const R = [['short_term', 'last 4 weeks'], ['medium_term', 'last 6 months'], ['long_term', 'all time']]

// current rotation: a countdown of top tracks + top artists as stickers
export default function Rotation({ top }) {
  const [r, setR] = useState('short_term')
  const d = top[r]
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Time range">
        {R.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={r === k} onClick={() => setR(k)} className={'gel ' + (r === k ? 'lime' : 'silver')}>{label}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <ol className="rot">
          {d.tracks.map((t, i) => (
            <li key={t.id + i} style={{ '--w': (100 - i * 7) + '%' }}>
              <span className="rk" aria-label={'Number ' + (i + 1)}>{i + 1}</span>
              {t.art ? <img src={t.art} alt="" /> : <span className="w-10 h-10" />}
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="min-w-0" title={t.title + ' by ' + t.artist}>
                <span className="block truncate font-semibold text-white">{t.short || t.title}</span>
                <span className="block truncate text-[14px] text-[#d9c7d4]">{t.artist}</span>
              </a>
              <span className="bar" aria-hidden="true"><i /></span>
            </li>
          ))}
        </ol>
        <div>
          <h3 className="f-ui text-[17px] text-[var(--lime)] mb-3">top artists</h3>
          <ul className="flex flex-wrap gap-3">
            {d.artists.map((a, i) => (
              <li key={a.name}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="artist-chip" style={{ transform: 'rotate(' + ((i % 3) - 1) * 3 + 'deg)' }}>
                  {a.art ? <img src={a.art} alt="" /> : null}{a.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-[#9c6f8d] mt-4">Ranked by Spotify from my listening. Bars show rank, not play counts.</p>
        </div>
      </div>
    </div>
  )
}
