'use client'

const clients = [
  'Acme Corp',
  'Nova Labs',
  'Meridian',
  'Apex Digital',
  'Forge Studio',
  'Northwind',
  'Brightpath',
  'Cobalt & Co',
]

function ClientMark({ name }: { name: string }) {
  // Minimal geometric monogram mark — clean, professional, no fake logos
  const initial = name.charAt(0)
  return (
    <div className="flex items-center gap-3 opacity-45 hover:opacity-80 transition-opacity duration-300">
      <span className="w-7 h-7 rounded-md border border-[#1A2332]/30 flex items-center justify-center font-mono text-[12px] font-bold text-[#1A2332]/60">
        {initial}
      </span>
      <span className="text-[15px] font-semibold text-[#1A2332]/70 whitespace-nowrap tracking-tight">
        {name}
      </span>
    </div>
  )
}

export default function TrustBar() {
  const doubled = [...clients, ...clients]

  return (
    <section className="py-12 bg-white border-y border-[#E2E9F5] overflow-hidden" aria-label="Trusted by">
      <p className="text-[12px] font-medium text-[#5A6B82] uppercase tracking-[0.25em] text-center mb-8">
        Trusted by growing teams
      </p>
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div className="flex gap-14 items-center w-max animate-marquee">
          {doubled.map((client, i) => (
            <ClientMark key={`${client}-${i}`} name={client} />
          ))}
        </div>
      </div>
    </section>
  )
}
