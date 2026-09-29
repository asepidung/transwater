import type { MetadataRoute } from 'next'
import { allowIndexing, siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Lokal/staging: blokir semua. Produksi: buka semua kecuali panel admin dan API.
  if (!allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
