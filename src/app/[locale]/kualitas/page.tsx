import type { Metadata } from 'next'
import Image from 'next/image'
import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { routing } from '@/i18n/routing'
import { asset, pageAlternates } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'
import LegalityGrid from '@/components/site/LegalityGrid'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.quality.eyebrow} | ${c.company.brand}`,
    description: c.quality.description,
    alternates: pageAlternates(locale, '/kualitas'),
  }
}

// Susunan galeri di layar lebar: satu foto besar (2x2), empat kecil, dua lebar.
const TILE = [
  'lg:col-span-2 lg:row-span-2',
  '',
  '',
  '',
  '',
  'lg:col-span-2',
  'lg:col-span-2',
]

export default async function QualityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = await getSiteContent(locale)
  const q = c.quality
  const g = c.qualityGallery

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/kualitas" />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{q.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-navy-800 sm:text-4xl">{q.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-600">{q.description}</p>
          </div>
        </section>

        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-2xl font-extrabold text-navy-800">{q.pillarsTitle}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {q.pillars.map((p) => (
                <li key={p.title} className="flex gap-4 rounded-2xl border border-navy-100 p-6">
                  <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-gold-500" />
                  <div>
                    <h3 className="text-lg font-bold text-navy-800">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {g.items.length > 0 && (
          <section className="bg-water-50 py-12 lg:py-16">
            <div className="mx-auto max-w-6xl px-5">
              <h2 className="text-2xl font-extrabold text-navy-800">{g.title}</h2>
              <p className="mt-2 max-w-2xl text-base text-navy-600">{g.intro}</p>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map((item, i) => (
                  <li
                    key={item.file}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-water-100 shadow-sm lg:aspect-auto lg:min-h-[220px] ${TILE[i] ?? ''}`}
                  >
                    <Image
                      src={asset(`/images/pabrik/${item.file}.webp`)}
                      alt={item.alt}
                      fill
                      sizes={i === 0 ? '(min-width: 1024px) 552px, 100vw' : '(min-width: 1024px) 276px, (min-width: 640px) 50vw, 100vw'}
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/85 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white">
                      {item.caption}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-navy-800">
              <ShieldCheck className="h-6 w-6 text-gold-500" /> {q.legalTitle}
            </h2>
            {c.trust.items.length > 0 && (
              <LegalityGrid items={c.trust.items} />
            )}
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-navy-600">{q.legalNote}</p>
          </div>
        </section>

        <section className="bg-navy-800 py-12 text-white lg:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">{q.ctaTitle}</h2>
              <p className="mt-1 text-navy-100">{q.ctaText}</p>
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
