import { getPayload } from 'payload'
import config from '@payload-config'

// Cek kesehatan untuk monitoring dan skrip deploy: aplikasi hidup dan database bisa dibaca.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'products' })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 503 })
  }
}
