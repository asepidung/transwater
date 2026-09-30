'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import { asset } from '@/lib/site'
import { Ridge } from './Decor'

// Video diputar otomatis (tanpa suara) hanya saat terlihat di layar. Pengunjung dengan
// "kurangi gerakan" atau penghemat data hanya melihat poster dan bisa memutar sendiri.
export default function BrandVideo({ c }: { c: SiteContent }) {
  const v = c.videoSection
  const ref = useRef<HTMLVideoElement>(null)
  const [manual, setManual] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || conn?.saveData === true
    if (calm) {
      setManual(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => setManual(true))
        else el.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!v.enabled) return null

  return (
    <section id="video" className="scroll-mt-20 relative isolate overflow-hidden bg-navy-900 py-16 text-white lg:py-20">
      <Ridge className="absolute inset-x-0 bottom-0 -z-10 h-40 text-white opacity-[0.04] sm:h-56" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.1fr_auto] lg:gap-16">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">{v.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{v.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-100">{v.text}</p>
          <a
            href="#penawaran"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-navy-800 hover:bg-water-50"
          >
            {c.cta.quote}
          </a>
        </div>

        <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.75rem] bg-navy-800 shadow-2xl shadow-black/40 lg:max-w-[300px]">
          <video
            ref={ref}
            className="h-full w-full object-cover"
            poster={asset('/videos/artic-splash-poster.webp')}
            muted
            loop
            playsInline
            preload="none"
            aria-label={v.title}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={asset('/videos/artic-splash.mp4')} type="video/mp4" />
          </video>
          {manual && !playing && (
            <button
              type="button"
              onClick={() => ref.current?.play()}
              aria-label="Play"
              className="absolute inset-0 flex items-center justify-center bg-navy-900/30"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-lg">
                <Play className="ml-1 h-7 w-7" fill="currentColor" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
