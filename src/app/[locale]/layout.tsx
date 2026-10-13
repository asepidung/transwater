import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getSiteContent } from '@/lib/get-content'
import { allowIndexing, asset, siteUrl } from '@/lib/site'
import { isPreview } from '@/lib/preview-mode'
import '../globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

// Metadata dasar untuk semua halaman; tiap halaman menimpa title/description/alternates sendiri.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  const title = `${c.company.brand} - ${c.company.name}`
  return {
    metadataBase: new URL(siteUrl),
    title,
    description: c.hero.description,
    robots: allowIndexing ? undefined : { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: title,
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      // Gambar preview 1200x630 (WhatsApp, Facebook, LinkedIn). Halaman yang punya gambar sendiri (artikel) menimpanya.
      images: [{ url: asset('/images/og.jpg'), width: 1200, height: 630, alt: `${c.company.brand} Premium Mineral Water` }],
    },
    twitter: { card: 'summary_large_image', images: [asset('/images/og.jpg')] },
  }
}

// Prerender kedua bahasa saat build: halaman jadi statis (respons cepat, bisa di-cache).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)
  const preview = await isPreview()

  // Tanpa NextIntlClientProvider: tidak ada kode next-intl yang dikirim ke browser.
  // Teks halaman datang dari src/lib/content.ts (kelak dari Payload).
  return (
    <html lang={locale} className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        {preview && (
          <div className="sticky top-0 z-[100] flex flex-wrap items-center justify-center gap-3 bg-gold-300 px-4 py-2 text-sm font-semibold text-navy-900">
            <span>Mode pratinjau: Anda melihat draf yang belum terbit.</span>
            <a href="/api/preview/exit" className="rounded bg-navy-900 px-3 py-1 text-white">Keluar &amp; kembali ke admin</a>
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
