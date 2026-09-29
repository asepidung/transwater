import Image from 'next/image'
import type { SiteContent } from '@/lib/content'
import { Ridge } from './Decor'

export default function Footer({ c }: { c: SiteContent }) {
  const f = c.footer

  return (
    <footer className="relative bg-navy-900 text-navy-200">
      <Ridge className="absolute inset-x-0 bottom-full -mb-px h-8 text-navy-900 sm:h-14" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <span className="inline-flex rounded-xl bg-white px-3 py-2">
            <Image src="/images/logo.png" alt="ARTIC Air Mineral" width={720} height={457} className="h-11 w-auto" />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{f.description}</p>
          {c.company.instagram && (
            <a
              href={c.company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-white"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              @{c.company.instagram.replace(/\/+$/, '').split('/').pop()}
            </a>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">{f.menuTitle}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {c.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">{f.certTitle}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {f.certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-xs text-navy-300 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {c.company.name}. {f.rights}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={`/${c.locale}/privasi`} className="hover:text-white">{f.privacy}</a>
            {c.showCredit && (
              <span>
                {f.credit}{' '}
                <a
                  href="https://saepullrock.tech/"
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-gold-300 hover:text-white"
                >
                  IDNX
                </a>
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
