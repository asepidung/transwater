// Penanda mockup. Tampil hanya jika NEXT_PUBLIC_DRAFT_BANNER=true (staging/lokal).
// Hapus/matikan variabel itu saat go-live setelah semua data diverifikasi ARTIC.
export default function DraftBanner({ text }: { text: string }) {
  if (process.env.NEXT_PUBLIC_DRAFT_BANNER !== 'true') return null
  return (
    <div className="bg-gold-600 px-4 py-1.5 text-center text-xs font-semibold text-white">{text}</div>
  )
}
