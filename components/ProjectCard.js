import Win from './Win'

// project as a lil window. no image? we fake a terminal screen instead
export default function ProjectCard({ project: p }) {
  const media = p.image ? (
    <div className={'rounded-md overflow-hidden border-2 border-[var(--bub)] ' + (p.contain ? 'bg-white p-4 flex justify-center' : '')}>
      <img src={p.image} alt={p.alt || p.title} className={p.contain ? 'max-h-40' : 'w-full aspect-[16/10] object-cover'} />
    </div>
  ) : (
    <div className="rounded-md bg-[#0b0010] border-2 border-[var(--term)] aspect-[16/10] p-3 mono text-[var(--term)] text-lg leading-tight">
      <span className="text-[var(--hot2)]">grant@ghaw:~$ </span>{p.cmd}
      <div className="text-[var(--aqua)] mt-1">{p.out}</div>
      <span className="cursor mt-1" />
    </div>
  )

  return (
    <div id={p.id} className="mb-7 break-inside-avoid scroll-mt-24">
      <Win title={p.file}>
        {media}
        <h2 className="text-2xl font-extrabold mt-3 text-[var(--hot)]" style={{ fontFamily: 'var(--f-head)' }}>{p.title}</h2>
        {p.sub ? <p className="pixel text-[9px] text-[var(--lilac)] -mt-1">{p.sub}</p> : null}
        <p className="mt-2 leading-relaxed text-[15px]">{p.description}</p>
        {p.tags ? (
          <div className="flex flex-wrap gap-1 mt-3">
            {p.tags.map((t) => <span key={t} className="pixel text-[8px] px-2 py-1 rounded-full bg-[var(--bub)]">{t}</span>)}
          </div>
        ) : null}
        {p.link ? (
          <div className="mt-4">
            <a href={p.link} target={p.link.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer" className="gel !text-[11px]">open ↗</a>
          </div>
        ) : null}
      </Win>
    </div>
  )
}
