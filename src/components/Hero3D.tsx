'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Hero3D — soft clay / geometric shapes in the hoardy brand palette.
 * Light-theme-safe, cursor-reactive rotation + scroll parallax.
 * AUTO-FITS to the canvas viewport: shapes are placed inside a group that
 * scales to `viewport.width / 4.3` so nothing ever clips at the edges,
 * regardless of container size or rotation swing.
 */

const BRAND = {
  navy: new THREE.Color('#1B2B5E'),
  navyDeep: new THREE.Color('#14214A'),
  blueMid: new THREE.Color('#4A82C4'),
  blueLight: new THREE.Color('#7BB8E8'),
  nearWhite: new THREE.Color('#EEF2FF'),
}

type ShapeProps = {
  position: [number, number, number]
  scale?: number
  color: THREE.Color
  roughness?: number
  metalness?: number
  wireframe?: boolean
  opacity?: number
}

function ClayTorusKnot({ position, scale = 1, color }: ShapeProps) {
  return (
    <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.2}>
      <mesh position={position} scale={scale}>
        <torusKnotGeometry args={[0.72, 0.22, 180, 28]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.12} />
      </mesh>
    </Float>
  )
}

function ClayIcosahedron({ position, scale = 1, color, wireframe }: ShapeProps) {
  return (
    <Float speed={1.8} rotationIntensity={1.1} floatIntensity={0.9}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.34}
          metalness={0.08}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  )
}

function ClayTorus({ position, scale = 1, color }: ShapeProps) {
  return (
    <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.0}>
      <mesh position={position} scale={scale} rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <torusGeometry args={[0.5, 0.16, 24, 48]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
    </Float>
  )
}

function ClaySphere({ position, scale = 1, color, opacity = 1 }: ShapeProps) {
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          metalness={0.05}
          transmission={opacity < 1 ? 0.25 : 0}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  const group = useRef<THREE.Group>(null)
  const target = useRef({ x: 0, y: 0 })
  const [pointerActive, setPointerActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const { viewport } = useThree()

  // Fit the whole scene inside the visible frustum: content spans ~4.3
  // world units wide; scale down whenever the canvas is narrower.
  const fitScale = Math.min(viewport.width / 4.3, viewport.height / 3.4, 1.02)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
      setPointerActive(true)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const t = state.clock.elapsedTime
    // Gentle idle drift (kept subtle so nothing swings out of frame)
    group.current.rotation.y = Math.sin(t * 0.12) * 0.3
    group.current.rotation.x = Math.cos(t * 0.1) * 0.1
    // Cursor coupling (desktop hover only) — eased, capped
    if (pointerActive) {
      group.current.rotation.y += (target.current.x * 0.35 - group.current.rotation.y) * 0.04
      group.current.rotation.x += (target.current.y * 0.22 - group.current.rotation.x) * 0.04
    }
    // Scroll parallax
    const sy = typeof window !== 'undefined' ? window.scrollY : 0
    group.current.position.y = Math.min(sy * 0.0006, 0.5)
  })

  return (
    <group ref={group} scale={fitScale}>
      {/* Core knot — navy */}
      <ClayTorusKnot position={[0, 0.15, 0]} scale={1.0} color={BRAND.navy} />
      {/* Floating companions — pulled inward (max |x| ≈ 1.35) */}
      <ClayIcosahedron position={[1.35, 0.95, -0.55]} scale={0.55} color={BRAND.blueLight} />
      <ClayTorus position={[-1.3, 0.85, -0.4]} scale={0.62} color={BRAND.blueMid} />
      <ClaySphere position={[-1.15, -0.95, 0.15]} scale={0.75} color={BRAND.nearWhite} opacity={0.9} />
      <ClayIcosahedron position={[1.3, -1.0, 0.1]} scale={0.45} color={BRAND.blueMid} wireframe />
      <ClaySphere position={[0.35, 1.4, -0.85]} scale={0.35} color={BRAND.blueLight} opacity={0.75} />
      {/* Ground shadow */}
      <mesh position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

export default function Hero3D() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#7BB8E8]/25 to-[#E2E9F5] animate-pulse" />
      </div>
    )
  }

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#7BB8E8" />
      <Scene />
    </Canvas>
  )
}
