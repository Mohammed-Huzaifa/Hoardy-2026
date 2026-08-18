'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/**
 * TechWorld v6 — "bg video type" cinematic atmosphere, CLEAN edition.
 *
 * Feedback round 3: v5 was too busy (6 heavy fog blobs, 5 bright rays, 480
 * sparkles, harsh grid). v6 keeps the video feel (constant camera glide,
 * fog depth, light, drifting dust) but restrained: vignette depth, soft
 * grid, 4 gentle fog banks, 3 subtle rays, fine dust particles.
 * "Aesthetic and clean" = layers you notice slowly, not at once.
 */

const LIGHT = '#7BB8E8'
const GLOW = '#9FD0F2'

function makeGridTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')!
  g.clearRect(0, 0, 512, 512)
  g.strokeStyle = 'rgba(123, 184, 232, 0.3)'
  g.lineWidth = 1.5
  for (let i = 0; i <= 8; i++) {
    const p = (i / 8) * 512
    g.beginPath()
    g.moveTo(p, 0)
    g.lineTo(p, 512)
    g.stroke()
    g.beginPath()
    g.moveTo(0, p)
    g.lineTo(512, p)
    g.stroke()
  }
  // section lines glow subtly
  g.strokeStyle = 'rgba(159, 208, 242, 0.6)'
  g.lineWidth = 3
  for (let i = 0; i <= 2; i++) {
    const p = (i / 2) * 512
    g.beginPath()
    g.moveTo(p, 0)
    g.lineTo(p, 512)
    g.stroke()
    g.beginPath()
    g.moveTo(0, p)
    g.lineTo(512, p)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(12, 12)
  tex.anisotropy = 4
  return tex
}

function makeSoftTexture(rgb: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128)
  grad.addColorStop(0, rgb)
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

function makeRayTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 512
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, 'rgba(224, 240, 255, 0.8)')
  grad.addColorStop(0.6, 'rgba(159, 208, 242, 0.28)')
  grad.addColorStop(1, 'rgba(159, 208, 242, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 512)
  return new THREE.CanvasTexture(c)
}

/** Glowing perspective grid floor rushing toward the camera — softer v6. */
function GridFloor({ reducedMotion }: { reducedMotion: boolean }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const gridTex = useMemo(() => makeGridTexture(), [])

  useFrame((_, delta) => {
    if (matRef.current && !reducedMotion) {
      matRef.current.map!.offset.y -= delta * 0.35
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, -1.5]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial ref={matRef} map={gridTex} transparent opacity={0.55} depthWrite={false} />
    </mesh>
  )
}

/** Gentle fog banks — fewer, softer, drifting through depth. */
function FogLayers({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const texGlow = useMemo(() => makeSoftTexture('rgba(123, 184, 232, 0.35)'), [])
  const texBlue = useMemo(() => makeSoftTexture('rgba(74, 130, 196, 0.3)'), [])
  const texWhite = useMemo(() => makeSoftTexture('rgba(224, 240, 255, 0.25)'), [])

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      child.position.x += Math.sin(t * 0.1 + i * 2.1) * 0.002
      child.position.y += Math.cos(t * 0.08 + i * 1.4) * 0.0015
      child.position.z += Math.sin(t * 0.05 + i) * 0.001
    })
  })

  const blobs: {
    position: [number, number, number]
    scale: number
    opacity: number
    tex: THREE.CanvasTexture
  }[] = [
    { position: [-4.5, 0.6, -2.2], scale: 11.0, opacity: 0.45, tex: texGlow },
    { position: [4.2, -0.4, -1.8], scale: 11.5, opacity: 0.4, tex: texBlue },
    { position: [1.4, 1.9, -3.2], scale: 12.5, opacity: 0.38, tex: texWhite },
    { position: [-1.8, -1.2, -0.6], scale: 9.5, opacity: 0.42, tex: texBlue },
  ]

  return (
    <group ref={group}>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.position} scale={b.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={b.tex} transparent opacity={b.opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/** God rays — 3 subtle shafts, gentle sway, no harsh breathing. */
function LightRays({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const rayTex = useMemo(() => makeRayTexture(), [])

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.rotation.z = 0.06 + Math.sin(t * 0.15 + i * 1.9) * 0.04
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.14 + Math.sin(t * 0.2 + i * 2.4) * 0.04
    })
  })

  const rays: { position: [number, number, number]; scale: [number, number, number] }[] = [
    { position: [-2.6, 2.3, -2.0], scale: [0.5, 6.4, 1] },
    { position: [0.6, 2.6, -2.6], scale: [0.6, 7.2, 1] },
    { position: [3.4, 2.1, -1.8], scale: [0.45, 5.8, 1] },
  ]

  return (
    <group ref={group}>
      {rays.map((r, i) => (
        <mesh key={i} position={r.position} scale={r.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={rayTex} transparent opacity={0.16} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Camera rig — slow, smooth glide + pointer parallax (the video feel, calmed). */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const target = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    const hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    if (hover) window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    const gx = Math.sin(t * 0.14) * 0.4
    const gy = Math.cos(t * 0.1) * 0.22
    const gz = Math.sin(t * 0.06) * 0.3
    const px = target.current.x * 0.35
    const py = target.current.y * 0.2
    camera.position.x += (gx + px - camera.position.x) * 0.05
    camera.position.y += (1.3 + gy + py - camera.position.y) * 0.05
    camera.position.z += (5.4 + gz - camera.position.z) * 0.04
    camera.lookAt(0, 0.05, -1.4)
  })

  return null
}

function Scene() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  return (
    <>
      <GridFloor reducedMotion={reducedMotion} />
      <FogLayers reducedMotion={reducedMotion} />
      <LightRays reducedMotion={reducedMotion} />

      {/* Fine drifting dust — restrained */}
      <Sparkles count={150} scale={[15, 7, 8]} size={2.6} speed={0.3} opacity={0.5} color={LIGHT} />
      <Sparkles count={70} scale={[12, 5, 6]} size={2} speed={0.4} opacity={0.4} color={GLOW} />
      <Sparkles count={40} scale={[10, 3.5, 4.5]} size={1.6} speed={0.5} opacity={0.3} color="#EEF2FF" />

      <CameraRig reducedMotion={reducedMotion} />
    </>
  )
}

export default function TechWorld() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-full h-full bg-[#101F45]" aria-hidden="true" />
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.3, 5.4], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <fog attach="fog" args={['#101F45', 6.5, 15]} />
      <Scene />
    </Canvas>
  )
}
