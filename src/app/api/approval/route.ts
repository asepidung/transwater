import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendPush } from '@/lib/push'
import { editUrl, findTarget } from '@/lib/approval-targets'

// "Ajukan terbit" dari Staf: mencatat permintaan dan memberi tahu semua Pemilik (notifikasi HP).
// GET ?target=&id= -> apakah sudah ada permintaan; POST {target, id?, note?} -> ajukan.
export const dynamic = 'force-dynamic'

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)
type U = { id: number | string; role?: string; username?: string | null; name?: string | null }

async function authed(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  return { payload, user: user as U | null }
}

const findExisting = (payload: Awaited<ReturnType<typeof getPayload>>, target: string, docId: string) =>
  payload.find({
    collection: 'approval-requests',
    where: { and: [{ target: { equals: target } }, { docId: { equals: docId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

export async function GET(request: Request) {
  const { payload, user } = await authed(request)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const u = new URL(request.url)
  const target = findTarget(u.searchParams.get('target') || '')
  if (!target) return NextResponse.json({ pending: false })
  const found = await findExisting(payload, target.slug, target.kind === 'global' ? '' : u.searchParams.get('id') || '')
  return NextResponse.json({ pending: found.totalDocs > 0 })
}

export async function POST(request: Request) {
  const { payload, user } = await authed(request)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = (await request.json().catch(() => ({}))) as { target?: string; id?: string | number; note?: string }
  const target = findTarget(String(body.target || ''))
  if (!target) return NextResponse.json({ error: 'target tidak valid' }, { status: 400 })
  const docId = target.kind === 'global' ? '' : String(body.id ?? '')
  if (target.kind === 'collection' && !docId) return NextResponse.json({ error: 'Simpan draf dulu sebelum mengajukan.' }, { status: 400 })

  let title = target.label
  if (target.kind === 'collection') {
    try {
      const doc = (await payload.findByID({ collection: target.slug as 'products' | 'posts', id: docId, draft: true, depth: 0, overrideAccess: true })) as { title?: string }
      if (doc?.title) title = `${target.label}: ${doc.title}`
    } catch {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan.' }, { status: 404 })
    }
  }

  const who = user.name || user.username || 'Staf'
  const note = typeof body.note === 'string' ? clip(body.note.trim(), 300) : ''
  const existing = await findExisting(payload, target.slug, docId)
  if (existing.docs[0]) {
    await payload.update({ collection: 'approval-requests', id: existing.docs[0].id, data: { title, requestedBy: who, note }, overrideAccess: true })
  } else {
    await payload.create({ collection: 'approval-requests', data: { target: target.slug, docId, title, requestedBy: who, note }, overrideAccess: true })
  }

  // Notifikasi ke semua Pemilik; klik membuka dokumennya langsung (di sana ada tombol Pratinjau).
  try {
    const owners = await payload.find({ collection: 'users', where: { role: { equals: 'owner' } }, limit: 20, depth: 0, overrideAccess: true })
    await Promise.allSettled(
      owners.docs.map((o) =>
        sendPush(payload, { title: 'Permintaan terbit', body: clip(`${who} meminta menerbitkan: ${title}`, 110), url: editUrl(target, docId), tag: `approval-${target.slug}-${docId}` }, o.id),
      ),
    )
  } catch (err) {
    payload.logger.error({ err }, '[approval] gagal mengirim notifikasi')
  }
  return NextResponse.json({ ok: true })
}
