import path from 'path'
import { APIError, type CollectionConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'

// Lokasi file upload. Di produksi arahkan ke folder DI LUAR folder aplikasi (mis. /home/user/artic-data/media)
// supaya deploy ulang tidak menghapus foto. Default untuk lokal: ./media
const mediaDir = process.env.MEDIA_DIR ? path.resolve(process.env.MEDIA_DIR) : path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Foto/Berkas', plural: 'Foto & Berkas' },
  access: {
    read: () => true,
  },
  hooks: {
    // Foto diganti/dihapus -> halaman statis dirender ulang supaya tidak menampilkan URL lama.
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
    // Foto yang masih dipakai produk tidak boleh dihapus (akan merusak halaman produk).
    beforeDelete: [
      async ({ req, id }) => {
        const used = await req.payload.find({
          collection: 'products',
          where: { image: { equals: id } },
          limit: 1,
          depth: 0,
          req,
        })
        if (used.totalDocs > 0) {
          throw new APIError('Foto ini masih dipakai oleh produk. Ganti foto produknya dulu, baru hapus foto ini.', 400, undefined, true)
        }
      },
    ],
  },
  upload: {
    staticDir: mediaDir,
    // SVG sengaja tidak diizinkan: bisa memuat skrip dan dilayani dari alamat yang sama dengan /admin.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Deskripsi singkat gambar (untuk aksesibilitas & SEO).' },
    },
  ],
}
