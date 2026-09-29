import type { Metadata } from 'next'

// Alamat publik situs (tanpa slash di akhir). Dipakai untuk canonical, sitemap, dan Open Graph.
// Nilai dibaca saat BUILD (halaman statis), jadi set sebelum `npm run build`.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

// Mesin pencari hanya boleh mengindeks jika ALLOW_INDEXING=true (produksi).
// Lokal dan staging otomatis noindex supaya draft tidak muncul di Google.
export const allowIndexing = process.env.ALLOW_INDEXING === 'true'

// Canonical + hreflang untuk satu halaman. `path` tanpa prefix bahasa, mis. '/produk'.
export function pageAlternates(locale: string, path = ''): NonNullable<Metadata['alternates']> {
  return {
    canonical: `/${locale}${path}`,
    languages: { id: `/id${path}`, en: `/en${path}`, 'x-default': `/id${path}` },
  }
}
