import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { pushEnabled, sendPush } from '@/lib/push'

// Pengaturan notifikasi dorong untuk pengguna admin yang sedang login.
//  GET  -> { enabled, publicKey, mine }   (status server + jumlah perangkat milikku)
//  POST -> { action: 'subscribe' | 'unsubscribe' | 'test', ... }
const MAX_DEVICES_PER_USER = 10

async function authed(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  return { payload, user }
}

export async function GET(request: Request) {
  const { payload, user } = await authed(request)
  if (!user) return NextResponse.json({ error: 'Silakan login ke admin dulu.' }, { status: 401 })
  const mine = await payload.count({ collection: 'push-subscriptions', where: { user: { equals: user.id } }, overrideAccess: true })
  return NextResponse.json({
    enabled: pushEnabled(),
    publicKey: pushEnabled() ? process.env.VAPID_PUBLIC_KEY : null,
    mine: mine.totalDocs,
  })
}

type Body = {
  action?: string
  endpoint?: string
  userAgent?: string
  subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } }
}

const deviceName = (ua: string) => {
  const os = /iphone|ipad|ipod/i.test(ua) ? 'iPhone/iPad' : /android/i.test(ua) ? 'Android' : /windows/i.test(ua) ? 'Windows' : /mac os/i.test(ua) ? 'Mac' : 'Perangkat'
  const br = /edg\//i.test(ua) ? 'Edge' : /chrome\//i.test(ua) ? 'Chrome' : /safari\//i.test(ua) ? 'Safari' : /firefox\//i.test(ua) ? 'Firefox' : ''
  return [os, br].filter(Boolean).join(' · ')
}

export async function POST(request: Request) {
  const { payload, user } = await authed(request)
  if (!user) return NextResponse.json({ error: 'Silakan login ke admin dulu.' }, { status: 401 })
  if (!pushEnabled()) return NextResponse.json({ error: 'Notifikasi belum diaktifkan di server. Hubungi pengelola website.' }, { status: 503 })

  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 })
  }

  if (body.action === 'subscribe') {
    const s = body.subscription
    if (!s?.endpoint || !s.keys?.p256dh || !s.keys.auth || !/^https:\/\//.test(s.endpoint)) {
      return NextResponse.json({ error: 'Data langganan tidak valid.' }, { status: 400 })
    }
    const existing = await payload.find({ collection: 'push-subscriptions', where: { endpoint: { equals: s.endpoint } }, limit: 1, depth: 0, overrideAccess: true })
    const data = { user: user.id, endpoint: s.endpoint, p256dh: s.keys.p256dh, auth: s.keys.auth, device: deviceName(String(body.userAgent || '')) }
    if (existing.docs[0]) {
      await payload.update({ collection: 'push-subscriptions', id: existing.docs[0].id, data, overrideAccess: true })
    } else {
      const mine = await payload.count({ collection: 'push-subscriptions', where: { user: { equals: user.id } }, overrideAccess: true })
      if (mine.totalDocs >= MAX_DEVICES_PER_USER) {
        return NextResponse.json({ error: `Maksimal ${MAX_DEVICES_PER_USER} perangkat per pengguna. Matikan notifikasi di perangkat lama dulu.` }, { status: 400 })
      }
      await payload.create({ collection: 'push-subscriptions', data, overrideAccess: true })
    }
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'unsubscribe') {
    if (!body.endpoint) return NextResponse.json({ error: 'Perangkat tidak dikenal.' }, { status: 400 })
    await payload.delete({
      collection: 'push-subscriptions',
      where: { and: [{ endpoint: { equals: body.endpoint } }, { user: { equals: user.id } }] },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'test') {
    const r = await sendPush(
      payload,
      { title: 'Tes notifikasi ARTIC', body: 'Kalau ini muncul di HP, notifikasi pesan baru sudah aktif.', url: '/admin', tag: 'test' },
      user.id,
    )
    return NextResponse.json({ ok: true, ...r })
  }

  return NextResponse.json({ error: 'Aksi tidak dikenal.' }, { status: 400 })
}
