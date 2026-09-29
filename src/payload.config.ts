import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import nodemailer from 'nodemailer'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Posts } from './collections/Posts'
import { Messages } from './collections/Messages'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { InfoPages } from './globals/InfoPages'

const isProd = process.env.NODE_ENV === 'production'

// Pengaman produksi: jangan diam-diam jalan dengan konfigurasi kosong. Di lokal ada default,
// di produksi wajib diisi eksplisit (lihat .env.example).
if (isProd && !process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET wajib diisi di produksi (lihat .env.example).')
}
if (isProd && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL wajib diisi di produksi, mis. file:/home/user/artic-data/artic.db (lihat .env.example).')
}
const databaseUrl = process.env.DATABASE_URL || 'file:./data/artic.db'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Email keluar (notifikasi form penawaran). Aktif hanya jika SMTP_HOST diisi; tanpa itu,
// Payload menulis email ke log konsol (aman untuk lokal). Transport dibuat dari paket
// nodemailer root (versi terbaru), bukan versi bawaan adapter.
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@artic.co.id',
      defaultFromName: 'Website ARTIC',
      transport: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      }),
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '- ARTIC CMS' },
  },
  collections: [Users, Media, Products, Posts, Messages],
  globals: [SiteSettings, HomePage, AboutPage, InfoPages],
  localization: {
    locales: [
      { label: 'Bahasa Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'id',
    fallback: true,
  },
  ...(email ? { email } : {}),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: databaseUrl },
  }),
  sharp,
})
