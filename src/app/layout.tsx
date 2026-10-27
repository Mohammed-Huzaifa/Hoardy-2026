import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Preloader from '@/components/Preloader'
import SmoothScroll from '@/components/SmoothScroll'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const siteUrl = 'https://hoardy.ai'
const siteTitle = 'hoardy.ai — Built for brands. Ready for agents.'
const siteDescription =
  'hoardy.ai is a Toronto-based boutique tech agency shipping AI agents & assistants, web & app development, product design (UI/UX), QA & maintenance, and VR & immersive tech — from concept to launch, quality baked in.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | hoardy.ai',
  },
  description: siteDescription,
  applicationName: 'hoardy.ai',
  authors: [{ name: 'hoardy.ai', url: siteUrl }],
  creator: 'hoardy.ai',
  publisher: 'hoardy.ai',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteUrl}/blog/rss.xml`,
      'text/markdown': `${siteUrl}/index.md`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'hoardy.ai',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'hoardy.ai — Built for brands. Ready for agents.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  category: 'technology',
  keywords: [
    'hoardy.ai',
    'AI agency Toronto',
    'AI agents development',
    'web development agency Toronto',
    'product design UI/UX',
    'QA and maintenance services',
    'VR development',
    'boutique tech agency',
  ],
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#101F45',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${siteUrl}/#organization`,
      name: 'Hoardy',
      alternateName: ['hoardy.ai', 'Hoardy AI'],
      // The registered legal entity, not the brand — AI systems cross-reference this
      // against corporate registries when they resolve an entity.
      legalName: '11371096 Canada Inc.',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/hoardy-logo.png`,
        width: 3859,
        height: 775,
      },
      image: `${siteUrl}/og-image.png`,
      slogan: 'Built for brands. Ready for agents.',
      description:
        'hoardy.ai is a boutique tech agency in the Greater Toronto Area shipping AI agents & assistants, web & app development, product design (UI/UX), QA & maintenance, VR & immersive tech, and technical strategy.',
      email: 'maaz@hoardy.ai',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '220 Missinnihe Way, Suite 1411',
        addressLocality: 'Mississauga',
        addressRegion: 'ON',
        postalCode: 'L5H 0A9',
        addressCountry: 'CA',
      },
      // Entity resolution: without these, AI systems cannot connect the site to the
      // brand's own profiles and treat each mention as a separate unknown company.
      sameAs: ['https://www.linkedin.com/company/hoardy/', 'https://x.com/hoardyAI'],
      areaServed: [
        { '@type': 'City', name: 'Toronto' },
        { '@type': 'City', name: 'Mississauga' },
        { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
        { '@type': 'Country', name: 'Canada' },
      ],
      knowsAbout: [
        'AI agents & assistants',
        'Agentic workflows',
        'Large language model integration',
        'Web & app development',
        'Product design (UI/UX)',
        'QA & maintenance',
        'VR & immersive tech',
        'Technical strategy',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'maaz@hoardy.ai',
        availableLanguage: 'English',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Hoardy services',
        itemListElement: [
          'AI Agents & Assistants',
          'Web & App Development',
          'Product Design (UI/UX)',
          'QA & Maintenance',
          'VR & Immersive Tech',
          'Technical Strategy',
        ].map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service, provider: { '@id': `${siteUrl}/#organization` } },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'hoardy.ai',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
