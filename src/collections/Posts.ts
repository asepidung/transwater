import type { CollectionConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'
import { validateSlug } from '../lib/validate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Artikel', plural: 'Berita & Artikel' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  defaultSort: '-publishedAt',
  versions: { drafts: true },
  hooks: {
    // Artikel diterbitkan/diubah/dihapus -> halaman Berita, menu, dan sitemap diperbarui.
    afterChange: [
      ({ doc }) => {
        revalidateSite()
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateSite()
        return doc
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      validate: validateSlug,
      admin: { position: 'sidebar', description: 'Huruf kecil, angka, dan tanda hubung. Dipakai di alamat artikel, mis. peresmian-lini-baru.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', description: 'Tanggal yang tampil di artikel. Artikel hanya tampil di situs jika statusnya Terbit.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', localized: true, admin: { description: 'Ringkasan 1-2 kalimat untuk daftar artikel.' } },
    { name: 'content', type: 'richText', localized: true },
  ],
}
