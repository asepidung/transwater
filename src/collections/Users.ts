import { APIError, type Access, type CollectionConfig, type FieldAccess } from 'payload'

// Dua peran saja, hanya untuk melindungi akun (bukan untuk membatasi isi situs):
//  - owner : boleh membuat, mengubah, dan menghapus akun lain serta mengatur peran.
//  - staff : boleh mengelola seluruh isi situs, tapi hanya bisa mengubah akunnya sendiri.
// Siapa mengubah apa tetap terlihat di "Log Aktivitas".
type RoleUser = { id: number | string; role?: 'owner' | 'staff' | null } | null | undefined

const isOwner = (user: RoleUser) => user?.role === 'owner'

const ownerOnly: Access = ({ req: { user } }) => isOwner(user as RoleUser)

// Owner bebas; staf hanya boleh mengubah akunnya sendiri.
const selfOrOwner: Access = ({ req: { user } }) => {
  const u = user as RoleUser
  if (!u) return false
  if (isOwner(u)) return true
  return { id: { equals: u.id } }
}

// Peran hanya bisa diatur owner. Akun pertama (belum ada yang login) dibuat sebagai owner lewat hook.
const roleAccess: FieldAccess = ({ req: { user } }) => !user || isOwner(user as RoleUser)

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'name', 'role'],
    description: 'Hanya Pemilik yang bisa menambah atau menghapus akun. Staf hanya bisa mengubah akunnya sendiri.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ownerOnly,
    update: selfOrOwner,
    delete: ownerOnly,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Akun pertama di sistem otomatis menjadi owner (pendaftaran awal).
        if (operation === 'create') {
          const count = await req.payload.count({ collection: 'users', req })
          if (count.totalDocs === 0) return { ...data, role: 'owner' }
          return { ...data, role: data.role ?? 'staff' }
        }
        // Owner terakhir tidak boleh diturunkan menjadi staf.
        if (operation === 'update' && originalDoc?.role === 'owner' && data.role && data.role !== 'owner') {
          const others = await req.payload.count({
            collection: 'users',
            where: { and: [{ role: { equals: 'owner' } }, { id: { not_equals: originalDoc.id } }] },
            req,
          })
          if (others.totalDocs === 0) {
            throw new APIError('Harus selalu ada minimal satu Pemilik. Jadikan akun lain Pemilik dulu.', 400, undefined, true)
          }
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const target = await req.payload.findByID({ collection: 'users', id, depth: 0, req })
        if (target.role !== 'owner') return
        const others = await req.payload.count({
          collection: 'users',
          where: { and: [{ role: { equals: 'owner' } }, { id: { not_equals: id } }] },
          req,
        })
        if (others.totalDocs === 0) {
          throw new APIError('Pemilik terakhir tidak bisa dihapus. Jadikan akun lain Pemilik dulu.', 400, undefined, true)
        }
      },
    ],
  },
  auth: {
    // Login murni pakai username + password. Payload selalu punya kolom email di
    // koleksi auth, jadi di sini email dibuat tidak wajib dan disembunyikan dari panel.
    // Konsekuensi: fitur "lupa password" lewat email tidak tersedia; reset dilakukan Pemilik.
    loginWithUsername: { allowEmailLogin: false, requireEmail: false },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: false,
      admin: { hidden: true },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Peran',
      defaultValue: 'staff',
      required: true,
      options: [
        { label: 'Pemilik (boleh kelola akun)', value: 'owner' },
        { label: 'Staf', value: 'staff' },
      ],
      access: { create: roleAccess, update: roleAccess },
      admin: { position: 'sidebar', description: 'Pemilik bisa menambah, menghapus akun, dan mengatur peran.' },
    },
  ],
}
