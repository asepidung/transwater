'use client'

import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'

interface Props {
  links: { label: string; href: string }[]
  ctaLabel: string
  ctaHref: string
  lang: { href: string; label: string }
}

export default function MobileMenu({ links, ctaLabel, ctaHref, lang }: Props) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menu"
        className="flex h-11 w-11 items-center justify-center rounded-lg text-navy-800 hover:bg-navy-50"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-navy-100 bg-white shadow-lg">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="border-b border-navy-50 py-3.5 text-base font-semibold text-navy-800"
              >
                {l.label}
              </a>
            ))}
            <a
              href={lang.href}
              onClick={close}
              className="flex items-center gap-2 py-3.5 text-base font-semibold text-navy-600"
            >
              <Globe className="h-4 w-4" /> {lang.label}
            </a>
            <a
              href={ctaHref}
              onClick={close}
              className="mb-2 mt-1 rounded-lg bg-navy-700 px-5 py-3.5 text-center text-base font-semibold text-white"
            >
              {ctaLabel}
            </a>
          </nav>
        </div>
      )}
    </div>
  )
}
