'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function Preloader() {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 300)
      }
    }
    rafId = requestAnimationFrame(tick)

    // Hard fallback: never trap the page behind the preloader
    const failsafe = setTimeout(() => setDone(true), 2800)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(failsafe)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#F0F5FF]"
          exit={{ x: '100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/hoardy-logo.png"
            alt="hoardyAI"
            width={3859}
            height={775}
            className="h-14 w-auto md:h-20"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.p
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#5A6B82]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Built for brands. Ready for agents.
          </motion.p>

          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-[#7BB8E8]"
            initial={{ width: '0%' }}
            animate={{ width: `${count}%` }}
            transition={{ ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
