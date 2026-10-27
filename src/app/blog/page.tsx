import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes from the hoardy.ai build — AI agents, web & app development, product design, QA, immersive tech, and how we ship them for brands.',
  alternates: { canonical: '/blog/' },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 sm:pt-36 pb-24">
      {/* Page header */}
      <header className="mb-14 sm:mb-16">
        <p className="eyebrow mb-4">hoardy · Journal</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1B2B5E] leading-[1.05] max-w-3xl">
          Notes from the <span className="text-gradient">build.</span>
        </h1>
        <p className="mt-5 text-[16px] sm:text-[17px] text-[#5A6B82] max-w-xl leading-relaxed">
          How we ship AI agents, websites, and immersive products for brands — lessons, launches,
          and what&apos;s next.
        </p>
      </header>

      {posts.length === 0 ? (
        /* Empty state — shown until the first article lands in content/blog */
        <div className="rounded-3xl border-2 border-dashed border-[#C8D6E5]/80 bg-white/50 px-8 py-20 text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#101F45] mb-4">
            Coming soon
          </p>
          <p className="text-[22px] sm:text-[26px] font-semibold text-[#1B2B5E] mb-3">
            The first article is in the works.
          </p>
          <p className="text-[15px] text-[#5A6B82] max-w-md mx-auto leading-relaxed">
            Fresh thinking on AI, web builds, and product launches — check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl bg-white border border-[#C8D6E5]/70 p-6 sm:p-7 transition-all duration-300 hover:border-[#4A82C4]/60 hover:shadow-[0_16px_48px_rgba(16,31,69,0.12)] hover:-translate-y-1"
            >
              {post.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover}
                  alt={post.coverAlt ?? post.title}
                  width={1600}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="rounded-xl aspect-[16/9] object-cover w-full mb-5 border border-[#C8D6E5]/50"
                />
              ) : null}

              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#4A82C4] mb-3">
                <time dateTime={post.date}>{post.displayDate}</time>
                <span aria-hidden="true" className="text-[#C8D6E5]">
                  /
                </span>
                <span>{post.readingTime}</span>
                {post.draft ? (
                  <span className="rounded-full bg-[#E8D39A]/40 border border-[#C9A94E]/60 px-2 py-[2px] text-[10px] font-semibold text-[#7A5E12]">
                    Draft
                  </span>
                ) : null}
              </div>

              <h2 className="text-[19px] sm:text-[22px] font-semibold text-[#1A2332] leading-snug mb-3 group-hover:text-[#1B2B5E] transition-colors duration-300">
                {post.title}
              </h2>

              <p className="text-[14.5px] text-[#5A6B82] leading-relaxed mb-6 line-clamp-3 flex-1">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between border-t border-[#C8D6E5]/60 pt-4">
                <span className="text-[13px] font-semibold text-[#1A2332]">{post.author}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4A82C4] inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2">
                  Read <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
