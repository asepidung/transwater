import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getSiteContent } from '@/lib/get-content'
import { formatDate, getPosts } from '@/lib/get-posts'
import { routing } from '@/i18n/routing'
import { asset, pageAlternates } from '@/lib/site'
import DraftBanner from '@/components/site/DraftBanner'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import MobileCtaBar from '@/components/site/MobileCtaBar'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = await getSiteContent(locale)
  return {
    title: `${c.news.eyebrow} | ${c.company.brand}`,
    description: c.news.description,
    alternates: pageAlternates(locale, '/berita'),
  }
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [c, posts] = await Promise.all([getSiteContent(locale), getPosts(locale)])
  const n = c.news

  return (
    <>
      <DraftBanner text={c.banner} />
      <Header c={c} switchPath="/berita" />
      <main className="pb-20 lg:pb-0">
        <section className="bg-gradient-to-b from-water-50 to-white py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600">{n.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-navy-800 sm:text-4xl">{n.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-600">{n.description}</p>
          </div>
        </section>

        <section className="bg-white pb-20 pt-4 sm:pb-24">
          <div className="mx-auto max-w-6xl px-5">
            {posts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-navy-200 p-8 text-center text-navy-600">{n.empty}</p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug} className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition hover:shadow-md">
                    <Link href={`/${c.locale}/berita/${post.slug}`} className="block">
                      <div className="relative aspect-[16/9] overflow-hidden bg-water-100">
                        {post.cover ? (
                          <Image
                            src={post.cover}
                            alt={post.coverAlt}
                            fill
                            sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-water-100 to-water-50">
                            <Image src={asset('/images/logo.png')} alt="" width={160} height={64} className="h-12 w-auto opacity-60" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <time dateTime={post.date} className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                          {formatDate(post.date, n.dateLocale)}
                        </time>
                        <h2 className="mt-2 text-lg font-bold leading-snug text-navy-800">{post.title}</h2>
                        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600">{post.excerpt}</p>}
                        <span className="mt-4 inline-block text-sm font-semibold text-navy-700 underline underline-offset-4">{n.readMore}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer c={c} />
      <MobileCtaBar c={c} />
    </>
  )
}
