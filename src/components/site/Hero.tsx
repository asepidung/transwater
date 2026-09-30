import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { whatsappLink, type SiteContent } from '@/lib/content'
import { Ridge, Wave } from './Decor'
import { asset } from '@/lib/site'

export default function Hero({ c }: { c: SiteContent }) {
  const wa = whatsappLink(c.company.whatsapp, c.cta.whatsappMessage)

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-water-50 to-white">
      {/* Siluet pegunungan samar di belakang, dan gelombang air di dasar hero */}
      <Ridge className="absolute inset-x-0 bottom-0 h-40 text-navy-700 opacity-[0.045] sm:h-56" />
      <Wave className="absolute inset-x-0 -bottom-px h-8 text-water-100 opacity-70 sm:h-12" />
      <Wave className="absolute inset-x-0 -bottom-px h-6 translate-y-1 text-white sm:h-9" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-2 lg:pb-24 lg:pt-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{c.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] text-navy-800 sm:text-5xl">{c.hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-600">{c.hero.description}</p>

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

          <dl className="mt-10 flex justify-between gap-3 border-t border-navy-100 pt-6 sm:justify-start sm:gap-10">
            {c.hero.facts.map((f) => (
              <div key={f.label}>
                <dt className="whitespace-nowrap text-lg font-extrabold text-navy-800 sm:text-2xl">{f.value}</dt>
                <dd className="mt-0.5 text-xs text-navy-500 sm:text-sm">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#cde3f6] to-[#98bfe2] p-3 lg:max-w-md">
          <Image
            src={asset('/images/floating.png')}
            alt="Botol ARTIC"
            width={800}
            height={800}
            priority
            sizes="(min-width: 1024px) 448px, 90vw"
            className="h-full w-full object-contain motion-safe:animate-wave-float"
          />
        </div>
      </div>
    </section>
  )
}
