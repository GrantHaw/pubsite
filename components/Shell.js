'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Win from './Win'
import { getInfo, LOGOS } from './sysinfo'

const HELP = [
  'help              this list',
  'ls [dir]          list files',
  'cd <dir>          change directory (.. goes up, ~ goes home)',
  'cat <file>        print a file',
  'open <path>       open the page for a file or folder',
  'np                what grant is listening to',
  'neofetch          what your browser says about you',
  'matrix            wake up, neo',
  'pwd, whoami, history, clear',
]

// for when people try to escape / pwn the thing. shuffled so it doesnt repeat
const SNARK = [
  "you really think i wouldn't handle that?",
  'nope.',
  'nice try.',
  "this is a static site. there's nothing back here.",
  'out of scope. read the rules of engagement.',
  'permission denied (and judged).',
  'i literally test this stuff for a living.',
  'that would be a finding. not on my box tho!!',
  'access denied. pinto saw that.',
  'cute.',
  'try harder (this is a joke, please do not try harder).',
]
// random line after the matrix rain ends
const AFTER = [
  'wake up.',
  'the matrix has you.',
  'follow the white rabbit.',
  'knock, knock.',
  'there is no spoon.',
  'ok that was cool, admit it.',
  'your gpu says hi.',
  'pink because green is overrated.',
  'that was your browser, btw.',
  'déjà vu? probably a glitch.',
]
// payload spotting. if someone echoes an attack string they get a lil note back
const PAYLOADS = [
  { re: /<\s*script|<\s*img[^>]*on\w+\s*=|<\s*svg[^>]*on\w+|on(error|load|mouseover|focus)\s*=|javascript\s*:|alert\s*\(|prompt\s*\(|confirm\s*\(|document\.cookie|<\s*iframe/i, t: "xss? react escapes all of this. it’s just text, srrz :(" },
  { re: /'\s*(or|and)\s*'?\d*'?\s*=\s*'?\d*|\bunion\b[\s\S]*\bselect\b|\bdrop\s+table\b|\bsleep\s*\(|\bwaitfor\s+delay\b|'\s*--|\bor\s+1\s*=\s*1\b|\binformation_schema\b|\bbenchmark\s*\(/i, t: "girl if you think i'm setting up an sqlite database for this you're crazyyyy" },
  { re: /\{\{.*\}\}|\$\{\s*\d+\s*[*+]\s*\d+\s*\}|<%=.*%>|#\{.*\}/, t: "ssti? no templates here >:)" },
  { re: /\$\{\s*jndi\s*:/i, t: "log4shell? this isn’t 2021 and this definitely aint java." },
  { re: /<!ENTITY|<!DOCTYPE[^>]*\[/i, t: 'xxe? no xml parser here, just vibes.' },
  { re: /\$(ne|gt|lt|regex|where)\b|\{\s*"\$/i, t: "nosql injection? if i'm too lazy to not set up a db i'm for SURE not setting up something like mongo" },
  { re: /%0d%0a|\\r\\n|%0a/i, t: 'crlf? there are no headers to split here.' },
  { re: /\.\.(\/|\\|%2f)|%2e%2e/i, t: "path traversal won’t get you anywhere. there’s no real filesystem. nice try tho!!!" },
  { re: /\*\)\s*\(|\(\|\(|\(uid=\*\)/i, t: "ldap injection? i’m flattered you think i would set up LDAP for a personal blog, but no lol" },
  { re: /\b(169\.254\.169\.254|metadata\.google|localhost:\d+|127\.0\.0\.1)\b/i, t: 'ssrf? this shell never makes requests. the metadata service is safe.' },
  { re: /\b(ignore|disregard) (all |any )?(previous|prior|above) (instructions|prompts)\b|\bsystem prompt\b|\byou are now\b|\bjailbreak\b|\bDAN\b/i, t: "prompt injection? on me? i’m a fake, emulated, static shell, not a chatbot. good instinct though!!!" },
]
function payload(line) {
  const hit = PAYLOADS.find((x) => x.re.test(line))
  return hit ? hit.t : null
}

// stuff that counts as poking at the walls
const SPICY = ['ssh', 'su', 'sudo', 'rm', 'curl', 'wget', 'nc', 'ncat', 'netcat', 'nmap', 'chmod', 'chown', 'kill', 'python', 'python3', 'node', 'bash', 'sh', 'zsh', 'powershell', 'cmd', 'vim', 'vi', 'nano', 'emacs', 'mv', 'cp', 'touch', 'mkdir', 'apt', 'pip', 'npm', 'scp', 'telnet', 'ftp', 'passwd', 'reboot', 'shutdown', 'exec', 'eval', 'msfconsole', 'hydra', 'sqlmap', 'ping', 'ifconfig', 'ip', 'netstat', 'whoami.exe', 'mimikatz']

// walk the tree. parts is an array like ['blog','example-post']
function walk(tree, parts) {
  let n = tree
  for (const p of parts) {
    if (!n || n.t !== 'd' || !n.kids[p]) return null
    n = n.kids[p]
  }
  return n
}

function resolve(cwd, arg) {
  if (!arg) return cwd.slice() // no arg = where you already are
  if (arg === '~') return []
  let parts = arg.startsWith('~') || arg.startsWith('/') ? [] : cwd.slice()
  arg.replace(/^~\/?/, '').replace(/^\//, '').split('/').forEach((s) => {
    if (!s || s === '.') return
    if (s === '..') parts.pop()
    else parts.push(s)
  })
  return parts
}

export default function Shell({ tree, id, className }) {
  const router = useRouter()
  const [cwd, setCwd] = useState([])
  const [out, setOut] = useState([{ c: 'dim', t: "type 'help' for commands, or click a name below." }])
  const [val, setVal] = useState('')
  const [hist, setHist] = useState([])
  const [hi, setHi] = useState(-1)
  const [rain, setRain] = useState(null)
  const cv = useRef(null)
  const bag = useRef([])
  const box = useRef(null)

  function snark() {
    if (!bag.current.length) {
      bag.current = SNARK.slice()
      for (let i = bag.current.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = bag.current[i]; bag.current[i] = bag.current[j]; bag.current[j] = t }
    }
    return [{ c: 'a', t: bag.current.pop() }]
  }
  const inp = useRef(null)

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight }, [out])
  const booted = useRef(false) // dev mode runs effects twice, this stops the double ls
  useEffect(() => { if (booted.current) return; booted.current = true; run('ls', true) }, []) // eslint-disable-line

  const where = (c) => '~' + (c.length ? '/' + c.join('/') : '')

  function lsLines(node, parts) {
    const names = Object.keys(node.kids).sort((a, b) => {
      const da = node.kids[a].t === 'd', db = node.kids[b].t === 'd'
      return da === db ? a.localeCompare(b) : da ? -1 : 1
    })
    if (!names.length) return [{ c: 'dim', t: '(empty)' }]
    return [{ items: names.map((n) => ({ n: n, d: node.kids[n].t === 'd', path: parts.concat([n]) })) }]
  }

  function run(raw, quiet, from) {
    const line = raw.trim()
    const base = from || cwd
    const echo = quiet ? [] : [{ prompt: where(base), t: line }]
    if (!line) { setOut((o) => o.concat(echo)); return }
    if (!quiet) { setHist((h) => [line].concat(h).slice(0, 50)); setHi(-1) }
    const [cmd, ...args] = line.split(/\s+/)
    const arg = args.join(' ')
    let res = []
    let next = base

    const lc = line.toLowerCase()
    const escapes = (a) => {
      if (!a) return false
      if (a.startsWith('/') && !a.startsWith('/home/guest')) return true // /etc/passwd and friends
      let d = a.startsWith('~') || a.startsWith('/') ? 0 : base.length
      for (const s of a.replace(/^~\/?/, '').replace(/^\/home\/guest\/?/, '').split('/')) { if (s === '..') d--; else if (s && s !== '.') d++; if (d < 0) return true }
      return false
    }

    const pl = ['cd', 'ls', 'cat', 'dir', 'type', 'open'].includes(cmd) ? null : payload(line) // nav cmds keep the snark instead
    if (pl) res = (cmd === 'echo' ? [{ t: arg }] : []).concat([{ c: 'g', t: '^ ' + pl }])
    else if (SPICY.includes(cmd.toLowerCase()) || /ignore (all )?(previous|prior) instructions|system prompt|\$\(|`|;|&&|\|\||\|/.test(lc)) res = snark()
    else if (['cd', 'ls', 'cat', 'dir', 'open', 'type'].includes(cmd) && escapes(arg.replace(/^\/home\/guest/, '~'))) res = snark()
    else if (cmd === 'help') res = HELP.map((t) => ({ t: t }))
    else if (cmd === 'clear') { setOut([]); return }
    else if (cmd === 'pwd') res = [{ t: '/home/guest/' + base.join('/') }]
    else if (cmd === 'whoami') res = [{ t: 'guest. this is grant\'s site though. try: cat about.txt' }]
    else if (cmd === 'history') res = hist.slice().reverse().map((h, i) => ({ t: (i + 1) + '  ' + h }))
    else if (cmd === 'echo') res = [{ t: arg }]
    else if (cmd === 'ls' || cmd === 'dir') {
      const parts = resolve(base, arg)
      const n = walk(tree, parts)
      if (!n) res = [{ c: 'a', t: 'ls: ' + arg + ': no such file or directory' }]
      else if (n.t === 'f') res = [{ t: parts[parts.length - 1] }]
      else res = lsLines(n, parts)
    } else if (cmd === 'cd') {
      const parts = resolve(base, arg || '~') // bare cd goes home like a real shell
      const n = walk(tree, parts)
      if (!n) res = [{ c: 'a', t: 'cd: ' + arg + ': no such directory' }]
      else if (n.t !== 'd') res = [{ c: 'a', t: 'cd: ' + arg + ': not a directory' }]
      else next = parts
    } else if (cmd === 'cat' || cmd === 'type' || cmd === 'less' || cmd === 'more') {
      if (!arg) res = [{ c: 'a', t: cmd + ': which file? try ls' }]
      else {
        const n = walk(tree, resolve(base, arg))
        if (!n) res = [{ c: 'a', t: cmd + ': ' + arg + ': no such file' }]
        else if (n.t === 'd') res = [{ c: 'a', t: cmd + ': ' + arg + ': is a directory' }]
        else if (n.bin) res = [{ c: 'a', t: cmd + ': ' + arg + ': binary file. try: open ' + arg }]
        else res = n.body.replace(/\n$/, '').split('\n').map((t) => ({ t: t || ' ' }))
      }
    } else if (cmd === 'open' || cmd === 'start' || cmd === 'xdg-open') {
      const n = walk(tree, resolve(base, arg || '.'))
      if (!n || !n.go) res = [{ c: 'a', t: 'open: ' + (arg || '.') + ': nothing to open' }]
      else if (n.go.startsWith('http')) { res = [{ c: 'dim', t: 'opening in spotify ...' }]; window.open(n.go, '_blank', 'noopener') }
      else { res = [{ c: 'dim', t: 'opening ' + n.go + ' ...' }]; setTimeout(() => router.push(n.go), 250) }
    } else if (cmd === 'exit' || cmd === 'logout') res = [{ c: 'dim', t: 'there is no escape. (ok fine, use the nav up top)' }]
    else if (cmd === 'np' || cmd === 'nowplaying') {
      setOut((o) => o.concat(echo))
      fetch('/api/now-playing').then((r) => r.json()).then((v) => {
        let l
        if (!v.ok) l = [{ c: 'dim', t: 'spotify isnt connected right now.' }]
        else if (!v.track) l = [{ c: 'dim', t: 'nothing played recently. its quiet in here.' }]
        else {
          const t = v.track
          const m = (ms) => Math.floor(ms / 60000) + ':' + String(Math.floor(ms / 1000) % 60).padStart(2, '0')
          l = [{ c: 'g', t: (v.playing ? '♪ now playing' : '■ last played') }, { t: t.title + ' - ' + t.artist }, { c: 'dim', t: t.album + (v.playing ? '  [' + m(v.progress) + ' / ' + m(t.dur) + ']' : '') }, { c: 'dim', t: 'more at /music, or: open music' }]
        }
        setOut((o) => o.concat(l))
      }).catch(() => setOut((o) => o.concat([{ c: 'a', t: 'np: couldnt reach the player' }])))
      return
    }
    else if (cmd === 'neofetch' || cmd === 'fastfetch') {
      setOut((o) => o.concat(echo))
      getInfo().then((inf) => setOut((o) => o.concat([{ neo: inf }, { c: 'dim', t: 'i can get all that from ur browser >:)' }])))
      return
    } else if (cmd === 'matrix' || cmd === 'cmatrix') {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) res = [{ c: 'dim', t: 'skipping the rain since you have reduced motion on.' }]
      else {
        setOut((o) => o.concat(echo))
        getInfo().then((inf) => setRain(inf))
        return
      }
    }
    else res = [{ c: 'a', t: cmd + ': command not found. try help' }]

    setCwd(next)
    setOut((o) => o.concat(echo, res))
  }

  // matrix rain made out of the visitor's own browser info
  useEffect(() => {
    if (!rain || !cv.current) return
    const c = cv.current
    const r = c.parentElement.getBoundingClientRect()
    c.width = r.width; c.height = r.height
    const x = c.getContext('2d')
    const src = (rain.rows.map((q) => q[1]).join(' ') + ' ' + rain.ua).replace(/\s+/g, '')
    const fs = 16
    const cols = Math.ceil(c.width / fs)
    const ys = Array.from({ length: cols }, () => Math.random() * -40)
    const colors = ['#ff3ea5', '#c6ff3d', '#9fe8ff', '#c9a6ff']
    let k = 0
    const t = setInterval(() => {
      x.fillStyle = 'rgba(13,0,11,0.18)'
      x.fillRect(0, 0, c.width, c.height)
      x.font = fs + 'px monospace'
      for (let i = 0; i < cols; i++) {
        const ch = src[(k + i * 7) % src.length]
        x.fillStyle = Math.random() > 0.96 ? '#ffffff' : colors[i % colors.length]
        x.fillText(ch, i * fs, ys[i] * fs)
        if (ys[i] * fs > c.height && Math.random() > 0.97) ys[i] = 0
        ys[i]++
      }
      k++
    }, 50)
    const g = rain.rows.find((q) => q[0] === 'gpu') // swap "gpu" for the real name if we got one
    const stop = () => {
      over = true; setRain(null)
      let line = AFTER[Math.floor(Math.random() * AFTER.length)]
      if (g) line = line.replace('your gpu', 'your ' + g[1])
      setOut((o) => o.concat([{ c: 'dim', t: line }]))
    }
    const done = setTimeout(stop, 7000)
    const t0 = Date.now()
    let over = false
    const key = () => {
      if (over || Date.now() - t0 < 500) return // ignore the enter that started it
      over = true; clearTimeout(done); stop()
    }
    window.addEventListener('keydown', key)
    c.addEventListener('click', key)
    return () => { clearInterval(t); clearTimeout(done); window.removeEventListener('keydown', key) }
  }, [rain])

  function tab() {
    const toks = val.split(/\s+/)
    const last = toks[toks.length - 1] || ''
    const i = last.lastIndexOf('/')
    const dirPart = i >= 0 ? last.slice(0, i + 1) : ''
    const frag = i >= 0 ? last.slice(i + 1) : last
    const n = walk(tree, resolve(cwd, dirPart || '.'))
    if (!n || n.t !== 'd') return
    const hits = Object.keys(n.kids).filter((k) => k.startsWith(frag))
    if (hits.length === 1) {
      toks[toks.length - 1] = dirPart + hits[0] + (n.kids[hits[0]].t === 'd' ? '/' : '')
      setVal(toks.join(' '))
    } else if (hits.length > 1) {
      setOut((o) => o.concat([{ prompt: where(cwd), t: val }, { t: hits.join('  ') }]))
    }
  }

  function onKey(e) {
    if (e.key === 'Enter') { run(val); setVal('') }
    else if (e.key === 'Tab') { e.preventDefault(); tab() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const j = Math.min(hi + 1, hist.length - 1); if (j >= 0) { setHi(j); setVal(hist[j]) } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const j = hi - 1; setHi(j); setVal(j >= 0 ? hist[j] : '') }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setOut([]) }
  }

  // clicking a name in ls output: dirs cd in, files cat
  function pick(it) {
    const rel = it.path.join('/')
    if (it.d) { run('cd ~/' + rel); setTimeout(() => run('ls', false, it.path), 0) }
    else run('cat ~/' + rel)
    if (inp.current) inp.current.focus()
  }

  return (
    // click anywhere on the shell to type, unless you're selecting text or hit a button/link
    <div className={className} onClick={(e) => {
      if (e.target.closest('button, a')) return
      if (String(window.getSelection ? window.getSelection() : '')) return
      if (inp.current) inp.current.focus()
    }}>
    <Win term id={id} title="shell" bodyClass="!p-0">
      <div className="relative px-[14px] pt-3 pb-2 lg:min-h-[290px] flex flex-col">
        <div ref={box} className="shell-out flex-1" aria-live="polite">
          {out.map((l, i) => {
            if (l.neo) {
              const art = LOGOS[l.neo.os.logo] || LOGOS.default
              return (
                <div key={i} className="flex flex-wrap gap-x-6 gap-y-2 my-1">
                  <pre className="a leading-[1.15] text-[14px]" style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>{art.join('\n')}</pre>
                  <div>
                    <p><span className="g">guest</span><span className="dim">@</span><span className="g">ghaw.net</span></p>
                    <p className="dim">-------------</p>
                    {l.neo.rows.map((q) => <p key={q[0]}><span className="v">{q[0]}</span><span className="dim">: </span>{q[1]}</p>)}
                    <p className="flex gap-1 mt-1" aria-hidden="true">{['#2a0822', '#ff3ea5', '#c6ff3d', '#9fe8ff', '#9b5cff', '#ffc2e2', '#ffffff'].map((cc) => <span key={cc} className="inline-block w-4 h-3" style={{ background: cc }} />)}</p>
                  </div>
                </div>
              )
            }
            if (l.items) return (
              <p key={i} className="flex flex-wrap gap-x-5">
                {l.items.map((it) => (
                  <button key={it.n} type="button" onClick={() => pick(it)} className={(it.d ? 'v' : '') + ' hover:underline'}>{it.n + (it.d ? '/' : '')}</button>
                ))}
              </p>
            )
            if (l.prompt !== undefined) return <p key={i}><span className="g">guest@ghaw.net</span><span className="dim">:</span><span className="v">{l.prompt}</span><span className="dim">$ </span>{l.t}</p>
            return <p key={i} className={(l.c || '') + ' whitespace-pre-wrap break-words'}>{l.t}</p>
          })}
        </div>
        {rain ? <canvas ref={cv} className="absolute inset-0 w-full h-full rounded-b-[10px]" aria-hidden="true" /> : null}
        <label className="flex items-center gap-0 mt-1">
          <span className="sr-only">Shell command</span>
          <span className="g" aria-hidden="true">guest@ghaw.net</span><span className="dim" aria-hidden="true">:</span><span className="v" aria-hidden="true">{where(cwd)}</span><span className="dim mr-1" aria-hidden="true">$</span>
          <input ref={inp} className="shell-in" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="off" spellCheck="false" />
        </label>
      </div>
    </Win>
    </div>
  )
}
