import nodemailer from 'nodemailer'

export async function POST(req) {
  const { name, email, message } = await req.json()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_PASS,
    },
  })

  const emailBody = `
You received a new message from your portfolio site:

Name: ${name}
Email: ${email}

Message:
${message}
`

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL,
      subject: `Portfolio Contact from ${name}`,
      text: emailBody,
    })

    return new Response('Email sent', { status: 200 })
  } catch (err) {
    console.error('Email error:', err)
    return new Response('Error sending email', { status: 500 })
  }
}
