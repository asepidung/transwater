import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post } from '@/payload-types'
import { isMedia, mediaUrl } from './get-content'
import { toLocale } from './content'

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
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'posts',
      locale,
      depth: 1,
      limit,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
    })
    return res.docs.map(toItem)
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
    const res = await payload.find({
      collection: 'posts',
      locale,
      depth: 2,
      limit: 1,
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    })
    return res.docs[0] ? toItem(res.docs[0]) : null
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
    return res.docs.map((p) => p.slug)
  } catch (error) {
    console.error('[getAllPostSlugs] gagal membaca Payload:', error)
    if (process.env.NODE_ENV === 'production') throw error
    return []
  }
}
