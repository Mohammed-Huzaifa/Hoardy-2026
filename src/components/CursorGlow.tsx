'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * CursorGlow — soft light-blue glow that trails the cursor.
 * Desktop / hover-capable devices only (hidden on touch via JS guard),
 * respects prefers-reduced-motion, pointer-events-none so it never blocks UI.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!hover.matches || reduced.matches) return
    setEnabled(true)

    let x = -200
    let y = -200
    let raf = 0

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const tick = () => {
      const el = glowRef.current
      if (el) {
        // Eased follow: 12% of remaining distance per frame
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const nx = cx + (x - cx) * 0.12
        const ny = cy + (y - cy) * 0.12
        el.style.transform = `translate(${nx - 250}px, ${ny - 250}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[5]"
      style={{
        background:
          'radial-gradient(circle, rgba(123,184,232,0.10) 0%, rgba(123,184,232,0.04) 40%, transparent 70%)',
      }}
      aria-hidden="true"
    />
  )
}
