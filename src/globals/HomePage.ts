import type { GlobalConfig, Field } from 'payload'
import { revalidateSite } from '../lib/revalidate'

const sectionHead = (extra: Field[] = []): Field[] => [
  { name: 'eyebrow', type: 'text', localized: true, label: 'Label kecil di atas judul' },
  { name: 'title', type: 'text', localized: true, label: 'Judul' },
  ...extra,
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Isi Halaman Utama',
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
          label: 'Hero',
          name: 'hero',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true, label: 'Label kecil' },
            { name: 'title', type: 'text', localized: true, required: true, label: 'Judul utama' },
            { name: 'description', type: 'textarea', localized: true, label: 'Deskripsi' },
            {
              name: 'facts',
              type: 'array',
              maxRows: 4,
              label: 'Angka ringkas',
              admin: { description: 'Hanya fakta yang benar dan bisa dibuktikan.' },
              fields: [
                { name: 'value', type: 'text', required: true, label: 'Angka / nilai' },
                { name: 'label', type: 'text', required: true, localized: true, label: 'Keterangan' },
              ],
            },
          ],
        },
        {
          label: 'Legalitas',
          name: 'trust',
          fields: [
            { name: 'title', type: 'text', localized: true, label: 'Judul bar' },
            {
              name: 'items',
              type: 'array',
              label: 'Sertifikasi',
              admin: { description: 'Kosongkan semua baris untuk menyembunyikan bar ini.' },
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Nama (BPOM, Halal, ...)' },
                { name: 'status', type: 'text', required: true, localized: true, label: 'Nomor / status' },
              ],
            },
          ],
        },
        {
          label: 'Produk',
          name: 'productsSection',
          fields: sectionHead([{ name: 'description', type: 'textarea', localized: true, label: 'Deskripsi' }]),
        },
        {
          label: 'Keunggulan',
          name: 'benefits',
          fields: sectionHead([
            {
              name: 'items',
              type: 'array',
              maxRows: 4,
              label: 'Poin keunggulan',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'package',
                  options: [
                    { label: 'Kemasan', value: 'package' },
                    { label: 'Kilat', value: 'zap' },
                    { label: 'Pengiriman', value: 'truck' },
                    { label: 'Layanan', value: 'headset' },
                  ],
                },
                { name: 'title', type: 'text', required: true, localized: true, label: 'Judul' },
                { name: 'text', type: 'textarea', required: true, localized: true, label: 'Penjelasan' },
              ],
            },
          ]),
        },
        {
          label: 'Segmen',
          name: 'segments',
          fields: sectionHead([
            {
              name: 'items',
              type: 'array',
              label: 'Segmen pelanggan',
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: 'Nama segmen' }],
            },
          ]),
        },
        {
          label: 'Cara Pesan',
          name: 'process',
          fields: sectionHead([
            {
              name: 'steps',
              type: 'array',
              label: 'Langkah',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, label: 'Judul langkah' },
                { name: 'text', type: 'textarea', required: true, localized: true, label: 'Penjelasan' },
              ],
            },
          ]),
        },
        {
          label: 'Minta Penawaran',
          name: 'quote',
          fields: sectionHead([{ name: 'description', type: 'textarea', localized: true, label: 'Deskripsi' }]),
        },
      ],
    },
  ],
}
