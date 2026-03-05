'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SparkleParticles({ isTyping }: { isTyping: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = 24

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2
    const r = 0.3 + Math.random() * 0.4
    positions[i * 3] = Math.cos(theta) * r
    positions[i * 3 + 1] = Math.sin(theta) * r
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3
  }

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const speed = isTyping ? 3.2 : 0.8
    ref.current.rotation.z = t * speed * 0.4
    ref.current.rotation.y = t * speed * 0.2
    const scale = isTyping ? 1.15 : 1.0
    ref.current.scale.setScalar(scale)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#E03A3E" transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

export default function SparkleIcon({ isTyping = false }: { isTyping?: boolean }) {
  return (
    <div style={{ width: 28, height: 28, flexShrink: 0 }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 2], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1} />
        <pointLight position={[2, 2, 2]} color="#E03A3E" intensity={2} />
        <SparkleParticles isTyping={isTyping} />
      </Canvas>
    </div>
  )
}
