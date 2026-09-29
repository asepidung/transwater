// Dekorasi SVG ringan (tanpa gambar): punggung gunung dan gelombang air, mengikuti
// motif logo ARTIC. Warna mengikuti `currentColor`, jadi atur lewat kelas text-*.

const RIDGE =
  'M0 100 L0 66 L90 44 L150 58 L250 18 L320 50 L400 30 L500 64 L610 24 L690 52 L800 8 L890 46 L980 28 L1090 60 L1180 34 L1290 58 L1360 40 L1440 56 L1440 100 Z'
const WAVE =
  'M0 52 C 180 88 360 8 540 44 C 720 80 900 8 1080 44 C 1220 70 1340 30 1440 48 L1440 100 L0 100 Z'

// Punggung gunung: puncak menghadap ke atas, diletakkan menempel di tepi section.
export function Ridge({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      fill="currentColor"
    >
      <path d={RIDGE} />
    </svg>
  )
}

// Gelombang air halus (dua lapis) untuk pemisah section.
export function Wave({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      fill="currentColor"
    >
      <path d={WAVE} />
    </svg>
  )
}
