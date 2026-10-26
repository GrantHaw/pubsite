// pulls recent public commits from github. cached 5 min so it doesnt hit the rate limit
const USER = 'GrantHaw'

const mock = [
  { sha: 'a1b2c3d', repo: 'pubsite', msg: 'y2k rig layout', date: '2026-10-26T14:00:00Z', url: '#' },
  { sha: '9f8e7d6', repo: 'Ticket-Tracker-Dashboard', msg: 'fix weekly rollup off by one', date: '2026-10-24T18:00:00Z', url: '#' },
  { sha: '1234abc', repo: 'iFixIt-Checkout-Kiosk', msg: 'update hdmi output name', date: '2026-10-20T12:00:00Z', url: '#' },
]

async function gh(path) {
  const h = { Accept: 'application/vnd.github+json', 'User-Agent': 'ghaw.net' }
  if (process.env.GITHUB_TOKEN) h.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN // optional, bumps rate limit
  const r = await fetch('https://api.github.com' + path, { headers: h, next: { revalidate: 300 } })
  if (!r.ok) throw new Error('gh ' + r.status)
  return r.json()
}

export async function getLog(n) {
  if (process.env.GITLOG_MOCK) return { ok: true, items: mock } // for local dev w/o network
  try {
    const repos = (await gh('/users/' + USER + '/repos?sort=pushed&per_page=6')).filter((r) => !r.fork && !r.archived).slice(0, 4)
    const lists = await Promise.all(repos.map((r) =>
      gh('/repos/' + USER + '/' + r.name + '/commits?per_page=8').then((cs) => cs.map((c) => ({
        sha: c.sha.slice(0, 7),
        repo: r.name,
        msg: (c.commit.message || '').split('\n')[0].slice(0, 90),
        date: c.commit.author ? c.commit.author.date : '',
        url: c.html_url,
      }))).catch(() => [])
    ))
    const items = [].concat.apply([], lists).sort((a, b) => b.date.localeCompare(a.date)).slice(0, n || 8)
    return { ok: true, items: items }
  } catch (e) {
    // console.log('gitlog failed', e)
    return { ok: false, items: [] }
  }
}
