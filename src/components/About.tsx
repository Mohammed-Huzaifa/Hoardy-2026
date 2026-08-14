'use client'
import { useInView } from '@/lib/utils'

const differentiators = [
  {
    title: 'Toronto-built, globally shipped',
    description:
      'Proudly Canadian, with a distributed team that delivers for clients across North America.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#7BB8E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" />
        <path d="M6 24 Q14 20 24 24 Q34 28 42 24" />
        <path d="M6 24 Q14 28 24 24 Q34 20 42 24" strokeOpacity="0.4" />
        <path d="M24 6 Q20 14 24 24 Q28 34 24 42" />
        <circle cx="24" cy="24" r="2.5" fill="#7BB8E8" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Full-stack from AI to VR',
    description:
      'Rare breadth: we build at every layer, from prompt engineering to spatial computing.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#7BB8E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="28" width="14" height="14" rx="3" />
        <rect x="27" y="28" width="14" height="14" rx="3" />
        <rect x="17" y="8" width="14" height="14" rx="3" />
        <path d="M15 28 L24 22 M33 28 L24 22" />
      </svg>
    ),
  },
  {
    title: 'Quality as infrastructure',
    description:
      "QA isn't an afterthought — it's embedded in our process through automated testing and continuous monitoring.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#7BB8E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6 L38 12 L38 24 C38 33 31 40 24 42 C17 40 10 33 10 24 L10 12 Z" />
        <path d="M17 24 L22 29 L31 18" />
      </svg>
    ),
  },
  {
    title: 'Agents, not just apps',
    description:
      'We design for the agentic era — autonomous workflows and AI assistants that do the work, not demos that impress.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="#7BB8E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="24" r="6" />
        <circle cx="34" cy="24" r="6" />
        <path d="M20 24 L28 24" strokeDasharray="2 3" />
        <path d="M8 12 L14 18 M8 36 L14 30" strokeOpacity="0.5" />
        <path d="M40 12 L34 18 M40 36 L34 30" strokeOpacity="0.5" />
      </svg>
    ),
  },
]

export default function About() {
  const { ref, inView } = useInView()

  return (
    <section id="about" className="py-24 lg:py-32 bg-[#F0F5FF]">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} mb-14 lg:mb-20`}>
          <p className="eyebrow mb-4">Why hoardy</p>
          <h2 className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold text-[#1A2332] tracking-[-0.02em] leading-[1.05] max-w-2xl">
            A boutique team with <span className="text-gradient">enterprise discipline</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className={`reveal ${inView ? 'in-view' : ''} grid grid-cols-1 md:grid-cols-2 gap-5`} style={{ transitionDelay: '120ms' }}>
          {differentiators.map((item, i) => (
            <div
              key={item.title}
              className={`group relative rounded-2xl border border-[#C8D6E5] bg-white p-8 lg:p-10 transition-all duration-500 hover:border-[#7BB8E8]/50 hover:shadow-[0_20px_50px_rgba(27,43,94,0.08)] hover:-translate-y-1 ${
                i === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#7BB8E8]/10 border border-[#7BB8E8]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#1A2332] mb-2.5 tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="text-[15px] text-[#5A6B82] leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
