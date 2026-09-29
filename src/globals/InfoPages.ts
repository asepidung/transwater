import type { GlobalConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'

const cta = [
  { name: 'ctaTitle', type: 'text', localized: true, label: 'Judul ajakan di bawah' },
  { name: 'ctaText', type: 'textarea', localized: true, label: 'Teks ajakan di bawah' },
] as const

export const InfoPages: GlobalConfig = {
  slug: 'info-pages',
  label: 'Isi Halaman Kualitas & Cara Pesan',
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateSite()
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kualitas',
          name: 'quality',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true, label: 'Label kecil' },
            { name: 'title', type: 'text', localized: true, label: 'Judul' },
            { name: 'description', type: 'textarea', localized: true, label: 'Deskripsi singkat' },
            { name: 'pillarsTitle', type: 'text', localized: true, label: 'Judul bagian poin kualitas' },
            {
              name: 'pillars',
              type: 'array',
              label: 'Poin kualitas',
              admin: { description: 'Hanya tulis hal yang benar dan bisa dibuktikan.' },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, label: 'Judul' },
                { name: 'text', type: 'textarea', required: true, localized: true, label: 'Penjelasan' },
              ],
            },
            { name: 'legalTitle', type: 'text', localized: true, label: 'Judul bagian legalitas' },
            { name: 'legalNote', type: 'textarea', localized: true, label: 'Catatan legalitas' },
            ...cta,
          ],
        },
        {
          label: 'Cara Pesan & FAQ',
          name: 'orderPage',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true, label: 'Label kecil' },
            { name: 'title', type: 'text', localized: true, label: 'Judul' },
            { name: 'description', type: 'textarea', localized: true, label: 'Deskripsi singkat' },
            { name: 'faqTitle', type: 'text', localized: true, label: 'Judul bagian FAQ' },
            {
              name: 'faqs',
              type: 'array',
              label: 'Pertanyaan & jawaban',
              fields: [
                { name: 'q', type: 'text', required: true, localized: true, label: 'Pertanyaan' },
                { name: 'a', type: 'textarea', required: true, localized: true, label: 'Jawaban' },
              ],
            },
            ...cta,
          ],
        },
        {
          label: 'Kebijakan Privasi',
          name: 'privacy',
          fields: [
            { name: 'title', type: 'text', localized: true, label: 'Judul' },
            { name: 'updated', type: 'text', localized: true, label: 'Teks tanggal pembaruan' },
            { name: 'intro', type: 'textarea', localized: true, label: 'Pembuka' },
            {
              name: 'sections',
              type: 'array',
              label: 'Bagian kebijakan',
              admin: { description: 'Tinjau dengan pihak legal PT sebelum tayang. Ubah tanggal pembaruan setiap ada perubahan.' },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, label: 'Judul bagian' },
                { name: 'text', type: 'textarea', required: true, localized: true, label: 'Isi' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
