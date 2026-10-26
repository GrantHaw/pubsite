import { notFound } from 'next/navigation'
import Explorer from '../../../../components/Explorer'
import { listFolders, getFile } from '../../../../lib/blog'

export const dynamicParams = false
export function generateStaticParams() {
  const out = []
  listFolders().forEach((f) => f.files.forEach((x) => out.push({ folder: f.slug, file: x.name })))
  return out
}

export default function FilePage({ params }) {
  const r = getFile(params.folder, params.file)
  if (!r) notFound()
  const raw = '/blog-files/' + r.folder.slug + '/' + r.file.name
  let body
  if (r.file.kind === 'md') {
    body = (
      <article>
        <h1 className="f-head text-[clamp(28px,4.5vw,40px)] leading-tight mb-6">{r.title}</h1>
        <div className="prose-y2k" dangerouslySetInnerHTML={{ __html: r.html }} />
      </article>
    )
  } else if (r.file.kind === 'pdf') {
    body = (
      <div>
        <object data={raw} type="application/pdf" className="w-full h-[75vh] rounded-lg border-2 border-[var(--plum)]">
          <p>Your browser can&apos;t show PDFs here. <a href={raw} className="underline">Download {r.file.name}</a></p>
        </object>
        <a href={raw} download className="gel silver mt-4">download pdf</a>
      </div>
    )
  } else if (r.file.kind === 'img') {
    body = <img src={raw} alt={r.file.name} className="max-w-full rounded-lg border-2 border-[var(--plum)]" />
  } else {
    body = <a href={raw} download className="gel">download {r.file.name}</a>
  }
  return <Explorer folder={r.folder} current={r.file.name}>{body}</Explorer>
}
