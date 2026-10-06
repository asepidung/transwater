import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import nodemailer from 'nodemailer'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { en } from '@payloadcms/translations/languages/en'
import { idLanguage } from './i18n/admin-id'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Posts } from './collections/Posts'
import { Messages } from './collections/Messages'
import { ActivityLog } from './collections/ActivityLog'
import { withAuditCollection, withAuditGlobal } from './lib/audit'
import { withAiCollection, withAiGlobal } from './lib/ai-fields'
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
    meta: {
      titleSuffix: '- ARTIC CMS',
      icons: [{ rel: 'icon', url: '/images/admin-icon-192.png' }],
      manifest: '/admin.webmanifest',
    },
    components: {
      // Ikon mata di kolom password + pendaftaran service worker (PWA)
      providers: [
        '/components/admin/PasswordToggle#PasswordToggle',
        '/components/admin/PwaRegister#PwaRegister',
      ],
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeDashboard: ['/components/admin/DashboardIntro#DashboardIntro'],
      afterLogin: ['/components/admin/AdminCredit#AdminCredit'],
      afterNavLinks: ['/components/admin/AdminCredit#AdminCredit'],
    },
  },
  collections: [Users, Media, Products, Posts, Messages, ActivityLog].map(withAiCollection).map(withAuditCollection),
  globals: [SiteSettings, HomePage, AboutPage, InfoPages].map(withAiGlobal).map(withAuditGlobal),
  localization: {
    locales: [
      { label: 'Bahasa Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'id',
    fallback: true,
  },
  ...(email ? { email } : {}),
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, id: idLanguage },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: databaseUrl },
  }),
  sharp,
})
