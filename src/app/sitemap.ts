import type { MetadataRoute } from 'next'
import { getSiteContent } from '@/lib/get-content'
import { getPosts } from '@/lib/get-posts'
import { routing } from '@/i18n/routing'
import { siteUrl } from '@/lib/site'

// Halaman statis (path tanpa prefix bahasa) + satu halaman per produk published.
const STATIC_PATHS = ['', '/produk', '/tentang', '/kualitas', '/cara-pesan', '/kontak', '/privasi']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getSiteContent('id')
  const posts = await getPosts('id', 500)
  const paths = [
    ...STATIC_PATHS,
    ...c.products.items.map((p) => `/produk/${p.id}`),
    ...(posts.length > 0 ? ['/berita', ...posts.map((p) => `/berita/${p.slug}`)] : []),
  ]

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path.startsWith('/produk/') || path.startsWith('/berita/') ? 0.6 : 0.8,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  )
}
