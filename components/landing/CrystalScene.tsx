'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Environment, 
  Float, 
  MeshDistortMaterial, 
  Lightformer,
  ContactShadows
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// The glowing, cracked crystal
function Crystal() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={meshRef} position={[0, 2, 0]}>
        {/* Outer Glass Shell */}
        <mesh scale={1.2}>
          <icosahedronGeometry args={[2, 1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={1}
            metalness={0.1}
            roughness={0.1}
            ior={1.5}
            thickness={2}
            specularIntensity={1}
            specularColor="#ffffff"
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#0066FF"
            emissive="#00aaff"
            emissiveIntensity={2}
            wireframe={true}
          />
        </mesh>
        
        {/* Solid inner core to give the cracks contrast */}
        <mesh>
            <icosahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color="#020817" roughness={1} metalness={0.5} />
        </mesh>

        {/* Internal Light source */}
        <pointLight color="#00aaff" intensity={20} distance={10} />
      </group>
    </Float>
  )
}

// The dark, wavy ocean
function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 64, 64]} />
      <MeshDistortMaterial
        color="#01040a"
        roughness={0.1}
        metalness={0.8}
        distort={0.4}
        speed={1}
        bumpScale={0.05}
      />
    </mesh>
  )
}

export function CrystalScene() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#030712] z-0 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        {/* Lighting setup */}
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 10, 30]} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        {/* Environment reflections for the glass */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer intensity={4} color="#0066FF" position={[0, 10, -10]} scale={[10, 10, 1]} />
            <Lightformer intensity={2} color="#ffffff" position={[10, 0, -10]} scale={[10, 10, 1]} />
          </group>
        </Environment>

        <Crystal />
        <Ocean />
        
        <ContactShadows position={[0, -1.9, 0]} scale={20} blur={2} far={10} opacity={0.5} />

        {/* Post-processing for that cinematic glow */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={1.5}
            radius={0.4}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
