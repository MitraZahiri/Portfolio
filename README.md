# The Museum of Code — 3D Virtual Gallery Portfolio

> **An immersive 3D architectural museum portfolio by Mitra Zahiri.**  
> Inspired by the dynamic storytelling and scroll-driven WebGL experience of [Sébastien Lempens](https://sebastien-lempens.com/), reimagined as a neoclassical-meets-cyberpunk virtual art gallery and museum tour.

---

## 🏛️ The Concept

Instead of a conventional 2D webpage or a motorized ride, visitors embark on a **cinematic stroll through six architectural museum wings**. The camera glides along an illuminated Z-axis gallery rail through marble corridors, neoclassical arches, spotlights, and floating geometric totems.

### 🌟 Exhibition Wings

1. **Wing 01 // The Grand Rotunda**: Monumental circular entrance hall featuring marble flooring, ambient skylight beams, and the rotating *Oracle of Code* sculpture.
2. **Wing 02 // The Wing of Masterpieces**: Gilded 3D gallery frames exhibiting four flagship interactive creations (*Datasphere Ascension*, *Neural Lumina*, *Prism Aether*, and *The Cosmic Chronos*).
3. **Wing 03 // The Hall of Artifacts**: Illuminated obsidian vitrines exhibiting floating interactive 3D sculptures symbolizing technical competencies (Spatial Computing, Modern Architecture, Distributed Cloud, and Motion Direction).
4. **Wing 04 // The Archive of Chronicles**: Architectural glass panels documenting career milestones, engineering leadership, and open-source contributions.
5. **Wing 05 // The Curator's Study**: Contemplative monolith gallery detailing the curator's design and engineering philosophy.
6. **Wing 06 // The VIP Salon & Inquiries**: Official curator reception desk with an interactive visitor guestbook, one-click contact channels, and portfolio archives.

---

## ✨ Features & Architecture

- **60 FPS 3D WebGL Engine**: Built with Three.js and custom lighting models (spotlight tracking, marble reflections, dynamic cursor flashlight, and floating atmospheric dust particles).
- **Procedural Web Audio Synthesizer**: Generative ambient museum drone, harmonic reverberation, and spatial frequency transition chimes synthesized entirely via Web Audio API (0 external audio dependencies, instant playback).
- **Live Equalizer Visualizer**: Real-time frequency analyser bars rendered in the top HUD.
- **Architectural Blueprint Radar (Mini-Map)**: 2D interactive architectural floorplan with live visitor radar beacon and one-click teleportation.
- **Interactive Inspect Mode**: Click any masterpiece or artifact to frame the artwork and open a curatorial critique placard with performance telemetry, tech stack badges, and live demo / source links.
- **Auto-Tour Playback**: Automated cinematic glide through the museum with one-click pause and resume.
- **Responsive Controls**: Mouse wheel, trackpad gestures, keyboard shortcuts (`W`/`S`, Arrow keys, `Space` for auto-tour, `M` for audio), and mobile touch gestures.

---

## 🛠️ Technology Stack

- **Graphics & 3D**: [Three.js](https://threejs.org/) (WebGL 2.0, procedural geometry, lighting, raycasting, fog)
- **Frontend & UI**: [React 19](https://react.dev/), [Vite](https://vite.dev/)
- **Motion & Audio**: Web Audio API (Generative dual-oscillator drone, biquad lowpass filtering, pentatonic chimes), CSS Keyframes
- **Icons & Typography**: Google Fonts (*Cinzel*, *Italiana*, *Space Grotesk*, *Inter*), Lucide Icons
- **Tooling & Quality**: Oxlint (0 warnings, 0 errors), Vite production bundler

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/MitraZahiri/Portfolio.git
cd Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📜 Curator & Author

- **Curator**: [Mitra Zahiri](https://github.com/MitraZahiri)
- **Repository**: [github.com/MitraZahiri/Portfolio](https://github.com/MitraZahiri/Portfolio)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
