'use client'

import dynamic from 'next/dynamic'

const TechWorld = dynamic(() => import('./TechWorld'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#101F45]" aria-hidden="true" />,
})

/**
 * TechWorldLayer — the "bg video for the whole page" layer.
 * Fixed, full-viewport, z-0: the living atmosphere stays put while content
 * scrolls over it. Sections above are translucent glass so it glows through.
 *
 * v6: a calm radial gradient + vignette sits OVER the canvas (pointer-events
 * none) so the scene stays deep at the edges and calm behind text areas —
 * "aesthetic and clean" rather than busy everywhere.
 */
export default function TechWorldLayer() {
  return (
    <div className="fixed inset-0 z-0 bg-[#101F45]" aria-hidden="true">
      <TechWorld />
      {/* Depth vignette + calm center: darkens edges, keeps mid calm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 35%, rgba(16,31,69,0) 40%, rgba(16,31,69,0.45) 78%, rgba(10,22,50,0.85) 100%)',
        }}
      />
    </div>
  )
}
