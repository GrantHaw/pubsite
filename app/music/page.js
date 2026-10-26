// app/music/page.js
import Win from '../../components/Win'
import NowPlaying from '../../components/NowPlaying'
import Playlist from '../../components/Playlist'
import Rotation from '../../components/Rotation'
import { getNow, getPlaylist, getTop } from '../../lib/spotify'

export const metadata = { title: 'My Music | Grant Hawerlander' }
// live for the same reason as the home page. playlist + rotation still cache 10 min / 1 hr
export const dynamic = 'force-dynamic'

export default async function MusicPage() {
  const [now, pl, top] = await Promise.all([getNow(), getPlaylist(), getTop()])
  return (
    <div className="space-y-5">
      <h1 className="page-title">my music</h1>
      <Win term id="player" title="C:\music\now_playing.exe" bodyClass="!p-4"><NowPlaying initial={now} /></Win>
      <Win term id="playlist" title="C:\music\playlist.m3u" bodyClass="!p-4">
        {pl ? <Playlist pl={pl} /> : <p className="dim">playlist isn&apos;t connected yet.</p>}
      </Win>
      {top ? <Win term id="rotation" title="C:\music\rotation.log" bodyClass="!p-4"><Rotation top={top} /></Win> : null}
      <p className="text-[13px] text-[#9c6f8d]">Music data from <a className="underline" href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">Spotify</a>.</p>
    </div>
  )
}
