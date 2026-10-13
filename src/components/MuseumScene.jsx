import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  useScroll,
  Float,
  Text,
  SpotLight,
  Sparkles,
} from '@react-three/drei'
import { EXHIBITS } from '../data/exhibitsData'

// ========================================================
// 1. CAMERA SCROLL & FLIGHT CONTROLLER (CameraRig)
// ========================================================
function CameraRig({ onScrollUpdate }) {
  const scroll = useScroll()

  useFrame((state, delta) => {
    // scroll.offset (0 to 1): Propels camera along Z-axis gallery depth
    const offset = scroll.offset
    const targetZ = 4 - offset * 52

    // Smooth camera interpolation (lerp / damp)
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      4,
      delta
    )

    // Subtle zero-gravity floating based on mouse parallax
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      state.pointer.x * 1.4,
      3,
      delta
    )
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      state.pointer.y * 0.9,
      3,
      delta
    )

    // Dynamic tilt angle
    state.camera.rotation.y = THREE.MathUtils.damp(
      state.camera.rotation.y,
      -state.pointer.x * 0.08,
      3,
      delta
    )
    state.camera.rotation.x = THREE.MathUtils.damp(
      state.camera.rotation.x,
      state.pointer.y * 0.05,
      3,
      delta
    )

    if (onScrollUpdate) {
      onScrollUpdate(offset, state.camera.position.z)
    }
  })

  return null
}

// ========================================================
// 2. ZERO-GRAVITY FLOATING EXHIBIT FRAME (ExhibitFrame)
// ========================================================
function ExhibitFrame({ exhibit, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const meshRef = useRef()
  const rimRef = useRef()

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Soft hover scaling effect
      const targetScale = hovered ? 1.06 : 1.0
      meshRef.current.scale.x = THREE.MathUtils.damp(
        meshRef.current.scale.x,
        targetScale,
        8,
        delta
      )
      meshRef.current.scale.y = THREE.MathUtils.damp(
        meshRef.current.scale.y,
        targetScale,
        8,
        delta
      )
      meshRef.current.scale.z = THREE.MathUtils.damp(
        meshRef.current.scale.z,
        targetScale,
        8,
        delta
      )
    }
  })

  return (
    <group
      ref={groupRef}
      position={exhibit.position}
      rotation={exhibit.rotation}
    >
      {/* Drei <Float>: Gentle floating glide in 3D void */}
      <Float
        speed={1.6}
        rotationIntensity={0.5}
        floatIntensity={0.9}
        floatingRange={[-0.15, 0.15]}
      >
        {/* Overhead Focused Artwork SpotLight */}
        <SpotLight
          position={[0, 3.5, 2.5]}
          angle={0.48}
          penumbra={0.7}
          intensity={hovered ? 7.5 : 4.0}
          distance={12}
          color={hovered ? exhibit.glowColor : '#ffffff'}
          castShadow
        />

        {/* Main Frame Mesh */}
        <group
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(exhibit)
          }}
        >
          {/* Outer Frame Chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.8, 2.5, 0.16]} />
            <meshStandardMaterial
              color="#0c0e15"
              roughness={0.25}
              metalness={0.85}
              emissive={hovered ? exhibit.color : '#05070d'}
              emissiveIntensity={hovered ? 0.8 : 0.05}
            />
          </mesh>

          {/* Gilded Bevel Edge Frame (Emissive Glow on Hover) */}
          <mesh ref={rimRef} position={[0, 0, 0.085]}>
            <boxGeometry args={[3.86, 2.56, 0.02]} />
            <meshStandardMaterial
              color={hovered ? exhibit.glowColor : '#22283a'}
              emissive={hovered ? exhibit.color : '#000000'}
              emissiveIntensity={hovered ? 2.8 : 0.0}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Monolithic Artwork Canvas */}
          <mesh position={[0, 0, 0.09]}>
            <planeGeometry args={[3.5, 2.2]} />
            <meshPhysicalMaterial
              color="#090a10"
              roughness={0.2}
              metalness={0.6}
              clearcoat={1}
              clearcoatRoughness={0.15}
              emissive={hovered ? exhibit.color : '#000000'}
              emissiveIntensity={hovered ? 0.35 : 0.0}
            />
          </mesh>

          {/* Orbiting Orbital Ring (Active on Hover) */}
          {hovered && (
            <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 0, 0.1]}>
              <ringGeometry args={[2.2, 2.23, 64]} />
              <meshBasicMaterial
                color={exhibit.glowColor}
                side={THREE.DoubleSide}
                transparent
                opacity={0.65}
              />
            </mesh>
          )}

          {/* 3D Exhibit Number */}
          <Text
            position={[-1.45, 0.85, 0.11]}
            fontSize={0.16}
            color={hovered ? exhibit.glowColor : '#8892b0'}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.2}
          >
            {`NO. ${exhibit.number}`}
          </Text>

          {/* 3D Exhibit Title */}
          <Text
            position={[0, 0.15, 0.12]}
            fontSize={0.34}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
          >
            {exhibit.title}
          </Text>

          {/* 3D Exhibit Subtitle */}
          <Text
            position={[0, -0.32, 0.12]}
            fontSize={0.13}
            color={hovered ? '#ffffff' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
            maxWidth={3.1}
            textAlign="center"
            letterSpacing={0.03}
          >
            {exhibit.subtitle}
          </Text>

          {/* 3D Category Badge */}
          <Text
            position={[0, -0.78, 0.12]}
            fontSize={0.095}
            color={exhibit.glowColor}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.22}
          >
            {exhibit.category}
          </Text>
        </group>
      </Float>
    </group>
  )
}

// ========================================================
// 3. MAIN 3D SCENE COMPONENT (MuseumScene)
// ========================================================
export default function MuseumScene({ onSelectExhibit, onScrollProgress }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#040508',
        zIndex: 1,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 52 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        shadows
      >
        {/* Infinite Depth Dark Atmosphere & Fog */}
        <color attach="background" args={['#040508']} />
        <fog attach="fog" args={['#040508', 3, 38]} />

        {/* Minimalist Ambient Light */}
        <ambientLight intensity={0.4} color="#0d111d" />

        {/* Floating Golden Atmospheric Sparkles */}
        <Sparkles
          count={220}
          scale={[28, 28, 70]}
          size={2.4}
          speed={0.35}
          color="#d4af37"
          opacity={0.5}
        />

        {/* Drei <ScrollControls>: Smooth scroll through Z-axis */}
        <ScrollControls pages={5} damping={0.25} distance={1}>
          <CameraRig onScrollUpdate={onScrollProgress} />

          {EXHIBITS.map((exhibit) => (
            <ExhibitFrame
              key={exhibit.id}
              exhibit={exhibit}
              onSelect={onSelectExhibit}
            />
          ))}
        </ScrollControls>
      </Canvas>
    </div>
  )
}
