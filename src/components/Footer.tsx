'use client'
import { usePathname } from 'next/navigation'

const serviceLinks = [
  { label: 'AI Agents & Assistants', href: '#services' },
  { label: 'Web & App Development', href: '#services' },
  { label: 'Product Design (UI/UX)', href: '#services' },
  { label: 'QA & Maintenance', href: '#services' },
  { label: 'VR & Immersive Tech', href: '#services' },
  { label: 'Technical Strategy', href: '#services' },
]

const companyLinks = [
  { label: 'Our Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

const socials = [
  {
    label: 'Twitter / X',
    href: 'https://x.com/hoardyAI',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/hoardy/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:maaz@hoardy.ai',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="m2 7 10 6 10-6" />
      </svg>
    ),
  },
]

export default function Footer() {
  const pathname = usePathname()
  // Section anchors only exist on the homepage — prefix them on other routes.
  const homeHref = (href: string) =>
    href.startsWith('#') && pathname !== '/' ? `/${href}` : href

  return (
    <footer className="relative z-10 bg-[#14214A] text-[#C8D6E5]">
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <a href="/" className="inline-block mb-4 group" aria-label="hoardyAI home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hoardy-logo-dark.png"
                alt="hoardyAI"
                width={2691}
                height={775}
                className="h-[30px] w-auto transition-opacity duration-300 group-hover:opacity-80"
              />
            </a>
            <p className="text-[14px] text-[#D5DFF0] leading-relaxed max-w-xs mb-6">
              Built for brands. Ready for agents. A Toronto-based boutique tech agency
              shipping AI, web, and immersive products.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-[#C8D6E5] hover:text-[#7BB8E8] hover:border-[#7BB8E8]/50 hover:bg-white/[0.04] transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7BB8E8] mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={homeHref(link.href)}
                    className="text-[14px] text-[#D5DFF0] hover:text-[#EEF2FF] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7BB8E8] mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={homeHref(link.href)}
                    className="text-[14px] text-[#D5DFF0] hover:text-[#EEF2FF] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7BB8E8] mb-5">
              Contact
            </h3>
            <p className="text-[14px] text-[#D5DFF0] leading-relaxed">
              Toronto, Canada
              <br />
              Working with clients worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#C8D6E5]/80">
            © {new Date().getFullYear()} hoardy.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy/" className="text-[13px] text-[#C8D6E5]/80 hover:text-[#EEF2FF] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms/" className="text-[13px] text-[#C8D6E5]/60 hover:text-[#EEF2FF] transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
