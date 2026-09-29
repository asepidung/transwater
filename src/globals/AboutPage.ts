import type { GlobalConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Isi Halaman Tentang & Kontak',
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
          label: 'Tentang',
          name: 'about',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true, label: 'Label kecil' },
            { name: 'title', type: 'text', localized: true, label: 'Judul' },
            { name: 'description', type: 'textarea', localized: true, label: 'Deskripsi singkat' },
            { name: 'storyTitle', type: 'text', localized: true, label: 'Judul bagian profil' },
            {
              name: 'story',
              type: 'array',
              label: 'Paragraf profil',
              fields: [{ name: 'text', type: 'textarea', required: true, localized: true, label: 'Paragraf' }],
            },
            { name: 'valuesTitle', type: 'text', localized: true, label: 'Judul bagian nilai' },
            {
              name: 'values',
              type: 'array',
              label: 'Nilai / komitmen',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, label: 'Judul' },
                { name: 'text', type: 'textarea', required: true, localized: true, label: 'Penjelasan' },
              ],
            },
            { name: 'legalTitle', type: 'text', localized: true, label: 'Judul bagian legalitas' },
            { name: 'ctaTitle', type: 'text', localized: true, label: 'Judul ajakan di bawah' },
            { name: 'ctaText', type: 'textarea', localized: true, label: 'Teks ajakan di bawah' },
          ],
        },
        {
          label: 'Kontak',
          name: 'contact',
          fields: [
            { name: 'title', type: 'text', localized: true, label: 'Judul' },
            { name: 'description', type: 'textarea', localized: true, label: 'Deskripsi' },
          ],
        },
      ],
    },
  ],
}
