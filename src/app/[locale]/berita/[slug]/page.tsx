import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { formatDate, getAllPostSlugs, getPost, getPosts } from '@/lib/get-posts'
import { routing } from '@/i18n/routing'
import { asset, pageAlternates, siteUrl } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'
import JsonLd from '@/components/site/JsonLd'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

type Params = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params
  const [c, post] = await Promise.all([getSiteContent(locale), getPost(slug, locale)])
  if (!post) return {}
  const description = post.excerpt || c.news.description
  return {
    title: `${post.title} | ${c.company.brand}`,
    description,
    alternates: pageAlternates(locale, `/berita/${slug}`),
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  }
}

export default async function NewsArticlePage({ params }: Params) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const [c, post, all] = await Promise.all([getSiteContent(locale), getPost(slug, locale), getPosts(locale, 6)])
  if (!post) notFound()
  const n = c.news
  const others = all.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath={`/berita/${slug}`} />
      <main className="pb-20 lg:pb-0">
        <article className="bg-gradient-to-b from-water-50 to-white pb-16 pt-10 lg:pt-14">
          <div className="mx-auto max-w-3xl px-5">
            <Link href={`/${c.locale}/berita`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-800">
              <ArrowLeft className="h-4 w-4" /> {n.back}
            </Link>
            <time dateTime={post.date} className="mt-6 block text-xs font-bold uppercase tracking-[0.14em] text-gold-600">
              {formatDate(post.date, n.dateLocale)}
            </time>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-navy-800 sm:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-navy-600">{post.excerpt}</p>}

            {post.cover && (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-water-100 shadow-sm">
                <Image src={post.cover} alt={post.coverAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
              </div>
            )}

            {post.content && (
              <div className="news-body mt-8">
                <RichText data={post.content} />
              </div>
            )}
          </div>
        </article>

        {others.length > 0 && (
          <section className="bg-white pb-20 pt-4 sm:pb-24">
            <div className="mx-auto max-w-3xl px-5">
              <h2 className="text-2xl font-extrabold text-navy-800">{n.othersTitle}</h2>
              <ul className="mt-6 space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/${c.locale}/berita/${o.slug}`} className="block rounded-xl border border-navy-100 p-4 hover:border-navy-300">
                      <time dateTime={o.date} className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                        {formatDate(o.date, n.dateLocale)}
                      </time>
                      <p className="mt-1 font-bold text-navy-800">{o.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-navy-800 py-12 text-white lg:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">{n.ctaTitle}</h2>
              <p className="mt-1 text-navy-100">{n.ctaText}</p>
            </div>
            <a
              href={`/${c.locale}/kontak`}
              className="rounded-lg bg-white px-6 py-3.5 text-center text-base font-semibold text-navy-800 hover:bg-water-50"
            >
              {c.cta.quote}
            </a>
          </div>
        </section>
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt || undefined,
          datePublished: post.date,
          dateModified: post.updatedAt,
          inLanguage: locale,
          image: post.cover ? [`${siteUrl}${post.cover}`] : undefined,
          mainEntityOfPage: `${siteUrl}/${locale}/berita/${slug}`,
          author: { '@type': 'Organization', name: c.company.name },
          publisher: {
            '@type': 'Organization',
            name: c.company.name,
            logo: { '@type': 'ImageObject', url: `${siteUrl}${asset('/images/logo.png')}` },
          },
        }}
      />
    </>
  )
}
