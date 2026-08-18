'use client'
import { useEffect, useRef, useState } from 'react'

const navLinks = [
  { label: 'Services', href: '#services', index: '01' },
  { label: 'Work', href: '#work', index: '02' },
  { label: 'Process', href: '#process', index: '03' },
  { label: 'About', href: '#about', index: '04' },
  { label: 'Contact', href: '#contact', index: '05' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = mq.matches
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Magnetic CTA — gently leans toward the cursor
  const handleCtaMove = (e: React.MouseEvent) => {
    const el = ctaRef.current
    if (!el || reducedRef.current) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`
  }
  const handleCtaLeave = () => {
    const el = ctaRef.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-[#C8D6E5]/60 shadow-[0_8px_32px_rgba(27,43,94,0.07)]'
          : 'bg-white/55 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 lg:h-[76px] flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="group flex items-center flex-shrink-0" aria-label="hoardyAI home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hoardy-logo.png"
            alt="hoardyAI"
            width={3859}
            height={775}
            className="h-[24px] lg:h-[28px] w-auto transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </a>

        {/* Desktop nav — sliding-mask links */}
        <nav className="hidden lg:flex items-center gap-2" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-[#1B2B5E]/[0.05] transition-colors duration-300 overflow-hidden"
            >
              <span className="font-mono text-[10px] tracking-widest text-[#7BB8E8] transition-colors duration-300">
                {link.index}
              </span>
              {/* Sliding mask: two stacked labels; top slides away, blue ghost slides in */}
              <span className="relative block h-[18px] overflow-hidden">
                <span className="block text-[15px] font-medium text-[#1A2332]/85 leading-[18px] transition-all duration-300 group-hover:-translate-y-[18px]">
                  {link.label}
                </span>
                <span className="absolute inset-0 block text-[15px] font-medium text-[#1B2B5E] leading-[18px] translate-y-[18px] transition-all duration-300 group-hover:translate-y-0">
                  {link.label}
                </span>
              </span>
            </a>
          ))}
        </nav>

        {/* Desktop CTA — magnetic */}
        <a
          ref={ctaRef}
          href="#contact"
          onMouseMove={handleCtaMove}
          onMouseLeave={handleCtaLeave}
          className="hidden lg:inline-flex items-center gap-1.5 bg-[#1B2B5E] text-[#EEF2FF] px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#243A6E] transition-colors duration-300 will-change-transform"
        >
          Start a project
          <span aria-hidden="true" className="text-[#7BB8E8]">
            →
          </span>
        </a>

        {/* Mobile hamburger (only < lg) */}
        <button
          className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2 min-h-[44px] min-w-[44px] items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-5 h-[2px] rounded-full bg-[#1A2332] transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-[2px] rounded-full bg-[#1A2332] transition-all duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-[2px] rounded-full bg-[#1A2332] transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden bg-white/90 backdrop-blur-xl border-b border-[#C8D6E5]/60 px-6 overflow-hidden transition-all duration-500 ${
          mobileOpen ? 'max-h-[480px] py-6' : 'max-h-0 py-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#1A2332] text-[18px] font-medium py-3.5 border-b border-[#C8D6E5]/50 last:border-b-0 flex items-center gap-4"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.4s ease ${i * 60 + 80}ms, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 60 + 80}ms`,
              }}
              onClick={() => setMobileOpen(false)}
            >
              <span className="font-mono text-[11px] tracking-widest text-[#7BB8E8]">
                {link.index}
              </span>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="mt-6 inline-flex items-center justify-center gap-2 bg-[#1B2B5E] text-[#EEF2FF] px-6 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 w-full"
          style={{
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.4s ease 380ms, transform 0.4s cubic-bezier(0.22,1,0.36,1) 380ms`,
          }}
          onClick={() => setMobileOpen(false)}
        >
          Start a project
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  )
}
