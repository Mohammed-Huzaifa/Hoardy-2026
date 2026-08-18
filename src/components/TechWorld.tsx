'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/**
 * TechWorld v7 — "Aurora Flow" cinematic background.
 *
 * Founder: "you don't have any other cool and aesthetic 3D bg video? only
 * this you've got. use your best research tool and get me the best aesthetic
 * bg for my site."
 *
 * Research (Aug 2026): the aesthetic leaders for AI-brand backgrounds are
 * aurora flow-fields (silky fbm light curtains — OpenAI/Anthropic hero vibe),
 * KIKK-style particle swarms, and fluid sims. A custom GLSL aurora is the
 * most premium + cheapest (one shader plane): perpetual silky motion =
 * "bg video" feel, brand navy/blue palette, zero discrete elements.
 *
 * Layers: aurora shader plane (domain-warped fbm, brand ramp, soft vignette)
 * + fine drifting dust + slow camera glide. v6 grid/rays removed — cleaner.
 */

const LIGHT = '#7BB8E8'
const GLOW = '#9FD0F2'

const AURORA_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const AURORA_FRAG = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(vUv.x * aspect, vUv.y);
  float t = uTime * 0.045;

  // Domain warp — the silky curl
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, t * 0.7)));
  vec2 r = vec2(
    fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.15),
    fbm(p + 2.0 * q + vec2(8.3, 2.8) + t * 0.12)
  );
  float f = fbm(p + 2.5 * r);

  // Brand ramp: deep navy -> mid blue -> light -> glow
  vec3 c1 = vec3(0.063, 0.122, 0.271); // #101F45
  vec3 c2 = vec3(0.106, 0.169, 0.369); // #1B2B5E-ish deep
  vec3 c3 = vec3(0.290, 0.510, 0.769); // #4A82C4
  vec3 c4 = vec3(0.482, 0.722, 0.910); // #7BB8E8
  vec3 c5 = vec3(0.624, 0.816, 0.949); // #9FD0F2

  vec3 col = mix(c1, c2, smoothstep(0.15, 0.55, f));
  col = mix(col, c3, smoothstep(0.45, 0.85, f));
  col = mix(col, c4, smoothstep(0.7, 1.05, f * 1.25));
  col = mix(col, c5, smoothstep(0.95, 1.35, f * 1.5));

  // Soft radial falloff — keeps edges calm and deep
  float d = length((vUv - 0.5) * vec2(aspect, 1.0));
  col *= 1.0 - smoothstep(0.65, 1.05, d) * 0.55;

  gl_FragColor = vec4(col, 1.0);
}
`

/** Aurora — one full-frame shader plane, silky fbm light curtains. */
function Aurora({ reducedMotion }: { reducedMotion: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  )

  useFrame((state) => {
    if (!matRef.current || reducedMotion) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  // Sized to cover the frustum at z=-3.2, with margin for camera glide
  const w = viewport.width * 2.2
  const h = viewport.height * 2.2

  return (
    <mesh position={[0, 0, -3.2]}>
      <planeGeometry args={[w, h]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Camera rig — slow, smooth glide + pointer parallax (the video feel). */
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
      <Aurora reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />

      {/* Fine drifting dust — catches the light like airborne motes */}
      <Sparkles count={140} scale={[15, 7, 8]} size={2.2} speed={0.3} opacity={0.45} color={GLOW} />
      <Sparkles count={60} scale={[12, 5, 6]} size={1.7} speed={0.4} opacity={0.35} color={LIGHT} />
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
      <Scene />
    </Canvas>
  )
}
