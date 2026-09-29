import Image from 'next/image'
import { Globe } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import MobileMenu from './MobileMenu'

// switchPath: path halaman saat ini tanpa prefix bahasa (mis. '/produk'), agar
// tombol bahasa pindah ke halaman yang sama, bukan ke Beranda.
export default function Header({ c, switchPath = '' }: { c: SiteContent; switchPath?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-6 px-5">
        <a href={`/${c.locale}`} className="flex shrink-0 items-center" aria-label={c.company.brand}>
          <Image
            src="/images/logo.png"
            alt="ARTIC Air Mineral"
            width={720}
            height={457}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-navy-700 lg:flex">
          {c.nav.map((n) => (
            <a key={n.href} href={n.href} className="whitespace-nowrap hover:text-gold-600">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`/${c.lang.other}${switchPath}`}
            hrefLang={c.lang.other}
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-800"
          >
            <Globe className="h-4 w-4" /> {c.lang.label}
          </a>
          <a
            href={`/${c.locale}#penawaran`}
            className="whitespace-nowrap rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            {c.cta.quote}
          </a>
        </div>

        <MobileMenu links={c.nav} ctaLabel={c.cta.quote} ctaHref={`/${c.locale}#penawaran`} lang={{ href: `/${c.lang.other}${switchPath}`, label: c.lang.label }} />
      </div>
    </header>
  )
}
