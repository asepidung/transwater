import type { SiteContent } from '@/lib/content'

export default function Segments({ c }: { c: SiteContent }) {
  const s = c.segments

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{s.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">{s.title}</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {s.items.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-navy-100 bg-navy-50 px-5 py-3 text-base font-semibold text-navy-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
