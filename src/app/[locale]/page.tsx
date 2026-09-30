import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { asset, pageAlternates, siteUrl } from '@/lib/site'
import JsonLd from '@/components/site/JsonLd'
import { getSiteContent } from '@/lib/get-content'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Hero from '@/components/site/Hero'
import TrustBar from '@/components/site/TrustBar'
import Products from '@/components/site/Products'
import Benefits from '@/components/site/Benefits'
import Segments from '@/components/site/Segments'
import Process from '@/components/site/Process'
import QuoteSection from '@/components/site/QuoteSection'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.company.brand} - ${c.company.name}`,
    description: c.hero.description,
    alternates: pageAlternates(locale),
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} />
      <main className="pb-20 lg:pb-0">
        <Hero c={c} />
        <TrustBar c={c} />
        <Products c={c} />
        <Benefits c={c} />
        <Segments c={c} />
        <Process c={c} />
        <QuoteSection c={c} />
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: c.company.name,
          alternateName: c.company.brand,
          url: siteUrl,
          logo: `${siteUrl}${asset('/images/logo.png')}`,
          sameAs: c.company.instagram ? [c.company.instagram] : undefined,
          address: { '@type': 'PostalAddress', streetAddress: c.company.address, addressCountry: 'ID' },
        }}
      />
    </>
  )
}
