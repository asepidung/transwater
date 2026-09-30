import TrustPill from './TrustPill'
import { ShieldCheck } from 'lucide-react'
import type { SiteContent } from '@/lib/content'

// Hanya menampilkan item yang ada. Item dengan status "menyusul" tampil putus-putus
// sebagai penanda jelas bahwa data resmi dari ARTIC belum masuk.
export default function TrustBar({ c }: { c: SiteContent }) {
  if (c.trust.items.length === 0) return null

  return (
    <section aria-label={c.trust.title} className="border-y border-navy-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2 text-sm font-bold text-navy-800">
          <ShieldCheck className="h-5 w-5 text-gold-500" /> {c.trust.title}
        </p>
        <ul className="flex flex-wrap gap-3">
          {c.trust.items.map((item) => (
<TrustPill key={`${item.label}-${item.status}`} label={item.label} status={item.status} />
))}
        </ul>
      </div>
    </section>
  )
}
