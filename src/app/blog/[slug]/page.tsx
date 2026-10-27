import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

const siteUrl = 'https://hoardy.ai'

export const dynamicParams = false

// output: 'export' cannot export a dynamic route with ZERO static params. Until the
// first real article lands in content/blog, synthesize a hidden param that renders
// the 404 page; it vanishes automatically once a post exists.
export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: '__none__' }]
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  const url = `/blog/${post.slug}/`
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url: `${siteUrl}${url}`,
      title: `${post.title} — hoardy.ai`,
      description: post.excerpt,
      publishedTime: `${post.date}T00:00:00Z`,
      authors: [post.author],
      tags: post.tags,
      siteName: 'hoardy.ai',
      images: post.cover ? [{ url: post.cover }] : ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — hoardy.ai`,
      description: post.excerpt,
      images: post.cover ? [post.cover] : ['/og-image.png'],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const postUrl = `${siteUrl}/blog/${post.slug}/`
  const coverImage = `${siteUrl}${post.cover ?? '/og-image.png'}`

  // Article structured data — lets Google render the post as an article result with
  // author, date and image, and gives it a breadcrumb trail in the SERP.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: `${post.date}T00:00:00Z`,
    dateModified: `${post.date}T00:00:00Z`,
    author: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Hoardy',
      alternateName: 'hoardy.ai',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'hoardy.ai',
      legalName: '11371096 Canada Inc.',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/hoardy-logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    image: [coverImage],
    thumbnailUrl: coverImage,
    keywords: post.tags.join(', '),
    articleSection: post.section,
    wordCount: post.wordCount,
    inLanguage: 'en-CA',
    isPartOf: { '@type': 'Blog', '@id': `${siteUrl}/blog/#blog`, name: 'hoardy.ai — Notes from the build' },
    url: postUrl,
  }

  // FAQPage — the markup that makes the article's Q&A section extractable verbatim
  // by search engines and AI assistants instead of being treated as body prose.
  const faqSchema =
    post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${postUrl}#faq`,
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null


  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  // JSON.stringify + '<' escaping keeps the payload safe inside a script tag.
  const asJsonLd = (obj: object) => ({ __html: JSON.stringify(obj).replace(/</g, '\u003c') })

  return (
    <article className="mx-auto max-w-6xl px-6 pt-32 sm:pt-36 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={asJsonLd(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={asJsonLd(breadcrumbSchema)} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={asJsonLd(faqSchema)} />
      ) : null}
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-[#4A82C4] hover:text-[#1B2B5E] transition-colors duration-200 mb-10"
      >
        <span aria-hidden="true">←</span> All articles
      </Link>

      <div className="max-w-3xl">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#4A82C4] mb-5">
          <time dateTime={post.date}>{post.displayDate}</time>
          <span aria-hidden="true" className="text-[#C8D6E5]">
            /
          </span>
          <span>{post.readingTime}</span>
          <span aria-hidden="true" className="text-[#C8D6E5]">
            /
          </span>
          <span>{post.author}</span>
          {post.draft ? (
            <span className="rounded-full bg-[#E8D39A]/40 border border-[#C9A94E]/60 px-2 py-[2px] text-[10px] font-semibold text-[#7A5E12]">
              Draft preview
            </span>
          ) : null}
        </div>

        <h1 className="text-[32px] sm:text-5xl font-semibold tracking-tight text-[#1B2B5E] leading-[1.08] mb-6">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="text-[17px] sm:text-[19px] text-[#5A6B82] leading-relaxed mb-8">
            {post.excerpt}
          </p>
        ) : null}

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#7BB8E8]/15 border border-[#7BB8E8]/40 px-3 py-1 text-[12px] font-semibold text-[#1B2B5E]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={post.coverAlt ?? post.title}
          width={1600}
          height={900}
          className="rounded-2xl aspect-[16/9] object-cover w-full max-w-4xl mt-6 mb-12 border border-[#C8D6E5]/60"
        />
      ) : (
        <div className="h-px bg-[#C8D6E5]/70 max-w-4xl mt-6 mb-12" />
      )}

      {/* Article body — styles live in globals.css under .blog-prose */}
      <div className="blog-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {/* End-of-article CTA */}
      <div className="max-w-3xl mt-16 rounded-3xl bg-gradient-to-br from-[#F0F5FF] to-white border border-[#C8D6E5]/70 px-8 py-10 text-center">
        <h2 className="text-[22px] sm:text-[26px] font-semibold text-[#1B2B5E] mb-2">
          Have a project in mind?
        </h2>
        <p className="text-[15px] text-[#5A6B82] mb-6 leading-relaxed">
          Let&apos;s talk about what hoardy can build for your brand.
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 bg-[#1B2B5E] text-[#EEF2FF] px-7 py-3.5 rounded-full text-[15px] font-semibold hover:bg-[#243A6E] transition-colors duration-300"
        >
          Start the conversation <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
