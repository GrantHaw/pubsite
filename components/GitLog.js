import Win from './Win'
import { getLog } from '../lib/gitlog'

function short(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' })
}

// server component, so the github call never hits the visitor's browser
export default async function GitLog({ id }) {
  const r = await getLog(8)
  return (
    <Win term id={id} title="git log" bodyClass="min-h-[300px]">
      <p><span className="g">guest@ghaw.net</span><span className="dim">:</span><span className="v">~</span><span className="dim">$ </span>git log --oneline -n 8</p>
      {r.ok && r.items.length ? (
        <ul className="mt-1">
          {r.items.map((c) => (
            <li key={c.repo + c.sha} className="grid grid-cols-[64px_1fr_auto] gap-2">
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="a hover:underline">{c.sha}</a>
              <span className="min-w-0"><span className="u">{c.repo}</span> <span>{c.msg}</span></span>
              <span className="dim whitespace-nowrap">{short(c.date)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="dim mt-1">fatal: couldn&apos;t reach GitHub right now. try again in a bit.</p>
      )}
      <p className="mt-2"><a href="https://github.com/GrantHaw" target="_blank" rel="noopener noreferrer" className="g underline">github.com/GrantHaw</a></p>
    </Win>
  )
}
