'use client'
import { useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import dynamic from 'next/dynamic'

/* ThreeUI (Meng To's open-source three.js UI library) — CSS-free canvas component */
const HeroOrb = dynamic(
  () =>
    import('@designcodeio/threeui/components/OrbitalSphereBackground').then(
      (m) => m.OrbitalSphereBackground
    ),
  { ssr: false, loading: () => null }
)

const words = [
  { text: 'Built', highlight: true },
  { text: 'for', highlight: false },
  { text: 'brands.', highlight: false },
  { text: 'Ready', highlight: true },
  { text: 'for', highlight: false },
  { text: 'agents.', highlight: false },
]

const stats = [
  { value: '40+', label: 'Products shipped' },
  { value: '6', label: 'Disciplines, one team' },
  { value: '100%', label: 'QA-baked process' },
]

export default function Hero() {
  const orbRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // The 3D centerpiece leans toward the cursor (fine pointers only)
  const onOrbMove = (e: React.MouseEvent) => {
    const el = orbRef.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1100px) rotateY(${x * 14}deg) rotateX(${y * -10}deg)`
  }
  const onOrbLeave = () => {
    const el = orbRef.current
    if (el) el.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <section
      id="top"
      className="relative min-h-0 bg-transparent pt-32 lg:pt-40 pb-16 lg:pb-24 lg:min-h-screen overflow-hidden"
    >
      {/* Readability scrims: keep text crisp over the atmosphere */}
      <div
        className="hidden lg:block absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#101F45]/95 via-[#101F45]/75 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="lg:hidden absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#101F45]/95 via-[#101F45]/80 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left column */}
          <div>
            {/* Mono label */}
            <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-[#9FD0F2] mb-8">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7BB8E8] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A82C4]/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#EEF2FF]/50" />
              </span>
              Toronto-based tech agency
            </p>

            {/* Heading with staggered word animation */}
            <h1 className="text-[52px] sm:text-[64px] lg:text-[72px] font-bold leading-[0.98] tracking-[-0.03em] mb-6">
              {words.map((word, i) => (
                <span key={i}>
                  <span
                    className="word-animate"
                    style={{
                      animationDelay: `${0.15 + i * 0.12}s`,
                      color: word.highlight ? '#7BB8E8' : '#EEF2FF',
                    }}
                  >
                    {word.text}
                  </span>
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[18px] text-[#C7D4EA] leading-relaxed max-w-xl mb-10">
              AI assistants. Product development. Web &amp; VR. hoardy.ai ships what moves your
              business forward, from concept to launch, with quality baked in.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#7BB8E8] text-[#101F45] px-8 py-4 rounded-full text-[16px] font-semibold hover:bg-[#9FD0F2] hover:scale-[1.02] transition-all duration-300 shine group"
              >
                Start a project
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center border border-[#4A82C4]/60 bg-white/5 text-[#EEF2FF] px-8 py-4 rounded-full text-[16px] font-semibold hover:border-[#7BB8E8] hover:text-[#9FD0F2] hover:bg-white/10 transition-all duration-300"
              >
                See our work
              </a>
            </div>

            {/* Stats row */}
            <dl className="grid grid-cols-3 gap-6 max-w-md">
              {stats.map((stat, i) => (
                <div key={stat.label} className={i > 0 ? 'border-l border-[#4A82C4]/40 pl-6' : ''}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-mono text-[22px] lg:text-[26px] font-bold text-[#9FD0F2]">
                    {stat.value}
                  </dd>
                  <dd className="text-[12px] text-[#C7D4EA] mt-1 leading-snug">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right column — ThreeUI 3D centerpiece (desktop only; mobile has no spacer gap) */}
          <div
            className="hidden lg:block relative h-[540px]"
            aria-hidden="true"
            onMouseMove={onOrbMove}
            onMouseLeave={onOrbLeave}
          >
            <div
              ref={orbRef}
              className="absolute inset-0 flex items-center justify-center will-change-transform transition-transform duration-200 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Soft halo behind the sphere */}
              <div className="absolute w-[440px] h-[440px] rounded-full bg-[#7BB8E8]/10 blur-[110px]" />
              {!reduced && (
                <div
                  className="relative w-[360px] h-[360px]"
                  style={{ filter: 'saturate(0.85)' }}
                >
                  <HeroOrb
                    hue={-55}
                    speed={1.15}
                    scale={1.15}
                    className="absolute inset-0 h-full w-full pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex items-center justify-center mt-6" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 text-[#C7D4EA]/70">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll to explore</span>
            <span className="block w-px h-10 bg-gradient-to-b from-[#7BB8E8] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
