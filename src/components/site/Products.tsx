import Image from 'next/image'
import type { SiteContent } from '@/lib/content'

export default function Products({ c }: { c: SiteContent }) {
  const p = c.products

  return (
    <section id="produk" className="scroll-mt-20 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{p.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">{p.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-navy-600">{p.description}</p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {p.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-water-50">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-navy-800">{item.name}</h3>
                <p className="mt-1 text-sm text-navy-500">{item.tagline}</p>

                <dl className="mt-5 divide-y divide-navy-100 border-y border-navy-100 text-sm">
                  {item.specs.map((s) => (
                    <div key={s.label} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-navy-500">{s.label}</dt>
                      <dd className="text-right font-semibold text-navy-800">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={`/${c.locale}/produk/${item.id}`}
                  className="mt-6 text-center text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-gold-600"
                >
                  {c.productPage.detailsCta}
                </a>
                <a
                  href="#penawaran"
                  className="mt-3 rounded-lg border border-navy-700 px-5 py-3 text-center text-sm font-semibold text-navy-700 hover:bg-navy-700 hover:text-white"
                >
                  {p.quoteCta}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
