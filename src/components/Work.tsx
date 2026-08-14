'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useInView } from '@/lib/utils'

const projects = [
  {
    tag: 'AI · Fintech',
    title: 'AI Assistant Platform for Fintech',
    description:
      'Built a multi-model AI assistant platform for a Canadian fintech, enabling natural language reporting and automated compliance checks.',
    gradient: 'from-[#7BB8E8]/25 via-white to-[#E2E9F5]',
    metric: '3× faster report turnaround',
  },
  {
    tag: 'VR · Training',
    title: 'VR Training Simulation Suite',
    description:
      'Delivered a WebXR-based training environment for an enterprise client, reducing onboarding time by making spatial simulations browser-accessible.',
    gradient: 'from-[#4A82C4]/15 via-[#F0F5FF] to-[#E2E9F5]',
    metric: '40% less onboarding time',
  },
  {
    tag: 'Web · E-Commerce',
    title: 'E-Commerce Redesign & Replatform',
    description:
      'Led a full replatform from legacy CMS to Next.js with a ground-up UX redesign, improving conversion and cutting page load times significantly.',
    gradient: 'from-[#EEF2FF] via-white to-[#7BB8E8]/15',
    metric: '60% faster page loads',
  },
]

export default function Work() {
  const { ref, inView } = useInView()
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const p = maxScroll > 0 ? el.scrollLeft / maxScroll : 0
    setProgress(Math.round(p * 100))
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateState()
    el.addEventListener('scroll', updateState, { passive: true })
    window.addEventListener('resize', updateState)
    return () => {
      el.removeEventListener('scroll', updateState)
      window.removeEventListener('resize', updateState)
    }
  }, [updateState])

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const amount = card ? card.offsetWidth + 32 : 380
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section id="work" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} mb-12`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="eyebrow mb-4">Our work</p>
              <h2 className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold text-[#1A2332] tracking-[-0.02em] leading-[1.05]">
                Projects we&apos;re proud of
              </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="font-mono text-[12px] text-[#5A6B82] tabular-nums">
                {String(progress).padStart(2, '0')}%
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollBy(-1)}
                  disabled={!canPrev}
                  aria-label="Previous projects"
                  className="w-12 h-12 rounded-full border border-[#C8D6E5] flex items-center justify-center text-[#1A2332] hover:border-[#7BB8E8] hover:text-[#7BB8E8] hover:bg-[#F0F5FF] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ←
                </button>
                <button
                  onClick={() => scrollBy(1)}
                  disabled={!canNext}
                  aria-label="Next projects"
                  className="w-12 h-12 rounded-full bg-[#1B2B5E] text-[#EEF2FF] flex items-center justify-center hover:bg-[#243A6E] hover:scale-[1.04] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar lg:-mx-6 lg:px-6 pb-2"
        >
          {projects.map((project) => (
            <article
              key={project.title}
              data-card
              className="group relative w-[85vw] sm:w-[380px] lg:w-[420px] flex-shrink-0 snap-start rounded-2xl border border-[#C8D6E5] bg-white overflow-hidden hover:border-[#7BB8E8]/50 hover:shadow-[0_24px_60px_rgba(27,43,94,0.12)] transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Visual */}
              <div className={`relative h-52 bg-gradient-to-br ${project.gradient}`}>
                <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
                <div className="absolute inset-0 flex items-end p-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#1B2B5E] bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-[#C8D6E5]">
                    {project.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-7">
                <h3 className="text-[20px] font-semibold text-[#1A2332] tracking-[-0.01em] mb-2.5">
                  {project.title}
                </h3>
                <p className="text-[14px] text-[#5A6B82] leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] font-bold text-[#4A82C4]">
                    {project.metric}
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#7BB8E8] group/link"
                    aria-label={`Ask about ${project.title}`}
                  >
                    Case study
                    <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}

          {/* End card — CTA */}
          <a
            data-card
            href="#contact"
            className="group relative w-[85vw] sm:w-[380px] lg:w-[420px] flex-shrink-0 snap-start rounded-2xl bg-[#1B2B5E] flex items-center justify-center p-8 hover:bg-[#14214A] transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden="true" />
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#7BB8E8]/20 blur-[70px] group-hover:bg-[#7BB8E8]/30 transition-colors duration-500"
              aria-hidden="true"
            />
            <div className="relative text-center">
              <p className="text-[22px] lg:text-[26px] font-semibold text-[#EEF2FF] mb-3 tracking-[-0.01em]">
                Your project could be next.
              </p>
              <span className="inline-flex items-center gap-2 bg-[#7BB8E8] text-[#1B2B5E] px-6 py-3 rounded-full text-[14px] font-semibold group-hover:scale-[1.04] transition-transform duration-200">
                Start a project
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </a>
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-px bg-[#E2E9F5] overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#7BB8E8] to-[#4A82C4] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
