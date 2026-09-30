import type { Metadata } from 'next'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { routing } from '@/i18n/routing'
import { asset, pageAlternates } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'
import TrustPill from '@/components/site/TrustPill'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.about.eyebrow} | ${c.company.brand}`,
    description: c.about.description,
    alternates: pageAlternates(locale, '/tentang'),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)
  const a = c.about

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/tentang" />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{a.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-navy-800 sm:text-4xl">{a.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-600">{a.description}</p>

            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-water-100 shadow-sm sm:aspect-[21/9]">
              <Image
                src={asset('/images/pabrik/filling-far.webp')}
                alt={c.qualityGallery.items[3]?.alt ?? ''}
                fill
                priority
                sizes="(min-width: 1152px) 1104px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold text-navy-800">{a.storyTitle}</h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-navy-600">
                {a.story.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-water-100 shadow-sm">
              <Image
                src={asset('/images/pabrik/packing.webp')}
                alt={c.qualityGallery.items[5]?.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 552px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {a.expertise.length > 0 && (
          <section className="bg-water-50 py-10">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="text-lg font-bold text-navy-800">{a.expertiseTitle}</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {a.expertise.map((e) => (
                  <li key={e} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-700 shadow-sm">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
            <div className="rounded-2xl border border-navy-100 p-6 lg:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{a.visionTitle}</p>
              <p className="mt-3 text-base leading-relaxed text-navy-700">{a.vision}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 p-6 lg:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{a.missionTitle}</p>
              <p className="mt-3 text-base leading-relaxed text-navy-700">{a.mission}</p>
            </div>
          </div>
        </section>

        <section className="bg-water-50 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-2xl font-extrabold text-navy-800">{a.valuesTitle}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {a.values.map((v, i) => (
                <li key={v.title} className="rounded-2xl bg-white p-6 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-800">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{v.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {c.trust.items.length > 0 && (
          <section className="bg-white py-12 lg:py-16">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="flex items-center gap-2 text-2xl font-extrabold text-navy-800">
                <ShieldCheck className="h-6 w-6 text-gold-500" /> {a.legalTitle}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {c.trust.items.map((item) => (
                  <TrustPill key={`${item.label}-${item.status}`} label={item.label} status={item.status} />
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-navy-800 py-12 text-white lg:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">{a.ctaTitle}</h2>
              <p className="mt-1 text-navy-100">{a.ctaText}</p>
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
    </>
  )
}
