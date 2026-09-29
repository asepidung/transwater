import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { routing } from '@/i18n/routing'
import { pageAlternates } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import QuoteSection from '@/components/site/QuoteSection'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.contactPage.title} | ${c.company.brand}`,
    description: c.contactPage.description,
    alternates: pageAlternates(locale, '/kontak'),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)
  // Halaman ini memakai bagian penawaran yang sama dengan Beranda, dengan judul halaman Kontak.
  const page = {
    ...c,
    quote: { ...c.quote, eyebrow: c.nav[c.nav.length - 1].label, title: c.contactPage.title, description: c.contactPage.description },
  }

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/kontak" />
      <main className="pb-20 lg:pb-0">
        <QuoteSection c={page} asH1 />
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
    </>
  )
}
