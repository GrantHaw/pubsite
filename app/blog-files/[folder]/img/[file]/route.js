// images for posts live in content/blog/<post>/img so they dont clutter the file list
import fs from 'fs'
import path from 'path'
import { rawPath } from '../../../../../lib/blog'

const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }

export async function GET(req, { params }) {
  const p = rawPath(params.folder, params.file, 'img')
  const t = p ? types[path.extname(p).toLowerCase()] : null
  if (!t) return new Response('Not found', { status: 404 })
  return new Response(fs.readFileSync(p), {
    headers: { 'Content-Type': t, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=86400' },
  })
}
