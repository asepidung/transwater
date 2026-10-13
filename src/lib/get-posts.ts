import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Post } from '@/payload-types'
import { isMedia, mediaUrl } from './get-content'
import { toLocale } from './content'
import { isPreview } from './preview-mode'

// Data artikel untuk halaman Berita. Hanya artikel berstatus "Terbit" yang diambil
// (draft tidak pernah sampai ke situs publik).

export type NewsItem = {
  slug: string
  title: string
  excerpt: string
  date: string // ISO
  updatedAt: string // ISO
  cover: string | null
  coverAlt: string
  content: Post['content'] | null
}

const hasContent = (c: Post['content'] | null | undefined) => Boolean(c && c.root && c.root.children && c.root.children.length > 0)

// Jika kolom kosong di bahasa yang diminta (mis. artikel hanya ditulis dalam English), pakai bahasa lainnya
// supaya halaman tidak kosong. Bahasa Inggris sudah otomatis memakai Indonesia lewat fallback CMS.
function withFallback(p: Post, alt: Post | undefined): Post {
  if (!alt) return p
  return {
    ...p,
    title: p.title || alt.title,
    excerpt: p.excerpt || alt.excerpt,
    content: hasContent(p.content) ? p.content : alt.content,
  }
}

function toItem(p: Post): NewsItem {
  const cover = isMedia(p.cover) ? p.cover : null
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    date: p.publishedAt ?? p.createdAt,
    updatedAt: p.updatedAt,
    cover: cover ? mediaUrl(cover, '', 'hero') : null,
    coverAlt: cover?.alt || p.title,
    content: p.content ?? null,
  }
}

export async function getPosts(localeParam: string, limit = 50): Promise<NewsItem[]> {
  const locale = toLocale(localeParam)
  try {
    const draft = await isPreview()
    const payload = await getPayload({ config })
    const query = { collection: 'posts' as const, depth: 1, limit, sort: '-publishedAt', draft, ...(draft ? {} : { where: { _status: { equals: 'published' as const } } }) }
    const other = locale === 'id' ? 'en' : 'id'
    const [res, alt] = await Promise.all([payload.find({ ...query, locale }), payload.find({ ...query, locale: other })])
    const altById = new Map(alt.docs.map((d) => [d.id, d]))
    return res.docs
      .map((d) => withFallback(d, altById.get(d.id)))
      .filter((d) => Boolean(d.title) && typeof d.slug === 'string' && d.slug !== '')
      .map(toItem)
  } catch (error) {
    console.error('[getPosts] gagal membaca Payload:', error)
    // Produksi: biarkan build/revalidate gagal supaya halaman lama dipertahankan (sama seperti getSiteContent).
    if (process.env.NODE_ENV === 'production') throw error
    return []
  }
}

export async function getPost(slug: string, localeParam: string): Promise<NewsItem | null> {
  const locale = toLocale(localeParam)
  try {
    const payload = await getPayload({ config })
    const draft = await isPreview()
    const where: Where = draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }
    const query = { collection: 'posts' as const, depth: 2, limit: 1, where, draft }
    const other = locale === 'id' ? 'en' : 'id'
    const [res, alt] = await Promise.all([payload.find({ ...query, locale }), payload.find({ ...query, locale: other })])
    const doc = res.docs[0] ? withFallback(res.docs[0], alt.docs[0]) : null
    return doc && doc.title ? toItem(doc) : null
  } catch (error) {
    console.error('[getPost] gagal membaca Payload:', error)
    if (process.env.NODE_ENV === 'production') throw error
    return null
  }
}

export const formatDate = (iso: string, dateLocale: string) =>
  new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(iso))

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 500,
      pagination: false,
      where: { _status: { equals: 'published' } },
    })
    return res.docs.map((p) => p.slug).filter((s): s is string => typeof s === 'string' && s !== '')
  } catch (error) {
    console.error('[getAllPostSlugs] gagal membaca Payload:', error)
    if (process.env.NODE_ENV === 'production') throw error
    return []
  }
}
