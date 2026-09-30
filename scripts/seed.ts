import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import type { AboutPage, HomePage, InfoPage } from '../src/payload-types'
import { defaultContent, type Locale, type SiteContent } from '../src/lib/content'

// Cara pakai:
//   npm run seed                   -> isi data awal hanya jika belum ada produk
//   SEED_RESET=1 npm run seed      -> hapus SEMUA produk & media, lalu isi ulang (akun user TIDAK disentuh)
const reset = process.env.SEED_RESET === '1'

// Pengaman: seed dengan reset menghapus produk & foto. Di produksi (server sungguhan) harus disengaja.
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== '1') {
  console.error('Seed ditolak di produksi. Untuk isi awal server baru: ALLOW_PROD_SEED=1 npm run seed (jangan pakai SEED_RESET=1 setelah ada konten asli).')
  process.exit(1)
}
const root = process.cwd()

const payload = await getPayload({ config })

const existing = await payload.count({ collection: 'products' })
if (existing.totalDocs > 0 && !reset) {
  console.log('Seed dilewati: sudah ada data produk. Pakai SEED_RESET=1 untuk isi ulang dari nol.')
  process.exit(0)
}
if (reset) {
  await payload.delete({ collection: 'products', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })
  console.log('Reset: produk & media lama dihapus.')
}

// Baris array yang barisnya dipakai bersama semua bahasa: saat mengisi bahasa kedua, id baris
// harus dibawa supaya terjemahan menempel ke baris yang sama (bukan membuat baris baru).
type Row = Record<string, unknown>
const withIds = (saved: { id?: string | null }[] | null | undefined, next: Row[]): Row[] =>
  next.map((row, i) => ({ ...row, id: saved?.[i]?.id ?? undefined }))

const id = defaultContent.id
const en = defaultContent.en
const both: Record<Locale, SiteContent> = { id, en }

// ---------- Media + Produk ----------
const slugs = ['artic-330ml', 'artic-600ml', 'artic-gallon-19l']

for (const [index, item] of id.products.items.entries()) {
  const itemEn = en.products.items[index]
  const media = await payload.create({
    collection: 'media',
    locale: 'id',
    data: { alt: item.imageAlt },
    filePath: path.join(root, 'public', item.image.replace(/^\//, '')),
  })
  await payload.update({ collection: 'media', id: media.id, locale: 'en', data: { alt: itemEn.imageAlt } })

  const specs = (locale: Locale) => both[locale].products.items[index].specs.map((s) => ({ label: s.label, value: s.value }))

  const created = await payload.create({
    collection: 'products',
    locale: 'id',
    data: {
      title: item.name,
      slug: slugs[index],
      order: index + 1,
      image: media.id,
      tagline: item.tagline,
      specs: specs('id'),
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'products',
    id: created.id,
    locale: 'en',
    data: {
      title: itemEn.name,
      tagline: itemEn.tagline,
      specs: withIds(created.specs, specs('en')) as { label: string; value: string; id?: string }[],
      _status: 'published',
    },
  })
}

// ---------- Pengaturan situs ----------
const certs = (locale: Locale) => both[locale].footer.certifications.map((text) => ({ text }))

const settingsId = await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'id',
  data: {
    companyName: id.company.name,
    brandName: id.company.brand,
    address: id.company.address,
    mapsUrl: id.company.mapsUrl,
    // DUMMY sampai TRI kirim data resmi
    phone: id.company.phone,
    email: id.company.email,
    whatsapp: id.company.whatsapp,
    footerDescription: id.footer.description,
    certifications: certs('id'),
  },
})
await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'en',
  data: {
    address: en.company.address,
    footerDescription: en.footer.description,
    certifications: withIds(settingsId.certifications, certs('en')) as { text: string; id?: string }[],
  },
})

// ---------- Isi halaman utama ----------
const home = (locale: Locale, saved?: HomePage) => {
  const c = both[locale]
  const ids = <T extends { id?: string | null }>(rows: T[] | null | undefined) => rows ?? undefined
  return {
    hero: {
      eyebrow: c.hero.eyebrow,
      title: c.hero.title,
      description: c.hero.description,
      facts: withIds(ids(saved?.hero?.facts), c.hero.facts.map((f) => ({ value: f.value, label: f.label }))),
    },
    trust: {
      title: c.trust.title,
      items: withIds(ids(saved?.trust?.items), c.trust.items.map((i) => ({ label: i.label, status: i.status }))),
    },
    productsSection: { eyebrow: c.products.eyebrow, title: c.products.title, description: c.products.description },
    benefits: {
      eyebrow: c.benefits.eyebrow,
      title: c.benefits.title,
      items: withIds(
        ids(saved?.benefits?.items),
        c.benefits.items.map((b) => ({ icon: b.icon, title: b.title, text: b.text })),
      ),
    },
    segments: {
      eyebrow: c.segments.eyebrow,
      title: c.segments.title,
      items: withIds(ids(saved?.segments?.items), c.segments.items.map((text) => ({ text }))),
    },
    process: {
      eyebrow: c.process.eyebrow,
      title: c.process.title,
      steps: withIds(ids(saved?.process?.steps), c.process.steps.map((s) => ({ title: s.title, text: s.text }))),
    },
    quote: { eyebrow: c.quote.eyebrow, title: c.quote.title, description: c.quote.description },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const homeId = await payload.updateGlobal({ slug: 'home-page', locale: 'id', data: home('id') as any })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
await payload.updateGlobal({ slug: 'home-page', locale: 'en', data: home('en', homeId) as any })

// ---------- Isi halaman Tentang & Kontak ----------
const about = (locale: Locale, saved?: AboutPage) => {
  const c = both[locale]
  return {
    about: {
      eyebrow: c.about.eyebrow,
      title: c.about.title,
      description: c.about.description,
      storyTitle: c.about.storyTitle,
      story: withIds(saved?.about?.story, c.about.story.map((text) => ({ text }))),
      valuesTitle: c.about.valuesTitle,
      values: withIds(saved?.about?.values, c.about.values.map((v) => ({ title: v.title, text: v.text }))),
      legalTitle: c.about.legalTitle,
      ctaTitle: c.about.ctaTitle,
      ctaText: c.about.ctaText,
    },
    contact: { title: c.contactPage.title, description: c.contactPage.description },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const aboutId = await payload.updateGlobal({ slug: 'about-page', locale: 'id', data: about('id') as any })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
await payload.updateGlobal({ slug: 'about-page', locale: 'en', data: about('en', aboutId) as any })

// ---------- Isi halaman Kualitas & Cara Pesan ----------
const infoPages = (locale: Locale, saved?: InfoPage) => {
  const c = both[locale]
  return {
    quality: {
      eyebrow: c.quality.eyebrow,
      title: c.quality.title,
      description: c.quality.description,
      pillarsTitle: c.quality.pillarsTitle,
      pillars: withIds(saved?.quality?.pillars, c.quality.pillars.map((x) => ({ title: x.title, text: x.text }))),
      legalTitle: c.quality.legalTitle,
      legalNote: c.quality.legalNote,
      ctaTitle: c.quality.ctaTitle,
      ctaText: c.quality.ctaText,
    },
    orderPage: {
      eyebrow: c.orderPage.eyebrow,
      title: c.orderPage.title,
      description: c.orderPage.description,
      faqTitle: c.orderPage.faqTitle,
      faqs: withIds(saved?.orderPage?.faqs, c.orderPage.faqs.map((x) => ({ q: x.q, a: x.a }))),
      ctaTitle: c.orderPage.ctaTitle,
      ctaText: c.orderPage.ctaText,
    },
    privacy: {
      title: c.privacyPage.title,
      updated: c.privacyPage.updated,
      intro: c.privacyPage.intro,
      sections: withIds(saved?.privacy?.sections, c.privacyPage.sections.map((x) => ({ title: x.title, text: x.text }))),
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const infoId = await payload.updateGlobal({ slug: 'info-pages', locale: 'id', data: infoPages('id') as any })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
await payload.updateGlobal({ slug: 'info-pages', locale: 'en', data: infoPages('en', infoId) as any })

console.log('Seed selesai: 3 produk + media, pengaturan situs, dan isi halaman utama (ID + EN).')
process.exit(0)

