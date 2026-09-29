import type { CollectionConfig } from 'payload'

// Permintaan penawaran dari form di situs. Sengaja TANPA akses tulis publik: pesan masuk
// hanya lewat server action di Next.js (Local API), sehingga tidak ada endpoint REST terbuka untuk spam.
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Pesan Masuk', plural: 'Pesan Masuk' },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'name', 'contact', 'product', 'handled', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'company', type: 'text', label: 'Perusahaan', required: true },
    { name: 'name', type: 'text', label: 'Nama', required: true },
    { name: 'contact', type: 'text', label: 'WhatsApp / telepon', required: true },
    { name: 'product', type: 'text', label: 'Produk diminati' },
    { name: 'volume', type: 'text', label: 'Perkiraan kebutuhan' },
    { name: 'message', type: 'textarea', label: 'Catatan' },
    { name: 'locale', type: 'text', admin: { description: 'Bahasa halaman saat pesan dikirim.' } },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sudah ditindaklanjuti',
      admin: { position: 'sidebar' },
    },
  ],
}
