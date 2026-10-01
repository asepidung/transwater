import { BadgeCheck } from 'lucide-react'

// Status berisi "menyusul"/"pending" = belum ada data resmi (tampil putus-putus).
// Selain itu dianggap terverifikasi (tampil solid dengan centang).
const PENDING = /menyusul|pending/i
export const isPendingStatus = (status: string) => PENDING.test(status)

export default function TrustPill({ label, status, onWhite = false }: { label: string; status: string; onWhite?: boolean }) {
  if (isPendingStatus(status)) {
    return (
      <li className={`rounded-full border border-dashed border-navy-300 px-4 py-1.5 text-sm text-navy-600 ${onWhite ? 'bg-white' : ''}`}>
        <span className="font-semibold text-navy-800">{label}</span>
        <span className="mx-1.5 text-navy-300">·</span>
        {status}
      </li>
    )
  }
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-gold-500 bg-white px-4 py-1.5 text-sm text-navy-700 shadow-sm">
      <BadgeCheck className="h-4 w-4 text-gold-500" />
      <span className="font-semibold text-navy-800">{label}</span>
      <span className="mx-0.5 text-navy-300">·</span>
      {status}
    </li>
  )
}
