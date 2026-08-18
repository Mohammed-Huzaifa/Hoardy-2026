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
 */
export default function TechWorldLayer() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <TechWorld />
    </div>
  )
}
