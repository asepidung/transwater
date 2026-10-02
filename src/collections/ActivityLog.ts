import type { CollectionConfig } from 'payload'

// Catatan siapa melakukan apa di panel admin. Diisi otomatis oleh hook (src/lib/audit.ts), tidak bisa
// diubah atau dihapus lewat panel/API. Yang dicatat hanya NAMA field yang berubah, bukan isinya,
// jadi password dan data pesan tidak ikut tersimpan di sini.
export const ActivityLog: CollectionConfig = {
  slug: 'activity-log',
  labels: { singular: 'Log Aktivitas', plural: 'Log Aktivitas' },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['createdAt', 'actor', 'action', 'area', 'item', 'fields'],
    description: 'Riwayat perubahan di panel admin: siapa, kapan, apa. Hanya bisa dibaca.',
  },
  defaultSort: '-createdAt',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'actor', type: 'text', label: 'Pengguna' },
    {
      name: 'action',
      type: 'select',
      label: 'Aksi',
      options: [
        { label: 'Masuk', value: 'login' },
        { label: 'Membuat', value: 'create' },
        { label: 'Mengubah', value: 'update' },
        { label: 'Menghapus', value: 'delete' },
      ],
    },
    { name: 'area', type: 'text', label: 'Bagian' },
    { name: 'item', type: 'text', label: 'Item' },
    { name: 'fields', type: 'text', label: 'Field yang berubah' },
    { name: 'summary', type: 'text', label: 'Ringkasan', admin: { hidden: true } },
  ],
}
