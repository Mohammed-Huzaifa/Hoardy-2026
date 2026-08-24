'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const services = [
  {
    number: '01',
    title: 'AI Agents & Assistants',
    description:
      'Custom AI agent setup, LLM integration, and workflow automation that augment your team, not replace it.',
    tags: ['LLM integration', 'Workflow automation', 'Intelligent assistants'],
    accent: '#7BB8E8',
    mock: (
      <div className="rounded-xl bg-[#F0F5FF] border border-[#C8D6E5]/70 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#C8D6E5]/60 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-[#E2A8A8]" />
          <span className="w-2 h-2 rounded-full bg-[#E8D39A]" />
          <span className="w-2 h-2 rounded-full bg-[#A8D5B0]" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-[#5A6B82]">agent · chat</span>
        </div>
        <div className="p-3.5 space-y-2">
          <div className="flex items-end gap-2">
            <span className="font-mono text-[9px] text-[#1B2B5E] bg-[#7BB8E8]/20 rounded-md px-2 py-1">Summarize Q3 report</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7BB8E8] to-[#4A82C4] flex items-center justify-center text-[8px] text-white flex-shrink-0 mt-0.5">✦</span>
            <span className="font-mono text-[9px] text-[#1A2332] bg-white border border-[#C8D6E5]/60 rounded-md px-2 py-1 leading-relaxed">Done. 3 key insights found. Deploying to Slack…</span>
          </div>
          <div className="flex gap-1 pl-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7BB8E8] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A82C4] animate-bounce" style={{ animationDelay: '120ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B2B5E] animate-bounce" style={{ animationDelay: '240ms' }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Web & App Development',
    description:
      'Full-stack web apps, responsive sites, and progressive web experiences built performance-first.',
    tags: ['Full-stack', 'Responsive', 'PWA'],
    accent: '#4A82C4',
    mock: (
      <div className="rounded-xl bg-[#F0F5FF] border border-[#C8D6E5]/70 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#C8D6E5]/60 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-[#E2A8A8]" />
          <span className="w-2 h-2 rounded-full bg-[#E8D39A]" />
          <span className="w-2 h-2 rounded-full bg-[#A8D5B0]" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-[#5A6B82]">hoardy.app</span>
        </div>
        <div className="p-3.5 space-y-2">
          <div className="h-1.5 w-3/4 rounded-full bg-[#C8D6E5]/70" />
          <div className="h-1.5 w-1/2 rounded-full bg-[#E2E9F5]" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-10 rounded-lg bg-white border border-[#C8D6E5]/60 flex items-center justify-center">
              <div className="w-5 h-3 rounded-[2px] bg-gradient-to-br from-[#7BB8E8] to-[#4A82C4]" />
            </div>
            <div className="h-10 rounded-lg bg-white border border-[#C8D6E5]/60 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-[#7BB8E8]/60" />
            </div>
            <div className="h-10 rounded-lg bg-white border border-[#C8D6E5]/60 flex items-center justify-center">
              <div className="w-4 h-4 rotate-45 rounded-[2px] bg-[#1B2B5E]/20" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Product Design (UI/UX)',
    description:
      'End-to-end interface design, user research, prototyping, and design systems that ship beautifully and convert.',
    tags: ['Design systems', 'Prototyping', 'User research'],
    accent: '#1B2B5E',
    mock: (
      <div className="rounded-xl bg-[#F0F5FF] border border-[#C8D6E5]/70 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#C8D6E5]/60 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-[#E2A8A8]" />
          <span className="w-2 h-2 rounded-full bg-[#E8D39A]" />
          <span className="w-2 h-2 rounded-full bg-[#A8D5B0]" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-[#5A6B82]">wireframe</span>
        </div>
        <div className="p-3.5 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <div className="h-8 rounded-lg bg-white border-2 border-dashed border-[#7BB8E8]/60 flex items-center justify-center">
                <span className="font-mono text-[8px] text-[#4A82C4]">hero</span>
              </div>
              <div className="h-4 rounded bg-white border border-[#C8D6E5]/70" />
              <div className="h-4 rounded bg-white border border-[#C8D6E5]/70" />
              <div className="h-6 rounded-lg bg-[#7BB8E8]/30" />
            </div>
            <div className="w-10 space-y-1.5">
              <div className="h-4 rounded bg-white border border-[#C8D6E5]/70" />
              <div className="h-4 rounded bg-white border border-[#C8D6E5]/70" />
              <div className="h-10 rounded bg-[#1B2B5E]/10" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '04',
    title: 'QA & Maintenance',
    description:
      'Automated testing, performance monitoring, security audits, and ongoing technical health for products that must never go down.',
    tags: ['Automated testing', 'Monitoring', 'Security audits'],
    accent: '#4A82C4',
    mock: (
      <div className="rounded-xl bg-[#F0F5FF] border border-[#C8D6E5]/70 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#C8D6E5]/60 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-[#E2A8A8]" />
          <span className="w-2 h-2 rounded-full bg-[#E8D39A]" />
          <span className="w-2 h-2 rounded-full bg-[#A8D5B0]" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-[#5A6B82]">ci · pipeline</span>
        </div>
        <div className="p-3.5 space-y-1.5">
          {[
            { name: 'unit · 48 passed', ok: true, time: '0.4s' },
            { name: 'e2e · 12 passed', ok: true, time: '1.2s' },
            { name: 'perf · 0.8s p95', ok: true, time: '0.8s' },
            { name: 'security · 0 issues', ok: true, time: '2.1s' },
          ].map((row) => (
            <div key={row.name} className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${row.ok ? 'bg-[#A8D5B0]/50 text-[#2E7D32]' : 'bg-[#E2A8A8]/50 text-[#C0392B]'}`}>
                {row.ok ? '✓' : '✕'}
              </span>
              <span className="font-mono text-[9px] text-[#1A2332] flex-1">{row.name}</span>
              <span className="font-mono text-[8px] text-[#5A6B82]">{row.time}</span>
            </div>
          ))}
          <div className="h-1 w-full rounded-full bg-[#E2E9F5] overflow-hidden mt-1">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#7BB8E8] to-[#4A82C4] animate-pulse" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '05',
    title: 'VR & Immersive Tech',
    description:
      'Spatial computing, WebXR, and virtual experiences that push the boundaries of interaction.',
    tags: ['WebXR', 'Spatial computing', 'Immersive'],
    accent: '#7BB8E8',
    mock: (
      <div className="rounded-xl bg-[#F0F5FF] border border-[#C8D6E5]/70 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#C8D6E5]/60 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-[#E2A8A8]" />
          <span className="w-2 h-2 rounded-full bg-[#E8D39A]" />
          <span className="w-2 h-2 rounded-full bg-[#A8D5B0]" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-[#5A6B82]">webxr · scene</span>
        </div>
        <div className="p-3.5 flex items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-[#7BB8E8]/50" />
            <div className="absolute inset-2.5 rounded-full border-2 border-[#4A82C4]/60" />
            <div className="absolute inset-5 rounded-full bg-gradient-to-br from-[#7BB8E8]/60 to-[#4A82C4]/60 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-dashed border-[#1B2B5E]/20 animate-spin-slow" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '06',
    title: 'Technical Strategy',
    description:
      'Architecture planning, AI readiness assessments, and transformation roadmaps that de-risk the future.',
    tags: ['Architecture', 'AI readiness', 'Roadmaps'],
    accent: '#1B2B5E',
    mock: (
      <div className="rounded-xl bg-[#F0F5FF] border border-[#C8D6E5]/70 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#C8D6E5]/60 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-[#E2A8A8]" />
          <span className="w-2 h-2 rounded-full bg-[#E8D39A]" />
          <span className="w-2 h-2 rounded-full bg-[#A8D5B0]" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-[#5A6B82]">roadmap</span>
        </div>
        <div className="p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#5A6B82]">Q3 → Q4</span>
            <span className="font-mono text-[8px] text-[#7BB8E8]">on track</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-[#E2E9F5]"><div className="h-full w-[90%] rounded-full bg-[#7BB8E8]" /></div>
            <div className="h-1.5 rounded-full bg-[#E2E9F5]"><div className="h-full w-[65%] rounded-full bg-[#4A82C4]" /></div>
            <div className="h-1.5 rounded-full bg-[#E2E9F5]"><div className="h-full w-[30%] rounded-full bg-[#1B2B5E]/40" /></div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <span className="w-2 h-2 rounded-full bg-[#7BB8E8]" />
            <span className="w-2 h-2 rounded-full bg-[#4A82C4]/60" />
            <span className="w-2 h-2 rounded-full bg-[#1B2B5E]/30" />
            <span className="w-2 h-2 rounded-full bg-[#C8D6E5]" />
          </div>
        </div>
      </div>
    ),
  },
]

function ServiceCard({
  service,
  index,
}: {
  service: typeof services[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false })
  const reduced = useReducedMotion()

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpot({ x, y, active: true })
    const rx = (0.5 - y / 100) * 6
    const ry = (x / 100 - 0.5) * 6
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    setSpot((s) => ({ ...s, active: false }))
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="snap-start shrink-0 w-[86vw] sm:w-[380px] lg:w-[400px]"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative h-full rounded-3xl border border-[#C8D6E5] bg-white p-6 lg:p-7 transition-transform duration-300 ease-out will-change-transform overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spot.active ? 1 : 0,
            background: `radial-gradient(380px circle at ${spot.x}% ${spot.y}%, rgba(123,184,232,0.13), transparent 60%)`,
          }}
          aria-hidden="true"
        />

        {/* Animated conic border on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'conic-gradient(from var(--angle, 0deg), transparent 0%, #7BB8E8 15%, #4A82C4 30%, transparent 45%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1.5px',
            animation: 'conicSpin 4s linear infinite',
          }}
          aria-hidden="true"
        />

        {/* Number + arrow */}
        <div className="relative flex items-center justify-between mb-5">
          <span className="font-mono text-[12px] tracking-widest text-[#101F45]">
            {service.number}
          </span>
          <span
            className="w-8 h-8 rounded-full border border-[#C8D6E5] flex items-center justify-center text-[#7BB8E8] text-[14px] transition-all duration-300 group-hover:bg-[#1B2B5E] group-hover:border-[#1B2B5E] group-hover:text-[#7BB8E8] group-hover:rotate-[-45deg]"
            aria-hidden="true"
          >
            →
          </span>
        </div>

        {/* Mini product mock — pops in 3D depth on hover */}
        <div className="relative mb-5 transition-transform duration-500 group-hover:[transform:translateZ(34px)_scale(1.03)]">
          {service.mock}
        </div>

        {/* Title + description — lifts with the mock */}
        <div className="relative transition-transform duration-500 group-hover:[transform:translateZ(22px)]">
          <h3 className="text-[19px] font-semibold text-[#1A2332] tracking-[-0.01em] mb-2 transition-colors duration-300 group-hover:text-[#1B2B5E]">
            {service.title}
          </h3>
          <p className="text-[13.5px] text-[#5A6B82] leading-relaxed">
            {service.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9.5px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border border-[#C8D6E5] text-[#5A6B82] transition-all duration-300 group-hover:border-[#7BB8E8]/50 group-hover:text-[#7BB8E8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
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

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const amount = card ? card.offsetWidth + 20 : 420
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#F0F5FF]/75 backdrop-blur-md overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading + controls */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div>
            <p className="eyebrow mb-4">What we do</p>
            <h2 className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold text-[#1A2332] tracking-[-0.02em] leading-[1.05] max-w-2xl">
              Full-stack capability, <span className="text-gradient">from AI to immersive</span>
            </h2>
            <p className="mt-4 text-[16px] text-[#5A6B82] max-w-xl leading-relaxed">
              One accountable team across strategy, consulting, design,
              development, and maintenance. Improving your business at every
              step. Drag the reel, or use the arrows.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="font-mono text-[12px] text-[#5A6B82] tabular-nums">
              {String(progress).padStart(2, '0')}%
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous services"
                className="w-12 h-12 rounded-full border border-[#C8D6E5] flex items-center justify-center text-[#1A2332] hover:border-[#7BB8E8] hover:text-[#7BB8E8] hover:bg-white transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
              >
                ←
              </button>
              <button
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next services"
                className="w-12 h-12 rounded-full bg-[#1B2B5E] text-[#EEF2FF] flex items-center justify-center hover:bg-[#243A6E] hover:scale-[1.04] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
              >
                →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar lg:-mx-6 lg:px-6 pb-3"
        >
          {services.map((service, i) => (
            <div key={service.number} data-card>
              <ServiceCard service={service} index={i} />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-px bg-[#E2E9F5] overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#7BB8E8] to-[#4A82C4] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
