/**
 * ==============================================================================
 * MITRA ZAHIRI — DIGITAL MUSEUM
 * ==============================================================================
 * A high-end, 3D WebGL virtual gallery inspired by Sébastien Lempens.
 * Features:
 * - Monumental exterior museum plaza & facade with towering brutalist pillars.
 * - 3D walking character avatar strolling from outside into the grand interior.
 * - Modular drop-in architecture ready for custom 3D models (GLTF / GLB).
 * - Smooth scroll & drag rail with normalized wheel mechanics.
 * - Raycaster dossier interaction, Web Audio ambience, and GSAP animations.
 * 100% English. Completely eliminates PointerLock for effortless freedom.
 * ==============================================================================
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

// ==============================================================================
// 1. CURATED EXHIBIT & PROJECT DATA (100% ENGLISH)
// ==============================================================================
const EXHIBITS_DATA = [
  {
    id: 'ray-os',
    number: '01',
    title: 'RĀY OS',
    subtitle: 'AI-Powered Pocket Olfactory Scanner',
    desc: 'An embedded sensory scanner integrating micro-sensor arrays with on-device TinyML neural inference to digitize, analyze, and profile volatile aromatic compounds in real time.',
    tech: ['C++', 'ESP32', 'TinyML', 'Embedded Systems', 'Hardware Architecture'],
    curatorField: 'Embedded Systems & Sensory AI',
    position: { x: -4.5, y: 3.4, z: -14 },
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    color: '#10b981',
    glowColor: '#34d399',
    scrollProgress: 0.48,
    imageUrl: null,
  },
  {
    id: 'pooshoo',
    number: '02',
    title: 'PooSHoo',
    subtitle: 'Smart Hardware Device & Flutter Mobile Companion',
    desc: 'An automated pet-care hardware ecosystem paired with a cross-platform Flutter application, communicating over low-latency Bluetooth Low Energy (BLE) with telemetry sync.',
    tech: ['Flutter', 'Dart', 'BLE (Bluetooth)', 'IoT Hardware', 'UI/UX Design'],
    curatorField: 'Mobile Architecture & Physical IoT',
    position: { x: 4.5, y: 3.4, z: -26 },
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    color: '#f59e0b',
    glowColor: '#fbbf24',
    scrollProgress: 0.62,
    imageUrl: null,
  },
  {
    id: 'ideal-systems',
    number: '03',
    title: 'Ideal Systems',
    subtitle: 'Corporate Identity & Monolithic Logo Architecture',
    desc: 'A comprehensive branding system constructed around the geometric morphology of the letter "B", embodying structural precision, digital perspective lines, and scalable design tokens.',
    tech: ['Adobe Illustrator', 'Brand Identity', 'Vector Geometry', 'Grid Systems'],
    curatorField: 'Vector Identity & Typography',
    position: { x: -4.5, y: 3.4, z: -38 },
    rotation: { x: 0, y: Math.PI / 3.5, z: 0 },
    color: '#3b82f6',
    glowColor: '#60a5fa',
    scrollProgress: 0.76,
    imageUrl: null,
  },
  {
    id: 'windmill-brand',
    number: '04',
    title: 'Windmill Brand',
    subtitle: 'Modern Corporate Identity & Artisan Packaging',
    desc: 'A timeless identity bridging heritage artisan aesthetics with contemporary minimalism, translating kinetic rotational momentum into abstract geometric emblems and sustainable packaging kits.',
    tech: ['Logo Design', 'Visual Identity', 'Typography', 'Minimalism'],
    curatorField: 'Abstract Geometry & Editorial Craft',
    position: { x: 4.5, y: 3.4, z: -50 },
    rotation: { x: 0, y: -Math.PI / 3.5, z: 0 },
    color: '#ec4899',
    glowColor: '#f472b6',
    scrollProgress: 0.88,
    imageUrl: null,
  },
  {
    id: 'karekok-publications',
    number: '05',
    title: 'Karekok Publications',
    subtitle: 'National Exam Prep Book Cover Series (TYT / AYT / LGS)',
    desc: 'A flagship textbook cover collection reaching millions of students nationwide, featuring stark high-contrast typography, mathematical tessellation art, and vibrant modular color coding.',
    tech: ['Cover Design', 'Editorial Grid', 'Color Theory', 'Print Production'],
    curatorField: 'Educational Publishing & Large-Scale Print',
    position: { x: 0, y: 3.4, z: -64 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#d4af37',
    glowColor: '#fef08a',
    scrollProgress: 1.0,
    imageUrl: null,
  },
];

// ==============================================================================
// 2. THREE.JS SCENE, CAMERA, & RENDERER SETUP
// ==============================================================================
const container = document.getElementById('webgl-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050609);
scene.fog = new THREE.FogExp2(0x050609, 0.026);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Initial camera position outside in the grand plaza
camera.position.set(0, 2.2, 44);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(renderer.domElement);

// ==============================================================================
// 3. MONUMENTAL EXTERIOR ARCHITECTURE & PLAZA
// ==============================================================================
// Ambient Cool Night Skylight
const ambientLight = new THREE.AmbientLight(0x101524, 0.65);
scene.add(ambientLight);

// 1. Exterior Stone Plaza Floor (Z = 52 down to Z = 22, Y = 0)
const plazaFloorGeo = new THREE.PlaneGeometry(48, 32);
const plazaFloorMat = new THREE.MeshStandardMaterial({
  color: 0x0a0c14,
  roughness: 0.35,
  metalness: 0.6,
});
const plazaFloor = new THREE.Mesh(plazaFloorGeo, plazaFloorMat);
plazaFloor.rotation.x = -Math.PI / 2;
plazaFloor.position.set(0, 0, 36);
plazaFloor.receiveShadow = true;
scene.add(plazaFloor);

// Plaza Guideline Brass Inlays
[-6, 0, 6].forEach((x) => {
  const runner = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.02, 28),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.9 })
  );
  runner.position.set(x, 0.01, 36);
  scene.add(runner);
});

// 2. Grand Entrance Stone Steps (Z = 22 to Z = 13, Y ascends from 0.0 to 1.2)
const stepCount = 8;
const stepDepth = (22 - 13) / stepCount;
const stepHeight = 1.2 / stepCount;

for (let i = 0; i < stepCount; i++) {
  const stepGeo = new THREE.BoxGeometry(26, stepHeight * (i + 1), stepDepth);
  const stepMat = new THREE.MeshStandardMaterial({
    color: 0x0c0f18,
    roughness: 0.4,
    metalness: 0.5,
  });
  const stepMesh = new THREE.Mesh(stepGeo, stepMat);
  stepMesh.position.set(
    0,
    (stepHeight * (i + 1)) / 2,
    22 - i * stepDepth - stepDepth / 2
  );
  stepMesh.receiveShadow = true;
  stepMesh.castShadow = true;
  scene.add(stepMesh);

  // Gilded Step Nosing Strip
  const nosing = new THREE.Mesh(
    new THREE.BoxGeometry(26.1, 0.02, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.95 })
  );
  nosing.position.set(
    0,
    stepHeight * (i + 1) + 0.01,
    22 - i * stepDepth - stepDepth
  );
  scene.add(nosing);
}

// 3. Colossal Brutalist Entrance Pillars (Z = 13, Y = 1.2 to 26)
const pillarMat = new THREE.MeshStandardMaterial({
  color: 0x0e111a,
  roughness: 0.65,
  metalness: 0.45,
});

const pillarPositionsX = [-12, -5.5, 5.5, 12];
pillarPositionsX.forEach((px) => {
  const pillar = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 25, 2.6),
    pillarMat
  );
  pillar.position.set(px, 1.2 + 12.5, 13);
  pillar.castShadow = true;
  pillar.receiveShadow = true;
  scene.add(pillar);

  // Architectural Ground Uplight shooting beams up each pillar
  const uplight = new THREE.SpotLight(0xffecd1, 16, 28, Math.PI / 5, 0.5, 1.2);
  uplight.position.set(px, 1.3, 15);
  uplight.target = pillar;
  scene.add(uplight.target);
  scene.add(uplight);
});

// 4. Monumental Museum Entablature / Upper Header Facade (Y = 22 to 28, Z = 13)
const entablatureGeo = new THREE.BoxGeometry(32, 6.5, 3.2);
const entablature = new THREE.Mesh(entablatureGeo, pillarMat);
entablature.position.set(0, 24.5, 13);
entablature.castShadow = true;
scene.add(entablature);

// Procedural Gilded Inscription Plaque on Facade
function createFacadeHeaderCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#080a12';
  ctx.fillRect(0, 0, 2048, 512);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 2048 - 60, 512 - 60);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 96px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('M I T R A   Z A H I R I', 1024, 210);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 44px "Space Grotesk", monospace';
  ctx.fillText('MUSEUM OF SPATIAL COMPUTING & ARCHITECTURE', 1024, 320);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const facadePlaque = new THREE.Mesh(
  new THREE.PlaneGeometry(22, 5.2),
  new THREE.MeshStandardMaterial({
    map: createFacadeHeaderCanvas(),
    roughness: 0.3,
    metalness: 0.8,
  })
);
facadePlaque.position.set(0, 24.5, 14.65);
scene.add(facadePlaque);

// 5. Monumental Glass & Brass Portal (Z = 13)
// Smoked Glass Wall
const glassWallMat = new THREE.MeshPhysicalMaterial({
  color: 0x111624,
  transmission: 0.75,
  opacity: 0.85,
  transparent: true,
  roughness: 0.1,
  metalness: 0.2,
  ior: 1.5,
});
const glassWall = new THREE.Mesh(new THREE.PlaneGeometry(28, 18), glassWallMat);
glassWall.position.set(0, 10, 13);
scene.add(glassWall);

// Giant Brass Portal Archway
const portalFrame = new THREE.Mesh(
  new THREE.BoxGeometry(5.8, 8.2, 0.4),
  new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
  })
);
portalFrame.position.set(0, 1.2 + 4.1, 13);
scene.add(portalFrame);

const portalOpening = new THREE.Mesh(
  new THREE.BoxGeometry(5.0, 7.8, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x050609 })
);
portalOpening.position.set(0, 1.2 + 3.9, 13);
scene.add(portalOpening);

// Volumetric Beam streaming out of the portal into the plaza
const portalBeam = new THREE.SpotLight(0xffe8c2, 18, 22, Math.PI / 4, 0.7, 1);
portalBeam.position.set(0, 6, 11);
portalBeam.target.position.set(0, 0, 24);
scene.add(portalBeam.target);
scene.add(portalBeam);

// ==============================================================================
// 4. INTERIOR ROTUNDA & EXHIBITION HALLWAY (Z = 13 down to -75, Y = 1.2)
// ==============================================================================
// Reflective Obsidian Interior Runway Floor
const interiorFloorGeo = new THREE.PlaneGeometry(36, 95);
const interiorFloorMat = new THREE.MeshStandardMaterial({
  color: 0x07090e,
  roughness: 0.12, // Wet obsidian sheen
  metalness: 0.88,
});
const interiorFloor = new THREE.Mesh(interiorFloorGeo, interiorFloorMat);
interiorFloor.rotation.x = -Math.PI / 2;
interiorFloor.position.set(0, 1.2, -34);
interiorFloor.receiveShadow = true;
scene.add(interiorFloor);

// Interior Vaulted Ceiling
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(36, 95),
  new THREE.MeshStandardMaterial({ color: 0x030406, roughness: 0.95 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 8.6, -34);
scene.add(ceiling);

// Interior Brass Runner Rails
[-4.8, 0, 4.8].forEach((posX) => {
  const guide = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.02, 90),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.95 })
  );
  guide.position.set(posX, 1.21, -34);
  scene.add(guide);
});

// Rotunda Circular Gold Ring (at Z = 0)
const rotundaRingGeo = new THREE.RingGeometry(3.6, 3.68, 64);
const rotundaRingMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.95,
  side: THREE.DoubleSide,
});
const rotundaRing = new THREE.Mesh(rotundaRingGeo, rotundaRingMat);
rotundaRing.rotation.x = -Math.PI / 2;
rotundaRing.position.set(0, 1.22, 0);
scene.add(rotundaRing);

// Warm Skylight Beam at Rotunda
const rotundaSpot = new THREE.SpotLight(0xffecd1, 7.5, 18, Math.PI / 4, 0.6, 1);
rotundaSpot.position.set(0, 8.2, 0);
rotundaSpot.target.position.set(0, 1.2, 0);
scene.add(rotundaSpot.target);
scene.add(rotundaSpot);

// Floating Atmospheric Dust Particles throughout World
const particleCount = 550;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  particlePositions[i] = (Math.random() - 0.5) * 32;
  particlePositions[i + 1] = Math.random() * 8.5 + 0.4;
  particlePositions[i + 2] = 45 - Math.random() * 120;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0xd4af37,
  size: 0.04,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
});
const dustParticles = new THREE.Points(particleGeo, particleMat);
scene.add(dustParticles);

// ==============================================================================
// 5. 3D VISITOR AVATAR (WALKING ENGINE + DROP-IN 3D MODEL SLOT)
// ==============================================================================
const avatarRoot = new THREE.Group();
scene.add(avatarRoot);

// Stylized architectural mannequin group
const proceduralAvatarGroup = new THREE.Group();
avatarRoot.add(proceduralAvatarGroup);

const mannequinMat = new THREE.MeshStandardMaterial({
  color: 0x141824,
  roughness: 0.35,
  metalness: 0.75,
});
const goldAccentMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.95,
  emissive: 0xd4af37,
  emissiveIntensity: 0.2,
});

// Pelvis & Torso
const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.18, 16), mannequinMat);
pelvis.position.y = 0.92;
proceduralAvatarGroup.add(pelvis);

const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.22), mannequinMat);
torso.position.y = 1.22;
torso.castShadow = true;
proceduralAvatarGroup.add(torso);

const spineGold = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.23), goldAccentMat);
spineGold.position.set(0, 1.22, 0.01);
proceduralAvatarGroup.add(spineGold);

// Head & Visor
const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), mannequinMat);
head.position.y = 1.56;
head.castShadow = true;
proceduralAvatarGroup.add(head);

const visor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.045, 0.12), goldAccentMat);
visor.position.set(0, 1.56, -0.08); // Facing -Z towards museum
proceduralAvatarGroup.add(visor);

// Legs & Walk Pivots
const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.11, 0.88, 0);
proceduralAvatarGroup.add(leftLegPivot);

const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.44, 12), mannequinMat);
leftThigh.position.y = -0.22;
leftThigh.castShadow = true;
leftLegPivot.add(leftThigh);

const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.42, 12), mannequinMat);
leftShin.position.set(0, -0.62, 0.02);
leftShin.castShadow = true;
leftLegPivot.add(leftShin);

const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.16), goldAccentMat);
leftFoot.position.set(0, -0.84, -0.04);
leftLegPivot.add(leftFoot);

const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.11, 0.88, 0);
proceduralAvatarGroup.add(rightLegPivot);

const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.44, 12), mannequinMat);
rightThigh.position.y = -0.22;
rightThigh.castShadow = true;
rightLegPivot.add(rightThigh);

const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.42, 12), mannequinMat);
rightShin.position.set(0, -0.62, 0.02);
rightShin.castShadow = true;
rightLegPivot.add(rightShin);

const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.16), goldAccentMat);
rightFoot.position.set(0, -0.84, -0.04);
rightLegPivot.add(rightFoot);

// Arms
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.24, 1.36, 0);
proceduralAvatarGroup.add(leftArmPivot);

const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.58, 12), mannequinMat);
leftArm.position.y = -0.29;
leftArm.castShadow = true;
leftArmPivot.add(leftArm);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.24, 1.36, 0);
proceduralAvatarGroup.add(rightArmPivot);

const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.58, 12), mannequinMat);
rightArm.position.y = -0.29;
rightArm.castShadow = true;
rightArmPivot.add(rightArm);

// Dedicated Avatar Rim Light
const avatarLight = new THREE.PointLight(0xd4af37, 2.2, 5.5);
avatarLight.position.set(0, 2.0, 1.4);
avatarRoot.add(avatarLight);

// ==============================================================================
// 6. EXTENSIBLE 3D GLTF MODEL LOADER (READY FOR MITRA'S 3D FILE)
// ==============================================================================
const gltfLoader = new GLTFLoader();
let customAvatarModel = null;
let avatarAnimationMixer = null;

// File path for Mitra's 3D avatar (Place file in: public/assets/character.glb)
const CUSTOM_MODEL_URL = './assets/character.glb';

gltfLoader.load(
  CUSTOM_MODEL_URL,
  (gltf) => {
    customAvatarModel = gltf.scene;

    // Normalize height to ~1.8 meters
    const bbox = new THREE.Box3().setFromObject(customAvatarModel);
    const size = bbox.getSize(new THREE.Vector3());
    if (size.y > 0) {
      const scaleFactor = 1.8 / size.y;
      customAvatarModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Orient character towards museum interior (-Z)
    customAvatarModel.rotation.y = Math.PI;

    customAvatarModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Setup animation mixer if character has clips
    if (gltf.animations && gltf.animations.length > 0) {
      avatarAnimationMixer = new THREE.AnimationMixer(customAvatarModel);
      const walkClip = gltf.animations.find((c) =>
        c.name.toLowerCase().includes('walk') || c.name.toLowerCase().includes('run')
      ) || gltf.animations[0];

      if (walkClip) {
        const action = avatarAnimationMixer.clipAction(walkClip);
        action.play();
      }
    }

    // Hide procedural mannequin and show custom 3D model
    proceduralAvatarGroup.visible = false;
    avatarRoot.add(customAvatarModel);
  },
  undefined,
  () => {
    // Graceful fallback: Procedural architectural mannequin remains active
  }
);

// ==============================================================================
// 7. EXHIBIT PLINTHS & FRAMED PROCEDURAL ARTWORKS
// ==============================================================================
const textureLoader = new THREE.TextureLoader();
const interactiveArtworks = [];

function createProceduralArtworkCanvas(exhibit) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 1024, 768);
  gradient.addColorStop(0, '#0c101c');
  gradient.addColorStop(1, '#05060a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 768);

  ctx.strokeStyle = exhibit.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1024 - 72, 768 - 72);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, 1024 - 96, 768 - 96);

  ctx.fillStyle = exhibit.color;
  ctx.font = '600 24px "Space Grotesk", monospace';
  ctx.fillText(`EXHIBIT // NO. ${exhibit.number}`, 80, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px "Cinzel", Georgia, serif';
  ctx.fillText(exhibit.title, 80, 200);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 28px "Inter", sans-serif';
  ctx.fillText(exhibit.subtitle, 80, 260);

  ctx.save();
  ctx.translate(512, 490);
  ctx.strokeStyle = exhibit.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * 110;
    const y = Math.sin(angle) * 110;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
  ctx.font = '500 20px "Space Grotesk", monospace';
  ctx.fillText('CURATOR: MITRA ZAHIRI // DIGITAL ARCHIVE', 80, 700);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Build 5 Exhibition Plinths and Works
EXHIBITS_DATA.forEach((exhibit) => {
  const group = new THREE.Group();
  group.position.set(exhibit.position.x, 0, exhibit.position.z);
  group.rotation.set(exhibit.rotation.x, exhibit.rotation.y, exhibit.rotation.z);

  // Anthracite Plinth Block
  const blockGeo = new THREE.BoxGeometry(4.6, 4.8, 0.6);
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x0e1118,
    roughness: 0.6,
    metalness: 0.35,
  });
  const block = new THREE.Mesh(blockGeo, blockMat);
  block.position.y = 3.6;
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  // Plinth Base Trim
  const baseTrim = new THREE.Mesh(
    new THREE.BoxGeometry(4.7, 0.08, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.95 })
  );
  baseTrim.position.y = 1.24;
  group.add(baseTrim);

  // Gilded Outer Frame
  const frameGeo = new THREE.BoxGeometry(3.6, 2.5, 0.14);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x141824,
    roughness: 0.25,
    metalness: 0.85,
    emissive: 0x000000,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 3.6, 0.35);
  group.add(frame);

  // Gold Bevel Edge
  const bevel = new THREE.Mesh(
    new THREE.BoxGeometry(3.64, 2.54, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.95 })
  );
  bevel.position.set(0, 3.6, 0.38);
  group.add(bevel);

  // Canvas Artwork
  let canvasTexture;
  if (exhibit.imageUrl) {
    canvasTexture = textureLoader.load(exhibit.imageUrl);
  } else {
    canvasTexture = createProceduralArtworkCanvas(exhibit);
  }

  const canvasMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.3, 2.2),
    new THREE.MeshStandardMaterial({
      map: canvasTexture,
      roughness: 0.22,
      metalness: 0.15,
    })
  );
  canvasMesh.position.set(0, 3.6, 0.43);
  group.add(canvasMesh);

  // Overhead Dedicated SpotLight Casting Cone on Artwork
  const spotLight = new THREE.SpotLight(0xfff3db, 14, 12, Math.PI / 4.8, 0.55, 1.2);
  spotLight.position.set(0, 6.8, 1.8);
  spotLight.target = canvasMesh;
  spotLight.castShadow = true;
  group.add(spotLight);

  scene.add(group);

  canvasMesh.userData = {
    exhibitData: exhibit,
    frameRef: frame,
    groupRef: group,
  };
  interactiveArtworks.push(canvasMesh);
});

// ==============================================================================
// 8. NAVIGATION, SMOOTH SCROLL RAIL, & MOUSE DRAGGING
// ==============================================================================
let scrollProgress = 0;       // 0.0 (Exterior Plaza) to 1.0 (End of Museum)
let currentScroll = 0;        // Smooth lerped progress
const MIN_Z = 42;             // Starting Z in the exterior plaza
const MAX_Z = -70;            // Final Z inside the gallery

const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let isAutoTour = false;

const welcomeBanner = document.getElementById('welcome-banner');
function fadeWelcomeBanner() {
  if (welcomeBanner && !welcomeBanner.classList.contains('faded')) {
    welcomeBanner.classList.add('faded');
  }
}

const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// 1. Normalized Mouse Wheel Scrolling
window.addEventListener(
  'wheel',
  (e) => {
    if (isAutoTour) isAutoTour = false;

    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 34; // Windows line mode
    else if (e.deltaMode === 2) delta *= 800;

    const step = delta / 980;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress + step));
    fadeWelcomeBanner();
  },
  { passive: true }
);

// 2. Click & Drag Anywhere to Stroll
let isMouseDragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

window.addEventListener('mousedown', (e) => {
  if (
    e.target.closest('#hud-header') ||
    e.target.closest('#hud-footer') ||
    e.target.closest('#exhibit-card') ||
    e.target.closest('#progress-rail')
  ) {
    return;
  }

  isMouseDragging = true;
  dragStartY = e.clientY;
  dragStartScroll = scrollProgress;
  document.body.classList.add('is-dragging');
});

window.addEventListener('mousemove', (e) => {
  mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

  if (cursorDot && cursorRing) {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
  }

  if (isMouseDragging) {
    if (isAutoTour) isAutoTour = false;
    const diffY = dragStartY - e.clientY;
    const sensitivity = 0.0018;
    scrollProgress = Math.max(0, Math.min(1, dragStartScroll + diffY * sensitivity));
    fadeWelcomeBanner();
  }
});

window.addEventListener('mouseup', () => {
  if (isMouseDragging) {
    isMouseDragging = false;
    document.body.classList.remove('is-dragging');
  }
});

// 3. Touch Drag
let touchStartY = 0;
let touchStartScroll = 0;

window.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
      touchStartScroll = scrollProgress;
    }
  },
  { passive: true }
);

window.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches && e.touches[0]) {
      if (isAutoTour) isAutoTour = false;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;
      const sensitivity = 0.0022;
      scrollProgress = Math.max(0, Math.min(1, touchStartScroll + diffY * sensitivity));
      fadeWelcomeBanner();
    }
  },
  { passive: true }
);

// 4. Keyboard Navigation
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'PageDown') {
    if (isAutoTour) isAutoTour = false;
    scrollProgress = Math.min(1, scrollProgress + 0.06);
    fadeWelcomeBanner();
  } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'PageUp') {
    if (isAutoTour) isAutoTour = false;
    scrollProgress = Math.max(0, scrollProgress - 0.06);
    fadeWelcomeBanner();
  } else if (e.code === 'Home') {
    scrollProgress = 0;
    fadeWelcomeBanner();
  } else if (e.code === 'End') {
    scrollProgress = 1;
    fadeWelcomeBanner();
  } else if (e.code === 'Space') {
    e.preventDefault();
    toggleAutoTour();
    fadeWelcomeBanner();
  }
});

// ==============================================================================
// 9. RAYCASTING & CURATORIAL DOSSIER
// ==============================================================================
const raycaster = new THREE.Raycaster();
const pointerVector = new THREE.Vector2();

const exhibitCard = document.getElementById('exhibit-card');
const cardBadge = document.getElementById('card-badge');
const cardTitle = document.getElementById('card-title');
const cardSubtitle = document.getElementById('card-subtitle');
const cardDesc = document.getElementById('card-desc');
const cardTechList = document.getElementById('card-tech-list');
const cardCurator = document.getElementById('card-curator');
const cardCloseBtn = document.getElementById('card-close-btn');

let currentlyHoveredArtwork = null;

function showExhibitDossier(exhibit) {
  cardBadge.textContent = `EXHIBIT // NO. ${exhibit.number}`;
  cardTitle.textContent = exhibit.title;
  cardSubtitle.textContent = exhibit.subtitle;
  cardDesc.textContent = exhibit.desc;
  cardCurator.textContent = exhibit.curatorField;

  cardTechList.innerHTML = '';
  exhibit.tech.forEach((techName) => {
    const pill = document.createElement('span');
    pill.className = 'tech-badge-pill';
    pill.textContent = techName;
    cardTechList.appendChild(pill);
  });

  document.body.classList.add('cursor-hover');

  gsap.killTweensOf(exhibitCard);
  gsap.to(exhibitCard, {
    autoAlpha: 1,
    y: 0,
    duration: 0.4,
    ease: 'power3.out',
  });
}

function hideExhibitDossier() {
  document.body.classList.remove('cursor-hover');

  gsap.killTweensOf(exhibitCard);
  gsap.to(exhibitCard, {
    autoAlpha: 0,
    y: 24,
    duration: 0.3,
    ease: 'power2.in',
  });
}

if (cardCloseBtn) {
  cardCloseBtn.addEventListener('click', () => {
    hideExhibitDossier();
    currentlyHoveredArtwork = null;
  });
}

window.addEventListener('pointermove', (e) => {
  pointerVector.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointerVector, camera);
  const intersects = raycaster.intersectObjects(interactiveArtworks, false);

  if (intersects.length > 0) {
    const hitArtwork = intersects[0].object;
    const exhibit = hitArtwork.userData.exhibitData;

    if (currentlyHoveredArtwork !== hitArtwork) {
      if (currentlyHoveredArtwork && currentlyHoveredArtwork.userData.frameRef) {
        currentlyHoveredArtwork.userData.frameRef.material.emissive.set(0x000000);
      }

      currentlyHoveredArtwork = hitArtwork;
      showExhibitDossier(exhibit);

      if (hitArtwork.userData.frameRef) {
        hitArtwork.userData.frameRef.material.emissive.set(exhibit.color);
        hitArtwork.userData.frameRef.material.emissiveIntensity = 0.55;
      }
    }
  } else {
    if (currentlyHoveredArtwork) {
      if (currentlyHoveredArtwork.userData.frameRef) {
        currentlyHoveredArtwork.userData.frameRef.material.emissive.set(0x000000);
      }
      currentlyHoveredArtwork = null;
      hideExhibitDossier();
    }
  }
});

// Click artwork to glide directly into close focus
window.addEventListener('click', (e) => {
  if (e.target.closest('#hud-header') || e.target.closest('#hud-footer') || e.target.closest('#exhibit-card')) {
    return;
  }

  raycaster.setFromCamera(pointerVector, camera);
  const intersects = raycaster.intersectObjects(interactiveArtworks, false);

  if (intersects.length > 0) {
    const exhibit = intersects[0].object.userData.exhibitData;
    if (exhibit && typeof exhibit.scrollProgress === 'number') {
      scrollProgress = exhibit.scrollProgress;
      playAcousticChime(Number(exhibit.number));
    }
  }
});

// ==============================================================================
// 10. HUD TELEMETRY, PROGRESS SCRUBBING, & AUTO-TOUR
// ==============================================================================
const roomIndicator = document.getElementById('room-indicator');
const depthReadout = document.getElementById('depth-readout');
const progressThumb = document.getElementById('progress-thumb');
const scrollPercentage = document.getElementById('scroll-percentage');
const navNodes = document.querySelectorAll('.nav-node');
const tourBtn = document.getElementById('tour-btn');

// Atmosphere Lighting Presets (Void, Dusk, Neo)
const ATMOSPHERES = [
  {
    name: 'VOID',
    bg: '#050609',
    fog: '#050609',
    ambient: '#101524',
    portal: '#ffe8c2',
  },
  {
    name: 'DUSK',
    bg: '#180c08',
    fog: '#180c08',
    ambient: '#3a1e12',
    portal: '#ff9858',
  },
  {
    name: 'NEO',
    bg: '#040d12',
    fog: '#040d12',
    ambient: '#06262e',
    portal: '#38efc6',
  },
];

let currentAtmosphereIdx = 0;
const atmosphereBtn = document.getElementById('atmosphere-btn');
const atmosphereLabel = document.getElementById('atmosphere-label');

if (atmosphereBtn) {
  atmosphereBtn.addEventListener('click', () => {
    currentAtmosphereIdx = (currentAtmosphereIdx + 1) % ATMOSPHERES.length;
    const preset = ATMOSPHERES[currentAtmosphereIdx];

    if (atmosphereLabel) {
      atmosphereLabel.textContent = preset.name;
    }

    const targetBg = new THREE.Color(preset.bg);
    const targetFog = new THREE.Color(preset.fog);
    const targetAmbient = new THREE.Color(preset.ambient);
    const targetPortal = new THREE.Color(preset.portal);

    gsap.to(scene.background, {
      r: targetBg.r,
      g: targetBg.g,
      b: targetBg.b,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(scene.fog.color, {
      r: targetFog.r,
      g: targetFog.g,
      b: targetFog.b,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(ambientLight.color, {
      r: targetAmbient.r,
      g: targetAmbient.g,
      b: targetAmbient.b,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(portalBeam.color, {
      r: targetPortal.r,
      g: targetPortal.g,
      b: targetPortal.b,
      duration: 1.2,
      ease: 'power2.out',
    });

    playAcousticChime(currentAtmosphereIdx + 2);
  });
}

function toggleAutoTour() {
  isAutoTour = !isAutoTour;
  if (tourBtn) {
    tourBtn.classList.toggle('playing', isAutoTour);
  }
}

if (tourBtn) {
  tourBtn.addEventListener('click', toggleAutoTour);
}

navNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const targetProg = parseFloat(node.getAttribute('data-progress'));
    if (!isNaN(targetProg)) {
      isAutoTour = false;
      scrollProgress = targetProg;
      fadeWelcomeBanner();
      playAcousticChime();
    }
  });
});

// Interactive Progress Rail scrubbing
const progressRail = document.getElementById('progress-rail');
if (progressRail) {
  const updateProgressFromRail = (clientY) => {
    const rect = progressRail.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    if (isAutoTour) isAutoTour = false;
    scrollProgress = ratio;
    fadeWelcomeBanner();
  };

  progressRail.addEventListener('click', (e) => {
    updateProgressFromRail(e.clientY);
  });

  let isRailDragging = false;
  progressRail.addEventListener('mousedown', (e) => {
    isRailDragging = true;
    updateProgressFromRail(e.clientY);
  });
  window.addEventListener('mousemove', (e) => {
    if (isRailDragging) updateProgressFromRail(e.clientY);
  });
  window.addEventListener('mouseup', () => {
    if (isRailDragging) isRailDragging = false;
  });
}

// ==============================================================================
// 11. GENERATIVE WEB AUDIO AMBIENCE
// ==============================================================================
let audioCtx = null;
let isAudioActive = false;
const soundBtn = document.getElementById('sound-btn');

function initWebAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioCtx = new AudioContext();

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(260, audioCtx.currentTime);

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.05, audioCtx.currentTime);

  [55.0, 82.4, 110.0].forEach((freq) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.06, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(2.0, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc.connect(filter);
    osc.start();
  });

  filter.connect(masterGain);
  masterGain.connect(audioCtx.destination);
}

function toggleAudio() {
  initWebAudio();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isAudioActive = !isAudioActive;
  if (soundBtn) {
    soundBtn.classList.toggle('active', isAudioActive);
  }
}

if (soundBtn) {
  soundBtn.addEventListener('click', toggleAudio);
}

function playAcousticChime(noteIndex = 1) {
  if (!audioCtx || !isAudioActive) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const scale = [261.63, 329.63, 392.0, 523.25, 659.25];
  const freq = scale[noteIndex % scale.length];

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 1.2);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.6);
}

window.addEventListener('pointerdown', () => {
  if (!audioCtx) initWebAudio();
}, { once: true });

// ==============================================================================
// 12. MAIN ANIMATION & AVATAR LOCOMOTION LOOP
// ==============================================================================
let lastTimestamp = performance.now();
let lastScrollProgress = 0;
let walkCyclePhase = 0;

function animate() {
  requestAnimationFrame(animate);

  const currentTimestamp = performance.now();
  const delta = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
  const elapsedTime = currentTimestamp * 0.001;
  lastTimestamp = currentTimestamp;

  // 1. Auto-Tour Progress
  if (isAutoTour) {
    scrollProgress += 0.00032;
    if (scrollProgress >= 1.0) scrollProgress = 0;
  }

  // 2. Smooth Lerp Scroll & Mouse Coordinates
  currentScroll += (scrollProgress - currentScroll) * 0.065;
  mouse.x += (mouse.targetX - mouse.x) * 0.08;
  mouse.y += (mouse.targetY - mouse.y) * 0.08;

  // 3. Avatar Walking Locomotion & Spatial Trajectory
  const cameraTargetZ = MIN_Z + currentScroll * (MAX_Z - MIN_Z);
  const avatarTargetZ = cameraTargetZ - 4.2;

  // Stair elevation profile:
  // In Plaza (Z > 22): Y = 0.0
  // On Grand Steps (13 < Z <= 22): smoothly ascends to 1.2
  // Inside Museum (Z <= 13): Y = 1.2
  let avatarElevation = 0.0;
  if (avatarTargetZ > 22) {
    avatarElevation = 0.0;
  } else if (avatarTargetZ > 13) {
    const t = (22 - avatarTargetZ) / (22 - 13);
    avatarElevation = t * 1.2;
  } else {
    avatarElevation = 1.2;
  }

  avatarRoot.position.set(0, avatarElevation, avatarTargetZ);

  // Avatar walk cycle kinematics
  const strollVelocity = Math.abs(currentScroll - lastScrollProgress);
  lastScrollProgress = currentScroll;
  const isStrolling = strollVelocity > 0.00012 || isAutoTour;

  if (isStrolling) {
    walkCyclePhase += delta * (strollVelocity * 240 + (isAutoTour ? 4.2 : 0));
    const legAngle = Math.sin(walkCyclePhase * 7) * 0.58;
    const armAngle = -Math.sin(walkCyclePhase * 7) * 0.44;

    leftLegPivot.rotation.x = legAngle;
    rightLegPivot.rotation.x = -legAngle;
    leftArmPivot.rotation.x = armAngle;
    rightArmPivot.rotation.x = -armAngle;

    proceduralAvatarGroup.position.y = Math.abs(Math.sin(walkCyclePhase * 14)) * 0.04;
    head.rotation.y = Math.sin(walkCyclePhase * 7) * 0.05;
  } else {
    // Idle breathing posture
    leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0, 8, delta);
    rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, 0, 8, delta);
    leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, 0, 8, delta);
    rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, 0, 8, delta);
    proceduralAvatarGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.012;
  }

  // Update custom 3D model mixer if loaded
  if (avatarAnimationMixer) {
    avatarAnimationMixer.update(delta);
  }

  // 4. Camera Follows Avatar Smoothly from Behind
  camera.position.z = avatarTargetZ + 4.2;
  camera.position.y = avatarElevation + 1.85 + mouse.y * 0.35;
  camera.position.x = mouse.x * 0.9;
  camera.rotation.y = -mouse.x * 0.06;
  camera.rotation.x = mouse.y * 0.035;

  // 5. Floating Dust Animation
  if (dustParticles) {
    dustParticles.rotation.y = elapsedTime * 0.012;
  }

  // 6. HUD Telemetry Updates
  const pct = Math.round(currentScroll * 100);
  if (scrollPercentage) {
    scrollPercentage.textContent = `${pct.toString().padStart(2, '0')}%`;
  }
  if (progressThumb) {
    progressThumb.style.height = `${pct}%`;
  }
  if (depthReadout) {
    depthReadout.textContent = `Z: ${cameraTargetZ.toFixed(1)}m`;
  }

  // Telemetry Stage & Stepper Activation
  let currentRoomName = 'STAGE 01 // EXTERIOR PLAZA';
  let activeNodeIdx = 0;

  if (currentScroll > 0.94) {
    currentRoomName = 'STAGE 08 // KAREKOK ARCHIVE';
    activeNodeIdx = 7;
  } else if (currentScroll > 0.82) {
    currentRoomName = 'STAGE 07 // WINDMILL BRAND';
    activeNodeIdx = 6;
  } else if (currentScroll > 0.70) {
    currentRoomName = 'STAGE 06 // IDEAL SYSTEMS';
    activeNodeIdx = 5;
  } else if (currentScroll > 0.55) {
    currentRoomName = 'STAGE 05 // POOSHOO COMPANION';
    activeNodeIdx = 4;
  } else if (currentScroll > 0.42) {
    currentRoomName = 'STAGE 04 // RĀY OS SENSORY';
    activeNodeIdx = 3;
  } else if (currentScroll > 0.28) {
    currentRoomName = 'STAGE 03 // INTERIOR ROTUNDA';
    activeNodeIdx = 2;
  } else if (currentScroll > 0.12) {
    currentRoomName = 'STAGE 02 // MONUMENTAL PORTAL & STEPS';
    activeNodeIdx = 1;
  }

  if (roomIndicator && roomIndicator.textContent !== currentRoomName) {
    roomIndicator.textContent = currentRoomName;
  }

  navNodes.forEach((node, idx) => {
    node.classList.toggle('active', idx === activeNodeIdx);
  });

  // Render Scene
  renderer.render(scene, camera);
}

animate();

// ==============================================================================
// 13. RESPONSIVE RESIZE
// ==============================================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
