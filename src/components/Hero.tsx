'use client'

import dynamic from 'next/dynamic'

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#7BB8E8]/25 to-[#E2E9F5] animate-pulse" />
    </div>
  ),
})

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
  return (
    <section id="top" className="relative min-h-screen bg-[#F0F5FF] pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden">
      {/* Background: subtle grid + glow orbs */}
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-[#7BB8E8]/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -left-40 w-[480px] h-[480px] rounded-full bg-[#4A82C4]/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Left column */}
          <div>
            {/* Mono label — hand-crafted, not a template pill */}
            <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-[#4A82C4] mb-8">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7BB8E8] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A82C4]/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B2B5E]/40" />
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
                      color: word.highlight ? '#7BB8E8' : '#1A2332',
                    }}
                  >
                    {word.text}
                  </span>
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[18px] text-[#5A6B82] leading-relaxed max-w-xl mb-10">
              AI assistants. Product development. Web &amp; VR. hoardy.ai ships what moves your
              business forward — from concept to launch, with quality baked in.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#1B2B5E] text-[#EEF2FF] px-8 py-4 rounded-full text-[16px] font-semibold hover:bg-[#243A6E] hover:scale-[1.02] transition-all duration-300 shine group"
              >
                Start a project
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center border border-[#C8D6E5] bg-white/50 text-[#1A2332] px-8 py-4 rounded-full text-[16px] font-semibold hover:border-[#7BB8E8] hover:text-[#7BB8E8] hover:bg-white transition-all duration-300"
              >
                See our work
              </a>
            </div>

            {/* Stats row */}
            <dl className="grid grid-cols-3 gap-6 max-w-md">
              {stats.map((stat, i) => (
                <div key={stat.label} className={i > 0 ? 'border-l border-[#C8D6E5] pl-6' : ''}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-mono text-[22px] lg:text-[26px] font-bold text-[#1B2B5E]">
                    {stat.value}
                  </dd>
                  <dd className="text-[12px] text-[#5A6B82] mt-1 leading-snug">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right column — 3D scene */}
          <div className="relative h-[340px] sm:h-[420px] lg:h-[540px]">
            {/* Soft gradient ring behind the scene */}
            <div
              className="absolute inset-8 rounded-full bg-gradient-to-br from-[#7BB8E8]/20 via-[#F0F5FF] to-[#E2E9F5]/70 blur-2xl"
              aria-hidden="true"
            />
            <div className="absolute inset-0">
              <Hero3D />
            </div>

            {/* Floating glass chip — bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-2xl px-5 py-3.5 animate-float-slow">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4A82C4] mb-0.5">
                Currently shipping
              </p>
              <p className="text-[14px] font-semibold text-[#1A2332]">AI · Web · VR</p>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex items-center justify-center mt-6" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 text-[#5A6B82]/60">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll to explore</span>
            <span className="block w-px h-10 bg-gradient-to-b from-[#7BB8E8] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
