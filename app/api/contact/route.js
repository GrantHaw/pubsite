import nodemailer from 'nodemailer'

export async function POST(req) {
  let b
  try { b = await req.json() } catch { return new Response('bad json', { status: 400 }) }
  const name = String(b.name || '').trim().slice(0, 100)
  const email = String(b.email || '').trim().slice(0, 200)
  const msg = String(b.message || '').trim().slice(0, 5000)

  // basic sanity check, nothing fancy
  if (!name || !msg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response('missing or invalid fields', { status: 400 })
  }

  const tx = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_PASS,
    },
  })

  const body = 'You received a new message from ghaw.net:\n\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n\n' +
    'Message:\n' + msg + '\n'

  try {
    await tx.sendMail({
      from: process.env.CONTACT_EMAIL, // gmail rewrites from anyway
      replyTo: email, // so hitting reply goes to the sender
      to: process.env.CONTACT_EMAIL,
      subject: 'ghaw.net contact from ' + name.replace(/[\r\n]/g, ' '),
      text: body,
    })
    return new Response('Email sent', { status: 200 })
  } catch (err) {
    console.error('Email error:', err)
    return new Response('Error sending email', { status: 500 })
  }
}
