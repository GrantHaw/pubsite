// polled by the player + the shell's np command
import { getNow } from '../../../lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET() {
  const v = await getNow()
  return Response.json(v, { headers: { 'Cache-Control': 'public, max-age=15' } })
}
