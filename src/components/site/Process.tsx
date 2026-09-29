import type { SiteContent } from '@/lib/content'

export default function Process({ c }: { c: SiteContent }) {
  const p = c.process

  return (
    <section id="cara-pesan" className="scroll-mt-20 bg-navy-800 py-16 text-white lg:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">{p.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{p.title}</h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {p.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-lg font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-navy-200">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
