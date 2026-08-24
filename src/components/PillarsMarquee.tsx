/* Kinetic typography band — basement.studio-style giant outlined marquee.
   Carries the five disciplines as ambient design, not a section. */
const pillars = ['Strategy', 'Consulting', 'Design', 'Development', 'Maintenance']

export default function PillarsMarquee() {
  const half = [...pillars, ...pillars, ...pillars]
  return (
    <section
      aria-hidden="true"
      className="relative py-12 lg:py-16 bg-[#1B2B5E]/90 backdrop-blur-md border-y border-white/[0.06] overflow-hidden select-none"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {half.map((pillar, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-4 text-[40px] md:text-[68px] lg:text-[92px] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(238,242,255,0.22)] tracking-[-0.02em]">
                  {pillar}
                </span>
                <span className="px-5 text-[28px] md:text-[44px] lg:text-[56px] text-[#7BB8E8]/60 leading-none">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
