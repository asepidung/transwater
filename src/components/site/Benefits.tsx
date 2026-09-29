import { Package, Zap, Truck, Headset, type LucideIcon } from 'lucide-react'
import type { IconName, SiteContent } from '@/lib/content'

const icons: Record<IconName, LucideIcon> = {
  package: Package,
  zap: Zap,
  truck: Truck,
  headset: Headset,
}

export default function Benefits({ c }: { c: SiteContent }) {
  const b = c.benefits

  return (
    <section id="keunggulan" className="scroll-mt-20 bg-water-50 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{b.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-800 sm:text-4xl">{b.title}</h2>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {b.items.map((item) => {
            const Icon = icons[item.icon]
            return (
              <li key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
