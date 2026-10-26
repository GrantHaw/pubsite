'use client'
import { useEffect, useState } from 'react'

export const mmss = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
export function ago(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  if (d < 90) return 'just now'
  if (d < 3600) return Math.round(d / 60) + 'm ago'
  if (d < 86400) return Math.round(d / 3600) + 'h ago'
  return Math.round(d / 86400) + 'd ago'
}

// polls the api route. returns the latest + a ticking progress number
export function useNow(initial) {
  const [np, setNp] = useState(initial || null)
  const [tick, setTick] = useState(0)
  const [live, setLive] = useState(false) // false during ssr + first paint so server/client html match
  useEffect(() => {
    setLive(true)
    let dead = false
    const get = () => fetch('/api/now-playing').then((r) => r.json()).then((v) => { if (!dead) setNp(Object.assign({}, v, { at: Date.now() })) }).catch(() => {})
    if (!initial) get()
    const t = setInterval(get, 30000)
    const k = setInterval(() => setTick((x) => x + 1), 1000)
    return () => { dead = true; clearInterval(t); clearInterval(k) }
  }, []) // eslint-disable-line
  let prog = 0
  if (np && np.track) prog = np.playing && live ? Math.min(np.track.dur, (np.progress || 0) + (Date.now() - (np.at || Date.now()))) : (np.progress || 0)
  return { np: np, prog: prog, tick: tick, live: live }
}

// the big player for /music
export default function NowPlaying({ initial }) {
  const { np, prog, live } = useNow(initial)
  if (!np || !np.ok) return <p className="term-body dim">spotify isn&apos;t connected right now.</p>
  const t = np.track
  if (!t) return <p className="term-body dim">nothing played recently.</p>
  const pct = t.dur ? Math.round((prog / t.dur) * 1000) / 10 : 0
  return (
    <div className="amp">
      <div className="amp-art">
        {t.art ? <img src={t.art} alt={'Album art for ' + t.album} /> : <div className="w-full h-full bg-[var(--plum)]" />}
      </div>
      <div className="amp-lcd min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className={'amp-state ' + (np.playing ? 'on' : '')}>{np.playing ? '▶ now playing' : '■ last played ' + (np.playedAt && live ? ago(np.playedAt) : '')}</span>
          {np.playing ? <span className="eq" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((i) => <i key={i} style={{ animationDelay: (i * 0.13) + 's' }} />)}</span> : null}
        </div>
        <div className="amp-time" aria-label={'Elapsed ' + mmss(prog)}>{mmss(prog)}<span>/ {mmss(t.dur)}</span></div>
        <div className="amp-marquee"><span>{t.title + '  ***  ' + t.artist + '  ***  ' + t.album + '  ***  '}</span></div>
        <div className="amp-seek" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Song progress"><i style={{ width: pct + '%' }} /></div>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <a href={t.url} target="_blank" rel="noopener noreferrer" className="gel lime">open in Spotify</a>
          <span className="text-[14px] text-[#d9c7d4] truncate min-w-0" title={t.title + ' by ' + t.artist}>{t.short || t.title} by {t.artist}</span>
        </div>
      </div>
    </div>
  )
}

// tiny lcd strip for the housing
export function NowMini() {
  const { np } = useNow(null)
  // no spotify? just show the old pink lights
  if (!np || !np.ok || !np.track) return <div className="leds" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <span key={i} className={'led pink' + (i === 2 ? ' on' : '')} />)}</div>
  const t = np.track
  return (
    <a href="/music" className="mini-lcd" title={(np.playing ? 'Now playing: ' : 'Last played: ') + t.title + ' by ' + t.artist}>
      <span className={'dot ' + (np.playing ? 'on' : '')} aria-hidden="true" />
      <span className="mini-scroll"><span>{(np.playing ? 'now playing: ' : 'last played: ') + t.title + ' - ' + t.artist}</span></span>
    </a>
  )
}

// home page widget at the bottom. flashing note if im listening rn
export function NowCard({ initial }) {
  const { np, prog, live } = useNow(initial)
  const ok = np && np.ok && np.track
  const t = ok ? np.track : null
  return (
    <a href="/music" className="np-card" aria-label={ok ? (np.playing ? 'Now playing: ' : 'Last listened to: ') + t.title + ' by ' + t.artist + '. Go to my music' : 'Go to my music'}>
      <span className="np-art">{t && t.art ? <img src={t.art} alt="" /> : <span className="block w-full h-full bg-[var(--plum)]" />}</span>
      <span className="min-w-0 flex-1">
        <span className={'np-state ' + (ok && np.playing ? 'live' : '')}>
          <span className="np-icon" aria-hidden="true">♪</span>
          {ok ? (np.playing ? 'listening right now' : 'last listened ' + (np.playedAt && live ? ago(np.playedAt) : '')) : 'my music'}
        </span>
        {t ? <span className="block truncate text-white font-semibold text-[18px]" title={t.title}>{t.short || t.title}</span> : <span className="block text-white">playlists, top tracks, and what im listening to</span>}
        {t ? <span className="block truncate text-[14px] text-[#d9c7d4]">{t.artist}</span> : null}
        {t && np.playing && t.dur ? <span className="np-bar" aria-hidden="true"><i style={{ width: Math.round((prog / t.dur) * 100) + '%' }} /></span> : null}
      </span>
      <span className="gel lime shrink-0 !hidden sm:!inline-flex">my music</span>
    </a>
  )
}
