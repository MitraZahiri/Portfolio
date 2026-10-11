import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { MASTERPIECES, TECH_ARTIFACTS, MUSEUM_ROOMS } from '../data/museumData'
import { audioEngine } from '../utils/audioEngine'

export default function MuseumCanvas({
  scrollProgress,
  onRoomChange,
  onExhibitSelect,
  isInspecting,
  inspectedExhibit,
}) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const frameIdRef = useRef(null)

  // Interaction & State references
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const cameraTargetZ = useRef(10)
  const currentCameraZ = useRef(10)
  const raycasterRef = useRef(new THREE.Raycaster())
  const interactiveObjectsRef = useRef([])
  const hoveredObjectRef = useRef(null)
  const activeRoomIndexRef = useRef(1)

  // Floating artifacts animations ref
  const artifactMeshesRef = useRef([])
  const particlesRef = useRef(null)
  const statueMeshRef = useRef(null)
  const cursorLightRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x08090d)
    scene.fog = new THREE.FogExp2(0x08090d, 0.015)

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    camera.position.set(0, 2.2, 10)

    // 2. High Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    })
    rendererRef.current = renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    container.appendChild(renderer.domElement)

    // 3. Texture Loader with Fallback
    const textureLoader = new THREE.TextureLoader()

    const loadTexture = (path, _fallbackColor = 0x22222a) => {
      return textureLoader.load(
        path,
        (tex) => {
          tex.generateMipmaps = true
          tex.minFilter = THREE.LinearMipmapLinearFilter
        },
        undefined,
        () => {
          // If texture load fails, return null or canvas fallback
          console.warn('Fallback texture used for:', path)
        }
      )
    }

    const marbleTexture = loadTexture('/exhibits/marble.jpg')
    if (marbleTexture) {
      marbleTexture.wrapS = THREE.RepeatWrapping
      marbleTexture.wrapT = THREE.RepeatWrapping
      marbleTexture.repeat.set(8, 60)
    }

    // 4. Ambient & Base Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1e29, 1.2)
    scene.add(ambientLight)

    // Dynamic Cursor Spotlight
    const cursorLight = new THREE.PointLight(0xffecd1, 2.8, 14, 1.5)
    cursorLight.position.set(0, 2.5, 8)
    scene.add(cursorLight)
    cursorLightRef.current = cursorLight

    // 5. Build Architectural Museum Halls
    buildMuseumArchitecture(scene, marbleTexture)

    // 6. Build Room 1: The Grand Rotunda & Oracle Statue
    buildGrandRotunda(scene, textureLoader)

    // 7. Build Room 2: The Masterpiece Gallery Frames
    buildMasterpiecesGallery(scene, textureLoader, interactiveObjectsRef)

    // 8. Build Room 3: The Hall of Artifacts Totems
    buildArtifactsHall(scene, artifactMeshesRef, interactiveObjectsRef)

    // 9. Build Room 4: Archive Vitrines & Chronicles
    buildArchiveHall(scene)

    // 10. Build Room 5: The Curator's Sanctuary Monolith
    buildSanctuaryHall(scene)

    // 11. Build Room 6: The VIP Salon Desk
    buildVIPSalonHall(scene)

    // 12. Atmospheric Light Particles
    buildDustParticles(scene, particlesRef)

    // Mouse Tracking Event Listeners
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = -(e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current.targetX = normX
      mouseRef.current.targetY = normY

      // Raycast for hover state on interactive artworks & artifacts
      raycasterRef.current.setFromCamera(
        new THREE.Vector2(normX, normY),
        cameraRef.current
      )

      const intersects = raycasterRef.current.intersectObjects(
        interactiveObjectsRef.current,
        true
      )

      if (intersects.length > 0) {
        let hitObject = intersects[0].object
        // Climb up to find data payload
        while (hitObject && !hitObject.userData.exhibitData && hitObject.parent) {
          hitObject = hitObject.parent
        }

        if (hitObject && hitObject.userData.exhibitData) {
          if (hoveredObjectRef.current !== hitObject) {
            hoveredObjectRef.current = hitObject
            container.style.cursor = 'pointer'
            audioEngine.playHoverTick()
          }
        }
      } else {
        if (hoveredObjectRef.current) {
          hoveredObjectRef.current = null
          container.style.cursor = 'default'
        }
      }
    }

    const handleClick = () => {
      if (hoveredObjectRef.current && hoveredObjectRef.current.userData.exhibitData) {
        const data = hoveredObjectRef.current.userData.exhibitData
        audioEngine.playExhibitFocus()
        onExhibitSelect(data)
      }
    }

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    // Main Render Loop
    let clock = new THREE.Clock()

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      // Cursor spotlight position
      if (cursorLightRef.current && cameraRef.current) {
        cursorLightRef.current.position.set(
          cameraRef.current.position.x + mouseRef.current.x * 3.5,
          cameraRef.current.position.y + mouseRef.current.y * 2.5,
          cameraRef.current.position.z - 3
        )
      }

      // Smooth camera position interpolation
      if (!isInspecting) {
        currentCameraZ.current += (cameraTargetZ.current - currentCameraZ.current) * 0.065

        // Smooth camera sway with mouse
        camera.position.x = mouseRef.current.x * 0.7
        camera.position.y = 2.1 + mouseRef.current.y * 0.35
        camera.position.z = currentCameraZ.current

        camera.rotation.y = -mouseRef.current.x * 0.08
        camera.rotation.x = mouseRef.current.y * 0.04
      } else if (inspectedExhibit && inspectedExhibit.wallPosition) {
        // Focus camera onto the inspected artwork with intimate gallery framing
        const targetX = inspectedExhibit.wallPosition.x > 0 ? 3.2 : -3.2
        const targetY = inspectedExhibit.wallPosition.y
        const targetZ = inspectedExhibit.wallPosition.z

        camera.position.x += (targetX - camera.position.x) * 0.06
        camera.position.y += (targetY - camera.position.y) * 0.06
        camera.position.z += (targetZ - camera.position.z) * 0.06

        camera.lookAt(
          inspectedExhibit.wallPosition.x,
          inspectedExhibit.wallPosition.y,
          inspectedExhibit.wallPosition.z
        )
      }

      // Rotate Oracle Statue
      if (statueMeshRef.current) {
        statueMeshRef.current.rotation.y = elapsedTime * 0.25
      }

      // Animate floating Artifact Relics
      artifactMeshesRef.current.forEach((item, idx) => {
        if (item.mesh) {
          item.mesh.rotation.x = elapsedTime * (0.4 + idx * 0.1)
          item.mesh.rotation.y = elapsedTime * (0.6 + idx * 0.08)
          item.mesh.position.y = item.baseY + Math.sin(elapsedTime * 1.5 + idx) * 0.18
        }
      })

      // Animate atmospheric dust particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.002
          if (positions[i + 1] > 6) positions[i + 1] = 0.5
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true
      }

      // Check current active room for HUD updates
      const currentZ = camera.position.z
      let currentRoom = MUSEUM_ROOMS[0]
      for (let i = 0; i < MUSEUM_ROOMS.length; i++) {
        const room = MUSEUM_ROOMS[i]
        const nextRoom = MUSEUM_ROOMS[i + 1]
        const nextZ = nextRoom ? nextRoom.zTarget : -999
        if (currentZ <= room.zTarget + 20 && currentZ > nextZ + 20) {
          currentRoom = room
          break
        }
      }

      if (currentRoom.index !== activeRoomIndexRef.current) {
        activeRoomIndexRef.current = currentRoom.index
        audioEngine.playTransitionChime(currentRoom.index)
        onRoomChange(currentRoom)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameIdRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove()
      }
      renderer.dispose()
    }
  }, [onRoomChange, onExhibitSelect, isInspecting, inspectedExhibit])

  // Sync scrollProgress to Camera Target Z
  useEffect(() => {
    if (isInspecting) return
    // Total museum rail length: Z starts at +10 and goes to -245
    const minZ = 10
    const maxZ = -245
    const targetZ = minZ + scrollProgress * (maxZ - minZ)
    cameraTargetZ.current = targetZ
  }, [scrollProgress, isInspecting])

  return (
    <div
      ref={mountRef}
      className="museum-canvas-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: isInspecting ? 'none' : 'auto',
      }}
    />
  )
}

// ==========================================
// 3D ARCHITECTURAL BUILDERS
// ==========================================

function buildMuseumArchitecture(scene, marbleTexture) {
  // 1. Long Dark Marble Floor Runway
  const floorGeo = new THREE.PlaneGeometry(16, 280)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c10,
    map: marbleTexture || null,
    roughness: 0.18,
    metalness: 0.45,
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, -115)
  floor.receiveShadow = true
  scene.add(floor)

  // Brass floor trim runners
  const trimGeo = new THREE.BoxGeometry(0.12, 0.04, 280)
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.9,
  })
  const leftTrim = new THREE.Mesh(trimGeo, trimMat)
  leftTrim.position.set(-6.8, 0.02, -115)
  scene.add(leftTrim)

  const rightTrim = new THREE.Mesh(trimGeo, trimMat)
  rightTrim.position.set(6.8, 0.02, -115)
  scene.add(rightTrim)

  // 2. High Museum Gallery Ceiling
  const ceilingGeo = new THREE.PlaneGeometry(16, 280)
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x08090d,
    roughness: 0.95,
  })
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, 6.5, -115)
  scene.add(ceiling)

  // 3. Gallery Walls (Left & Right)
  const wallGeo = new THREE.PlaneGeometry(280, 7)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x0e1017,
    roughness: 0.85,
    metalness: 0.05,
  })

  // Left Wall
  const leftWall = new THREE.Mesh(wallGeo, wallMat)
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-7, 3.5, -115)
  leftWall.receiveShadow = true
  scene.add(leftWall)

  // Right Wall
  const rightWall = new THREE.Mesh(wallGeo, wallMat)
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.set(7, 3.5, -115)
  rightWall.receiveShadow = true
  scene.add(rightWall)

  // 4. Architectural Portals & Fluted Pillars along the gallery
  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 6.5, 24)
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x141824,
    roughness: 0.5,
    metalness: 0.2,
  })

  const archPositions = [5, -20, -45, -70, -95, -120, -145, -170, -195, -220, -245]
  archPositions.forEach((zPos) => {
    // Left Pillar
    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat)
    leftPillar.position.set(-6.5, 3.25, zPos)
    scene.add(leftPillar)

    // Right Pillar
    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat)
    rightPillar.position.set(6.5, 3.25, zPos)
    scene.add(rightPillar)

    // Overhead Archway Beam
    const archBeamGeo = new THREE.BoxGeometry(14, 0.5, 0.8)
    const archBeam = new THREE.Mesh(archBeamGeo, pillarMat)
    archBeam.position.set(0, 6.2, zPos)
    scene.add(archBeam)

    // Warm museum downlight on arch
    const archLight = new THREE.PointLight(0xffecd1, 0.8, 12, 1.8)
    archLight.position.set(0, 5.8, zPos)
    scene.add(archLight)
  })
}

function buildGrandRotunda(scene, textureLoader) {
  // Rotunda circular marble medallion
  const medallionGeo = new THREE.RingGeometry(0.2, 5.5, 64)
  const medallionMat = new THREE.MeshStandardMaterial({
    color: 0x121520,
    roughness: 0.2,
    metalness: 0.8,
    side: THREE.DoubleSide,
  })
  const medallion = new THREE.Mesh(medallionGeo, medallionMat)
  medallion.rotation.x = -Math.PI / 2
  medallion.position.set(0, 0.015, 0)
  scene.add(medallion)

  // Concentric Gold Ring
  const goldRingGeo = new THREE.RingGeometry(5.4, 5.55, 64)
  const goldRingMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
    side: THREE.DoubleSide,
  })
  const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat)
  goldRing.rotation.x = -Math.PI / 2
  goldRing.position.set(0, 0.02, 0)
  scene.add(goldRing)

  // Central Monument Pedestal
  const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 1.2, 32)
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x0c0d12,
    roughness: 0.25,
    metalness: 0.8,
  })
  const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
  pedestal.position.set(0, 0.6, 0)
  pedestal.castShadow = true
  pedestal.receiveShadow = true
  scene.add(pedestal)

  // Pedestal Gold Plaque Trim
  const trimGeo = new THREE.TorusGeometry(1.62, 0.05, 16, 64)
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
  })
  const plaqueTrim = new THREE.Mesh(trimGeo, trimMat)
  plaqueTrim.rotation.x = Math.PI / 2
  plaqueTrim.position.set(0, 1.2, 0)
  scene.add(plaqueTrim)

  // Centerpiece Statue Texture / Mesh
  // Load generated high-res neoclassical statue
  textureLoader.load('/exhibits/statue.jpg', (tex) => {
    const statueGeo = new THREE.PlaneGeometry(2.6, 2.6)
    const statueMat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide,
    })
    const statue = new THREE.Mesh(statueGeo, statueMat)
    statue.position.set(0, 2.5, 0)
    scene.add(statue)
  })

  // Geometric Modern Oracle Crystal Core floating above pedestal
  const coreGeo = new THREE.OctahedronGeometry(0.85, 0)
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.1,
    metalness: 0.9,
    wireframe: true,
  })
  const core = new THREE.Mesh(coreGeo, coreMat)
  core.position.set(0, 2.5, 0)
  scene.add(core)

  // Inner glowing gem
  const innerGemGeo = new THREE.IcosahedronGeometry(0.5, 0)
  const innerGemMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xd4af37,
    emissiveIntensity: 0.6,
    roughness: 0.1,
  })
  const innerGem = new THREE.Mesh(innerGemGeo, innerGemMat)
  core.add(innerGem)

  // Dramatic Skylight Beam on Statue
  const spotlight = new THREE.SpotLight(0xfff7e6, 6.5, 20, Math.PI / 6, 0.45, 1)
  spotlight.position.set(0, 6.4, 0)
  spotlight.target = pedestal
  spotlight.castShadow = true
  scene.add(spotlight)
}

function buildMasterpiecesGallery(scene, textureLoader, interactiveObjectsRef) {
  MASTERPIECES.forEach((project) => {
    const group = new THREE.Group()
    group.position.set(
      project.wallPosition.x,
      project.wallPosition.y,
      project.wallPosition.z
    )
    group.rotation.set(...project.rotation)

    // Outer Gilded Museum Frame (Beveled Box)
    const frameGeo = new THREE.BoxGeometry(4.8, 3.0, 0.18)
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1a150e,
      roughness: 0.35,
      metalness: 0.85,
    })
    const frame = new THREE.Mesh(frameGeo, frameMat)
    group.add(frame)

    // Gold Bevel Rim
    const rimGeo = new THREE.BoxGeometry(4.86, 3.06, 0.04)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.95,
    })
    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.position.z = 0.08
    group.add(rim)

    // Artwork Canvas Mesh
    textureLoader.load(project.image, (tex) => {
      const canvasGeo = new THREE.PlaneGeometry(4.4, 2.6)
      const canvasMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.25,
        metalness: 0.1,
      })
      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat)
      canvasMesh.position.z = 0.11
      group.add(canvasMesh)
    })

    // Curatorial Brass Placard below frame
    const placardGeo = new THREE.PlaneGeometry(1.6, 0.38)
    const placardMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.9,
    })
    const placard = new THREE.Mesh(placardGeo, placardMat)
    placard.position.set(0, -1.8, 0.1)
    group.add(placard)

    // Spot lamp mounted above frame
    const lampArmGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6)
    const lampArmMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
    })
    const lampArm = new THREE.Mesh(lampArmGeo, lampArmMat)
    lampArm.rotation.x = Math.PI / 4
    lampArm.position.set(0, 1.8, 0.4)
    group.add(lampArm)

    // Dedicated Gallery SpotLight illuminating the painting
    const artSpot = new THREE.SpotLight(0xfff3db, 3.8, 8, Math.PI / 4, 0.3, 1.2)
    artSpot.position.set(0, 2.2, 1.4)
    artSpot.target = frame
    group.add(artSpot)

    // UserData for raycasting
    group.userData.exhibitData = project
    interactiveObjectsRef.current.push(frame)

    scene.add(group)
  })
}

function buildArtifactsHall(scene, artifactMeshesRef, interactiveObjectsRef) {
  TECH_ARTIFACTS.forEach((artifact) => {
    const group = new THREE.Group()
    group.position.set(...artifact.position)

    // Obsidian Pedestal
    const pedestalGeo = new THREE.BoxGeometry(1.2, 1.1, 1.2)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      roughness: 0.2,
      metalness: 0.7,
    })
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
    pedestal.position.y = 0.55
    group.add(pedestal)

    // Gold pedestal top trim
    const topTrimGeo = new THREE.BoxGeometry(1.26, 0.06, 1.26)
    const topTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
    })
    const topTrim = new THREE.Mesh(topTrimGeo, topTrimMat)
    topTrim.position.y = 1.12
    group.add(topTrim)

    // Glass vitrine enclosure
    const vitrineGeo = new THREE.BoxGeometry(1.1, 1.4, 1.1)
    const vitrineMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    })
    const vitrine = new THREE.Mesh(vitrineGeo, vitrineMat)
    vitrine.position.y = 1.85
    group.add(vitrine)

    // Floating 3D Sculpture Relic
    let relicGeo
    if (artifact.shape === 'icosahedron') {
      relicGeo = new THREE.IcosahedronGeometry(0.38, 0)
    } else if (artifact.shape === 'torus') {
      relicGeo = new THREE.TorusGeometry(0.32, 0.1, 16, 32)
    } else if (artifact.shape === 'octahedron') {
      relicGeo = new THREE.OctahedronGeometry(0.38, 0)
    } else {
      relicGeo = new THREE.DodecahedronGeometry(0.38, 0)
    }

    const relicMat = new THREE.MeshStandardMaterial({
      color: artifact.color,
      roughness: 0.15,
      metalness: 0.9,
      emissive: artifact.color,
      emissiveIntensity: 0.25,
    })
    const relic = new THREE.Mesh(relicGeo, relicMat)
    relic.position.y = 1.85
    group.add(relic)

    // Inner wireframe glow
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const wire = new THREE.Mesh(relicGeo, wireMat)
    relic.add(wire)

    // Dedicated spotlight
    const spot = new THREE.PointLight(artifact.glowColor, 1.8, 5, 2)
    spot.position.set(0, 2.2, 0)
    group.add(spot)

    // Register for animation & interaction
    artifactMeshesRef.current.push({
      mesh: relic,
      baseY: 1.85,
    })

    group.userData.exhibitData = {
      ...artifact,
      title: artifact.name,
      category: artifact.subtitle,
      leadQuote: artifact.symbol,
      image: null,
      isArtifact: true,
    }
    interactiveObjectsRef.current.push(vitrine)

    scene.add(group)
  })
}

function buildArchiveHall(scene) {
  // Archive Hall: Floating monolithic glass panels along the walls
  const archiveZPositions = [-130, -140, -150, -160]
  archiveZPositions.forEach((zPos, index) => {
    const isLeft = index % 2 === 0
    const xPos = isLeft ? -5.5 : 5.5

    const panelGeo = new THREE.BoxGeometry(2.8, 3.8, 0.1)
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x111420,
      roughness: 0.4,
      metalness: 0.6,
    })
    const panel = new THREE.Mesh(panelGeo, panelMat)
    panel.position.set(xPos, 2.2, zPos)
    panel.rotation.y = isLeft ? 0.3 : -0.3
    scene.add(panel)

    // Gold Year Banner on top
    const bannerGeo = new THREE.PlaneGeometry(2.4, 0.4)
    const bannerMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
    })
    const banner = new THREE.Mesh(bannerGeo, bannerMat)
    banner.position.set(0, 1.5, 0.08)
    panel.add(banner)

    // Accent uplight
    const uplight = new THREE.PointLight(0xd4af37, 1.2, 6, 2)
    uplight.position.set(xPos, 0.3, zPos)
    scene.add(uplight)
  })
}

function buildSanctuaryHall(scene) {
  // Sanctuary: Monumental Dark Obsidian Pillar with Golden Inscription
  const monolithGeo = new THREE.BoxGeometry(3.5, 5.2, 0.8)
  const monolithMat = new THREE.MeshStandardMaterial({
    color: 0x0b0d14,
    roughness: 0.1,
    metalness: 0.85,
  })
  const monolith = new THREE.Mesh(monolithGeo, monolithMat)
  monolith.position.set(0, 2.6, -190)
  scene.add(monolith)

  // Golden Inscription Plate
  const plateGeo = new THREE.PlaneGeometry(2.8, 3.8)
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.9,
  })
  const plate = new THREE.Mesh(plateGeo, plateMat)
  plate.position.set(0, 0, 0.42)
  monolith.add(plate)

  // Overhead dramatic spotlight
  const spot = new THREE.SpotLight(0xffecd1, 4.5, 12, Math.PI / 5, 0.2, 1)
  spot.position.set(0, 6.2, -188)
  spot.target = monolith
  scene.add(spot)
}

function buildVIPSalonHall(scene) {
  // VIP Salon: Curator's Reception Terminal Table
  const tableGeo = new THREE.BoxGeometry(4.2, 0.9, 1.4)
  const tableMat = new THREE.MeshStandardMaterial({
    color: 0x0c0d12,
    roughness: 0.2,
    metalness: 0.8,
  })
  const table = new THREE.Mesh(tableGeo, tableMat)
  table.position.set(0, 0.45, -235)
  scene.add(table)

  // Golden accent bar on table
  const barGeo = new THREE.BoxGeometry(4.24, 0.04, 1.44)
  const barMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
  })
  const bar = new THREE.Mesh(barGeo, barMat)
  bar.position.set(0, 0.92, -235)
  scene.add(bar)

  // Holographic guestbook console
  const consoleGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8)
  const consoleMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.4,
  })
  const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat)
  consoleMesh.rotation.x = -Math.PI / 8
  consoleMesh.position.set(0, 1.05, -235)
  scene.add(consoleMesh)

  // Warm salon chandelier light
  const salonLight = new THREE.PointLight(0xfff1d6, 2.5, 14, 1.8)
  salonLight.position.set(0, 4.8, -235)
  scene.add(salonLight)
}

function buildDustParticles(scene, particlesRef) {
  const particleCount = 450
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 14
    positions[i + 1] = Math.random() * 6 + 0.2
    positions[i + 2] = 10 - Math.random() * 260
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const mat = new THREE.PointsMaterial({
    color: 0xf5eedc,
    size: 0.04,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
  })

  const particles = new THREE.Points(geo, mat)
  scene.add(particles)
  particlesRef.current = particles
}
