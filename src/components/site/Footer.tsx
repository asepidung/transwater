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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-navy-300 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {c.company.name}. {f.rights}</p>
          <a href={`/${c.locale}/privasi`} className="hover:text-white">{f.privacy}</a>
        </div>
      </div>
    </footer>
  )
}
