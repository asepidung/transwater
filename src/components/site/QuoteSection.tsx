import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { phoneNumbers, whatsappLink, type SiteContent } from '@/lib/content'
import QuoteForm from './QuoteForm'
import { Ridge } from './Decor'

export default function QuoteSection({ c, asH1 = false }: { c: SiteContent; asH1?: boolean }) {
  const Heading = asH1 ? 'h1' : 'h2'
  const q = c.quote
  const wa = whatsappLink(c.company.whatsapp, c.cta.whatsappMessage)

  return (
    <section id="penawaran" className="relative scroll-mt-20 bg-navy-800 py-16 lg:py-20">
      {!asH1 && <Ridge className="absolute inset-x-0 bottom-full -mb-px h-8 text-navy-800 sm:h-14" />}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-300">{q.eyebrow}</p>
          <Heading className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{q.title}</Heading>
          <p className="mt-3 text-base leading-relaxed text-navy-200">{q.description}</p>

          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-white">{q.addressTitle}</p>
                <p className="mt-0.5 leading-relaxed text-navy-200">{c.company.address}</p>
                <a
                  href={c.company.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-semibold text-gold-300 underline"
                >
                  {q.mapsLabel}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-white">{q.phoneTitle}</p>
                {phoneNumbers(c.company.phone).map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="mt-0.5 block text-navy-200">
                    {phone}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-white">{q.emailTitle}</p>
                <a href={`mailto:${c.company.email}`} className="mt-0.5 block text-navy-200">
                  {c.company.email}
                </a>
              </div>
            </li>
            {c.company.hours && (
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-white">{q.hoursTitle}</p>
                  <p className="mt-0.5 text-navy-200">{c.company.hours}</p>
                </div>
              </li>
            )}
          </ul>

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-navy-300 bg-white px-5 py-3 text-sm font-semibold text-navy-700 hover:border-navy-500"
          >
            <MessageCircle className="h-5 w-5" /> {c.cta.chat}
          </a>
        </div>

        <div className="lg:col-span-3">
          <QuoteForm c={c} />
        </div>
      </div>
    </section>
  )
}
