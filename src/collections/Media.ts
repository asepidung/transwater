import path from 'path'
import type { CollectionConfig } from 'payload'

// Lokasi file upload. Di produksi arahkan ke folder DI LUAR folder aplikasi (mis. /home/user/artic-data/media)
// supaya deploy ulang tidak menghapus foto. Default untuk lokal: ./media
const mediaDir = process.env.MEDIA_DIR ? path.resolve(process.env.MEDIA_DIR) : path.resolve(process.cwd(), 'media')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: mediaDir,
    mimeTypes: ['image/*'],
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
