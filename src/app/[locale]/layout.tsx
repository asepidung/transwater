import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getSiteContent } from '@/lib/get-content'
import { allowIndexing, siteUrl } from '@/lib/site'
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
      images: [{ url: '/images/logo.png', alt: c.company.brand }],
    },
    twitter: { card: 'summary' },
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

  // Tanpa NextIntlClientProvider: tidak ada kode next-intl yang dikirim ke browser.
  // Teks halaman datang dari src/lib/content.ts (kelak dari Payload).
  return (
    <html lang={locale} className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
