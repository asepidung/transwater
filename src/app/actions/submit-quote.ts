'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSiteContent } from '@/lib/get-content'

export type QuoteResult = { ok: true } | { ok: false }

const MAX = { company: 120, name: 100, contact: 40, product: 80, volume: 120, message: 1000 }
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return false
}

const esc = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Hilangkan baris baru dari teks yang masuk ke header email (cegah header injection).
const clean = (v: string) => v.replace(/\s+/g, ' ')

// Nomor Indonesia -> tautan wa.me (08xx -> 628xx). Kembalikan null jika bentuknya tidak jelas.
function waLink(contact: string): string | null {
  const d = contact.replace(/\D/g, '')
  let n: string | null = null
  if (d.startsWith('62')) n = d
  else if (d.startsWith('0')) n = `62${d.slice(1)}`
  else if (d.startsWith('8')) n = `62${d}`
  return n && n.length >= 10 && n.length <= 15 ? `https://wa.me/${n}` : null
}

function field(fd: FormData, key: keyof typeof MAX) {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim().slice(0, MAX[key]) : ''
}

export async function submitQuote(fd: FormData): Promise<QuoteResult> {
  // Jebakan bot: kolom "website" disembunyikan dari manusia. Bot yang mengisinya
  // dianggap sukses supaya tidak tahu ketahuan.
  if (fd.get('website')) return { ok: true }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) return { ok: false }

  const company = field(fd, 'company')
  const name = field(fd, 'name')
  const contact = field(fd, 'contact')
  if (!company || !name || !contact) return { ok: false }
  if (contact.replace(/\D/g, '').length < 6) return { ok: false }

  const locale = fd.get('locale') === 'en' ? 'en' : 'id'

  try {
    const payload = await getPayload({ config })
    // Simpan nama produk yang terbaca manusia (bukan kode teknis), dalam bahasa Indonesia
    // karena tim yang membaca pesan memakai bahasa itu.
    const site = await getSiteContent('id')
    const rawProduct = field(fd, 'product')
    const product =
      rawProduct === 'other'
        ? site.quote.form.productOther
        : (site.products.items.find((p) => p.id === rawProduct)?.name ?? rawProduct)
    const volume = field(fd, 'volume')
    const message = field(fd, 'message')
    await payload.create({
      collection: 'messages',
      data: { company, name, contact, product, volume, message, locale },
    })

    // Notifikasi email ke tim ARTIC. Pesan sudah tersimpan di CMS, jadi kegagalan kirim
    // email tidak boleh membuat pengunjung melihat galat.
    const to = process.env.NOTIFY_EMAIL
    if (to) {
      try {
        const rows: [string, string][] = [
          ['Perusahaan', company],
          ['Nama', name],
          ['WhatsApp / telepon', contact],
          ['Produk', product || '-'],
          ['Perkiraan kebutuhan', volume || '-'],
          ['Catatan', message || '-'],
          ['Bahasa halaman', locale],
        ]
        const wa = waLink(contact)
        const adminUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '')}/admin/collections/messages`
        const link = (href: string, label: string) => `<a href="${esc(href)}" style="color:#303860">${esc(label)}</a>`
        await payload.sendEmail({
          to: to.split(',').map((a) => a.trim()).filter(Boolean),
          subject: `[ARTIC] Permintaan penawaran baru: ${clean(company)}`,
          text:
            rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
            (wa ? `\n\nBalas via WhatsApp: ${wa}` : '') +
            `\nLihat semua pesan: ${adminUrl}`,
          html:
            '<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' +
            rows.map(([k, v]) => `<tr><td style="color:#555"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('') +
            '</table><p style="font-family:sans-serif;font-size:14px">' +
            (wa ? `${link(wa, 'Balas via WhatsApp')} &nbsp;·&nbsp; ` : '') +
            `${link(adminUrl, 'Buka Pesan Masuk di panel admin')}</p>`,
        })
      } catch (err) {
        console.error('[submitQuote] email notifikasi gagal terkirim', err)
      }
    }
    return { ok: true }
  } catch (err) {
    console.error('[submitQuote] gagal menyimpan pesan', err)
    return { ok: false }
  }
}
