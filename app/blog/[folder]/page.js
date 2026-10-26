import { notFound } from 'next/navigation'
import Explorer from '../../../components/Explorer'
import { listFolders, getFolder, prettyDate } from '../../../lib/blog'

export const dynamicParams = false
export function generateStaticParams() {
  return listFolders().map((f) => ({ folder: f.slug }))
}
export function generateMetadata({ params }) {
  const f = getFolder(params.folder)
  return { title: f ? f.title + ' | Grant Hawerlander' : 'Blog' }
}

export default function FolderPage({ params }) {
  const f = getFolder(params.folder)
  if (!f) notFound()
  return (
    <Explorer folder={f}>
      <article>
        <h1 className="f-head text-[clamp(30px,5vw,44px)] leading-tight">{f.title}</h1>
        {f.date ? <p className="f-ui text-[16px] mt-1 mb-6 text-[#6b3a5c]">{prettyDate(f.date)}</p> : null}
        <div className="prose-y2k" dangerouslySetInnerHTML={{ __html: f.html }} />
      </article>
    </Explorer>
  )
}
