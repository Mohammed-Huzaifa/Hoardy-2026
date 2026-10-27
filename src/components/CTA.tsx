'use client'
import { useState } from 'react'
import { useInView } from '@/lib/utils'

/* Form backend: Web3Forms (https://web3forms.com) — free static-site form endpoint.
   NOTE: on the free plan the notification is delivered ONLY to the email address the
   access key was created with (recipient redirect / CC is a Pro feature). To send to
   maaz@hoardy.ai the key itself must be created at web3forms.com using that address. */
const FORM_ENDPOINT = 'https://api.web3forms.com/submit'
const FORM_ACCESS_KEY = '9eb35079-b098-40bb-a0f7-bd6ba69f5042'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full bg-[#EEF2FF] border border-[#C8D6E5] rounded-xl px-4 py-3 text-[15px] text-[#1A2332] placeholder:text-[#5A6B82] outline-none transition-colors duration-200 focus:border-[#4A82C4] focus:ring-2 focus:ring-[#7BB8E8]/45 shadow-[inset_0_1px_2px_rgba(16,31,69,0.07)]'
const labelClass = 'block font-mono text-[11px] uppercase tracking-[0.2em] text-[#7BB8E8] mb-2'

export default function CTA() {
  const { ref, inView } = useInView()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', botcheck: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.botcheck) return // honeypot: bots fill it, humans never see it

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_ACCESS_KEY,
          subject: `New project inquiry from ${form.name}${form.company ? ` (${form.company})` : ''}`,
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          botcheck: form.botcheck,
        }),
      })
      const data = await res.json()
      const ok = data.success === true || data.success === 'true'
      if (!res.ok || !ok) {
        throw new Error(data.message || 'Submission failed — please try again.')
      }
      setStatus('sent')
    } catch (err) {
      const raw = err instanceof Error ? err.message : ''
      setError(
        !raw || raw === 'Failed to fetch'
          ? 'We could not send your message right now — please try again in a moment.'
          : raw
      )
      setStatus('error')
    }
  }

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

        {status === 'sent' ? (
          <div className="max-w-xl mx-auto rounded-2xl border border-[#7BB8E8]/30 bg-white/[0.06] backdrop-blur-xl p-10">
            <div className="text-[#7BB8E8] mb-4 flex justify-center" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12.5 2.5 2.5L16 9.5" />
              </svg>
            </div>
            <p className="text-[22px] font-semibold text-[#EEF2FF] mb-2">Message sent — thank you!</p>
            <p className="text-[15px] text-[#C8D6E5] mb-6">
              We&apos;ll get back to you within one business day.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus('idle')
                setForm({ name: '', email: '', company: '', message: '', botcheck: '' })
              }}
              className="text-[14px] font-semibold text-[#7BB8E8] hover:text-[#EEF2FF] transition-colors duration-200"
            >
              Send another message →
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto rounded-2xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-xl p-6 sm:p-8 text-left shadow-[0_20px_60px_rgba(16,31,69,0.35)]"
          >
            {/* Honeypot — hidden from humans */}
            <input
              type="text"
              name="botcheck"
              value={form.botcheck}
              onChange={set('botcheck')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label htmlFor="cta-name" className={labelClass}>
                  Your name *
                </label>
                <input
                  id="cta-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Jane Cooper"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="cta-email" className={labelClass}>
                  Email *
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="jane@company.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="cta-company" className={labelClass}>
                Company <span className="normal-case tracking-normal text-[#C8D6E5]/50">(optional)</span>
              </label>
              <input
                id="cta-company"
                type="text"
                value={form.company}
                onChange={set('company')}
                placeholder="Company Inc."
                className={inputClass}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="cta-message" className={labelClass}>
                What are you trying to ship? *
              </label>
              <textarea
                id="cta-message"
                required
                rows={4}
                value={form.message}
                onChange={set('message')}
                placeholder="AI agents, a product build, QA for a launch, immersive web experience…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p role="alert" className="mb-5 text-[14px] text-[#FF9E9E] bg-[#FF9E9E]/10 border border-[#FF9E9E]/25 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1B2B5E] via-[#4A82C4] to-[#7BB8E8] text-[#EEF2FF] font-semibold px-8 py-4 text-[16px] hover:brightness-110 active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_30px_rgba(74,130,196,0.35)] focus-visible:ring-2 focus-visible:ring-[#9FD0F2] focus-visible:outline-none"
            >
              {status === 'sending' ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>Start the conversation</>
              )}
            </button>

            <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#C8D6E5]/60">
              Typical response time: within one business day
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
