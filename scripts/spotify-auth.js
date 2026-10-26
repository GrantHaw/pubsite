// one time helper: gets the spotify refresh token for the site
// usage (powershell):
//   $env:SPOTIFY_CLIENT_ID="..."; $env:SPOTIFY_CLIENT_SECRET="..."; node scripts/spotify-auth.js
// then open the link it prints, log in, and copy the refresh token it spits out into azure
const http = require('http')
const crypto = require('crypto')

const id = process.env.SPOTIFY_CLIENT_ID
const sec = process.env.SPOTIFY_CLIENT_SECRET
if (!id || !sec) { console.log('set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first'); process.exit(1) }

const redirect = 'http://127.0.0.1:8888/callback' // has to match the app settings on developer.spotify.com exactly
const scopes = 'user-read-currently-playing user-read-recently-played user-top-read playlist-read-private playlist-read-collaborative'
const state = crypto.randomBytes(12).toString('hex')

const url = 'https://accounts.spotify.com/authorize?response_type=code' +
  '&client_id=' + encodeURIComponent(id) +
  '&scope=' + encodeURIComponent(scopes) +
  '&redirect_uri=' + encodeURIComponent(redirect) +
  '&state=' + state

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1:8888')
  if (u.pathname !== '/callback') { res.end(); return }
  if (u.searchParams.get('state') !== state) { res.end('state mismatch, try again'); return }
  const code = u.searchParams.get('code')
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(id + ':' + sec).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code: code, redirect_uri: redirect }),
  })
  const j = await r.json()
  if (!j.refresh_token) { res.end('no refresh token :( ' + JSON.stringify(j)); console.log(j); process.exit(1) }
  res.end('got it! you can close this tab and go back to the terminal.')
  console.log('\nSPOTIFY_REFRESH_TOKEN=' + j.refresh_token + '\n')
  console.log('put that in azure app settings (and .env.local for local dev). dont commit it.')
  process.exit(0)
}).listen(8888, '127.0.0.1', () => {
  console.log('open this in your browser and log in:\n\n' + url + '\n')
})
