import type { MetadataRoute } from 'next'
import { allowIndexing, siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Lokal/staging: blokir semua. Produksi: buka semua. /admin dan /api sengaja TIDAK di-Disallow: keduanya dikeluarkan
  // dari indeks lewat header X-Robots-Tag: noindex (next.config.ts), dan itu hanya terbaca jika Google boleh mengunjunginya.
  if (!allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
