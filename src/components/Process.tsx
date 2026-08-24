'use client'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import dynamic from 'next/dynamic'

/* ThreeUI (Meng To's open-source three.js UI library) — CSS-free canvas components.
   Both auto-pause offscreen and load client-side only. */
const StreamVisual = dynamic(
  () =>
    import('@designcodeio/threeui/components/StreamConvergenceBackground').then(
      (m) => m.StreamConvergenceBackground
    ),
  { ssr: false, loading: () => null }
)
const OrbitVisual = dynamic(
  () =>
    import('@designcodeio/threeui/components/OrbitalSphereBackground').then(
      (m) => m.OrbitalSphereBackground
    ),
  { ssr: false, loading: () => null }
)

const steps = [
  {
    number: '01',
    phase: 'Vision',
    title: 'Every lasting brand starts with a why',
    message:
      'We sit with you and learn the business behind the brief: where you have been, where you want to go, and what has to be true for you to get there. Your ambition becomes the north star for everything we build together.',
    chips: ['Vision workshops', 'North star framing', 'Success metrics'],
    commit: 'We commit to understanding your business before we touch a single screen.',
  },
  {
    number: '02',
    phase: 'Strategy',
    title: 'A vision without a plan is a wish',
    message:
      'We turn your ambition into a roadmap you can defend to anyone: the right technology, the right sequence, the right priorities. Every recommendation comes with a reason, and every reason comes with numbers.',
    chips: ['Technology roadmap', 'Architecture planning', 'AI readiness'],
    commit: 'We commit to recommendations you can explain in plain English.',
  },
  {
    number: '03',
    phase: 'Consulting',
    title: 'A senior team in your corner, not a vendor',
    message:
      'We advise like owners, not order-takers. That means telling you what to build, what to skip, and what to fix before it gets expensive, even when the honest answer means less work for us.',
    chips: ['Technical audits', 'Product guidance', 'Vendor-neutral advice'],
    commit: 'We commit to honest advice, even when it costs us the project.',
  },
  {
    number: '04',
    phase: 'Design',
    title: 'Trust is earned before a word is read',
    message:
      'Great design makes your product feel inevitable. We research, prototype, and build a design system your customers understand instantly and your team can ship confidently for years.',
    chips: ['User research', 'Design systems', 'Interactive prototypes'],
    commit: 'We commit to design backed by evidence, not opinion.',
  },
  {
    number: '05',
    phase: 'Development',
    title: 'Built to last, not built to demo',
    message:
      'Clean architecture, weekly demos, and QA embedded from day one. You always know exactly where your product stands, because you watch it working every single week.',
    chips: ['Weekly demos', 'CI/CD pipelines', 'Embedded QA'],
    commit: 'We commit to no black boxes and no surprises, ever.',
  },
  {
    number: '06',
    phase: 'Maintenance',
    title: 'Launch is the beginning, not the end',
    message:
      'We monitor, test, secure, and improve your product long after the launch. It stays fast, stable, and ahead of the market, so you can focus on growing the business.',
    chips: ['24/7 monitoring', 'Security audits', 'Continuous improvement'],
    commit: 'We commit to being there after launch. For years, not weeks.',
  },
  {
    number: '07',
    phase: 'Legacy',
    title: 'The business that outlasts its founders',
    message:
      'This is the whole point. A business that runs on systems it trusts, with a team that knows it inside out, survives market shifts, leadership changes, and decades. Everything we do is in service of that.',
    chips: ['Knowledge transfer', 'Long-term partnership', 'Built to evolve'],
    commit: 'We commit to building what outlives us.',
  },
]

const promises = [
  'One accountable team from first call to year ten.',
  'Weekly demos, no black boxes, no surprises.',
  'Honest advice, even when it costs us the project.',
  'Your data and your IP stay yours, always.',
]

const disciplines = ['Strategy', 'Consulting', 'Design', 'Development', 'Maintenance']

export default function Process() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  const goTo = useCallback((index: number) => {
    setActive((current) => {
      const next = Math.max(0, Math.min(steps.length - 1, index))
      return next === current ? current : next
    })
  }, [])

  // Arrow keys step the journey while the section is on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.getElementById('process')
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(active + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(active - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  const step = steps[active]
  // The stream gains momentum as the journey advances
  const streamSpeed = 0.9 + active * 0.06
  const streamBrightness = 0.95 + active * 0.035

  return (
    <section
      id="process"
      className="relative py-24 lg:py-32 bg-[#1B2B5E]/90 backdrop-blur-md overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-dark" aria-hidden="true" />
      <div
        className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full bg-[#4A82C4]/15 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -right-32 w-[420px] h-[420px] rounded-full bg-[#7BB8E8]/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 lg:mb-16"
        >
          <p className="eyebrow mb-4 !text-[#7BB8E8]">How we help</p>
          <h2 className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold text-[#EEF2FF] tracking-[-0.02em] leading-[1.05] max-w-3xl">
            From vision to a business that{' '}
            <span className="text-[#7BB8E8]">outlasts decades</span>
          </h2>
          <p className="mt-4 text-[16px] lg:text-[17px] text-[#C8D6E5] max-w-xl leading-relaxed">
            Strategy, consulting, design, development, and maintenance, working
            as one accountable team. This is how we help you improve your
            business, at every step.
          </p>
        </motion.div>

        {/* Step rail */}
        <div
          className="mb-8 -mx-6 px-6 lg:mx-0 lg:px-0 overflow-x-auto hide-scrollbar"
          aria-label="Journey steps"
        >
          <div className="flex lg:grid lg:grid-cols-7 gap-2 lg:gap-2.5 min-w-max lg:min-w-0">
            {steps.map((s, i) => {
              const isActive = i === active
              return (
                <button
                  key={s.number}
                  onClick={() => goTo(i)}
                  aria-label={`Step ${s.number}: ${s.phase}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center gap-2.5 px-4 py-3 lg:py-3.5 rounded-full border min-h-[44px] transition-all duration-300 ${
                    isActive
                      ? 'bg-[#7BB8E8] border-[#7BB8E8] text-[#1B2B5E] shadow-[0_8px_24px_rgba(123,184,232,0.35)]'
                      : 'bg-white/[0.04] border-white/[0.12] text-[#C8D6E5] hover:border-[#7BB8E8]/50 hover:text-[#EEF2FF]'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-widest ${
                      isActive ? 'text-[#1B2B5E]/70' : 'text-[#7BB8E8]'
                    }`}
                  >
                    {s.number}
                  </span>
                  <span className="text-[13px] font-semibold whitespace-nowrap">
                    {s.phase}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Journey stage */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm"
        >
          {/* ThreeUI stream backdrop — every step converges on your outcome */}
          <div className="absolute inset-0" aria-hidden="true">
            {reduced ? (
              <div className="absolute inset-0 bg-[#101F45]/60" />
            ) : (
              <StreamVisual
                hue={-35}
                saturation={0.85}
                brightness={streamBrightness}
                speed={streamSpeed}
                className="absolute inset-0 h-full w-full pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-[#1B2B5E]/50" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1B2B5E]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#101F45]/90 to-transparent" />
          </div>

          {/* Stage content */}
          <div
            aria-live="polite"
            className="relative p-7 sm:p-10 lg:p-14 min-h-[500px] lg:min-h-[520px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#7BB8E8]">
                Step {step.number} · {step.phase}
              </span>
              <span className="font-mono text-[11px] text-[#C8D6E5]/70 tabular-nums">
                {active + 1} / {String(steps.length).padStart(2, '0')}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-[26px] sm:text-[32px] lg:text-[40px] font-bold text-[#EEF2FF] tracking-[-0.02em] leading-[1.08] max-w-3xl mb-4">
                  {step.title}
                </h3>
                <p className="text-[15px] lg:text-[17px] text-[#C8D6E5] leading-relaxed max-w-2xl">
                  {step.message}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {step.chips.map((chip) => (
                    <span
                      key={chip}
                      className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full border border-white/[0.12] text-[#C8D6E5]/90 bg-white/[0.05]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Commitment + controls */}
            <div className="mt-auto pt-10">
              <div className="flex items-start gap-3 border-t border-white/10 pt-6">
                <span
                  className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#7BB8E8] flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="text-[14px] lg:text-[15px] text-[#9FD0F2] leading-relaxed">
                  {step.commit}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous step"
                  className="w-12 h-12 rounded-full border border-white/[0.18] text-[#EEF2FF] flex items-center justify-center hover:border-[#7BB8E8] hover:text-[#7BB8E8] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ←
                </button>
                <div
                  className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={steps.length}
                  aria-valuenow={active + 1}
                  aria-label="Journey progress"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#7BB8E8] to-[#4A82C4] rounded-full transition-all duration-500"
                    style={{ width: `${((active + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => goTo(active + 1)}
                  disabled={active === steps.length - 1}
                  aria-label="Next step"
                  className="w-12 h-12 rounded-full bg-[#7BB8E8] text-[#1B2B5E] flex items-center justify-center font-bold hover:brightness-110 hover:scale-[1.04] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
                >
                  →
                </button>
                <a
                  href="#contact"
                  className="hidden sm:inline-flex items-center gap-2 text-[#7BB8E8] text-[14px] font-semibold hover:brightness-125 transition-all duration-200 ml-2"
                >
                  Start a project
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom strip: orbit visual + the promise */}
        <div className="mt-10 grid lg:grid-cols-5 gap-6">
          {/* ThreeUI orbital sphere — one team in orbit around your business */}
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm min-h-[380px] lg:min-h-[400px] flex flex-col">
            <div className="absolute inset-0" aria-hidden="true">
              {reduced ? (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B2B5E]/60 to-[#101F45]/60" />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ filter: 'saturate(0.8)' }}
                >
                  <OrbitVisual
                    hue={-55}
                    speed={1.05}
                    className="absolute inset-0 h-full w-full pointer-events-none"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#101F45]/30 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#101F45]/80 to-transparent" />
            </div>
            <div className="relative p-8 lg:p-10">
              <p className="eyebrow mb-3 !text-[#7BB8E8]">Your business at the center</p>
              <h4 className="text-[22px] lg:text-[26px] font-bold text-[#EEF2FF] tracking-[-0.01em] mb-3 max-w-md">
                One team, five disciplines, all in orbit around you
              </h4>
              <p className="text-[14px] text-[#C8D6E5] leading-relaxed max-w-md">
                Strategy, consulting, design, development, and maintenance
                working as one accountable team. You never have to manage five
                vendors again.
              </p>
            </div>
            <div className="relative mt-auto px-8 lg:px-10 pb-8 flex flex-wrap gap-2">
              {disciplines.map((label) => (
                <span
                  key={label}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full border border-white/[0.12] text-[#C8D6E5]/90 bg-white/[0.06] backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* The promise */}
          <div className="lg:col-span-2 rounded-3xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm p-8 lg:p-10 flex flex-col">
            <p className="eyebrow mb-7 !text-[#7BB8E8]">Why brands trust us</p>
            <ul className="space-y-5">
              {promises.map((promise) => (
                <li key={promise} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full bg-[#7BB8E8]/20 text-[#7BB8E8] flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-[14.5px] text-[#EEF2FF]/90 leading-relaxed">
                    {promise}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold text-[#7BB8E8] hover:brightness-125 transition-all duration-200"
            >
              Start a project
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
