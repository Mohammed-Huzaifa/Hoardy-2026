'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Grid } from '@react-three/drei'
import * as THREE from 'three'

/**
 * TechWorld — the "living, breathing world" hero background.
 *
 * Meng To / Opus-5 style scene (mouse-orbit 3D parallax + particles that
 * follow the pointer), rebuilt as a LIGHT-THEME tech landscape in the hoardy
 * brand palette: perspective grid floor, floating clay/wireframe geometry,
 * and a ~650-particle field that gets pulled toward the cursor.
 *
 * Light-theme-safe: transparent canvas over #F0F5FF, fog blends into the page
 * bg, particles use normal blending in navy/blue tones (additive white would
 * vanish on a light background).
 */

const BRAND = {
  navy: '#1B2B5E',
  navyDeep: '#14214A',
  blueMid: '#4A82C4',
  blueLight: '#7BB8E8',
  nearWhite: '#EEF2FF',
}

const PALETTE = [
  new THREE.Color(BRAND.navy),
  new THREE.Color(BRAND.blueMid),
  new THREE.Color(BRAND.blueLight),
  new THREE.Color('#5A6B82'),
]

type ShapeProps = {
  position: [number, number, number]
  scale?: number
  color: string
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

function ClayOctahedron({ position, scale = 1, color, wireframe }: ShapeProps) {
  return (
    <Float speed={1.5} rotationIntensity={1.3} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          flatShading
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  )
}

/**
 * Particle field, ~650 points, vertex-colored in the brand palette.
 * Each particle floats around a base position (idle life); when the pointer
 * is over the canvas, particles within radius R get pulled toward the
 * pointer's world position (raycast onto the z=0 plane), then spring back.
 * "Add particles to pointer" — the living-world signature.
 */
function PointerParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const COUNT = 650
  const ref = useRef<THREE.Points>(null)
  const { camera, pointer } = useThree()

  const { positions, base, colors, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const base = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const phases = new Float32Array(COUNT)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      // bias x toward the right so the field reads behind the right column
      const x = (Math.random() - 0.38) * 6.4
      const y = (Math.random() - 0.5) * 4.4
      const z = (Math.random() - 0.5) * 5 - 1.1
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
      const c = PALETTE[i % PALETTE.length]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = 0.4 + Math.random() * 0.8
    }
    return { positions, base, colors, phases, speeds }
  }, [])

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const mouseWorld = useRef(new THREE.Vector3(999, 999, 999))
  const haveHit = useRef(false)

  useFrame((state) => {
    const pts = ref.current
    if (!pts || reducedMotion) return
    const t = state.clock.elapsedTime
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute
    const pos = attr.array as Float32Array

    raycaster.setFromCamera(pointer, camera)
    haveHit.current = raycaster.ray.intersectPlane(plane, hit) !== null

    const R = 2.6
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const bx = base[ix]
      const by = base[ix + 1]
      const bz = base[ix + 2]
      // idle life: slow per-particle orbit around the base
      const fx = bx + Math.sin(t * speeds[i] * 0.5 + phases[i]) * 0.12
      const fy = by + Math.cos(t * speeds[i] * 0.4 + phases[i]) * 0.16
      const fz = bz + Math.sin(t * speeds[i] * 0.3 + phases[i] + 1.7) * 0.12
      let tx = fx
      let ty = fy
      let tz = fz
      if (haveHit.current) {
        const dx = mouseWorld.current.x - fx
        const dy = mouseWorld.current.y - fy
        const dz = mouseWorld.current.z - fz
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (d < R) {
          const pull = (1 - d / R) * 0.55
          tx = fx + dx * pull
          ty = fy + dy * pull
          tz = fz + dz * pull
        }
      }
      pos[ix] += (tx - pos[ix]) * 0.06
      pos[ix + 1] += (ty - pos[ix + 1]) * 0.06
      pos[ix + 2] += (tz - pos[ix + 2]) * 0.06
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

function Scene() {
  const group = useRef<THREE.Group>(null)
  const target = useRef({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const { viewport, camera } = useThree()

  // Fit the whole scene inside the visible frustum (right-biased content
  // spans ~4.8 world units wide; scale down on narrow canvases).
  const fitScale = Math.min(viewport.width / 4.8, viewport.height / 3.6, 1.0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    if (hover) window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (reducedMotion) return

    // Mouse-orbit parallax: scene group eases toward the pointer direction.
    const rx = target.current.x * 0.22
    const ry = target.current.y * 0.12
    group.current.rotation.y += (rx - group.current.rotation.y) * 0.04
    group.current.rotation.x += (ry - group.current.rotation.x) * 0.04
    // Gentle idle sway
    group.current.rotation.z = Math.sin(t * 0.08) * 0.02
    // Camera drift for depth ("orbit using mouse")
    camera.position.x += (target.current.x * 0.28 - camera.position.x) * 0.03
    camera.position.y += (target.current.y * 0.16 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
    // Scroll parallax
    const sy = typeof window !== 'undefined' ? window.scrollY : 0
    group.current.position.y = Math.min(sy * 0.0006, 0.5)
  })

  return (
    <group ref={group} scale={fitScale}>
      {/* Perspective tech grid floor — the "tech world" ground */}
      <Grid
        position={[0, -2.1, -0.5]}
        cellSize={0.55}
        cellThickness={0.6}
        cellColor="#C8D6E5"
        sectionSize={2.75}
        sectionThickness={1.1}
        sectionColor="#7BB8E8"
        fadeDistance={12}
        fadeStrength={2}
        infiniteGrid
        followCamera={false}
      />

      {/* Floating tech geometry — biased toward the right column */}
      <ClayTorusKnot position={[1.55, 0.85, -0.4]} scale={0.92} color={BRAND.navy} />
      <ClayIcosahedron position={[1.9, -0.75, 0.2]} scale={0.62} color={BRAND.blueLight} />
      <ClayTorus position={[-1.05, 0.95, -0.5]} scale={0.55} color={BRAND.blueMid} />
      <ClayOctahedron position={[2.15, 1.55, -0.9]} scale={0.5} color={BRAND.blueMid} wireframe />
      <ClaySphere position={[-0.55, -1.05, 0.3]} scale={0.62} color={BRAND.nearWhite} opacity={0.9} />
      <ClayIcosahedron position={[0.4, 1.6, -1.1]} scale={0.42} color={BRAND.blueLight} wireframe />
      <ClayOctahedron position={[-1.35, -0.55, 0.1]} scale={0.4} color={BRAND.navy} />
      <ClaySphere position={[2.0, -1.35, 0.4]} scale={0.32} color={BRAND.blueLight} opacity={0.75} />

      {/* Particles to pointer */}
      <PointerParticles reducedMotion={reducedMotion} />
    </group>
  )
}

export default function TechWorld() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-full h-full bg-[#F0F5FF]" aria-hidden="true" />
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {/* Fog blends distant geometry into the light page background */}
      <fog attach="fog" args={['#F0F5FF', 7, 15]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#7BB8E8" />
      <Scene />
    </Canvas>
  )
}
