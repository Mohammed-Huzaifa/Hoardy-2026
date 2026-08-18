'use client'

import dynamic from 'next/dynamic'

const TechWorld = dynamic(() => import('./TechWorld'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#7BB8E8]/25 to-[#1B2B5E]/20 animate-pulse" />
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
    <section
      id="top"
      className="relative min-h-screen bg-[#101F45] pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden"
    >
      {/* Cinematic living background — full-bleed */}
      <div className="absolute inset-0" aria-hidden="true">
        <TechWorld />
      </div>

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
              business forward — from concept to launch, with quality baked in.
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

          {/* Right column — scene lives full-bleed behind; chip floats here */}
          <div className="relative h-[340px] sm:h-[420px] lg:h-[540px]">
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
          <div className="flex flex-col items-center gap-2 text-[#C7D4EA]/70">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll to explore</span>
            <span className="block w-px h-10 bg-gradient-to-b from-[#7BB8E8] to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom fade back to the light page */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#F0F5FF] pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
