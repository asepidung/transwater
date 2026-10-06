import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { asset, pageAlternates, siteUrl } from '@/lib/site'
import JsonLd from '@/components/site/JsonLd'
import { getSiteContent } from '@/lib/get-content'
import { phoneNumbers } from '@/lib/content'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Hero from '@/components/site/Hero'
import TrustBar from '@/components/site/TrustBar'
import Products from '@/components/site/Products'
import BrandVideo from '@/components/site/BrandVideo'
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
    // Nama brand publik dari ARTIC: "Artic Premium Mineral Water". Deskripsi disusun untuk pencarian
    // "air mineral" / "AMDK" di Jabodetabek (pasar utama menurut formulir requirement).
    title: `${c.company.brand} Premium Mineral Water - ${c.company.name}`,
    description:
      locale === 'en'
        ? 'ARTIC mineral water (bottled drinking water): 330 ml and 600 ml bottles and 19-liter gallons for businesses in Greater Jakarta (Jabodetabek). Produced in Cileungsi, Bogor.'
        : 'Air mineral ARTIC (AMDK): botol 330 ml, 600 ml, dan galon 19 liter untuk bisnis di Jabodetabek. Diproduksi di Cileungsi, Bogor. Minta penawaran lewat formulir atau WhatsApp.',
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
        <BrandVideo c={c} />
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
          email: c.company.email,
          telephone: phoneNumbers(c.company.phone),
          address: { '@type': 'PostalAddress', streetAddress: c.company.address, addressCountry: 'ID' },
        }}
      />
    </>
  )
}
