import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { routing } from '@/i18n/routing'
import { pageAlternates } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.productPage.listTitle} | ${c.company.brand}`,
    description: c.productPage.listDescription,
    alternates: pageAlternates(locale, '/produk'),
  }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/produk" />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h1 className="text-3xl font-extrabold text-navy-800 sm:text-4xl">{c.productPage.listTitle}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-navy-600">{c.productPage.listDescription}</p>

            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {c.products.items.map((item) => (
                <li key={item.id} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
                  <a href={`/${c.locale}/produk/${item.id}`} className="group block">
                    <div className="relative aspect-square bg-water-50">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-navy-800">{item.name}</h2>
                      <p className="mt-1 text-sm text-navy-500">{item.tagline}</p>
                      <span className="mt-4 inline-block text-sm font-semibold text-navy-700 underline underline-offset-4 group-hover:text-gold-600">
                        {c.productPage.detailsCta}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
    </>
  )
}
