import type { CollectionConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'
import { validateSlug } from '../lib/validate'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produk', plural: 'Produk' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', '_status'],
  },
  defaultSort: 'order',
  versions: { drafts: true },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  hooks: {
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
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Nama produk' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      validate: validateSlug,
      admin: { position: 'sidebar', description: 'Huruf kecil, angka, dan tanda hubung. Contoh: artic-600ml' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Foto produk' },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Kalimat singkat',
      admin: { description: 'Satu kalimat di bawah nama produk.' },
    },
    {
      name: 'specs',
      type: 'array',
      label: 'Spesifikasi',
      labels: { singular: 'Baris spesifikasi', plural: 'Spesifikasi' },
      admin: { description: 'Contoh: Volume = 600 ml. Isi hanya data yang benar; belum tahu, tulis "Menyusul".' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
