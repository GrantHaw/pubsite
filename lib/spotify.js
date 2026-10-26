// spotify stuff. all server side, the browser never sees the tokens
// env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_PLAYLIST_ID
// SPOTIFY_MOCK=1 gives fake data for local dev
import { mockNow, mockPlaylist, mockTop } from './spotify-mock'

const API = 'https://api.spotify.com/v1'
let tok = null // { v, exp }
let refresh = null // spotify sometimes hands back a new refresh token, keep it in memory

export const configured = () => !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REFRESH_TOKEN)
const mock = () => !!process.env.SPOTIFY_MOCK

async function token() {
  if (tok && tok.exp > Date.now() + 30000) return tok.v
  const id = process.env.SPOTIFY_CLIENT_ID
  const sec = process.env.SPOTIFY_CLIENT_SECRET
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh || process.env.SPOTIFY_REFRESH_TOKEN })
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(id + ':' + sec).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body,
    cache: 'no-store',
  })
  if (!r.ok) throw new Error('spotify token ' + r.status)
  const j = await r.json()
  if (j.refresh_token) refresh = j.refresh_token
  tok = { v: j.access_token, exp: Date.now() + j.expires_in * 1000 }
  return tok.v
}

async function sp(path, revalidate) {
  const r = await fetch(API + path, {
    headers: { Authorization: 'Bearer ' + (await token()) },
    next: revalidate ? { revalidate: revalidate } : undefined,
    cache: revalidate ? undefined : 'no-store',
  })
  if (r.status === 204) return null // nothing playing
  if (!r.ok) throw new Error('spotify ' + path + ' ' + r.status)
  return r.json()
}

// spotify escapes html in descriptions, undo that
export function unesc(x) {
  return (x || '').replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&#x2F;/g, '/').replace(/&amp;/g, '&')
}

// shorter title for tight spots. artists already shows the feat. people so drop it, plus soundtrack/remaster tails
export function shorty(t) {
  return (t || '')
    .replace(/\s*[([](feat|ft|with)\.?\s[^)\]]*[)\]]/i, '')
    .replace(/\s+-\s+(from|remaster|remastered|\d{4} remaster|live at|radio edit|single version|bonus track)\b.*$/i, '')
    .trim() || t
}

// squash a spotify track into just what we show
export function slim(t) {
  if (!t) return null
  const imgs = (t.album && t.album.images) || []
  return {
    id: t.id,
    title: t.name,
    short: shorty(t.name),
    artist: (t.artists || []).map((a) => a.name).join(', '),
    album: t.album ? t.album.name : '',
    art: (imgs[1] || imgs[0] || {}).url || null,
    url: t.external_urls ? t.external_urls.spotify : null,
    dur: t.duration_ms || 0,
  }
}

// now playing, or the last thing played
let nowCache = null // { at, v }
export async function getNow() {
  if (mock()) return mockNow()
  if (!configured()) return { ok: false }
  if (nowCache && Date.now() - nowCache.at < 20000) return nowCache.v // dont hammer spotify
  try {
    const cur = await sp('/me/player/currently-playing?additional_types=track')
    let v
    if (cur && cur.item && cur.currently_playing_type === 'track') {
      v = { ok: true, playing: !!cur.is_playing, track: slim(cur.item), progress: cur.progress_ms || 0, at: Date.now() }
    } else {
      const rec = await sp('/me/player/recently-played?limit=1')
      const it = rec && rec.items && rec.items[0]
      v = it ? { ok: true, playing: false, track: slim(it.track), playedAt: it.played_at, progress: 0, at: Date.now() } : { ok: true, playing: false, track: null }
    }
    nowCache = { at: Date.now(), v: v }
    return v
  } catch (e) {
    // console.log('np failed', e)
    return { ok: false }
  }
}

export async function getPlaylist() {
  if (mock()) return mockPlaylist()
  const id = process.env.SPOTIFY_PLAYLIST_ID
  if (!configured() || !id) return null
  try {
    const meta = await sp('/playlists/' + id + '?fields=name,description,external_urls,images', 600)
    let items = []
    let next = '/playlists/' + id + '/items?limit=50'
    for (let page = 0; next && page < 4; page++) { // cap at 200 tracks, plenty
      const j = await sp(next, 600)
      // feb 2026 renamed track -> item in some spots, handle both
      items = items.concat((j.items || []).map((x) => slim(x.item || x.track)).filter((t) => t && t.id))
      next = j.next ? j.next.replace(API, '') : null
    }
    return {
      name: meta.name,
      desc: unesc(meta.description),
      url: meta.external_urls ? meta.external_urls.spotify : null,
      art: meta.images && meta.images[0] ? meta.images[0].url : null,
      tracks: items,
    }
  } catch (e) {
    return null
  }
}

// current rotation. spotify only gives order, not play counts
export async function getTop() {
  if (mock()) return mockTop()
  if (!configured()) return null
  try {
    const out = {}
    for (const r of ['short_term', 'medium_term', 'long_term']) {
      const [t, a] = await Promise.all([sp('/me/top/tracks?limit=10&time_range=' + r, 3600), sp('/me/top/artists?limit=8&time_range=' + r, 3600)])
      out[r] = {
        tracks: (t.items || []).map(slim),
        artists: (a.items || []).map((x) => ({ name: x.name, url: x.external_urls ? x.external_urls.spotify : null, art: x.images && x.images.length ? (x.images[2] || x.images[0]).url : null })),
      }
    }
    return out
  } catch (e) {
    return null
  }
}
