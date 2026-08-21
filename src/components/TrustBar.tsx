'use client'

const clients = [
  { name: 'Salt XC', src: '/logos/salt-xc.png' },
  { name: 'OpsGuru', src: '/logos/opsguru-logo.png' },
  { name: 'The Arden', src: '/logos/arden.png' },
  { name: 'Bud Light', src: '/logos/bud-light.png' },
  { name: 'Tim Hortons', src: '/logos/tim-hortons.png' },
  { name: 'Adidas SportsCheck', src: '/logos/adidas-sportscheck.png' },
  { name: 'Budweiser', src: '/logos/budweiser.png' },
  { name: "Welch's", src: '/logos/welchs.png' },
  { name: 'GE', src: '/logos/ge.png' },
  { name: 'Peace Tea', src: '/logos/peace-tea.png' },
  { name: 'Carbon60', src: '/logos/carbon60.png' },
  { name: 'Busch', src: '/logos/busch.png' },
  { name: 'McCain', src: '/logos/mccain.png' },
  { name: 'Michelob FIFA', src: '/logos/michelob-fifa.png' },
  { name: "Dick's", src: '/logos/dicks.png' },
  { name: 'Stella Artois', src: '/logos/stella-artois.png' },
  { name: 'Roger', src: '/logos/roger.png' },
  { name: 'HoopTea', src: '/logos/hooptea.png' },
  { name: 'Adidas Striker Lab', src: '/logos/adidas-striker-lab.png' },
  { name: 'Adidas GA Cup', src: '/logos/adidas-ga-cup.png' },
  { name: 'Brickworks Ciderhouse', src: '/logos/brickworks-ciderhouse.png' },
]

export default function TrustBar() {
  const doubled = [...clients, ...clients]

  return (
    <section className="py-12 bg-white/70 backdrop-blur-md border-y border-[#E2E9F5]/70 overflow-hidden" aria-label="Trusted by">
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
        <div className="flex gap-12 items-center w-max animate-marquee">
          {doubled.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex items-center shrink-0"
              title={client.name}
            >
              <img
                src={client.src}
                alt={client.name}
                className="h-10 w-auto max-w-[170px] object-contain md:h-12 md:max-w-[200px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
