// app/layout.js
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script'

export const metadata = {
  title: 'Grant Hawerlander',
  description: 'Cybersecurity, Sysadmin, Educator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen bg-black text-white">
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
