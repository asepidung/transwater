import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { routing } from '@/i18n/routing'
import { pageAlternates } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'
import JsonLd from '@/components/site/JsonLd'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.orderPage.eyebrow} | ${c.company.brand}`,
    description: c.orderPage.description,
    alternates: pageAlternates(locale, '/cara-pesan'),
  }
}

export default async function OrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)
  const o = c.orderPage

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: o.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/cara-pesan" />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{o.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-navy-800 sm:text-4xl">{o.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-600">{o.description}</p>
          </div>
        </section>

        <section className="bg-white pb-12 lg:pb-16">
          <div className="mx-auto max-w-6xl px-5">
            <ol className="grid gap-6 md:grid-cols-3">
              {c.process.steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-navy-100 p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-navy-800">{s.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {o.faqs.length > 0 && (
          <section className="bg-water-50 py-12 lg:py-16">
            <div className="mx-auto max-w-3xl px-5">
              <h2 className="text-2xl font-extrabold text-navy-800">{o.faqTitle}</h2>
              <div className="mt-6 space-y-3">
                {o.faqs.map((f) => (
                  <details key={f.q} className="group rounded-xl bg-white shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-navy-800">
                      {f.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-navy-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-navy-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-navy-800 py-12 text-white lg:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">{o.ctaTitle}</h2>
              <p className="mt-1 text-navy-100">{o.ctaText}</p>
            </div>
            <a
              href={`/${c.locale}/kontak`}
              className="rounded-lg bg-white px-6 py-3.5 text-center text-base font-semibold text-navy-800 hover:bg-water-50"
            >
              {c.cta.quote}
            </a>
          </div>
        </section>
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
      <JsonLd data={faqJsonLd} />
    </>
  )
}
