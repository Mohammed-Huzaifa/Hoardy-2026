'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/**
 * TechWorld v5 — "bg video type" cinematic hero background.
 *
 * The reference (Meng To demo) reads as VIDEO because it's a DARK atmosphere:
 * fog banks, light rays, particles, a floor rushing by — all glowing against
 * deep tones, camera constantly gliding. Light-theme fog has no contrast, so
 * it read as a faint wash (v3/v4 measured 1-4% motion).
 *
 * v5: deep brand-navy cinematic scene (NOT near-black — honors the navy
 * anchor #1B2B5E / blue #4A82C4 / #7BB8E8 palette). Glowing perspective grid
 * rushing toward camera, volumetric fog banks drifting, bright light shafts,
 * dense rising particles, constant camera glide + pointer parallax. The hero
 * section fades back to the light page at its bottom edge.
 */

const LIGHT = '#7BB8E8'
const GLOW = '#9FD0F2'

function makeGridTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')!
  g.clearRect(0, 0, 512, 512)
  g.strokeStyle = 'rgba(123, 184, 232, 0.5)'
  g.lineWidth = 2
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
  // section lines glow brighter
  g.strokeStyle = 'rgba(159, 208, 242, 0.95)'
  g.lineWidth = 4
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
  grad.addColorStop(0, 'rgba(224, 240, 255, 0.95)')
  grad.addColorStop(0.6, 'rgba(159, 208, 242, 0.35)')
  grad.addColorStop(1, 'rgba(159, 208, 242, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 512)
  return new THREE.CanvasTexture(c)
}

/** Glowing perspective grid floor rushing toward the camera. */
function GridFloor({ reducedMotion }: { reducedMotion: boolean }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const gridTex = useMemo(() => makeGridTexture(), [])

  useFrame((_, delta) => {
    if (matRef.current && !reducedMotion) {
      matRef.current.map!.offset.y -= delta * 0.5
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, -1.5]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial ref={matRef} map={gridTex} transparent opacity={0.85} depthWrite={false} />
    </mesh>
  )
}

/** Volumetric fog banks — glowing blue clouds drifting through depth. */
function FogLayers({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const texGlow = useMemo(() => makeSoftTexture('rgba(123, 184, 232, 0.5)'), [])
  const texDeep = useMemo(() => makeSoftTexture('rgba(16, 31, 69, 0.85)'), [])
  const texBlue = useMemo(() => makeSoftTexture('rgba(74, 130, 196, 0.45)'), [])

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      child.position.x += Math.sin(t * 0.14 + i * 2.1) * 0.003
      child.position.y += Math.cos(t * 0.11 + i * 1.4) * 0.002
      child.position.z += Math.sin(t * 0.07 + i) * 0.0015
    })
  })

  const blobs: {
    position: [number, number, number]
    scale: number
    opacity: number
    tex: THREE.CanvasTexture
  }[] = [
    { position: [-4.8, 0.8, -2.4], scale: 9.0, opacity: 0.75, tex: texGlow },
    { position: [4.6, -0.2, -1.6], scale: 9.5, opacity: 0.7, tex: texDeep },
    { position: [1.6, 2.1, -3.4], scale: 10.5, opacity: 0.6, tex: texBlue },
    { position: [-2.4, -1.0, -0.4], scale: 7.5, opacity: 0.65, tex: texDeep },
    { position: [3.8, 1.6, -2.8], scale: 8.0, opacity: 0.55, tex: texGlow },
    { position: [-0.6, -1.6, -1.2], scale: 8.5, opacity: 0.6, tex: texBlue },
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

/** God rays — bright shafts from the top, swaying with breathing opacity. */
function LightRays({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const rayTex = useMemo(() => makeRayTexture(), [])

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.rotation.z = 0.1 + Math.sin(t * 0.2 + i * 1.9) * 0.07
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.22 + Math.sin(t * 0.28 + i * 2.4) * 0.08
    })
  })

  const rays: { position: [number, number, number]; scale: [number, number, number] }[] = [
    { position: [-2.8, 2.2, -1.8], scale: [0.5, 6.2, 1] },
    { position: [0.3, 2.5, -2.4], scale: [0.6, 7.0, 1] },
    { position: [3.2, 2.0, -1.6], scale: [0.45, 5.6, 1] },
    { position: [-4.6, 1.7, -0.8], scale: [0.38, 4.6, 1] },
    { position: [4.8, 1.4, -0.4], scale: [0.36, 4.2, 1] },
  ]

  return (
    <group ref={group}>
      {rays.map((r, i) => (
        <mesh key={i} position={r.position} scale={r.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={rayTex} transparent opacity={0.24} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Camera rig — constant glide + sway + pointer parallax (the video feel). */
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
    const gx = Math.sin(t * 0.18) * 0.55
    const gy = Math.cos(t * 0.13) * 0.3
    const gz = Math.sin(t * 0.08) * 0.4
    const px = target.current.x * 0.45
    const py = target.current.y * 0.26
    camera.position.x += (gx + px - camera.position.x) * 0.065
    camera.position.y += (1.35 + gy + py - camera.position.y) * 0.065
    camera.position.z += (5.2 + gz - camera.position.z) * 0.05
    camera.lookAt(0, 0.1, -1.2)
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

      {/* Dense glowing particle mist */}
      <Sparkles count={260} scale={[15, 7.5, 8]} size={3.4} speed={0.45} opacity={0.85} color={LIGHT} />
      <Sparkles count={140} scale={[12, 5.5, 6]} size={2.6} speed={0.6} opacity={0.75} color={GLOW} />
      <Sparkles count={80} scale={[10, 4, 4.5]} size={2} speed={0.75} opacity={0.6} color="#EEF2FF" />

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
      camera={{ position: [0, 1.35, 5.2], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <fog attach="fog" args={['#101F45', 6, 14]} />
      <Scene />
    </Canvas>
  )
}
