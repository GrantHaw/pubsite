'use client'
import { useState } from 'react'
import { mmss } from './NowPlaying'

// winamp-ish playlist editor. click a row to load spotify's player for that track
export default function Playlist({ pl }) {
  const [sel, setSel] = useState(null)
  const total = pl.tracks.reduce((a, t) => a + t.dur, 0)
  const cur = pl.tracks.find((t) => t.id === sel)
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-3">
        {pl.art ? <img src={pl.art} alt="" className="w-16 h-16 rounded border-2 border-[var(--plum)] object-cover" /> : null}
        <div className="min-w-0 flex-1 basis-[200px]">
          <h3 className="f-head text-[24px] leading-tight text-white" style={{ textShadow: '2px 2px 0 #2a0822' }}>{pl.name}</h3>
          <p className="text-[14px] text-[#d9c7d4]">{pl.tracks.length} tracks, {Math.round(total / 60000)} min{pl.desc ? '. ' + pl.desc : ''}</p>
        </div>
        {pl.url ? <a href={pl.url} target="_blank" rel="noopener noreferrer" className="gel silver sm:ml-auto shrink-0">open in Spotify</a> : null}
      </div>
      <ol className="pl">
        {pl.tracks.map((t, i) => (
          <li key={t.id + i}>
            <button type="button" onClick={() => setSel(t.id)} aria-pressed={sel === t.id} className={sel === t.id ? 'on' : ''} title={t.artist + ' - ' + t.title}>
              <span className="n">{i + 1}.</span>
              <span className="min-w-0 truncate">{t.artist} - {t.short || t.title}</span>
              <span className="d">{mmss(t.dur)}</span>
            </button>
          </li>
        ))}
      </ol>
      {cur && !cur.id.startsWith('mock') ? (
        <iframe key={cur.id} title={'Spotify player for ' + cur.title} src={'https://open.spotify.com/embed/track/' + cur.id} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="mt-3 rounded-xl border-0" />
      ) : cur ? <p className="f-ui text-[15px] mt-3 text-[#d9c7d4]">(the real spotify player loads here once your keys are set up)</p> : <p className="f-ui text-[15px] mt-3 text-[#9c6f8d]">click a track to play it with spotify&apos;s player</p>}
    </div>
  )
}
