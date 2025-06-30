'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setStatus('Message sent!')
      setForm({ name: '', email: '', message: '' })
    } else {
      setStatus('Failed to send message.')
    }

    setSubmitting(false)
  }

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <Image
        src="/portraits/casual.jpeg"
        width={250}
        height={350}
        className="mx-auto rounded-xl mb-6"
        alt="Contact Grant"
      />
      <h2 className="text-3xl font-bold mb-4">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          className="w-full p-2 border rounded bg-black text-white placeholder-gray-400"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="email"
          className="w-full p-2 border rounded bg-black text-white placeholder-gray-400"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          required
          className="w-full p-2 border rounded bg-black text-white placeholder-gray-400"
          rows={5}
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 px-4 rounded text-white ${submitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  )
}
