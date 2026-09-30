import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import { getDefaultContent, toLocale, type IconName, type ProductItem, type SiteContent } from './content'

const ICONS: IconName[] = ['package', 'zap', 'truck', 'headset']

// Ambil nilai CMS jika terisi, kalau kosong pakai bawaan.
const text = (value: string | null | undefined, fallback: string): string =>
  typeof value === 'string' && value.trim() !== '' ? value : fallback

// Ambil array CMS jika punya isi, kalau kosong pakai bawaan.
const rows = <T, R>(value: T[] | null | undefined, map: (row: T) => R, fallback: R[]): R[] =>
  Array.isArray(value) && value.length > 0 ? value.map(map) : fallback

const isMedia = (value: unknown): value is Media => typeof value === 'object' && value !== null && 'url' in value

function mediaUrl(media: unknown, fallback: string): string {
  if (!isMedia(media)) return fallback
  const url = media.sizes?.card?.url ?? media.url
  if (!url) return fallback
  // Versi = waktu file terakhir diubah, supaya foto yang diganti tidak tertahan di cache browser.
  const v = media.updatedAt ? Date.parse(media.updatedAt) : 0
  return v ? `${url}${url.includes('?') ? '&' : '?'}v=${v}` : url
}

export async function getSiteContent(localeParam: string): Promise<SiteContent> {
  const locale = toLocale(localeParam)
  const d = getDefaultContent(locale)

  try {
    const payload = await getPayload({ config })
    const [home, settings, aboutPage, info, products] = await Promise.all([
      payload.findGlobal({ slug: 'home-page', locale, depth: 0 }),
      payload.findGlobal({ slug: 'site-settings', locale, depth: 0 }),
      payload.findGlobal({ slug: 'about-page', locale, depth: 0 }),
      payload.findGlobal({ slug: 'info-pages', locale, depth: 0 }),
      payload.find({
        collection: 'products',
        locale,
        depth: 1,
        sort: 'order',
        pagination: false,
        where: { _status: { equals: 'published' } },
      }),
    ])

    const productItems: ProductItem[] = rows(
      products.docs,
      (p) => ({
        id: p.slug,
        name: p.title,
        tagline: p.tagline ?? '',
        image: mediaUrl(p.image, ''),
        imageAlt: isMedia(p.image) ? p.image.alt : p.title,
        specs: (p.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
      }),
      d.products.items,
    )

    return {
      ...d,
      showCredit: settings.showDeveloperCredit !== false,
      company: {
        ...d.company,
        name: text(settings.companyName, d.company.name),
        brand: text(settings.brandName, d.company.brand),
        address: text(settings.address, d.company.address),
        mapsUrl: text(settings.mapsUrl, d.company.mapsUrl),
        phone: text(settings.phone, d.company.phone),
        email: text(settings.email, d.company.email),
        whatsapp: text(settings.whatsapp, d.company.whatsapp),
        instagram: text(settings.instagramUrl, d.company.instagram),
      },
      hero: {
        style: (['banner', 'lake', 'mountain', 'forest', 'photo'] as const).find((s) => s === home.hero?.style) ?? d.hero.style,
        eyebrow: text(home.hero?.eyebrow, d.hero.eyebrow),
        title: text(home.hero?.title, d.hero.title),
        description: text(home.hero?.description, d.hero.description),
        facts: rows(home.hero?.facts, (f) => ({ value: f.value, label: f.label }), d.hero.facts),
      },
      videoSection: {
        enabled: home.videoSection?.enabled !== false,
        eyebrow: text(home.videoSection?.eyebrow, d.videoSection.eyebrow),
        title: text(home.videoSection?.title, d.videoSection.title),
        text: text(home.videoSection?.text, d.videoSection.text),
      },
      trust: {
        title: text(home.trust?.title, d.trust.title),
        // Bar sertifikasi disembunyikan hanya jika CMS sengaja dikosongkan setelah pernah diisi.
        items: rows(home.trust?.items, (i) => ({ label: i.label, status: i.status }), d.trust.items),
      },
      products: {
        ...d.products,
        eyebrow: text(home.productsSection?.eyebrow, d.products.eyebrow),
        title: text(home.productsSection?.title, d.products.title),
        description: text(home.productsSection?.description, d.products.description),
        items: productItems,
      },
      about: {
        eyebrow: text(aboutPage.about?.eyebrow, d.about.eyebrow),
        title: text(aboutPage.about?.title, d.about.title),
        description: text(aboutPage.about?.description, d.about.description),
        storyTitle: text(aboutPage.about?.storyTitle, d.about.storyTitle),
        story: rows(aboutPage.about?.story, (s) => s.text, d.about.story),
        expertiseTitle: text(aboutPage.about?.expertiseTitle, d.about.expertiseTitle),
        expertise: rows(aboutPage.about?.expertise, (x) => x.text, d.about.expertise),
        visionTitle: text(aboutPage.about?.visionTitle, d.about.visionTitle),
        vision: text(aboutPage.about?.vision, d.about.vision),
        missionTitle: text(aboutPage.about?.missionTitle, d.about.missionTitle),
        mission: text(aboutPage.about?.mission, d.about.mission),
        valuesTitle: text(aboutPage.about?.valuesTitle, d.about.valuesTitle),
        values: rows(aboutPage.about?.values, (v) => ({ title: v.title, text: v.text }), d.about.values),
        legalTitle: text(aboutPage.about?.legalTitle, d.about.legalTitle),
        ctaTitle: text(aboutPage.about?.ctaTitle, d.about.ctaTitle),
        ctaText: text(aboutPage.about?.ctaText, d.about.ctaText),
      },
      quality: {
        eyebrow: text(info.quality?.eyebrow, d.quality.eyebrow),
        title: text(info.quality?.title, d.quality.title),
        description: text(info.quality?.description, d.quality.description),
        pillarsTitle: text(info.quality?.pillarsTitle, d.quality.pillarsTitle),
        pillars: rows(info.quality?.pillars, (x) => ({ title: x.title, text: x.text }), d.quality.pillars),
        legalTitle: text(info.quality?.legalTitle, d.quality.legalTitle),
        legalNote: text(info.quality?.legalNote, d.quality.legalNote),
        ctaTitle: text(info.quality?.ctaTitle, d.quality.ctaTitle),
        ctaText: text(info.quality?.ctaText, d.quality.ctaText),
      },
      qualityGallery: d.qualityGallery,
      orderPage: {
        eyebrow: text(info.orderPage?.eyebrow, d.orderPage.eyebrow),
        title: text(info.orderPage?.title, d.orderPage.title),
        description: text(info.orderPage?.description, d.orderPage.description),
        faqTitle: text(info.orderPage?.faqTitle, d.orderPage.faqTitle),
        faqs: rows(info.orderPage?.faqs, (x) => ({ q: x.q, a: x.a }), d.orderPage.faqs),
        ctaTitle: text(info.orderPage?.ctaTitle, d.orderPage.ctaTitle),
        ctaText: text(info.orderPage?.ctaText, d.orderPage.ctaText),
      },
      privacyPage: {
        title: text(info.privacy?.title, d.privacyPage.title),
        updated: text(info.privacy?.updated, d.privacyPage.updated),
        intro: text(info.privacy?.intro, d.privacyPage.intro),
        sections: rows(info.privacy?.sections, (x) => ({ title: x.title, text: x.text }), d.privacyPage.sections),
      },
      contactPage: {
        title: text(aboutPage.contact?.title, d.contactPage.title),
        description: text(aboutPage.contact?.description, d.contactPage.description),
      },
      benefits: {
        eyebrow: text(home.benefits?.eyebrow, d.benefits.eyebrow),
        title: text(home.benefits?.title, d.benefits.title),
        items: rows(
          home.benefits?.items,
          (b) => ({
            icon: (ICONS as string[]).includes(b.icon) ? (b.icon as IconName) : 'package',
            title: b.title,
            text: b.text,
          }),
          d.benefits.items,
        ),
      },
      segments: {
        eyebrow: text(home.segments?.eyebrow, d.segments.eyebrow),
        title: text(home.segments?.title, d.segments.title),
        items: rows(home.segments?.items, (s) => s.text, d.segments.items),
      },
      process: {
        eyebrow: text(home.process?.eyebrow, d.process.eyebrow),
        title: text(home.process?.title, d.process.title),
        steps: rows(home.process?.steps, (s) => ({ title: s.title, text: s.text }), d.process.steps),
      },
      quote: {
        ...d.quote,
        eyebrow: text(home.quote?.eyebrow, d.quote.eyebrow),
        title: text(home.quote?.title, d.quote.title),
        description: text(home.quote?.description, d.quote.description),
      },
      footer: {
        ...d.footer,
        description: text(settings.footerDescription, d.footer.description),
        certifications: rows(settings.certifications, (c) => c.text, d.footer.certifications),
      },
    }
  } catch (error) {
    // CMS tidak terjangkau saat build/render: tampilkan teks bawaan, jangan gagalkan situs.
    console.error('[getSiteContent] gagal membaca Payload, memakai teks bawaan:', error)
    return d
  }
}
