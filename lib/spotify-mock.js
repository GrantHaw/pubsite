// fake data so the music page can be built without real spotify keys. only used when SPOTIFY_MOCK=1
const T = [
  ['Lip Gloss Firewall', 'Chrome Hearts Club', 'Dial-Up Diaries', 213000],
  ['Packet Loss (Love Song)', 'The Subnets', 'Ping Me Later', 187000],
  ['Glitter Overflow', 'BUFFER', 'Stack Smash', 241000],
  ['Away Message', 'Nokia Kiss', 'BRB', 199000],
  ['Frosted Tips', 'Y2Kandy', 'Millennium Bug', 176000],
  ['Pink Noise', 'Seraph.exe', 'Firmware', 228000],
  ['Burn It To CD', 'Mixtape Mafia', 'Track 13', 204000],
  ['Butterfly Clip', 'Holo Holo', 'Iridescent', 192000],
  ['Root Access', 'kernel panic girls', 'sudo make me', 265000],
  ['Sidekick Swivel', 'Flip Phone Feelings', 'Charging...', 183000],
  ['LAN Party', 'The Subnets', 'Ping Me Later', 221000],
  ['Gel Pen Diary', 'Y2Kandy', 'Millennium Bug', 197000],
]
const colors = ['#ff3ea5', '#9b5cff', '#9fe8ff', '#c6ff3d', '#ffb3dc', '#7a2fd6']
function art(i) {
  const a = colors[i % colors.length], b = colors[(i + 2) % colors.length]
  return 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='" + a + "'/><stop offset='1' stop-color='" + b + "'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/><circle cx='100' cy='100' r='" + (30 + (i * 13) % 50) + "' fill='none' stroke='#fff' stroke-width='6' opacity='.7'/></svg>")
}
const tr = (i) => ({ id: 'mock' + i, title: T[i][0], short: T[i][0], artist: T[i][1], album: T[i][2], art: art(i), url: 'https://open.spotify.com', dur: T[i][3] })

export function mockNow() { return { ok: true, playing: true, track: tr(0), progress: 64000, at: Date.now() } }
export function mockPlaylist() { return { name: 'chrome hearts radio', desc: 'what im looping this month <3 &gt;:)', url: 'https://open.spotify.com', art: art(3), tracks: T.map((_, i) => tr(i)) } }
export function mockTop() {
  const mk = (off) => ({ tracks: Array.from({ length: 10 }, (_, k) => tr((k + off) % T.length)), artists: ['Chrome Hearts Club', 'The Subnets', 'Y2Kandy', 'BUFFER', 'Holo Holo', 'Nokia Kiss', 'Seraph.exe', 'Mixtape Mafia'].map((n, k) => ({ name: n, url: 'https://open.spotify.com', art: art(k + off) })) })
  return { short_term: mk(0), medium_term: mk(3), long_term: mk(6) }
}
