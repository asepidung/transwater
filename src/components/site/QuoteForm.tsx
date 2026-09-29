'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import { submitQuote } from '@/app/actions/submit-quote'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const field =
  'w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-300 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-200'
const label = 'mb-1.5 block text-sm font-semibold text-navy-700'

export default function QuoteForm({ c }: { c: SiteContent }) {
  const f = c.quote.form
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('locale', c.locale)
    setStatus('sending')
    try {
      const res = await submitQuote(fd)
      if (res.ok) {
        form.reset()
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-700 text-white">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-xl font-bold text-navy-800">{f.successTitle}</h3>
        <p className="mt-2 text-navy-600">{f.successText}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-navy-700 underline"
        >
          OK
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4 overflow-hidden rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      {/* Jebakan bot: tersembunyi dari manusia dan pembaca layar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-company" className={label}>{f.company}</label>
          <input id="q-company" name="company" required autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="q-name" className={label}>{f.name}</label>
          <input id="q-name" name="name" required autoComplete="name" className={field} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-contact" className={label}>{f.contact}</label>
          <input id="q-contact" name="contact" type="tel" required autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor="q-product" className={label}>{f.product}</label>
          <select id="q-product" name="product" required defaultValue="" className={field}>
            <option value="" disabled>{f.productPlaceholder}</option>
            {c.products.items.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="other">{f.productOther}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="q-volume" className={label}>{f.volume}</label>
        <input id="q-volume" name="volume" placeholder={f.volumePlaceholder} className={field} />
      </div>

      <div>
        <label htmlFor="q-message" className={label}>{f.message}</label>
        <textarea id="q-message" name="message" rows={3} placeholder={f.messagePlaceholder} className={field} />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-navy-700 px-6 py-3.5 text-base font-semibold text-white hover:bg-navy-800 disabled:opacity-70"
      >
        {status === 'sending' ? f.sending : f.submit}
      </button>
      {status === 'error' && (
        <p role="alert" className="text-center text-sm font-medium text-accent">{f.error}</p>
      )}
    </form>
  )
}
