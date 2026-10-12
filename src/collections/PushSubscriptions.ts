import type { CollectionConfig } from 'payload'

// Perangkat (HP/komputer) milik pengguna admin yang mengaktifkan notifikasi dorong.
// Diisi oleh /api/push saat pengguna menekan "Aktifkan notifikasi"; tidak bisa dibuat/diubah lewat panel.
// Hanya Pemilik yang bisa melihat dan mencabut perangkat.
export const PushSubscriptions: CollectionConfig = {
  slug: 'push-subscriptions',
  labels: { singular: 'Perangkat Notifikasi', plural: 'Perangkat Notifikasi' },
  admin: {
    useAsTitle: 'device',
    defaultColumns: ['device', 'user', 'createdAt'],
    description: 'Perangkat yang menerima notifikasi pesan penawaran baru. Hapus baris untuk mencabut sebuah perangkat.',
    hidden: ({ user }) => (user as { role?: string } | null)?.role !== 'owner',
  },
  access: {
    read: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'owner',
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'owner',
  },
  fields: [
    { name: 'device', type: 'text', label: 'Perangkat', admin: { readOnly: true } },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, label: 'Pengguna', admin: { readOnly: true } },
    { name: 'endpoint', type: 'text', required: true, unique: true, index: true, admin: { hidden: true } },
    { name: 'p256dh', type: 'text', required: true, admin: { hidden: true } },
    { name: 'auth', type: 'text', required: true, admin: { hidden: true } },
  ],
}
