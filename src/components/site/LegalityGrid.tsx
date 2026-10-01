import { BadgeCheck, Clock } from 'lucide-react'
import { isPendingStatus } from './TrustPill'

type Item = { label: string; status: string }

// Kartu seragam: yang sudah terverifikasi tampil di atas (garis emas + centang),
// yang masih menyusul tampil di bawah (garis putus-putus + jam).
export default function LegalityGrid({ items }: { items: Item[] }) {
  const sorted = [...items].sort((a, b) => Number(isPendingStatus(a.status)) - Number(isPendingStatus(b.status)))

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((item) => {
        const pending = isPendingStatus(item.status)
        return (
          <li
            key={`${item.label}-${item.status}`}
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              pending ? 'border-dashed border-navy-200 bg-water-50/60' : 'border-gold-300 bg-white shadow-sm'
            }`}
          >
            {pending ? (
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-navy-300" />
            ) : (
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-navy-500">{item.label}</p>
              <p className={`mt-0.5 break-words text-sm font-semibold ${pending ? 'text-navy-500' : 'text-navy-800'}`}>
                {item.status}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
