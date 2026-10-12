import webpush from 'web-push'
import type { Payload } from 'payload'

// Notifikasi dorong ke perangkat admin (PWA). Dikirim saat ada pesan penawaran baru.
// Kunci VAPID dibuat di server oleh deploy/set-vapid.sh dan disimpan di env (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY).
// Kegagalan mengirim TIDAK PERNAH boleh mengganggu penyimpanan pesan atau email.

export const pushEnabled = () => Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)

let configured = false
function configure(): boolean {
  if (!pushEnabled()) return false
  if (!configured) {
    const firstEmail = process.env.NOTIFY_EMAIL?.split(',')[0]?.trim()
    const subject = process.env.VAPID_SUBJECT || (firstEmail ? `mailto:${firstEmail}` : 'mailto:admin@artic.co.id')
    webpush.setVapidDetails(subject, process.env.VAPID_PUBLIC_KEY as string, process.env.VAPID_PRIVATE_KEY as string)
    configured = true
  }
  return true
}

export type PushMessage = { title: string; body: string; url: string; tag?: string }
export type PushResult = { sent: number; removed: number; failed: number }

// userId kosong = kirim ke semua perangkat terdaftar.
export async function sendPush(payload: Payload, message: PushMessage, userId?: number | string): Promise<PushResult> {
  const result: PushResult = { sent: 0, removed: 0, failed: 0 }
  if (!configure()) return result

  const subs = await payload.find({
    collection: 'push-subscriptions',
    where: userId ? { user: { equals: userId } } : {},
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const body = JSON.stringify(message)
  await Promise.allSettled(
    subs.docs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, body, {
          TTL: 60 * 60 * 24,
          urgency: 'high',
        })
        result.sent++
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) {
          // Perangkat sudah tidak berlangganan (aplikasi dihapus / izin dicabut): bersihkan.
          await payload.delete({ collection: 'push-subscriptions', id: s.id, overrideAccess: true }).catch(() => {})
          result.removed++
        } else {
          result.failed++
          console.error('[push] gagal mengirim ke satu perangkat:', status ?? (error as Error).message)
        }
      }
    }),
  )
  return result
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

// Pesan penawaran baru. Isi singkat dan TANPA nomor WhatsApp (notifikasi bisa terbaca di layar kunci).
export async function notifyNewQuote(payload: Payload, doc: { id: number | string; company: string; product?: string | null }) {
  if (!pushEnabled()) return
  try {
    await sendPush(payload, {
      title: 'Permintaan penawaran baru',
      body: clip([doc.company, doc.product].filter(Boolean).join(' · '), 110),
      url: `/admin/collections/messages/${doc.id}`,
      tag: `quote-${doc.id}`,
    })
  } catch (error) {
    console.error('[push] notifikasi pesan baru gagal:', error)
  }
}
