/**
 * ==============================================================================
 * MITRA ZAHIRI — DIGITAL MUSEUM
 * ==============================================================================
 * A high-end, 3D WebGL virtual gallery inspired by Sébastien Lempens.
 * Features smooth scroll-driven camera glide, natural mouse parallax,
 * interactive raycasting, generative Web Audio ambience, and GSAP dossier animations.
 * 100% English. Completely eliminates PointerLock for effortless scrolling & cursor freedom.
 * ==============================================================================
 */

import * as THREE from 'three';
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
    position: { x: -4.2, y: 2.2, z: -12 },
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    color: '#10b981',
    glowColor: '#34d399',
    scrollProgress: 0.18,
    // TODO: Insert Image URL here (e.g. '/assets/ray-os.jpg')
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
    position: { x: 4.2, y: 2.2, z: -24 },
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    color: '#f59e0b',
    glowColor: '#fbbf24',
    scrollProgress: 0.36,
    // TODO: Insert Image URL here (e.g. '/assets/pooshoo.jpg')
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
    position: { x: -4.5, y: 2.2, z: -36 },
    rotation: { x: 0, y: Math.PI / 3.5, z: 0 },
    color: '#3b82f6',
    glowColor: '#60a5fa',
    scrollProgress: 0.54,
    // TODO: Insert Image URL here (e.g. '/assets/ideal.jpg')
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
    position: { x: 4.5, y: 2.2, z: -48 },
    rotation: { x: 0, y: -Math.PI / 3.5, z: 0 },
    color: '#ec4899',
    glowColor: '#f472b6',
    scrollProgress: 0.72,
    // TODO: Insert Image URL here (e.g. '/assets/yel-degirmeni.jpg')
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
    position: { x: 0, y: 2.2, z: -60 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#d4af37',
    glowColor: '#fef08a',
    scrollProgress: 0.88,
    // TODO: Insert Image URL here (e.g. '/assets/karekok.jpg')
    imageUrl: null,
  },
];

// ==============================================================================
// 2. THREE.JS SCENE, CAMERA, & RENDERER SETUP
// ==============================================================================
const container = document.getElementById('webgl-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06070a);
scene.fog = new THREE.FogExp2(0x06070a, 0.038);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Starting camera position in the Entrance Rotunda
camera.position.set(0, 1.85, 4);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(renderer.domElement);

// ==============================================================================
// 3. ARCHITECTURAL GALLERY, REFLECTIVE MARBLE FLOOR, & LIGHTS
// ==============================================================================
// Reflective dark marble/obsidian runway
const floorGeometry = new THREE.PlaneGeometry(36, 120);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x090b10,
  roughness: 0.14, // Polished wet glass / obsidian sheen
  metalness: 0.85,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, -35);
floor.receiveShadow = true;
scene.add(floor);

// Brass Floor Runner Guide Rails
const guideGeo = new THREE.BoxGeometry(0.05, 0.02, 110);
const guideMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.95,
});
[-4.8, 0, 4.8].forEach((posX) => {
  const guide = new THREE.Mesh(guideGeo, guideMat);
  guide.position.set(posX, 0.01, -35);
  scene.add(guide);
});

// Vaulted Dark Ceiling
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(36, 120),
  new THREE.MeshStandardMaterial({ color: 0x040507, roughness: 0.95 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 6.8, -35);
scene.add(ceiling);

// Entrance Rotunda Circular Gold Ring
const rotundaRingGeo = new THREE.RingGeometry(3.2, 3.26, 64);
const rotundaRingMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.95,
  side: THREE.DoubleSide,
});
const rotundaRing = new THREE.Mesh(rotundaRingGeo, rotundaRingMat);
rotundaRing.rotation.x = -Math.PI / 2;
rotundaRing.position.set(0, 0.02, 1.5);
scene.add(rotundaRing);

// Ambient Lighting
const ambientLight = new THREE.AmbientLight(0x101422, 0.55);
scene.add(ambientLight);

// Rotunda Warm Skylight Beam
const rotundaSpot = new THREE.SpotLight(0xffecd1, 6.5, 16, Math.PI / 4, 0.6, 1);
rotundaSpot.position.set(0, 6.6, 1.5);
rotundaSpot.target.position.set(0, 0, 1.5);
scene.add(rotundaSpot.target);
scene.add(rotundaSpot);

// Floating Golden Atmospheric Dust Particles
const particleCount = 450;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  particlePositions[i] = (Math.random() - 0.5) * 28;
  particlePositions[i + 1] = Math.random() * 5.8 + 0.2;
  particlePositions[i + 2] = 10 - Math.random() * 85;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0xd4af37,
  size: 0.038,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
});
const dustParticles = new THREE.Points(particleGeo, particleMat);
scene.add(dustParticles);

// ==============================================================================
// 4. EXHIBIT PLINTHS, FRAMED CANVASES, & PROCEDURAL ARTWORKS
// ==============================================================================
const textureLoader = new THREE.TextureLoader();
const interactiveArtworks = [];

// Procedural Canvas Texture Generator (Displays clean museum art until custom images are loaded)
function createProceduralArtworkCanvas(exhibit) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Deep obsidian gradient
  const gradient = ctx.createLinearGradient(0, 0, 1024, 768);
  gradient.addColorStop(0, '#0c101c');
  gradient.addColorStop(1, '#05060a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 768);

  // Outer gold borders
  ctx.strokeStyle = exhibit.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1024 - 72, 768 - 72);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, 1024 - 96, 768 - 96);

  // Catalogue Header
  ctx.fillStyle = exhibit.color;
  ctx.font = '600 24px "Space Grotesk", monospace';
  ctx.fillText(`EXHIBIT // NO. ${exhibit.number}`, 80, 120);

  // Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px "Cinzel", Georgia, serif';
  ctx.fillText(exhibit.title, 80, 200);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 28px "Inter", sans-serif';
  ctx.fillText(exhibit.subtitle, 80, 260);

  // Central Geometric Monolith Artwork
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

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 70, 45, Math.PI / 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Bottom Signature
  ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
  ctx.font = '500 20px "Space Grotesk", monospace';
  ctx.fillText('CURATOR: MITRA ZAHIRI // DIGITAL ARCHIVE', 80, 700);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Build 5 Floating Exhibition Plinths and Framed Works
EXHIBITS_DATA.forEach((exhibit) => {
  const group = new THREE.Group();
  group.position.set(exhibit.position.x, 0, exhibit.position.z);
  group.rotation.set(exhibit.rotation.x, exhibit.rotation.y, exhibit.rotation.z);

  // 1. Anthracite Minimalist Monolith Block
  const blockGeo = new THREE.BoxGeometry(4.6, 4.8, 0.6);
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x0e1118,
    roughness: 0.6,
    metalness: 0.35,
  });
  const block = new THREE.Mesh(blockGeo, blockMat);
  block.position.y = 2.4;
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  // Plinth Base Trim
  const baseTrim = new THREE.Mesh(
    new THREE.BoxGeometry(4.7, 0.08, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.95 })
  );
  baseTrim.position.y = 0.04;
  group.add(baseTrim);

  // 2. Gilded Outer Picture Frame
  const frameGeo = new THREE.BoxGeometry(3.6, 2.5, 0.14);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x141824,
    roughness: 0.25,
    metalness: 0.85,
    emissive: 0x000000,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 2.4, 0.35);
  group.add(frame);

  // Gold Bevel Edge
  const bevel = new THREE.Mesh(
    new THREE.BoxGeometry(3.64, 2.54, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.95 })
  );
  bevel.position.set(0, 2.4, 0.38);
  group.add(bevel);

  // 3. Canvas Artwork
  // TODO: Insert Image URL here (e.g. textureLoader.load('path/to/image.jpg'))
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
  canvasMesh.position.set(0, 2.4, 0.43);
  group.add(canvasMesh);

  // Curatorial Brass Placard
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.24),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.9 })
  );
  plaque.position.set(0, 1.0, 0.32);
  group.add(plaque);

  // 4. Overhead Dedicated SpotLight Casting Cone on Artwork
  const spotLight = new THREE.SpotLight(0xfff3db, 14, 12, Math.PI / 4.8, 0.55, 1.2);
  spotLight.position.set(0, 5.6, 1.8);
  spotLight.target = canvasMesh;
  spotLight.castShadow = true;
  group.add(spotLight);

  scene.add(group);

  // Attach metadata for raycasting interaction
  canvasMesh.userData = {
    exhibitData: exhibit,
    frameRef: frame,
    groupRef: group,
  };
  interactiveArtworks.push(canvasMesh);
});

// ==============================================================================
// 5. SMOOTH SCROLL MECHANICS, MOUSE DRAGGING, & CAMERA RAIL
// ==============================================================================
// Scroll state parameters
let scrollProgress = 0;       // Target scroll progress (0.0 to 1.0)
let currentScroll = 0;        // Smooth lerped scroll progress
const MIN_Z = 4;              // Entrance Z position
const MAX_Z = -66;            // End of gallery Z position

// Mouse movement parallax state
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let isAutoTour = false;

// Welcome banner auto-dismiss on interaction
const welcomeBanner = document.getElementById('welcome-banner');
function fadeWelcomeBanner() {
  if (welcomeBanner && !welcomeBanner.classList.contains('faded')) {
    welcomeBanner.classList.add('faded');
  }
}

// Custom luxury cursor elements
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// 1. High-Precision Normalized Mouse Wheel Scrolling
window.addEventListener(
  'wheel',
  (e) => {
    if (isAutoTour) isAutoTour = false;

    // Normalize wheel delta across all mice, trackpads, and operating systems
    let delta = e.deltaY;
    if (e.deltaMode === 1) {
      // DOM_DELTA_LINE: Windows default for mouse wheel (~3 lines)
      delta *= 34;
    } else if (e.deltaMode === 2) {
      // DOM_DELTA_PAGE
      delta *= 800;
    }

    // Responsive step: silky smooth glide without requiring dozens of frantic scrolls
    const step = delta / 950;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress + step));
    fadeWelcomeBanner();
  },
  { passive: true }
);

// 2. Fluid Mouse Drag Navigation (Click & Drag Anywhere to Stroll)
let isMouseDragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

window.addEventListener('mousedown', (e) => {
  // Ignore clicks on HUD buttons, footer stepper, dossier card, or progress rail
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
  // Normalize pointer (-1 to +1) for camera sway
  mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

  // Custom cursor position
  if (cursorDot && cursorRing) {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
  }

  // Handle active mouse dragging
  if (isMouseDragging) {
    if (isAutoTour) isAutoTour = false;
    const diffY = dragStartY - e.clientY;
    const sensitivity = 0.0019; // Responsive, tactile physical feel
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

// 3. Touch Drag Support for Mobile & Tablets
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

// 4. Keyboard Arrow / W-S Navigation
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
    if (isAutoTour) isAutoTour = false;
    scrollProgress = 0;
    fadeWelcomeBanner();
  } else if (e.code === 'End') {
    if (isAutoTour) isAutoTour = false;
    scrollProgress = 1;
    fadeWelcomeBanner();
  } else if (e.code === 'Space') {
    e.preventDefault();
    toggleAutoTour();
    fadeWelcomeBanner();
  }
});

// ==============================================================================
// 6. RAYCASTING & CURATORIAL DOSSIER INTERACTION (WITHOUT POINTERLOCK)
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

// Raycaster check on mouse move
window.addEventListener('pointermove', (e) => {
  pointerVector.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointerVector, camera);
  const intersects = raycaster.intersectObjects(interactiveArtworks, false);

  if (intersects.length > 0) {
    const hitArtwork = intersects[0].object;
    const exhibit = hitArtwork.userData.exhibitData;

    if (currentlyHoveredArtwork !== hitArtwork) {
      // Reset previously hovered frame
      if (currentlyHoveredArtwork && currentlyHoveredArtwork.userData.frameRef) {
        currentlyHoveredArtwork.userData.frameRef.material.emissive.set(0x000000);
      }

      currentlyHoveredArtwork = hitArtwork;
      showExhibitDossier(exhibit);

      // Emissive frame glow
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
  // Prevent if clicking HUD or card
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
// 7. HUD TELEMETRY, STEPPER NAVIGATION, & AUTO-TOUR
// ==============================================================================
const roomIndicator = document.getElementById('room-indicator');
const depthReadout = document.getElementById('depth-readout');
const progressThumb = document.getElementById('progress-thumb');
const scrollPercentage = document.getElementById('scroll-percentage');
const navNodes = document.querySelectorAll('.nav-node');
const tourBtn = document.getElementById('tour-btn');

function toggleAutoTour() {
  isAutoTour = !isAutoTour;
  if (tourBtn) {
    tourBtn.classList.toggle('playing', isAutoTour);
  }
}

if (tourBtn) {
  tourBtn.addEventListener('click', toggleAutoTour);
}

// Stepper click handlers
navNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const targetProg = parseFloat(node.getAttribute('data-progress'));
    if (!isNaN(targetProg)) {
      isAutoTour = false;
      scrollProgress = targetProg;
      playAcousticChime();
    }
  });
});

// ==============================================================================
// 8. GENERATIVE WEB AUDIO AMBIENCE (0 EXTERNAL DEPENDENCIES)
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

  // Binaural ambient drones (55Hz & 82.5Hz)
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

// Interactive Progress Rail scrubbing & dragging
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
    if (isRailDragging) {
      updateProgressFromRail(e.clientY);
    }
  });
  window.addEventListener('mouseup', () => {
    if (isRailDragging) isRailDragging = false;
  });
}

// ==============================================================================
// 9. FIRST-GESTURE AUDIO PRIMING
// ==============================================================================
window.addEventListener(
  'pointerdown',
  () => {
    // Prime audio context silently on first user interaction
    if (!audioCtx) {
      initWebAudio();
    }
  },
  { once: true }
);

// ==============================================================================
// 10. MAIN RENDER & RAF LOOP (SMOOTH 60 FPS INTERPOLATION)
// ==============================================================================
let lastTimestamp = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const currentTimestamp = performance.now();
  const _delta = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
  const elapsedTime = currentTimestamp * 0.001;
  lastTimestamp = currentTimestamp;

  // 1. Auto-Tour Glide
  if (isAutoTour) {
    scrollProgress += 0.00035;
    if (scrollProgress >= 1.0) {
      scrollProgress = 0;
    }
  }

  // 2. Smooth Lerp Scroll & Mouse Parallax
  currentScroll += (scrollProgress - currentScroll) * 0.065;
  mouse.x += (mouse.targetX - mouse.x) * 0.08;
  mouse.y += (mouse.targetY - mouse.y) * 0.08;

  // Calculate Camera Z along the gallery rail
  const targetZ = MIN_Z + currentScroll * (MAX_Z - MIN_Z);
  camera.position.z = targetZ;

  // Natural cinematic camera sway with mouse
  camera.position.x = mouse.x * 0.85;
  camera.position.y = 1.85 + mouse.y * 0.35;
  camera.rotation.y = -mouse.x * 0.07;
  camera.rotation.x = mouse.y * 0.035;

  // 3. Floating Dust Animation
  if (dustParticles) {
    dustParticles.rotation.y = elapsedTime * 0.012;
  }

  // 4. Update HUD Telemetry
  const pct = Math.round(currentScroll * 100);
  if (scrollPercentage) {
    scrollPercentage.textContent = `${pct.toString().padStart(2, '0')}%`;
  }
  if (progressThumb) {
    progressThumb.style.height = `${pct}%`;
  }
  if (depthReadout) {
    depthReadout.textContent = `Z: ${targetZ.toFixed(1)}m`;
  }

  // Update Active Room / Stepper Node (100% Pure English)
  let currentRoomName = 'HALL 01 // ROTUNDA';
  let activeNodeIdx = 0;

  if (currentScroll > 0.82) {
    currentRoomName = 'HALL 06 // KAREKOK ARCHIVE';
    activeNodeIdx = 5;
  } else if (currentScroll > 0.65) {
    currentRoomName = 'HALL 05 // WINDMILL BRAND';
    activeNodeIdx = 4;
  } else if (currentScroll > 0.48) {
    currentRoomName = 'HALL 04 // IDEAL SYSTEMS';
    activeNodeIdx = 3;
  } else if (currentScroll > 0.28) {
    currentRoomName = 'HALL 03 // POOSHOO COMPANION';
    activeNodeIdx = 2;
  } else if (currentScroll > 0.1) {
    currentRoomName = 'HALL 02 // RĀY OS SENSORY';
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
// 11. RESPONSIVE RESIZE
// ==============================================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
