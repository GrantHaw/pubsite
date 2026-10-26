import Link from 'next/link'
import Win from './Win'
import { FileIco } from './Icons'
import Pixel from './Pixel'
import { prettySize } from '../lib/blog'

// two pane explorer. left = files in the folder, right = whatever is open
export default function Explorer({ folder, current, children }) {
  const base = '/blog/' + folder.slug
  return (
    <div>
      <nav aria-label="Breadcrumb" className="f-ui text-[16px] mb-4 flex flex-wrap gap-2 text-[#ffd6ec]">
        <Link href="/blog" className="underline">C:\blog</Link><span>\</span>
        <Link href={base} className="underline">{folder.slug}</Link>
        {current ? <><span>\</span><span>{current}</span></> : null}
      </nav>
      <Win title={'C:\\blog\\' + folder.slug + (current ? '\\' + current : '')} bodyClass="!p-0 grid md:grid-cols-[250px_1fr]">
        <aside className="border-b-2 md:border-b-0 md:border-r-2 border-[var(--plum)] bg-[#fff7fb] p-3">
          <ul>
            <li>
              <Link href={base} className="fx-row !grid-cols-[28px_1fr]" aria-current={!current ? 'page' : undefined} style={!current ? { background: 'var(--bub)' } : null}>
                <Pixel name="folder" size={2} /><span className="truncate">overview</span>
              </Link>
            </li>
            {folder.files.map((f) => (
              <li key={f.name}>
                <Link href={base + '/' + f.name} className="fx-row" aria-current={current === f.name ? 'page' : undefined} style={current === f.name ? { background: 'var(--bub)' } : null}>
                  <FileIco kind={f.kind} />
                  <span className="truncate">{f.name}</span>
                  <span className="f-ui text-[13px]">{prettySize(f.size)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div className="p-5 md:p-8 min-w-0">{children}</div>
      </Win>
    </div>
  )
}
