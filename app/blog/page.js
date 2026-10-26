// app/blog/page.js
import Link from 'next/link'
import Win from '../../components/Win'
import Pixel from '../../components/Pixel'
import { listFolders, prettyDate } from '../../lib/blog'

export const metadata = { title: 'Blog | Grant Hawerlander' }

export default function BlogPage() {
  const posts = listFolders()
  return (
    <div>
      <h1 className="page-title mb-6">blog</h1>
      <Win title="C:\blog" className="max-w-4xl">
        {posts.length ? (
          <ul>
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={'/blog/' + p.slug} className="fx-row !items-start">
                  <span className="pt-1"><Pixel name="folder" size={2} /></span>
                  <span className="min-w-0">
                    <span className="block f-head text-[21px] leading-tight">{p.title}</span>
                    {p.summary ? <span className="block mt-1 max-w-[60ch]">{p.summary}</span> : null}
                  </span>
                  <span className="text-right f-ui text-[15px] whitespace-nowrap">{prettyDate(p.date)}<br />{p.files.length + (p.files.length === 1 ? ' file' : ' files')}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p>No posts yet.</p>}
      </Win>
    </div>
  )
}
