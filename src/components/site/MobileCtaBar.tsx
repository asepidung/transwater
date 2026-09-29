import { MessageCircle } from 'lucide-react'
import { whatsappLink, type SiteContent } from '@/lib/content'

// Bar tetap di bawah layar khusus mobile: jalur tercepat ke WhatsApp / penawaran.
export default function MobileCtaBar({ c }: { c: SiteContent }) {
  const wa = whatsappLink(c.company.whatsapp, c.cta.whatsappMessage)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t border-navy-100 bg-white/95 p-3 backdrop-blur lg:hidden">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg border border-navy-200 px-3 py-3 text-sm font-semibold text-navy-700"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
      <a
        href={`/${c.locale}#penawaran`}
        className="flex items-center justify-center rounded-lg bg-navy-700 px-3 py-3 text-sm font-semibold text-white"
      >
        {c.cta.quote}
      </a>
    </div>
  )
}
