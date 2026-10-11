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
// 1. KAMERA SCROLL VE UÇUŞ KONTROLCÜSÜ (CameraRig)
// ========================================================
function CameraRig({ onScrollUpdate }) {
  const scroll = useScroll()

  useFrame((state, delta) => {
    // scroll.offset (0 ile 1 arası): Kamerayı Z-ekseninde derinliklere uçurur
    const offset = scroll.offset
    const targetZ = 4 - offset * 52

    // Akıcı kamera interpolasyonu (lerp / damp)
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      4,
      delta
    )

    // Fare hareketine bağlı hafif yerçekimsiz süzülme (Mouse Parallax)
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

    // Kameranın baktığı açıya çok hafif dinamik eğim
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
// 2. YERÇEKİMSİZ SÜZÜLEN ESER ÇERÇEVESİ (ExhibitFrame)
// ========================================================
function ExhibitFrame({ exhibit, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const meshRef = useRef()
  const rimRef = useRef()

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Hover durumunda yumuşak yaylanma / büyüme efekti
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
      {/* Drei <Float>: Uzay boşluğunda yavaş süzülme ve hafif rotasyon */}
      <Float
        speed={1.6}
        rotationIntensity={0.5}
        floatIntensity={0.9}
        floatingRange={[-0.15, 0.15]}
      >
        {/* Dramatik Eser Spot Işığı: Çerçevenin üzerine odaklanır */}
        <SpotLight
          position={[0, 3.5, 2.5]}
          angle={0.48}
          penumbra={0.7}
          intensity={hovered ? 7.5 : 4.0}
          distance={12}
          color={hovered ? exhibit.glowColor : '#ffffff'}
          castShadow
        />

        {/* Ana Çerçeve Meshi */}
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
          {/* Dış Çerçeve Gövdesi */}
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

          {/* Parlayan Çerçeve Kenarlığı (Emissive Hover Efekti) */}
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

          {/* İç Sanat / Monolitik Tuval */}
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

          {/* Dönen Geometrik Yörünge Halkası (Hover olduğunda canlanır) */}
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

          {/* 3D Eser Numarası */}
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

          {/* 3D Eser Başlığı */}
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

          {/* 3D Alt Başlık / Tanım */}
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

          {/* 3D Kategori Etiketi */}
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
// 3. ANA 3D SAHNE BİLEŞENİ (MuseumScene)
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
        {/* Sonsuz Derinlik Veren Karanlık Arka Plan ve Sis */}
        <color attach="background" args={['#040508']} />
        <fog attach="fog" args={['#040508', 3, 38]} />

        {/* Minimalist ve Soğuk Ortam Işığı */}
        <ambientLight intensity={0.4} color="#0d111d" />

        {/* Uzay Boşluğunda Süzülen Mikro Kozmik Parçacıklar */}
        <Sparkles
          count={220}
          scale={[28, 28, 70]}
          size={2.4}
          speed={0.35}
          color="#d4af37"
          opacity={0.5}
        />

        {/* Drei <ScrollControls>: Fare tekerleğiyle Z ekseninde uçuş */}
        <ScrollControls pages={5} damping={0.25} distance={1}>
          {/* Kamerayı Z ekseni boyunca sürükleyen motor */}
          <CameraRig onScrollUpdate={onScrollProgress} />

          {/* 5 Özgün Portfolyo Eserinin Yerçekimsiz Boşluktaki Dizilimi */}
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
