'use client'
import { useInView } from '@/lib/utils'

export default function CTA() {
  const { ref, inView } = useInView()

  return (
    <section id="contact" className="relative py-28 lg:py-36 bg-[#1B2B5E]/90 backdrop-blur-md overflow-hidden">
      {/* Background: grid + glow orbs */}
      <div className="absolute inset-0 bg-grid-dark" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-[#7BB8E8]/15 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full bg-[#4A82C4]/15 blur-[110px]"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`reveal ${inView ? 'in-view' : ''} relative max-w-3xl mx-auto px-6 text-center`}
      >
        <p className="eyebrow mb-6 !text-[#7BB8E8]">Contact</p>
        <h2 className="text-[34px] sm:text-[42px] lg:text-[52px] font-bold text-[#EEF2FF] tracking-[-0.02em] leading-[1.05] mb-6">
          Ready to build something extraordinary?
        </h2>
        <p className="text-[17px] lg:text-[19px] text-[#C8D6E5] mb-12 max-w-xl mx-auto leading-relaxed">
          Tell us what you&apos;re trying to ship. We&apos;ll tell you the fastest way to get it
          to market, with quality baked in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:hello@hoardy.ai"
            className="inline-flex items-center gap-2 bg-[#7BB8E8] text-[#1B2B5E] px-10 py-4 rounded-full text-[17px] font-semibold hover:brightness-110 hover:scale-[1.04] transition-all duration-300 group shine"
          >
            Let&apos;s talk
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="mailto:hello@hoardy.ai"
            className="inline-flex items-center gap-2 border border-white/[0.2] text-[#EEF2FF] px-10 py-4 rounded-full text-[17px] font-semibold hover:border-[#7BB8E8] hover:text-[#7BB8E8] transition-all duration-300"
          >
            hello@hoardy.ai
          </a>
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-[#C8D6E5]/60">
          Typical response time: within one business day
        </p>
      </div>
    </section>
  )
}
