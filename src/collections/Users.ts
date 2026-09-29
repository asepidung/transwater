import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'name'],
  },
  auth: {
    // Login murni pakai username + password. Payload selalu punya kolom email di
    // koleksi auth, jadi di sini email dibuat tidak wajib dan disembunyikan dari panel.
    // Konsekuensi: fitur "lupa password" lewat email tidak tersedia; reset dilakukan admin lain.
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
  ],
}
