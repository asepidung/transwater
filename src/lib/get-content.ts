import { isSafeHttpUrl } from './validate'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import { isPreview } from './preview-mode'
import { getDefaultContent, toLocale, type IconName, type ProductItem, type SiteContent } from './content'

const ICONS: IconName[] = ['package', 'zap', 'truck', 'headset']

// Ambil nilai CMS jika terisi, kalau kosong pakai bawaan.
const text = (value: string | null | undefined, fallback: string): string =>
  typeof value === 'string' && value.trim() !== '' ? value : fallback

// Ambil array CMS jika punya isi, kalau kosong pakai bawaan.
const rows = <T, R>(value: T[] | null | undefined, map: (row: T) => R, fallback: R[]): R[] =>
  Array.isArray(value) && value.length > 0 ? value.map(map) : fallback

const safeUrl = (value: string | null | undefined, fallback: string) => (isSafeHttpUrl(value) ? value.trim() : fallback)

export const isMedia = (value: unknown): value is Media => typeof value === 'object' && value !== null && 'url' in value

export function mediaUrl(media: unknown, fallback: string, size: 'card' | 'hero' | 'thumbnail' = 'card'): string {
  if (!isMedia(media)) return fallback
  const url = media.sizes?.[size]?.url ?? media.url
  if (!url) return fallback
  // Versi = waktu file terakhir diubah, supaya foto yang diganti tidak tertahan di cache browser.
  const v = media.updatedAt ? Date.parse(media.updatedAt) : 0
  return v ? `${url}${url.includes('?') ? '&' : '?'}v=${v}` : url
}

export async function getSiteContent(localeParam: string): Promise<SiteContent> {
  const locale = toLocale(localeParam)
  const d = getDefaultContent(locale)

  try {
    const draft = await isPreview()
    const payload = await getPayload({ config })
    const [home, settings, aboutPage, info, products, postCount] = await Promise.all([
      payload.findGlobal({ slug: 'home-page', locale, depth: 0, draft }),
      payload.findGlobal({ slug: 'site-settings', locale, depth: 0, draft }),
      payload.findGlobal({ slug: 'about-page', locale, depth: 0, draft }),
      payload.findGlobal({ slug: 'info-pages', locale, depth: 0, draft }),
      payload.find({
        collection: 'products',
        locale,
        depth: 1,
        sort: 'order',
        pagination: false,
        draft,
        ...(draft ? {} : { where: { _status: { equals: 'published' as const } } }),
      }),
      payload.find({ collection: 'posts', draft, limit: 1, depth: 0, ...(draft ? {} : { where: { _status: { equals: 'published' as const } } }) }),
    ])

    const productItems: ProductItem[] = rows(
      products.docs,
      (p) => ({
        id: p.slug,
        name: p.title,
        tagline: p.tagline ?? '',
        // Foto produk hilang (mis. media terhapus): pakai foto bawaan supaya halaman tidak rusak.
        image: mediaUrl(p.image, d.products.items.find((i) => i.id === p.slug)?.image ?? d.products.items[0]?.image ?? ''),
        imageAlt: isMedia(p.image) ? p.image.alt : p.title,
        specs: (p.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
      }),
      d.products.items,
    )

    return {
      ...d,
      showCredit: settings.showDeveloperCredit !== false,
      // Menu "Berita" hanya muncul jika sudah ada artikel yang terbit (sebelum Kontak).
      nav:
        postCount.totalDocs > 0
          ? [...d.nav.slice(0, -1), { label: d.news.navLabel, href: `/${locale}/berita` }, ...d.nav.slice(-1)]
          : d.nav,
      company: {
        ...d.company,
        name: text(settings.companyName, d.company.name),
        brand: text(settings.brandName, d.company.brand),
        address: text(settings.address, d.company.address),
        mapsUrl: safeUrl(settings.mapsUrl, d.company.mapsUrl),
        phone: text(settings.phone, d.company.phone),
        email: text(settings.email, d.company.email),
        whatsapp: text(settings.whatsapp, d.company.whatsapp),
        instagram: safeUrl(settings.instagramUrl, d.company.instagram),
        hours: text(settings.hours, d.company.hours),
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
        // Hanya item yang ada isinya yang tampil. Item yang masih menunggu data cukup dihapus dari daftar di admin.
        // (Jika SEMUA baris dihapus, teks bawaan dari kode dipakai.)
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
      partners: {
        eyebrow: text(home.partners?.eyebrow, d.partners.eyebrow),
        title: text(home.partners?.title, d.partners.title),
        // Daftar diisi lewat migrasi awal dan dikelola di admin; dikosongkan = bagian disembunyikan (tidak memakai bawaan).
        items: (home.partners?.items ?? []).map((p) => p.name).filter(Boolean),
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
    console.error('[getSiteContent] gagal membaca Payload:', error)
    // Produksi: lempar error supaya build/revalidate gagal dan Next mempertahankan halaman lama,
    // bukan menyimpan teks bawaan seolah-olah itu isi CMS. Dev: pakai teks bawaan agar tetap bisa dikerjakan.
    if (process.env.NODE_ENV === 'production') throw error
    return d
  }
}
