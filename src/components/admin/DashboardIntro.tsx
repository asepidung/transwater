import type { Payload } from 'payload'

type Props = {
  payload: Payload
  user?: { name?: string | null; username?: string | null } | null
}

// Ringkasan di atas dasbor: sapaan, pesan masuk yang belum ditindaklanjuti, dan pintasan
// ke bagian yang paling sering dipakai tim ARTIC.
export async function DashboardIntro({ payload, user }: Props) {
  const [unhandled, products] = await Promise.all([
    payload.count({ collection: 'messages', where: { handled: { equals: false } }, overrideAccess: true }),
    payload.count({ collection: 'products', overrideAccess: true }),
  ])
  const who = user?.name || user?.username || ''
  const newMessages = unhandled.totalDocs

  return (
    <div className="artic-dash">
      <h2 className="artic-dash__hello">Halo{who ? `, ${who}` : ''} 👋</h2>
      <p className="artic-dash__sub">Kelola isi website ARTIC dari sini. Perubahan tampil di situs setelah disimpan/diterbitkan.</p>

      <div className="artic-dash__grid">
        <a
          className={`artic-dash__card artic-dash__card--main${newMessages > 0 ? ' is-alert' : ''}`}
          href="/admin/collections/messages?where[handled][equals]=false"
        >
          <span className="artic-dash__num">{newMessages}</span>
          <span className="artic-dash__label">Permintaan penawaran baru</span>
          <span className="artic-dash__hint">{newMessages > 0 ? 'Belum ditindaklanjuti. Buka sekarang' : 'Semua sudah ditindaklanjuti'}</span>
        </a>
        <a className="artic-dash__card" href="/admin/collections/products">
          <span className="artic-dash__num">{products.totalDocs}</span>
          <span className="artic-dash__label">Produk</span>
          <span className="artic-dash__hint">Nama, foto, spesifikasi</span>
        </a>
        <a className="artic-dash__card" href="/admin/globals/home-page">
          <span className="artic-dash__icon">🏠</span>
          <span className="artic-dash__label">Isi Halaman Utama</span>
          <span className="artic-dash__hint">Judul, keunggulan, langkah pesan</span>
        </a>
        <a className="artic-dash__card" href="/admin/globals/site-settings">
          <span className="artic-dash__icon">⚙️</span>
          <span className="artic-dash__label">Pengaturan Situs</span>
          <span className="artic-dash__hint">Alamat, telepon, WhatsApp, Instagram</span>
        </a>
        <a className="artic-dash__card" href="/id" target="_blank" rel="noopener">
          <span className="artic-dash__icon">🌐</span>
          <span className="artic-dash__label">Lihat situs</span>
          <span className="artic-dash__hint">Buka di tab baru</span>
        </a>
      </div>
    </div>
  )
}
