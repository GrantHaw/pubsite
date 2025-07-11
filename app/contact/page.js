// app/contact/page.js
'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      setStatus('Message sent!')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('Failed to send message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800">
              <Image
                src="/portraits/casual.jpeg"
                alt="Contact Grant"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
            Contact Me
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Your Message"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 text-white font-medium rounded-lg transition ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>

            {status && (
              <p
                className={`text-center mt-2 text-sm ${
                  status.includes('Failed') ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
