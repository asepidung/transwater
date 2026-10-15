import type { SiteContent } from '@/lib/content'

// Nama partner/pelanggan (teks saja, tanpa logo). Disembunyikan jika daftarnya kosong.
export default function Partners({ c }: { c: SiteContent }) {
  const p = c.partners
  if (!p.items.length) return null

  return (
    <section className="bg-navy-50 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{p.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">{p.title}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {p.items.map((name) => (
            <li key={name} className="rounded-xl border border-navy-100 bg-white px-5 py-4 text-base font-semibold text-navy-800">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
