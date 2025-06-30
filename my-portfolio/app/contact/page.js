'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) alert('Message sent!')
    else alert('Failed to send message.')
  }

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <Image src="/portraits/casual.jpg" width={250} height={350} className="mx-auto rounded-xl mb-6" alt="Contact Grant" />
      <h2 className="text-3xl font-bold mb-4">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required className="w-full p-2 border rounded" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" className="w-full p-2 border rounded" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea required className="w-full p-2 border rounded" rows={5} placeholder="Message" onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Send Message</button>
      </form>
    </div>
  )
}
