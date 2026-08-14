'use client'
import { useInView } from '@/lib/utils'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We learn your business, users, and goals through deep discovery and stakeholder workshops. We leave with a shared truth.',
    detail: 'Stakeholder workshops · User interviews · Tech audit',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'We translate insight into product — information architecture, wireframes, and a design system your team will actually use.',
    detail: 'UX flows · Design system · Prototypes',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Rapid, iterative development with continuous feedback loops and weekly progress demos. No black boxes, no surprises.',
    detail: 'Sprint cadence · Weekly demos · CI/CD',
  },
  {
    number: '04',
    title: 'Launch & Maintain',
    description:
      'Production deployment, monitoring setup, and ongoing support. QA is embedded the whole way — not bolted on at the end.',
    detail: 'Deployment · Monitoring · Ongoing QA',
  },
]

export default function Process() {
  const { ref, inView } = useInView()

  return (
    <section id="process" className="relative py-24 lg:py-32 bg-[#1B2B5E] overflow-hidden">
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
        <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} mb-16 lg:mb-24`}>
          <p className="eyebrow mb-4 !text-[#7BB8E8]">How we work</p>
          <h2 className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold text-[#EEF2FF] tracking-[-0.02em] leading-[1.05] max-w-2xl">
            From concept to launch, <span className="text-[#7BB8E8]">together</span>
          </h2>
          <p className="mt-5 text-[17px] text-[#C8D6E5] max-w-xl leading-relaxed">
            A proven workflow that keeps your team in the loop at every stage — because
            trust is a feature.
          </p>
        </div>

        {/* Sticky stacked steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`reveal ${inView ? 'in-view' : ''} group relative rounded-2xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm p-8 lg:p-12 hover:bg-white/[0.07] hover:border-[#7BB8E8]/40 transition-all duration-500`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Number */}
                <span className="font-mono text-[13px] font-bold text-[#7BB8E8] tracking-widest lg:w-20 lg:pt-2">
                  {step.number}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[24px] lg:text-[30px] font-semibold text-[#EEF2FF] tracking-[-0.01em] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[15px] lg:text-[16px] text-[#C8D6E5] leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>

                {/* Detail tags */}
                <div className="lg:w-64 flex flex-wrap lg:flex-col lg:items-end gap-2">
                  {step.detail.split('·').map((item) => (
                    <span
                      key={item}
                      className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full border border-white/[0.12] text-[#C8D6E5]/80 group-hover:text-[#7BB8E8] group-hover:border-[#7BB8E8]/30 transition-colors duration-300"
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
