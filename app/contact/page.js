// app/contact/page.js
'use client'

import { useState } from 'react'
import Win from '../../components/Win'
import Pic from '../../components/Pic'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('bad res')
      setStatus({ ok: true, t: 'Message sent. I\'ll reply to the email you gave.' })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus({ ok: false, t: 'Your message didn\'t send. Try again, or email contactme@ghaw.net.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
      <aside className="lg:col-span-4 space-y-6">
        <div className="bezel">
          <div className="bezel-screen">
            <Pic src="/y2k/grant-ocean.jpg" alt="Grant smiling in front of the ocean, wearing a bandana and an orange shirt" className="w-full aspect-[4/5] object-cover" />
          </div>
        </div>
        <Win title="C:\grant\links.txt">
          <ul className="space-y-2">
            <li><a className="underline decoration-2 underline-offset-4" href="mailto:contactme@ghaw.net">contactme@ghaw.net</a></li>
            <li><a className="underline decoration-2 underline-offset-4" href="https://www.linkedin.com/in/grant-hawerlander/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a className="underline decoration-2 underline-offset-4" href="https://github.com/GrantHaw" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </Win>
      </aside>

      <Win title="C:\grant\new_message.txt" className="lg:col-span-8">
        <h1 className="page-title !text-[clamp(38px,6vw,64px)] mb-6">contact</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="f-ui text-[16px]">name</span>
              <input name="name" value={form.name} onChange={onChange} required maxLength={100} placeholder="Your name" className="y2k-input mt-1" />
            </label>
            <label className="block">
              <span className="f-ui text-[16px]">email</span>
              <input type="email" name="email" value={form.email} onChange={onChange} required maxLength={200} placeholder="you@example.com" className="y2k-input mt-1" />
            </label>
          </div>
          <label className="block">
            <span className="f-ui text-[16px]">message</span>
            <textarea name="message" value={form.message} onChange={onChange} required maxLength={5000} rows={6} placeholder="What would you like to talk about?" className="y2k-input mt-1" />
          </label>
          <div className="flex items-center gap-4 flex-wrap">
            <button type="submit" disabled={busy} className={'gel !px-8 !py-2' + (busy ? ' opacity-60 cursor-wait' : '')}>
              {busy ? 'sending...' : 'send message'}
            </button>
            {status ? (
              <p role="status" className={'f-ui text-[16px] ' + (status.ok ? 'text-[#1d6b3a]' : 'text-[#b0002a]')}>{status.t}</p>
            ) : null}
          </div>
        </form>
      </Win>
    </div>
  )
}
