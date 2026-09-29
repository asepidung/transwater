import type { Metadata } from 'next'
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
    title: `${c.privacyPage.title} | ${c.company.brand}`,
    description: c.privacyPage.intro,
    alternates: pageAlternates(locale, '/privasi'),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)
  const p = c.privacyPage

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/privasi" />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h1 className="text-3xl font-extrabold text-navy-800 sm:text-4xl">{p.title}</h1>
            <p className="mt-2 text-sm text-navy-500">{p.updated}</p>
            <p className="mt-6 text-base leading-relaxed text-navy-600">{p.intro}</p>
          </div>
        </section>

        <section className="bg-white pb-14 lg:pb-20">
          <div className="mx-auto max-w-3xl space-y-8 px-5">
            {p.sections.map((s, i) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-navy-800">
                  {i + 1}. {s.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-navy-600">{s.text}</p>
              </div>
            ))}

            <div className="rounded-2xl bg-water-50 p-6">
              <h2 className="text-lg font-bold text-navy-800">{c.company.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{c.company.address}</p>
              <p className="mt-1 text-sm text-navy-600">
                <a href={`mailto:${c.company.email}`} className="font-semibold text-navy-700 underline">
                  {c.company.email}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
    </>
  )
}
