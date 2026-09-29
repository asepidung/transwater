import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft, MessageCircle } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { whatsappLink } from '@/lib/content'
import { routing } from '@/i18n/routing'
import { pageAlternates } from '@/lib/site'
import { siteUrl } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'
import JsonLd from '@/components/site/JsonLd'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const out: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    const c = await getSiteContent(locale)
    for (const p of c.products.items) out.push({ locale, slug: p.id })
  }
  return out
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const c = await getSiteContent(locale)
  const item = c.products.items.find((p) => p.id === slug)
  if (!item) return {}
  return {
    title: `${item.name} | ${c.company.brand}`,
    description: item.tagline,
    alternates: pageAlternates(locale, `/produk/${slug}`),
    openGraph: { images: item.image ? [{ url: item.image, alt: item.imageAlt }] : undefined },
  }
}

export default async function ProductDetail({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)
  const item = c.products.items.find((p) => p.id === slug)
  if (!item) notFound()

  const pp = c.productPage
  const wa = whatsappLink(c.company.whatsapp, pp.whatsappMessage.replace('{product}', item.name))
  const others = c.products.items.filter((p) => p.id !== item.id)

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath={`/produk/${item.id}`} />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-10 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <a
              href={`/${c.locale}/produk`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy-600 hover:text-navy-800"
            >
              <ChevronLeft className="h-4 w-4" /> {pp.back}
            </a>

            <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-navy-100 bg-water-50">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-navy-800 sm:text-4xl">{item.name}</h1>
                <p className="mt-3 text-lg leading-relaxed text-navy-600">{item.tagline}</p>

                <h2 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-gold-600">{pp.specsTitle}</h2>
                <dl className="mt-3 divide-y divide-navy-100 border-y border-navy-100 text-base">
                  {item.specs.map((s) => (
                    <div key={s.label} className="flex justify-between gap-4 py-3">
                      <dt className="text-navy-500">{s.label}</dt>
                      <dd className="text-right font-semibold text-navy-800">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`/${c.locale}#penawaran`}
                    className="w-full rounded-lg bg-navy-700 px-6 py-3.5 text-center text-base font-semibold text-white shadow-sm hover:bg-navy-800 sm:w-auto"
                  >
                    {pp.quoteCta}
                  </a>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-navy-200 bg-white px-6 py-3.5 text-base font-semibold text-navy-700 hover:border-navy-400 sm:w-auto"
                  >
                    <MessageCircle className="h-5 w-5" /> {pp.chatCta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="bg-white py-12">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="text-2xl font-extrabold text-navy-800">{pp.othersTitle}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {others.map((o) => (
                  <li key={o.id}>
                    <a
                      href={`/${c.locale}/produk/${o.id}`}
                      className="flex items-center gap-4 rounded-xl border border-navy-100 p-3 hover:border-navy-300"
                    >
                      <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-water-50">
                        <Image src={o.image} alt={o.imageAlt} fill sizes="80px" className="object-cover" />
                      </span>
                      <span>
                        <span className="block font-bold text-navy-800">{o.name}</span>
                        <span className="block text-sm text-navy-500">{o.tagline}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: item.name,
          description: item.tagline,
          image: item.image ? `${siteUrl}${item.image}` : undefined,
          brand: { '@type': 'Brand', name: c.company.brand },
          url: `${siteUrl}/${c.locale}/produk/${item.id}`,
        }}
      />
    </>
  )
}
