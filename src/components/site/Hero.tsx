import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { whatsappLink, type SiteContent } from '@/lib/content'
import { Wave } from './Decor'
import { asset } from '@/lib/site'

// Hero banner melebar: foto hutan dan sungai (latar) + lapisan putih di kiri agar teks tetap
// terbaca, produk di kanan. <picture> memuat HANYA satu file sesuai layar (lebar untuk desktop,
// tinggi untuk HP), supaya HP tidak mengunduh gambar desktop.
export default function Hero({ c }: { c: SiteContent }) {
  const wa = whatsappLink(c.company.whatsapp, c.cta.whatsappMessage)

  return (
    <section id="home" className="relative isolate overflow-hidden bg-water-50">
      <picture>
        <source media="(min-width: 1024px)" srcSet={asset('/images/hero-bg-wide.webp')} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset('/images/hero-bg-tall.webp')}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center lg:object-[60%_35%]"
        />
      </picture>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/95 via-white/80 to-white/25 lg:bg-gradient-to-r lg:from-white/95 lg:via-white/70 lg:to-transparent"
      />
      <Wave className="absolute inset-x-0 -bottom-px z-0 h-6 text-white sm:h-9" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{c.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] text-navy-800 sm:text-5xl">{c.hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-700">{c.hero.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#penawaran"
              className="w-full rounded-lg bg-navy-700 px-6 py-3.5 text-center text-base font-semibold text-white shadow-sm hover:bg-navy-800 sm:w-auto"
            >
              {c.cta.quote}
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-navy-200 bg-white px-6 py-3.5 text-base font-semibold text-navy-700 hover:border-navy-400 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" /> {c.cta.chat}
            </a>
          </div>

          <dl className="mt-10 flex justify-between gap-3 border-t border-navy-200/70 pt-6 sm:justify-start sm:gap-10">
            {c.hero.facts.map((f) => (
              <div key={f.label}>
                <dt className="whitespace-nowrap text-lg font-extrabold text-navy-800 sm:text-2xl">{f.value}</dt>
                <dd className="mt-0.5 text-xs text-navy-600 sm:text-sm">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-lg">
          <Image
            src={asset('/images/floating.png')}
            alt="Botol dan galon ARTIC"
            width={800}
            height={800}
            priority
            sizes="(min-width: 1024px) 512px, 90vw"
            className="h-auto w-full drop-shadow-[0_24px_28px_rgba(20,40,80,0.28)] motion-safe:animate-wave-float"
          />
        </div>
      </div>
    </section>
  )
}
