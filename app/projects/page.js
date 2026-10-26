// app/projects/page.js
import Win from '../../components/Win'
import Pic from '../../components/Pic'
import tools, { toolCats } from '../../data/tools'
import projects from '../../data/projects'


export default function ProjectsPage() {
  return (
    <div>
      <h1 className="page-title mb-6">projects</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {projects.map((p) => (
          <Win key={p.id} id={p.id} title={'C:\\projects\\' + p.id} className={p.wide ? 'md:col-span-2 lg:col-span-3' : ''} bodyClass={p.wide ? 'grid md:grid-cols-[260px_1fr] gap-6 items-center' : ''}>
            <div className={'rounded-lg overflow-hidden border-2 border-[var(--plum)] ' + (p.contain ? 'bg-white p-5 flex justify-center' : '')}>
              <Pic src={p.img} alt={p.alt} loading={p.wide ? undefined : 'lazy'} decoding="async" className={p.contain ? 'max-h-44' : 'w-full aspect-[16/10] object-cover'} />
            </div>
            <div>
              <h2 className={'f-head leading-tight ' + (p.wide ? 'text-[38px]' : 'text-[24px] mt-4')}>{p.title}</h2>
              <p className="mt-2 leading-relaxed max-w-[68ch]">{p.desc}</p>
              {p.tags ? <div className="flex flex-wrap gap-2 mt-3">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div> : null}
              {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" className="gel mt-4">{p.link.includes("github.com") ? "view on GitHub" : "open"}</a> : null}
            </div>
          </Win>
        ))}
      </div>

      <Win id="tools" title="C:\projects\tools" className="mt-8">
        <h2 className="f-head text-[30px] leading-tight">Tools</h2>
        {toolCats.map((c) => {
          const list = tools.filter((t) => t.cat === c.id)
          if (!list.length) return null // empty section stays hidden
          return (
            <div key={c.id} id={'tools-' + c.id} className="mt-5 first:mt-2 scroll-mt-6">
              <h3 className="f-ui text-[18px] text-[#c4006f]">{c.name}</h3>
              <p className="text-[14px] text-[#6b3a5c]">{c.blurb}</p>
              <ul className="mt-1">
                {list.map((t) => (
                  <li key={t.id} className="grid sm:grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-4 border-b-[1.5px] border-dotted border-[var(--bub)] last:border-0">
                    <div>
                      <h4 className="f-head text-[22px] leading-tight">{t.name}</h4>
                      <p className="mt-1 max-w-[62ch]">{t.what}</p>
                      <p className="f-ui text-[15px] mt-1 text-[#6b3a5c]">{t.tech}</p>
                    </div>
                    {t.link ? <a href={t.link} target="_blank" rel="noopener noreferrer" className="gel silver self-start">source</a> : null}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </Win>
    </div>
  )
}
