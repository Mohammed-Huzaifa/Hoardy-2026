'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Grid, Edges } from '@react-three/drei'
import * as THREE from 'three'

/**
 * TechWorld v2 — the "living, breathing world" hero background.
 *
 * Studied the Meng To / Opus-5 demo frame-by-frame (x.com/mengto/status/
 * 2089252548473688076). What makes it alive is NOT floating objects — it's a
 * LAYERED ENVIRONMENT with the camera sweeping through it:
 *   - big dark silhouettes at the edges (forest trunks in the demo) passing
 *     by as the camera orbits
 *   - atmospheric fog giving depth to a horizon
 *   - dense particles drifting in the air, pulled toward the pointer
 *   - CONSTANT camera motion (frame-to-frame diff up to 61%/1.5s)
 *
 * Rebuilt as a LIGHT-THEME tech canyon: navy data towers as edge silhouettes,
 * perspective grid floor, glowing horizon, 3-depth-layer particle field, and a
 * continuously orbiting camera + pointer coupling. Brand palette only.
 */

const FOG_COLOR = '#F0F5FF'

const PALETTE = [
  new THREE.Color('#1B2B5E'), // navy
  new THREE.Color('#4A82C4'), // blue-mid
  new THREE.Color('#7BB8E8'), // blue-light
  new THREE.Color('#5A6B82'), // slate
]

/**
 * Data tower — an architectural edge silhouette (the "tree trunk" analogue).
 * Stacked tech monoliths with a scanning light line, anchored near screen
 * edges and partially off-canvas so it reads as environment, not decoration.
 */
function DataTower({
  position,
  scale = 1,
  rotation = 0,
  accent = '#4A82C4',
}: {
  position: [number, number, number]
  scale?: number
  rotation?: number
  accent?: string
}) {
  const scanRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (scanRef.current) {
      const t = state.clock.elapsedTime
      scanRef.current.position.y = Math.sin(t * 1.4 + position[1]) * 1.6
    }
  })

  const boxes: { y: number; size: [number, number, number] }[] = [
    { y: 0.2, size: [0.62, 3.2, 0.62] },
    { y: 2.3, size: [0.42, 1.7, 0.42] },
    { y: 3.8, size: [0.28, 1.2, 0.28] },
  ]

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {boxes.map((b, i) => (
        <mesh key={i} position={[0, b.y, 0]}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#1B2B5E" roughness={0.32} metalness={0.15} transparent opacity={0.62} />
          <Edges scale={1.001} threshold={15} color="#7BB8E8" />
        </mesh>
      ))}
      {/* scanning light line */}
      <mesh ref={scanRef} position={[0, 0, 0.33]}>
        <planeGeometry args={[0.72, 0.07]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
      {/* antenna */}
      <mesh position={[0, 4.6, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.0, 6]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[0, 5.15, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  )
}

/**
 * Floating geometry at 3 depth layers (parallax): far = small/fogged/slow,
 * near = bigger/crisper/faster. Crisp wireframes + clay shapes only.
 * Balanced across the frame — the middle stays open to the horizon.
 */
function DepthShapes() {
  return (
    <>
      {/* FAR layer — recedes into fog */}
      <Float speed={2.2} rotationIntensity={1.4} floatIntensity={1.2}>
        <mesh position={[-2.7, 0.8, -2.4]} scale={0.5}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#7BB8E8" wireframe roughness={0.5} metalness={0.1} transparent opacity={0.55} />
        </mesh>
      </Float>
      <Float speed={1.9} rotationIntensity={1.1} floatIntensity={1.0}>
        <mesh position={[2.4, -0.3, -2.8]} scale={0.6}>
          <torusGeometry args={[0.6, 0.14, 16, 32]} />
          <meshStandardMaterial color="#4A82C4" roughness={0.4} metalness={0.2} />
        </mesh>
      </Float>

      {/* MID layer — the "hero" shapes, off the towers' line */}
      <Float speed={2.6} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh position={[1.45, 1.0, -0.9]} scale={0.75}>
          <torusKnotGeometry args={[0.6, 0.18, 140, 24]} />
          <meshStandardMaterial color="#1B2B5E" roughness={0.24} metalness={0.18} />
        </mesh>
      </Float>
      <Float speed={2.8} rotationIntensity={1.6} floatIntensity={1.5}>
        <mesh position={[2.2, -1.2, 0.0]} scale={0.55}>
          <octahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial color="#7BB8E8" flatShading roughness={0.3} metalness={0.1} />
        </mesh>
      </Float>
      <Float speed={2.4} rotationIntensity={1.0} floatIntensity={1.3}>
        <mesh position={[-1.5, -0.6, 0.3]} scale={0.7}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshPhysicalMaterial color="#EEF2FF" roughness={0.22} metalness={0.05} transmission={0.25} transparent opacity={0.85} />
        </mesh>
      </Float>

      {/* NEAR layer — fast, crisp, passes by like foreground */}
      <Float speed={3.4} rotationIntensity={2.0} floatIntensity={1.8}>
        <mesh position={[-2.6, -1.3, 1.2]} scale={0.5}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#4A82C4" flatShading roughness={0.35} metalness={0.08} />
        </mesh>
      </Float>
      <Float speed={3.8} rotationIntensity={1.8} floatIntensity={1.6}>
        <mesh position={[2.9, 0.7, 1.1]} scale={0.45}>
          <torusGeometry args={[0.55, 0.12, 16, 40]} />
          <meshStandardMaterial color="#1B2B5E" roughness={0.3} metalness={0.12} />
        </mesh>
      </Float>
      <Float speed={3.2} rotationIntensity={1.5} floatIntensity={1.7}>
        <mesh position={[0.2, 1.6, 0.8]} scale={0.4}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#7BB8E8" wireframe roughness={0.4} metalness={0.1} transparent opacity={0.7} />
        </mesh>
      </Float>
    </>
  )
}

/**
 * 3-depth-layer particle field (far + mid + near). All layers get pulled
 * toward the pointer (raycast onto z=0 plane), near layer moves fastest.
 */
function ParticleField({ reducedMotion }: { reducedMotion: boolean }) {
  const LAYERS = [
    { count: 380, spread: [7.2, 4.6, 4.2], zOff: -2.2, size: 0.035, opacity: 0.5, speedMul: 0.7 },
    { count: 420, spread: [6.6, 4.2, 2.6], zOff: -0.6, size: 0.05, opacity: 0.75, speedMul: 1.0 },
    { count: 220, spread: [6.0, 3.6, 1.6], zOff: 0.9, size: 0.07, opacity: 0.95, speedMul: 1.5 },
  ]
  const ref = useRef<THREE.Points>(null)
  const { camera, pointer } = useThree()

  const { positions, base, colors, phases, speeds, layerOf } = useMemo(() => {
    const total = LAYERS.reduce((s, l) => s + l.count, 0)
    const positions = new Float32Array(total * 3)
    const base = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const phases = new Float32Array(total)
    const speeds = new Float32Array(total)
    const layerOf = new Uint8Array(total)
    let idx = 0
    LAYERS.forEach((l, li) => {
      for (let i = 0; i < l.count; i++) {
        const x = (Math.random() - 0.42) * l.spread[0]
        const y = (Math.random() - 0.5) * l.spread[1]
        const z = (Math.random() - 0.5) * l.spread[2] + l.zOff
        positions[idx * 3] = x
        positions[idx * 3 + 1] = y
        positions[idx * 3 + 2] = z
        base[idx * 3] = x
        base[idx * 3 + 1] = y
        base[idx * 3 + 2] = z
        const c = PALETTE[idx % PALETTE.length]
        colors[idx * 3] = c.r
        colors[idx * 3 + 1] = c.g
        colors[idx * 3 + 2] = c.b
        phases[idx] = Math.random() * Math.PI * 2
        speeds[idx] = (0.8 + Math.random() * 1.2) * l.speedMul
        layerOf[idx] = li
        idx++
      }
    })
    return { positions, base, colors, phases, speeds, layerOf }
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

    const R = 3.0
    for (let i = 0; i < pos.length / 3; i++) {
      const ix = i * 3
      const sp = speeds[i]
      // fast idle drift — visible motion even without the pointer
      const fx = base[ix] + Math.sin(t * sp * 0.7 + phases[i]) * 0.28
      const fy = base[ix + 1] + Math.cos(t * sp * 0.55 + phases[i]) * 0.34
      const fz = base[ix + 2] + Math.sin(t * sp * 0.4 + phases[i] + 1.7) * 0.26
      let tx = fx
      let ty = fy
      let tz = fz
      if (haveHit.current) {
        const dx = mouseWorld.current.x - fx
        const dy = mouseWorld.current.y - fy
        const dz = mouseWorld.current.z - fz
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (d < R) {
          const pull = (1 - d / R) * (0.75 * (layerOf[i] === 2 ? 1.25 : 1))
          tx = fx + dx * pull
          ty = fy + dy * pull
          tz = fz + dz * pull
        }
      }
      const ease = 0.075 * (layerOf[i] === 2 ? 1.4 : 1)
      pos[ix] += (tx - pos[ix]) * ease
      pos[ix + 1] += (ty - pos[ix + 1]) * ease
      pos[ix + 2] += (tz - pos[ix + 2]) * ease
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
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
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

  const fitScale = Math.min(viewport.width / 6.4, viewport.height / 4.4, 1.05)

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

    // CONSTANT camera orbit — the scene never stops moving (the demo's core).
    // Faster sweep + z breathing + pointer offset, all eased snappily.
    const orbitX = Math.sin(t * 0.45) * 0.95
    const orbitY = Math.cos(t * 0.32) * 0.38
    const zoom = Math.sin(t * 0.22) * 0.35
    const px = target.current.x * 0.4
    const py = target.current.y * 0.24
    camera.position.x += (orbitX + px - camera.position.x) * 0.08
    camera.position.y += (orbitY + py - camera.position.y) * 0.08
    camera.position.z += (5.6 + zoom - camera.position.z) * 0.06
    camera.lookAt(0, 0.05, 0)

    // Scene group parallax: eases toward pointer direction
    const rx = target.current.x * 0.16
    const ry = target.current.y * 0.08
    group.current.rotation.y += (rx - group.current.rotation.y) * 0.06
    group.current.rotation.x += (ry - group.current.rotation.x) * 0.06
    group.current.rotation.z = Math.sin(t * 0.12) * 0.015

    // Scroll parallax
    const sy = typeof window !== 'undefined' ? window.scrollY : 0
    group.current.position.y = Math.min(sy * 0.0008, 0.6)
  })

  return (
    <group ref={group} scale={fitScale}>
      {/* Horizon glow — soft light band at the depth line */}
      <mesh position={[0, -0.9, -4.5]}>
        <circleGeometry args={[4.2, 48]} />
        <meshBasicMaterial color="#7BB8E8" transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, -1.1, -4.2]}>
        <circleGeometry args={[2.6, 48]} />
        <meshBasicMaterial color="#4A82C4" transparent opacity={0.12} />
      </mesh>

      {/* Perspective tech grid floor */}
      <Grid
        position={[0, -2.35, -0.8]}
        cellSize={0.6}
        cellThickness={0.7}
        cellColor="#B8CCE4"
        sectionSize={3.0}
        sectionThickness={1.2}
        sectionColor="#4A82C4"
        fadeDistance={13}
        fadeStrength={2.2}
        infiniteGrid
        followCamera={false}
      />

      {/* Edge silhouettes — the environment framing (forest trunks -> data towers) */}
      <DataTower position={[-3.4, -1.6, -0.5]} scale={1.25} rotation={0.2} />
      <DataTower position={[3.5, -1.8, -0.9]} scale={1.05} rotation={-0.16} accent="#7BB8E8" />
      <DataTower position={[-4.6, -1.2, -3.2]} scale={1.55} rotation={0.32} />

      {/* Parallax geometry at 3 depths */}
      <DepthShapes />

      {/* Dense particle field */}
      <ParticleField reducedMotion={reducedMotion} />
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
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {/* Atmospheric fog — deeper than v1 so layers separate */}
      <fog attach="fog" args={[FOG_COLOR, 5.5, 13]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.7} />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#7BB8E8" />
      <Scene />
    </Canvas>
  )
}
