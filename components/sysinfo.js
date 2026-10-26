// reads what the visitor's browser will tell us. none of this gets sent anywhere, it all stays on their machine
function osFrom(ua, plat) {
  const p = (plat || '').toLowerCase()
  if (/android/i.test(ua)) return { name: 'Android', logo: 'android' }
  if (/iphone|ipad|ipod/i.test(ua)) return { name: /ipad/i.test(ua) ? 'iPadOS' : 'iOS', logo: 'ios' }
  if (/cros/i.test(ua) || p === 'chrome os') return { name: 'ChromeOS', logo: 'default' }
  if (/windows/i.test(ua) || p === 'windows') return { name: 'Windows', logo: 'windows' }
  if (/mac os x|macintosh/i.test(ua) || p === 'macos') return { name: 'macOS', logo: 'mac' }
  if (/linux/i.test(ua) || p === 'linux') return { name: 'Linux', logo: 'linux' }
  return { name: 'something mysterious', logo: 'default' }
}

function browserFrom(ua) {
  let m
  if ((m = ua.match(/Edg\/([\d.]+)/))) return 'Edge ' + m[1].split('.')[0]
  if ((m = ua.match(/OPR\/([\d.]+)/))) return 'Opera ' + m[1].split('.')[0]
  if ((m = ua.match(/Firefox\/([\d.]+)/))) return 'Firefox ' + m[1].split('.')[0]
  if ((m = ua.match(/CriOS\/([\d.]+)/))) return 'Chrome (iOS) ' + m[1].split('.')[0]
  if ((m = ua.match(/Chrome\/([\d.]+)/))) return 'Chrome ' + m[1].split('.')[0]
  if ((m = ua.match(/Version\/([\d.]+).*Safari/))) return 'Safari ' + m[1]
  return 'unknown browser'
}

function gpu() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
    if (!gl) return null
    const d = gl.getExtension('WEBGL_debug_renderer_info')
    const r = d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    // chrome wraps it like ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 ...), trim that down
    const m = String(r).match(/ANGLE \([^,]*,\s*([^,(]+?)(?:\s+Direct3D|\s+\(|,|\))/)
    return (m ? m[1] : String(r)).trim()
  } catch (e) { return null }
}

function dur(ms) {
  const s = Math.floor(ms / 1000)
  if (s < 60) return s + 's'
  return Math.floor(s / 60) + 'm ' + (s % 60) + 's'
}

export async function getInfo() {
  const n = navigator
  const ua = n.userAgent || ''
  const plat = n.userAgentData ? n.userAgentData.platform : n.platform
  const os = osFrom(ua, plat)
  const rows = []
  rows.push(['os', os.name])
  rows.push(['browser', browserFrom(ua)])
  rows.push(['resolution', screen.width + 'x' + screen.height + (window.devicePixelRatio !== 1 ? ' @' + Math.round(window.devicePixelRatio * 100) / 100 + 'x' : '')])
  rows.push(['viewport', window.innerWidth + 'x' + window.innerHeight])
  if (n.hardwareConcurrency) rows.push(['cpu', n.hardwareConcurrency + ' threads'])
  const g = gpu()
  if (g) rows.push(['gpu', g])
  if (n.deviceMemory) rows.push(['memory', n.deviceMemory + (n.deviceMemory >= 8 ? '+' : '') + ' GB (rounded by your browser)'])
  rows.push(['theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark mode' : 'light mode'])
  rows.push(['language', n.language || 'unknown'])
  rows.push(['timezone', Intl.DateTimeFormat().resolvedOptions().timeZone])
  rows.push(['local time', new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })])
  if (n.connection && n.connection.effectiveType) rows.push(['network', n.connection.effectiveType + (n.connection.downlink ? ', ~' + n.connection.downlink + ' Mbps' : '')])
  if (n.maxTouchPoints > 0) rows.push(['touch', n.maxTouchPoints + ' points'])
  try {
    if (n.getBattery) {
      const b = await n.getBattery()
      rows.push(['battery', Math.round(b.level * 100) + '%' + (b.charging ? ' (charging)' : '')])
    }
  } catch (e) { /* prob dont need this */ }
  rows.push(['on this page', dur(performance.now())])
  return { os: os, rows: rows, ua: ua }
}

export const LOGOS = {
  windows: [
    '########  ########',
    '########  ########',
    '########  ########',
    '########  ########',
    '',
    '########  ########',
    '########  ########',
    '########  ########',
    '########  ########',
  ],
  mac: [
    "        .:'",
    "    __ :'__",
    " .'`  `-'  ``.",
    ":          .-'",
    ':         :',
    ' :         `-;',
    "  `.__.-.__.'",
  ],
  linux: [
    '    .--.',
    '   |o_o |',
    '   |:_/ |',
    '  //   \\ \\',
    ' (|     | )',
    "/'\\_   _/`\\",
    '\\___)=(___/',
  ],
  android: [
    '  \\  _____  /',
    '   /       \\',
    '  |  o   o  |',
    '  |_________|',
    ' || |     | ||',
    ' || |     | ||',
    '    |_| |_|',
  ],
  ios: [
    ' .-------.',
    ' | ----- |',
    ' |       |',
    ' |       |',
    ' |       |',
    ' |   o   |',
    " '-------'",
  ],
  default: [
    '  ____ _   _',
    ' / ___| | | |',
    '| |  _| |_| |',
    '| |_| |  _  |',
    ' \\____|_| |_|',
  ],
}
