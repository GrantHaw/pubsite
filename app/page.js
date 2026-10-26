import Link from 'next/link'
import Win from '../components/Win'
import Shell from '../components/Shell'
import GitLog from '../components/GitLog'
import Pixel from '../components/Pixel'
import HeroScenes from '../components/HeroScenes'
import tools from '../data/tools'
import projects from '../data/projects'
import { listFolders, prettyDate } from '../lib/blog'
import { buildTree } from '../lib/vfs'
import { getPlaylist, getNow } from '../lib/spotify'
import { NowCard } from '../components/NowPlaying'

// rendered live so spotify works right after a deploy (ci doesnt have the keys). the api calls are still cached
export const dynamic = 'force-dynamic'

export default async function Home() {
  const posts = listFolders().slice(0, 4)
  const [pl, now] = await Promise.all([getPlaylist(), getNow()])
  const tree = buildTree(pl)
  return (
    <div className="space-y-5">
      {/* hero */}
      <section className="hero p-6 md:p-10">
        <HeroScenes />

        <h1 className="wordmark relative text-[clamp(28px,8.2vw,104px)]" aria-label="Grant Hawerlander">
          <span className="glitch" data-text="Grant" aria-hidden="true">Grant</span>
          <span className="glitch" data-text="Hawerlander" aria-hidden="true">Hawerlander</span>
        </h1>
        <div className="relative grid md:grid-cols-[1fr_270px] gap-8 items-end mt-6">
          <div className="min-w-0 pb-2">
            <p className="f-head text-[clamp(22px,2.8vw,30px)] text-white leading-tight" style={{ textShadow: '2px 2px 0 #2a0822' }}>Web, AI, and network penetration testing</p>
            <p className="mt-2 max-w-[48ch] text-[17px] text-[#ffe3f2]">Pentest intern at Coalfire Division Hex. Cybersecurity at RIT, graduating May 2028.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/projects" className="gel">see my projects</Link>
              <Link href="/contact" className="gel lime">get in touch</Link>
            </div>
          </div>
          <div className="relative sticker max-w-[260px] w-full mx-auto">
            <img src="/y2k/grant-pinto-mirror.jpg" alt="Grant taking a mirror selfie with Pinto, their tuxedo cat, perched on their shoulder" className="w-full aspect-[4/5] object-cover" />
            <span className="absolute -top-5 -left-5 spin8" aria-hidden="true"><Pixel name="star" size={5} /></span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <Win id="about" title="about_me.txt" className="order-1 lg:col-span-5">
          <div className="space-y-4 leading-relaxed">
            <p>hiii, I&apos;m Grant! I&apos;m a cybersecurity student at RIT and a penetration testing intern at Coalfire&apos;s Division Hex. My current specialty is AI/LLM penetration testing, particularly prompt injection, data and model poisoning, and system prompt leakage.</p>
            <p>I also run management operations for the RIT ITS Tech Center, building the internal tools that keep the repair shop running! Off the clock I&apos;m playing CTFs, emulating retro Wii games, or getting yelled at by my cat, Pinto.</p>
          </div>
        </Win>
        <Shell id="shell" tree={tree} className="order-8 lg:order-2 lg:col-span-7" />
        <div className="order-7 lg:order-3 lg:col-span-7"><GitLog id="gitlog" /></div>
        <Win title="profile" className="order-2 lg:order-4 lg:col-span-5">
          <dl>
            <div className="stat"><dt>school</dt><dd>RIT, Cybersecurity, May 2028</dd></div>
            <div className="stat"><dt>work</dt><dd>Coalfire Division Hex, RIT ITS Tech Center</dd></div>
            <div className="stat"><dt>likes</dt><dd>CTFs, homelabs, retro Wii games</dd></div>
            <div className="stat"><dt>dislikes</dt><dd>plaintext passwords, chatbots that overshare</dd></div>
          </dl>
          <div className="flex flex-wrap gap-2 mt-4">
            <a className="gel silver" href="https://github.com/GrantHaw" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="gel silver" href="https://www.linkedin.com/in/grant-hawerlander/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </Win>
        <Win id="latest" className="order-3 lg:order-5 lg:col-span-3" title="latest posts">
          {posts.length ? (
            <ul>
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Link href={'/blog/' + p.slug} className="fx-row">
                    <Pixel name="folder" size={2} />
                    <span className="min-w-0">
                      <span className="block font-semibold truncate">{p.title} {i === 0 ? <span className="newtag ml-1">new</span> : null}</span>
                      <span className="block text-[14px] text-[#6b3a5c]">{prettyDate(p.date)}</span>
                    </span>
                    <span />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p>No posts yet.</p>}
          <Link href="/blog" className="gel silver mt-4">all posts</Link>
        </Win>
        <Win className="order-4 lg:order-6 lg:col-span-3" title="projects">
          <ul className="space-y-2">
            {projects.slice(0, 4).map((p) => (
              <li key={p.id}><Link href={'/projects#' + p.id} className="flex items-center gap-2 hover:underline"><Pixel name="floppy" size={2} /><span className="font-semibold">{p.title}</span></Link></li>
            ))}
          </ul>
          <Link href="/projects" className="gel silver mt-4">all projects</Link>
        </Win>
        <Win className="order-5 lg:order-7 lg:col-span-3" title="tools">
          <ul className="space-y-2">
            {tools.map((t) => (
              <li key={t.id}><Link href="/projects#tools" className="flex items-center gap-2 hover:underline"><Pixel name="term" size={2} /><span className="font-semibold">{t.name}</span></Link></li>
            ))}
          </ul>
        </Win>
        <Win title="pinto.jpg" className="order-6 lg:order-8 lg:col-span-3" bodyClass="!p-3">
          <img src="/y2k/pinto-bag.jpg" alt="Pinto the tuxedo cat peeking out of a paper shopping bag" className="w-full aspect-square object-cover object-[50%_45%] rounded-md border-2 border-[var(--plum)]" />
          <p className="f-ui text-[15px] mt-2 text-center">Pinto (Chief Morale Officer)</p>
        </Win>
        <div className="order-9 lg:col-span-12"><NowCard initial={now && now.ok ? now : null} /></div>
      </div>
    </div>
  )
}
