import type { CollectionConfig } from 'payload'

// Permintaan terbit dari Staf ("Ajukan terbit"). Dibuat lewat /api/approval, dihapus otomatis saat Pemilik menerbitkan.
// Hanya Pemilik yang melihatnya; daftar utamanya tampil di dasbor.
const isOwner = ({ req: { user } }: { req: { user?: unknown } }) => (user as { role?: string } | null)?.role === 'owner'

export const ApprovalRequests: CollectionConfig = {
  slug: 'approval-requests',
  labels: { singular: 'Permintaan Terbit', plural: 'Permintaan Terbit' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'requestedBy', 'createdAt'], hidden: true },
  access: { read: isOwner, create: () => false, update: () => false, delete: isOwner },
  fields: [
    { name: 'target', type: 'text', required: true, index: true },
    { name: 'docId', type: 'text', index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'requestedBy', type: 'text' },
    { name: 'note', type: 'textarea' },
  ],
}
