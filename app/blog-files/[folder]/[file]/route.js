// serves the raw files (pdfs, images) out of content/blog
import fs from 'fs'
import path from 'path'
import { rawPath } from '../../../../lib/blog'

const types = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.md': 'text/plain; charset=utf-8' }

export async function GET(req, { params }) {
  const p = rawPath(params.folder, params.file)
  if (!p) return new Response('Not found', { status: 404 })
  const t = types[path.extname(p).toLowerCase()] || 'application/octet-stream'
  return new Response(fs.readFileSync(p), {
    headers: { 'Content-Type': t, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=3600' },
  })
}
