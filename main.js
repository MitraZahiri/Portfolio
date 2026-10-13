/**
 * ==============================================================================
 * MITRA ZAHIRI — DIGITAL MUSEUM (FPS 3D VIRTUAL GALLERY)
 * ==============================================================================
 * WebGL, Three.js, PointerLockControls ve GSAP ile geliştirilmiş 3D interaktif portfolyo.
 * Tasarım Dili: "Sébastien Lempens" ilhamlı karanlık tema, dramatik spot ışıkları,
 * yansıtıcı zemin, FPS kamera (WASD + Fare) ve nesneye duyarlı Raycaster etkileşimi.
 * ==============================================================================
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import gsap from 'gsap';

// ==============================================================================
// 1. SERGİLENECEK ESERLERİN VE KÜRATÖR VERİLERİNİN TANIMI
// ==============================================================================
const EXHIBITS_DATA = [
  {
    id: 'ray-os',
    number: '01',
    title: 'RĀY OS',
    subtitle: 'AI Destekli Cep Boy Koku Tarayıcı',
    desc: 'Mikro-sensör dizilimi ile ortamdaki koku moleküllerini algılayan, gömülü makine öğrenimi (TinyML) modelleriyle gerçek zamanlı koku profili çıkaran taşınabilir donanım ve gömülü işletim sistemi.',
    tech: ['C++', 'ESP32', 'TinyML', 'Embedded Systems', 'Hardware Architecture'],
    curatorNote: 'Gömülü Donanım ve Yapay Zeka Entegrasyonu',
    position: { x: -7, y: 2.2, z: -8 },
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    color: '#10b981',
    // TODO: Insert Image URL here (e.g. '/assets/ray-os.jpg')
    imageUrl: null,
  },
  {
    id: 'pooshoo',
    number: '02',
    title: 'PooSHoo',
    subtitle: 'Akıllı Fiziksel Cihaz ve Flutter Mobil Uygulaması',
    desc: 'Kullanıcı alışkanlıklarını analiz ederek evcil hayvan bakım süreçlerini otomatikleştiren, Bluetooth Low Energy (BLE) üzerinden senkronize çalışan fiziksel IoT cihazı ve modern mobil arayüz ekosistemi.',
    tech: ['Flutter', 'Dart', 'BLE (Bluetooth)', 'IoT Hardware', 'UI/UX Design'],
    curatorNote: 'Mobil Mimari & Fiziksel Cihaz Haberleşmesi',
    position: { x: 7, y: 2.2, z: -8 },
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    color: '#f59e0b',
    // TODO: Insert Image URL here (e.g. '/assets/pooshoo.jpg')
    imageUrl: null,
  },
  {
    id: 'ideal-bilisim',
    number: '03',
    title: 'İdeal Bilişim',
    subtitle: 'Kurumsal Kimlik ve Özgün Logo Tasarımı',
    desc: 'Bilişim ve kurumsal yazılım sektöründe faaliyet gösteren firma için "B" harfi morfolojisi ve dijital perspektif çizgileri üzerine inşa edilmiş monolitik vektörel kurumsal kimlik ve marka sistemi.',
    tech: ['Adobe Illustrator', 'Brand Identity', 'Vector Geometry', 'Grid Systems'],
    curatorNote: 'Vektörel Marka Mimarisi & Tipografi',
    position: { x: -8, y: 2.2, z: -18 },
    rotation: { x: 0, y: Math.PI / 3, z: 0 },
    color: '#3b82f6',
    // TODO: Insert Image URL here (e.g. '/assets/ideal.jpg')
    imageUrl: null,
  },
  {
    id: 'yel-degirmeni',
    number: '04',
    title: 'Yel Değirmeni',
    subtitle: 'Modern Kurumsal Logo Tasarımı',
    desc: 'Geleneksel zanaat vizyonunu modern minimalizmle buluşturan, dönme kinetiğini soyut geometrik formlarla ifade eden zarif ve zamansız kurumsal logo ve ambalaj kimlik çalışması.',
    tech: ['Logo Design', 'Visual Identity', 'Typography', 'Minimalism'],
    curatorNote: 'Soyut Geometrik Formlar & Modern Tipografi',
    position: { x: 8, y: 2.2, z: -18 },
    rotation: { x: 0, y: -Math.PI / 3, z: 0 },
    color: '#ec4899',
    // TODO: Insert Image URL here (e.g. '/assets/yel-degirmeni.jpg')
    imageUrl: null,
  },
  {
    id: 'karekok',
    number: '05',
    title: 'Karekök Yayınları',
    subtitle: 'TYT, AYT ve LGS Soru Bankası Kapak Tasarımları',
    desc: 'Milyonlarca öğrenciye ulaşan ulusal sınavlara hazırlık kitap serisi için geliştirilmiş, yüksek kontrastlı tipografi, soyut matematiksel desenler ve canlı renk kodlamasına sahip prestijli kapak tasarımları.',
    tech: ['Cover Design', 'Editorial Grid', 'Color Theory', 'Print Production'],
    curatorNote: 'Eğitim Yayıncılığı & Büyük Ölçekli Baskı Tasarımı',
    position: { x: 0, y: 2.2, z: -25 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#d4af37',
    // TODO: Insert Image URL here (e.g. '/assets/karekok.jpg')
    imageUrl: null,
  },
];

// ==============================================================================
// 2. THREE.JS SAHNE, KAMERA VE RENDERER KURULUMU
// ==============================================================================
const container = document.getElementById('webgl-container');

// Sahne (Scene)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// Sonsuzluk ve derinlik hissi veren yumuşak üstel sis (Exponential Fog)
scene.fog = new THREE.FogExp2(0x050505, 0.045);

// FPS Kamera (PerspectiveCamera): Göz seviyesi 1.7m
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.7, 4);

// Yüksek Performanslı WebGL Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// ==============================================================================
// 3. YANSITICI ZEMİN VE MİMARİ MÜZE ALANI
// ==============================================================================
// Zemin: Üzerine düşen spot ışıklarını yansıtan, düşük pürüzlülük (roughness) ve yüksek metaliklik
const floorGeometry = new THREE.PlaneGeometry(60, 60);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x090b10,
  roughness: 0.16, // Islak beton / koyu cilalı cam yansıması
  metalness: 0.85,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Zemin Üzerinde Pirinç Mimari Kılavuz Çizgileri
const gridGuideGeo = new THREE.BoxGeometry(0.04, 0.01, 50);
const gridGuideMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.95,
});

[-5, 0, 5].forEach((posX) => {
  const guide = new THREE.Mesh(gridGuideGeo, gridGuideMat);
  guide.position.set(posX, 0.005, -12);
  scene.add(guide);
});

// Tavan Yapısı (Minimalist Koyu Tavan)
const ceilingGeometry = new THREE.PlaneGeometry(60, 60);
const ceilingMaterial = new THREE.MeshStandardMaterial({
  color: 0x040507,
  roughness: 0.95,
});
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 7.5;
scene.add(ceiling);

// Sınır Duvarları (Kullanıcının müzeyi terk etmemesi için)
const wallMat = new THREE.MeshStandardMaterial({
  color: 0x07080c,
  roughness: 0.9,
});
const perimeterWalls = [];

function createBoundaryWall(width, height, depth, x, y, z) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
  wall.position.set(x, y, z);
  wall.receiveShadow = true;
  scene.add(wall);
  perimeterWalls.push(new THREE.Box3().setFromObject(wall));
}

createBoundaryWall(60, 8, 1, 0, 4, -32); // Arka duvar
createBoundaryWall(60, 8, 1, 0, 4, 12);  // Ön giriş duvarı
createBoundaryWall(1, 8, 60, -22, 4, -10); // Sol dış duvar
createBoundaryWall(1, 8, 60, 22, 4, -10);  // Sağ dış duvar

// ==============================================================================
// 4. SERGİ BLOKLARI, TABLOLAR VE DOKU YÜKLEME (TEXTURELOADER)
// ==============================================================================
const textureLoader = new THREE.TextureLoader();

// Raycaster çarpışması için taranacak interaktif tablolar dizisi
const interactiveArtworks = [];
// Fiziksel çarpışma kutuları (Player collision boxes)
const collisionObstacles = [...perimeterWalls];

// Varsayılan Sanatsal Proje Dokusu Üretici (TODO: Kullanıcı kendi resmini ekleyene kadar zarif bir tuval sunar)
function generateProceduralArtworkCanvas(exhibit) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Koyu degrade arkaplan
  const gradient = ctx.createLinearGradient(0, 0, 1024, 768);
  gradient.addColorStop(0, '#0c0f18');
  gradient.addColorStop(1, '#05060a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 768);

  // Eser renginde zarif ışık halkası
  ctx.strokeStyle = exhibit.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1024 - 72, 768 - 72);

  // İç altın çerçeve çizgisi
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, 1024 - 96, 768 - 96);

  // Eser Kataloğu No
  ctx.fillStyle = exhibit.color;
  ctx.font = '600 24px "Space Grotesk", monospace';
  ctx.fillText(`EXHIBIT // NO. ${exhibit.number}`, 80, 120);

  // Proje Başlığı
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px "Cinzel", Georgia, serif';
  ctx.fillText(exhibit.title, 80, 200);

  // Alt Başlık
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 28px "Inter", sans-serif';
  ctx.fillText(exhibit.subtitle, 80, 260);

  // Soyut Geometrik Monogram Çizimi (Ortada)
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

  // İç soyut elips
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 70, 45, Math.PI / 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Alt Küratör İmzası
  ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
  ctx.font = '500 20px "Space Grotesk", monospace';
  ctx.fillText('CURATOR: MITRA ZAHIRI // DIGITAL ARCHIVE', 80, 700);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Her bir sergi eseri için monolitik plinth (blok), çerçeve ve spot ışığı oluştur
EXHIBITS_DATA.forEach((exhibit) => {
  const group = new THREE.Group();
  group.position.set(exhibit.position.x, 0, exhibit.position.z);
  group.rotation.set(exhibit.rotation.x, exhibit.rotation.y, exhibit.rotation.z);

  // 1. Minimalist Antrasit Monolit Blok (Duvar/Sütun)
  const blockGeo = new THREE.BoxGeometry(4.6, 5.0, 0.6);
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0x0f121a,
    roughness: 0.65,
    metalness: 0.35,
  });
  const block = new THREE.Mesh(blockGeo, blockMat);
  block.position.y = 2.5;
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  // Blok alt altın taban bordürü
  const baseTrimGeo = new THREE.BoxGeometry(4.7, 0.08, 0.7);
  const baseTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.9,
  });
  const baseTrim = new THREE.Mesh(baseTrimGeo, baseTrimMat);
  baseTrim.position.y = 0.04;
  group.add(baseTrim);

  // 2. Yaldızlı Dış Çerçeve
  const frameGeo = new THREE.BoxGeometry(3.6, 2.5, 0.12);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x161a24,
    roughness: 0.3,
    metalness: 0.85,
    emissive: 0x05070d,
  });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 2.5, 0.35);
  group.add(frame);

  // Çerçeve Kenar Altın Vurgusu
  const frameBevelGeo = new THREE.BoxGeometry(3.64, 2.54, 0.04);
  const frameBevelMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95,
  });
  const frameBevel = new THREE.Mesh(frameBevelGeo, frameBevelMat);
  frameBevel.position.set(0, 2.5, 0.38);
  group.add(frameBevel);

  // 3. Tablo / Tuval (Artwork Canvas Mesh)
  // TODO: Insert Image URL here (Kendi görselini eklemek istersen: textureLoader.load('path/to/img.jpg'))
  let artworkTexture;
  if (exhibit.imageUrl) {
    artworkTexture = textureLoader.load(exhibit.imageUrl);
  } else {
    // Görsel verilmediğinde özel tasarlanmış prosedürel tuval dokusu yüklenir
    artworkTexture = generateProceduralArtworkCanvas(exhibit);
  }

  const canvasGeo = new THREE.PlaneGeometry(3.3, 2.2);
  const canvasMat = new THREE.MeshStandardMaterial({
    map: artworkTexture,
    roughness: 0.25,
    metalness: 0.15,
  });
  const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
  canvasMesh.position.set(0, 2.5, 0.42);
  canvasMesh.castShadow = false;
  canvasMesh.receiveShadow = true;
  group.add(canvasMesh);

  // Tablo altına pirinç açıklama plaketi
  const plaqueGeo = new THREE.PlaneGeometry(1.2, 0.24);
  const plaqueMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.9,
  });
  const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
  plaque.position.set(0, 1.05, 0.32);
  group.add(plaque);

  // 4. Yukarıdan Vuran Volumetrik / Konik Spot Işığı (SpotLight)
  const spotLight = new THREE.SpotLight(0xfff5e0, 14, 12, Math.PI / 4.5, 0.55, 1.2);
  spotLight.position.set(0, 5.8, 1.8);
  spotLight.target = canvasMesh;
  spotLight.castShadow = true;
  spotLight.shadow.bias = -0.0001;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  group.add(spotLight);

  // Spot lamba gövdesi (Tavanda asılı armatür)
  const lampGeo = new THREE.CylinderGeometry(0.08, 0.15, 0.3, 16);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.set(0, 5.8, 1.8);
  lamp.rotation.x = Math.PI / 4;
  group.add(lamp);

  scene.add(group);

  // Raycaster için metaveri kaydı
  canvasMesh.userData = { exhibitData: exhibit, frameRef: frame };
  interactiveArtworks.push(canvasMesh);

  // Çarpışma engeli için Bounding Box hesapla
  const boxHelper = new THREE.Box3().setFromObject(block);
  collisionObstacles.push(boxHelper);
});

// ==============================================================================
// 5. GENEL SAHNE AYDINLATMASI VE KOZMİK DUST PARTİKÜLLERİ
// ==============================================================================
// Ortam Işığı (Karanlık minimalist tonu korumak için çok düşük tutulmuştur)
const ambientLight = new THREE.AmbientLight(0x0e1320, 0.35);
scene.add(ambientLight);

// Müze koridorlarında süzülen hafif toz parçacıkları (Floating Dust Motes)
const dustCount = 350;
const dustGeo = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount * 3; i += 3) {
  dustPositions[i] = (Math.random() - 0.5) * 36;
  dustPositions[i + 1] = Math.random() * 5.5 + 0.3;
  dustPositions[i + 2] = (Math.random() - 0.5) * 44;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

const dustMat = new THREE.PointsMaterial({
  color: 0xd4af37,
  size: 0.035,
  transparent: true,
  opacity: 0.45,
  blending: THREE.AdditiveBlending,
});
const dustParticles = new THREE.Points(dustGeo, dustMat);
scene.add(dustParticles);

// ==============================================================================
// 6. FPS KAMERA KONTROLLERİ (POINTERLOCKCONTROLS & WASD HAREKETİ)
// ==============================================================================
const controls = new PointerLockControls(camera, document.body);

// Hareket Durumları
const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

// Fiziksel İvmelenme ve Hız Vektörleri
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const WALK_SPEED = 32.0; // Yürüme ivmesi
const DAMPING = 8.5;     // Yumuşak sürtünme duruşu (Inertia damping)

// Kafa Sarsıntısı (Head Bobbing) Değişkenleri
let headBobTimer = 0;
const BASE_CAMERA_Y = 1.7;

// Klavye Olay Dinleyicileri
const onKeyDown = (event) => {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      moveState.forward = true;
      break;
    case 'KeyS':
    case 'ArrowDown':
      moveState.backward = true;
      break;
    case 'KeyA':
    case 'ArrowLeft':
      moveState.left = true;
      break;
    case 'KeyD':
    case 'ArrowRight':
      moveState.right = true;
      break;
  }
};

const onKeyUp = (event) => {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      moveState.forward = false;
      break;
    case 'KeyS':
    case 'ArrowDown':
      moveState.backward = false;
      break;
    case 'KeyA':
    case 'ArrowLeft':
      moveState.left = false;
      break;
    case 'KeyD':
    case 'ArrowRight':
      moveState.right = false;
      break;
  }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// ==============================================================================
// 7. BASİT ÇARPIŞMA (COLLISION DETECTION) MANTIĞI
// ==============================================================================
const playerBoundingBox = new THREE.Box3();
const PLAYER_RADIUS = 0.65; // Oyuncu koruma yarıçapı

function checkCollision(candidatePosition) {
  playerBoundingBox.min.set(
    candidatePosition.x - PLAYER_RADIUS,
    0.1,
    candidatePosition.z - PLAYER_RADIUS
  );
  playerBoundingBox.max.set(
    candidatePosition.x + PLAYER_RADIUS,
    2.5,
    candidatePosition.z + PLAYER_RADIUS
  );

  for (let i = 0; i < collisionObstacles.length; i++) {
    if (playerBoundingBox.intersectsBox(collisionObstacles[i])) {
      return true; // Çarpışma var!
    }
  }
  return false;
}

// ==============================================================================
// 8. RAYCASTER İLE ESER ETKİLEŞİMİ VE GSAP BİLGİ KARTI ANİMASYONU
// ==============================================================================
const raycaster = new THREE.Raycaster();
raycaster.far = 7.5; // Maksimum etkileşim mesafesi (7.5 metre)
const screenCenter = new THREE.Vector2(0, 0); // Ekran ortası (Crosshair)

const crosshairElement = document.getElementById('crosshair');
const exhibitCardElement = document.getElementById('exhibit-card');
const cardBadge = document.getElementById('card-badge');
const cardTitle = document.getElementById('card-title');
const cardSubtitle = document.getElementById('card-subtitle');
const cardDesc = document.getElementById('card-desc');
const cardTechList = document.getElementById('card-tech-list');
const cardCurator = document.getElementById('card-curator');
const telemetryCoords = document.getElementById('telemetry-coords');

let currentlyHoveredExhibit = null;

// HTML Bilgi Kartını GSAP ile Yumuşakça Aç
function showExhibitCard(exhibit) {
  cardBadge.textContent = `SERGİ // ESER NO. ${exhibit.number}`;
  cardTitle.textContent = exhibit.title;
  cardSubtitle.textContent = exhibit.subtitle;
  cardDesc.textContent = exhibit.desc;
  cardCurator.textContent = exhibit.curatorNote;

  // Teknolojileri badge'lere dönüştür
  cardTechList.innerHTML = '';
  exhibit.tech.forEach((techName) => {
    const span = document.createElement('span');
    span.className = 'tech-badge-item';
    span.textContent = techName;
    cardTechList.appendChild(span);
  });

  crosshairElement.classList.add('active');

  // GSAP Yumuşak Giriş Animasyonu
  gsap.killTweensOf(exhibitCardElement);
  gsap.to(exhibitCardElement, {
    autoAlpha: 1,
    y: 0,
    duration: 0.45,
    ease: 'power3.out',
  });
}

// HTML Bilgi Kartını GSAP ile Kapat
function hideExhibitCard() {
  crosshairElement.classList.remove('active');

  // GSAP Yumuşak Kapanış Animasyonu
  gsap.killTweensOf(exhibitCardElement);
  gsap.to(exhibitCardElement, {
    autoAlpha: 0,
    y: 24,
    duration: 0.3,
    ease: 'power2.in',
  });
}

// ==============================================================================
// 9. GİRİŞ EKRANI VE POINTERLOCK ETKİNLİKLERİ
// ==============================================================================
const introOverlay = document.getElementById('intro-overlay');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  // Müzeye yumuşak fade-in ile giriş
  introOverlay.classList.add('hidden');
});

controls.addEventListener('unlock', () => {
  // ESC tuşuna basıldığında veya fare serbest bırakıldığında
  introOverlay.classList.remove('hidden');
  hideExhibitCard();
  currentlyHoveredExhibit = null;
});

// ==============================================================================
// 10. RENDER VE ANİMASYON DÖNGÜSÜ (REQUESTANIMATIONFRAME - 60 FPS)
// ==============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1); // FPS düşüşlerinde ani sıçramayı önle
  const elapsedTime = clock.getElapsedTime();

  // 1. Toz Partiküllerinin Hafifçe Süzülmesi
  if (dustParticles) {
    dustParticles.rotation.y = elapsedTime * 0.015;
  }

  // 2. FPS Hareketi ve Fiziksel İvmelenme
  if (controls.isLocked) {
    // Sürtünme sönümlemesi (Smooth Damping)
    velocity.x -= velocity.x * DAMPING * delta;
    velocity.z -= velocity.z * DAMPING * delta;

    // Yürüme yönü vektörünü normalize et
    direction.z = Number(moveState.forward) - Number(moveState.backward);
    direction.x = Number(moveState.right) - Number(moveState.left);
    direction.normalize();

    // Hız ekle
    if (moveState.forward || moveState.backward) {
      velocity.z -= direction.z * WALK_SPEED * delta;
    }
    if (moveState.left || moveState.right) {
      velocity.x -= direction.x * WALK_SPEED * delta;
    }

    // Aday pozisyonları hesapla
    const deltaX = -velocity.x * delta;
    const deltaZ = -velocity.z * delta;

    const oldX = camera.position.x;
    const oldZ = camera.position.z;

    // X ekseninde hareket dene
    controls.moveRight(-deltaX);
    if (checkCollision(camera.position)) {
      camera.position.x = oldX; // Çarpışma varsa geri al
    }

    // Z ekseninde hareket dene
    controls.moveForward(-deltaZ);
    if (checkCollision(camera.position)) {
      camera.position.z = oldZ; // Çarpışma varsa geri al
    }

    // 3. Yürüme Kafa Sarsıntısı (Head Bobbing)
    const isMoving =
      moveState.forward || moveState.backward || moveState.left || moveState.right;

    if (isMoving) {
      headBobTimer += delta * 12.0;
      camera.position.y = BASE_CAMERA_Y + Math.sin(headBobTimer) * 0.045;
    } else {
      // Durunca orijinal göz seviyesine dön
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, BASE_CAMERA_Y, 0.1);
    }

    // Üst Telemetri Güncellemesi
    if (telemetryCoords) {
      telemetryCoords.textContent = `X: ${camera.position.x.toFixed(1)} | Z: ${camera.position.z.toFixed(1)}`;
    }

    // 4. Raycaster ile Eser Tespiti (Crosshair üzerinden)
    raycaster.setFromCamera(screenCenter, camera);
    const intersects = raycaster.intersectObjects(interactiveArtworks, false);

    if (intersects.length > 0) {
      const hitArtwork = intersects[0].object;
      const exhibit = hitArtwork.userData.exhibitData;

      if (currentlyHoveredExhibit !== exhibit) {
        currentlyHoveredExhibit = exhibit;
        showExhibitCard(exhibit);

        // Çerçevede hafif parlama efekti (Emissive)
        if (hitArtwork.userData.frameRef) {
          hitArtwork.userData.frameRef.material.emissive.set(exhibit.color);
          hitArtwork.userData.frameRef.material.emissiveIntensity = 0.45;
        }
      }
    } else {
      if (currentlyHoveredExhibit !== null) {
        // Önceden parlayan çerçevenin emisyonunu sıfırla
        interactiveArtworks.forEach((art) => {
          if (art.userData.frameRef) {
            art.userData.frameRef.material.emissive.set(0x05070d);
            art.userData.frameRef.material.emissiveIntensity = 0;
          }
        });

        hideExhibitCard();
        currentlyHoveredExhibit = null;
      }
    }
  }

  // Sahneyi çiz
  renderer.render(scene, camera);
}

animate();

// ==============================================================================
// 11. PENCERE BOYUTU DEĞİŞİMİ (RESPONSIVE RESIZE)
// ==============================================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
