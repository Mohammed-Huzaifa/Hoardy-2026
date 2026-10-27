import type { Metadata } from 'next'
import Link from 'next/link'
import { getLegal } from '@/lib/legal'

const siteUrl = 'https://hoardy.ai'
const doc = getLegal('privacy')

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: '/privacy/' },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/privacy/`,
    title: `${doc.title} — hoardy.ai`,
    description: doc.description,
    siteName: 'hoardy.ai',
  },
  twitter: {
    card: 'summary',
    title: `${doc.title} — hoardy.ai`,
    description: doc.description,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 pt-32 sm:pt-36 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-[#4A82C4] hover:text-[#1B2B5E] transition-colors duration-200 mb-10"
      >
        <span aria-hidden="true">←</span> Back to home
      </Link>

      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#4A82C4] mb-4">Legal</p>
        <h1 className="text-[32px] sm:text-5xl font-semibold tracking-tight text-[#1B2B5E] leading-[1.08] mb-6">
          {doc.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#4A82C4] mb-2">
          <span>Effective {doc.effective}</span>
          <span aria-hidden="true" className="text-[#C8D6E5]">
            /
          </span>
          <span>Last updated {doc.updated}</span>
        </div>
      </div>

      {/* Styles live in globals.css under .blog-prose */}
      <div className="blog-prose max-w-3xl mt-10" dangerouslySetInnerHTML={{ __html: doc.contentHtml }} />

      <div className="max-w-3xl mt-16 pt-8 border-t border-[#C8D6E5]">
        <p className="text-[14px] text-[#5A6B82]">
          Questions about this policy?{' '}
          <Link href="/#contact" className="font-semibold text-[#1B2B5E] hover:text-[#4A82C4] transition-colors duration-200">
            Contact us
          </Link>
          .
        </p>
      </div>
    </article>
  )
}
