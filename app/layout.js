// app/layout.js
import './globals.css'
import localFont from 'next/font/local'
import '@fontsource/chakra-petch/400.css'
import '@fontsource/chakra-petch/600.css'
import Rig from '../components/Rig'
import { listFolders } from '../lib/blog'

// big stuff = audio nugget, headings = granix, ui/terminal = pixalatte. body is chakra petch
const disp = localFont({ src: './fonts/audionugget.woff2', variable: '--f-display', display: 'swap' })
const head = localFont({ src: './fonts/granix.woff2', variable: '--f-head', display: 'swap' })
const ui = localFont({ src: './fonts/pixalatte.woff2', variable: '--f-ui', display: 'swap' })

export const metadata = {
  title: 'Grant Hawerlander',
  description: 'Cybersecurity student at RIT and penetration testing intern at Coalfire Division Hex, focused on AI and LLM security.',
}

export default function RootLayout({ children }) {
  const folders = listFolders().map((f) => ({ slug: f.slug, title: f.title }))
  return (
    <html lang="en" className={disp.variable + ' ' + head.variable + ' ' + ui.variable}>
      <body style={{ '--f-body': "'Chakra Petch'" }}>
        <Rig folders={folders}>{children}</Rig>
      </body>
    </html>
  )
}
