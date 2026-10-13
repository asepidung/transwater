import type { Payload } from 'payload'

type Props = { payload: Payload; user?: { role?: string | null } | null }

// Dasbor: daftar perubahan yang masih berupa draf dan menunggu persetujuan (terbit) Pemilik.
// Draf = versi terbaru berstatus draft; yang sudah terbit tetap tayang sampai Pemilik menerbitkan perubahannya.
const GLOBALS: { slug: 'site-settings' | 'home-page' | 'about-page' | 'info-pages'; label: string }[] = [
  { slug: 'site-settings', label: 'Pengaturan Situs' },
  { slug: 'home-page', label: 'Isi Halaman Utama' },
  { slug: 'about-page', label: 'Halaman Tentang' },
  { slug: 'info-pages', label: 'Halaman Info (Kualitas, Cara Pesan, Privasi)' },
]

export async function PendingApprovals({ payload, user }: Props) {
  const isOwner = user?.role === 'owner'
  const items: { key: string; label: string; href: string }[] = []

  try {
    const [products, posts] = await Promise.all([
      payload.find({ collection: 'products', draft: true, where: { _status: { equals: 'draft' } }, limit: 50, depth: 0, overrideAccess: true }),
      payload.find({ collection: 'posts', draft: true, where: { _status: { equals: 'draft' } }, limit: 50, depth: 0, overrideAccess: true }),
    ])
    for (const p of products.docs) items.push({ key: `p${p.id}`, label: `Produk: ${p.title ?? p.slug ?? p.id}`, href: `/admin/collections/products/${p.id}` })
    for (const p of posts.docs) items.push({ key: `a${p.id}`, label: `Artikel: ${p.title || p.slug || p.id}`, href: `/admin/collections/posts/${p.id}` })
    for (const g of GLOBALS) {
      const doc = await payload.findGlobal({ slug: g.slug, draft: true, depth: 0, overrideAccess: true })
      if ((doc as { _status?: string })._status === 'draft') items.push({ key: g.slug, label: g.label, href: `/admin/globals/${g.slug}` })
    }
  } catch {
    return null
  }

  if (items.length === 0) return null

  return (
    <div className="artic-push">
      <div className="artic-push__head">
        <strong>📝 Menunggu persetujuan ({items.length})</strong>
      </div>
      <p className="artic-push__text">
        {isOwner
          ? 'Perubahan berikut masih draf dan belum tampil di situs. Buka, klik Pratinjau untuk melihat hasilnya, lalu Terbitkan jika sudah sesuai.'
          : 'Perubahan berikut sudah tersimpan sebagai draf. Pemilik akan melihat pratinjau dan menerbitkannya.'}
      </p>
      <ul className="artic-push__text" style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
        {items.map((i) => (
          <li key={i.key}>
            <a href={i.href}>{i.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
