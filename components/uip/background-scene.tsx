'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Scattered small dot particles
function ScatterDots() {
  const ref = useRef<THREE.Points>(null)
  const count = 60

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#c4c8d0" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

// A single wireframe floating shape
function WireframeShape({
  position,
  geometry,
  scale,
  speedY,
  speedRot,
  phase,
}: {
  position: [number, number, number]
  geometry: React.ReactNode
  scale: number
  speedY: number
  speedRot: number
  phase: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * speedY + phase) * 0.55
    ref.current.rotation.x += speedRot * 0.007
    ref.current.rotation.y += speedRot * 0.011
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshBasicMaterial color="#c0c4cc" wireframe transparent opacity={0.55} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      {/* Large icosahedron — left mid */}
      <WireframeShape
        position={[-7.5, 1.5, -3]}
        geometry={<icosahedronGeometry args={[1, 1]} />}
        scale={2.4}
        speedY={0.18}
        speedRot={0.9}
        phase={0}
      />

      {/* Medium icosahedron — right upper */}
      <WireframeShape
        position={[7.8, 1.8, -4]}
        geometry={<icosahedronGeometry args={[1, 1]} />}
        scale={1.6}
        speedY={0.14}
        speedRot={0.7}
        phase={1.5}
      />

      {/* Small diamond/octahedron — top center */}
      <WireframeShape
        position={[1.2, 5.5, -5]}
        geometry={<octahedronGeometry args={[1, 0]} />}
        scale={0.7}
        speedY={0.25}
        speedRot={1.3}
        phase={0.8}
      />

      {/* Torus — bottom left */}
      <WireframeShape
        position={[-5.5, -5.5, -2]}
        geometry={<torusGeometry args={[1, 0.38, 14, 28]} />}
        scale={1.5}
        speedY={0.13}
        speedRot={0.6}
        phase={2.2}
      />

      {/* Partial torus — right lower (slightly cropped by screen edge) */}
      <WireframeShape
        position={[9.2, -2.5, -3]}
        geometry={<torusGeometry args={[1, 0.38, 14, 28]} />}
        scale={1.8}
        speedY={0.16}
        speedRot={0.8}
        phase={3.1}
      />

      {/* Tiny accent dot/sphere — scattered */}
      <WireframeShape
        position={[4.5, -5.8, -2]}
        geometry={<icosahedronGeometry args={[1, 0]} />}
        scale={0.3}
        speedY={0.3}
        speedRot={1.8}
        phase={1.1}
      />

      <ScatterDots />
    </>
  )
}

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Clean light gray base */}
      <div
        className="absolute inset-0"
        style={{ background: '#f0f0f2' }}
      />
      <Canvas
        camera={{ position: [0, 0, 12], fov: 62 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
