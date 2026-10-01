import { ShieldCheck } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import TrustPill, { isPendingStatus } from './TrustPill'

// Di beranda hanya item yang sudah terverifikasi (rapi dan ringkas). Daftar lengkap, termasuk yang
// masih "menyusul", ada di halaman Kualitas.
export default function TrustBar({ c }: { c: SiteContent }) {
  const verified = c.trust.items.filter((i) => !isPendingStatus(i.status))
  if (verified.length === 0) return null
  const hasMore = verified.length < c.trust.items.length

  return (
    <section aria-label={c.trust.title} className="border-y border-navy-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2 text-sm font-bold text-navy-800">
            <ShieldCheck className="h-5 w-5 text-gold-500" /> {c.trust.title}
          </p>
          {hasMore && (
            <a href={`/${c.locale}/kualitas`} className="text-sm font-semibold text-navy-700 underline underline-offset-4">
              {c.locale === 'en' ? 'See all credentials' : 'Lihat semua legalitas'}
            </a>
          )}
        </div>
        <ul className="mt-4 flex flex-wrap gap-3">
          {verified.map((item) => (
            <TrustPill key={`${item.label}-${item.status}`} label={item.label} status={item.status} />
          ))}
        </ul>
      </div>
    </section>
  )
}
