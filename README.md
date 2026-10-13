# Mitra Zahiri — Digital Museum (3D Virtual Portfolio)

> An immersive 3D digital museum and interactive portfolio inspired by the architectural minimalism and dark atmosphere of **Sébastien Lempens**.
> Engineered with WebGL, Three.js, GSAP, and Web Audio API.

---

## 🏛️ Architectural & Atmospheric Features

- **Dark Minimalism**: Deep void atmosphere (`#06070a`) with atmospheric exponential fog (`THREE.FogExp2`).
- **Reflective Obsidian Floor**: Mirror-like polished floor reflecting overhead spotlight cones, floating plinths, and artworks.
- **Smooth Scroll & Mouse Drag Rail**: Free, unobstructed mouse navigation powered by normalized wheel mechanics, inertia drag strolling, and interactive progress rail scrubbing.
- **Floating Anthracite Plinths**: 5 custom monolith exhibition blocks showcasing framed artworks with gilded bevel trims.
- **Raycaster & GSAP Curatorial Dossier**: Seamless hover and click interaction that highlights exhibits with an emissive aura and opens a detailed project dossier.
- **Generative Ambient Soundscape**: Native Web Audio API synthesizer generating calming low-frequency binaural drones and harmonic acoustic chimes with zero external audio assets.

---



## 🎮 Navigation & Controls

| Control | Action |
| :--- | :--- |
| **Mouse Wheel / Trackpad** | Smooth glide forward & backward through gallery halls |
| **Click & Drag Mouse** | Stroll freely through the exhibition with momentum |
| **Hover on Artwork** | Glow highlight & reveal curatorial dossier |
| **Click Artwork / Wing** | Glide directly into close focus in front of the exhibit |
| **Right Progress Rail** | Click or drag thumb to scrub anywhere in the gallery |
| **Arrow Up / Down or W / S** | Step forward / backward along the camera rail |
| **Sound Button** | Toggle generative ambient soundscape |
| **Auto-Tour** | Automated guided glide across all wings |

---

## 📁 Repository Structure

```
├── index.html       # Semantic HTML5 structure, fonts, CDN importmap, HUD & dossier
├── style.css        # Luxury dark design system, glassmorphism, responsive styles
├── main.js          # Three.js 3D gallery, smooth scroll rail, raycasting, audio
├── .gitignore       # Production rules excluding build artifacts and node_modules
├── package.json     # Vite setup, scripts, and dependencies
└── README.md        # Exhibition documentation & guide
```

---

## 🖼️ Adding Custom Artwork Images

Each exhibit in `main.js` (`EXHIBITS_DATA`) includes an `imageUrl` property ready for your assets:

```javascript
// Example:
{
  id: 'ray-os',
  title: 'RĀY OS',
  // ...
  imageUrl: './public/assets/ray-os.jpg', // Set your image path here
}
```

When no image URL is provided, the gallery automatically generates high-resolution procedural canvas artworks displaying geometric monolith compositions.

---

## 🚀 Quick Start

### Development Server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build:
```bash
npm run build
```

---

## 👤 Curator & Developer

- **Mitra Zahiri**: [github.com/MitraZahiri](https://github.com/MitraZahiri)
- **Repository**: [github.com/MitraZahiri/Portfolio](https://github.com/MitraZahiri/Portfolio)
