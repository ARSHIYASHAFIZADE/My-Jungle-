<div align="center">

# The Neon Canopy

**A premium bioluminescent 3D jungle experience — six mythical creatures, procedural audio, cinematic intro**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://my-jungle-seven.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.183.2-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Descend into a bioluminescent jungle populated by six mythical creatures. A five-phase cinematic meteor intro leads into a 13-section scroll experience with hand-drawn SVG creature dossiers, real-time procedurally synthesized audio, and a dense Three.js environment — all running in the browser with zero external audio files.

---

## Features

### Cinematic Meteor Intro

The site opens with a five-phase cinematic sequence:

1. **Gate** — Dark star field with title and pulsing "Click to Enter" prompt
2. **Meteor Approach** (3.2s) — Canvas-rendered fireball with quartic easing, organic wobble, tapered gradient trail, radial halo, hot white center, orbiting sparks, and a synthesized rising whoosh
3. **Explosion** — Screen shake, crater bloom to 6× scale, five colored shockwave rings, 80 debris particles, warm residual glow, layered crash sound
4. **"Made with Love"** (2.2s) — Staggered text with pulsing orange heart, gradient type, ambient theme song begins
5. **Crossfade** (1s) — Overlay fades to reveal the 3D scene

### Six Mythical Creatures

| Creature | Role | Color | Abilities |
|----------|------|-------|-----------|
| **Phantom Tiger** | Apex Predator | `#ff6b35` | Phase Walk · Thermal Lock · Silent Stalk |
| **Azure Macaws** | Canopy Dweller | `#13ffe1` | Echo Burst · Dive Bomb · Signal Mimic |
| **The Silverback** | Forest Guardian | `#00ff9d` | Ground Slam · Pack Bond · Resonance Field |
| **Neon Tree Python** | Canopy Coiler | `#00ff9d` | Heat Sense · Scale Cloak · Death Coil |
| **Bioluminescent Frog** | Toxic Beauty | `#13ffe1` | Toxic Aura · Light Burst · Leap Strike |
| **Void Jaguar** | Void Entity | `#bf5fff` | Void Phase · Dark Pulse · Signal Erase · Rift Step |

### 3D Environment

- **25** procedural jungle trees (normal + palm) with animated swaying vines
- **6** jumping neon fish arcing out of a reflective lake
- **5** walking wireframe animals with animated leg cycles
- **100** drifting fireflies with additive blending and sine/cos motion
- **12** circling birds orbiting at altitude with emissive materials
- **600** instanced grass/fern ground cover plants (single draw call)
- **25** floating glow orbs cycling through neon colors
- **50** emissive flowers in a ring around the lake
- Reflective lake with `MeshReflectorMaterial`, blur, and glowing edge ring
- Animated scroll-descending sun wrapped in a wireframe icosahedron
- Distant mountains and midground cliffs with emissive edges
- **6,000 stars**, dual cloud layers, and forest environment map
- Scroll-reactive lighting that shifts through HSL as you scroll

### Post-Processing Pipeline

Seven effects in a single EffectComposer pass:

| Effect | Config |
|--------|--------|
| Bloom | Luminance threshold 0.2 · intensity 1.5 |
| Depth of Field | Bokeh scale 2 |
| Film Noise | Opacity 0.02 |
| Vignette | Darkness 1.2 |
| Chromatic Aberration | Offset [0.001, 0.001] |
| Brightness / Contrast | +0.05 / +0.1 |
| Hue / Saturation | +0.2 saturation |

### Procedural Audio Engine

All audio synthesized in real-time — zero external audio files.

**Ambient Theme Song** (generative, loops indefinitely)
- 8-voice pad layer with chord progression Am9 → Cmaj7 → Dm → Em7, 8s per chord with 2s smooth frequency glides
- LFO-modulated lowpass filter for evolving timbre
- Pentatonic arpeggio at ~85 BPM with per-note gain envelopes
- Sub drone on A2 (110 Hz) with subtle pitch LFO
- High shimmer layer (bandpass-filtered noise bursts every 5 seconds)
- 3s fade-in · 2s fade-out

**Sound Effects**
- **Meteor whoosh** — Rising sawtooth (60→300 Hz) layered with bandpass-filtered wind noise over 3.2 seconds
- **Impact crash** — 5-layer synthesis: sub boom (55→25 Hz), distorted mid thud (150→40 Hz sawtooth through waveshaper), bandpass noise sweep (2000→200 Hz), high-frequency crackle, metallic ring-out overtones

### Scroll Sections

13.3-page scroll experience:

| Section | Description |
|---------|-------------|
| Hero | Transparent overlay over the full 3D scene with scroll indicator |
| Signal Transmission 001 | Mission statement with animated border beam, 4 stat tiles, tag pills |
| 6 Creature Dossiers | Full-screen glassmorphic cards with inline SVGs and animated stat bars |
| Manifesto | "We Believe the Jungle Lives in Code" with decorative marks and stat grid |
| Depth Map | 4 habitat layer cards (Canopy Crown, Mid-Canopy, Forest Floor, Void Stratum) |
| Expedition Timeline | 5-step journey from Mist Gate to Apex Overlook |
| Night Bazaar | Marketplace with 4 stalls and a live Firefly Session event card |
| Join The Cause | Conservation CTA footer |

---

## Tech Stack

### Core

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

### 3D & Animation

![Three.js](https://img.shields.io/badge/Three.js-0.183.2-black?style=flat-square&logo=threedotjs&logoColor=white)
![R3F](https://img.shields.io/badge/@react--three/fiber-9.5.0-black?style=flat-square&logo=threedotjs&logoColor=white)
![Drei](https://img.shields.io/badge/@react--three/drei-10.7.7-black?style=flat-square&logo=threedotjs&logoColor=white)
![Postprocessing](https://img.shields.io/badge/@react--three/postprocessing-3.0.4-black?style=flat-square&logo=threedotjs&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.35.2-0055FF?style=flat-square&logo=framer&logoColor=white)

### Audio

![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Native-FF6B35?style=flat-square)

### Utilities

![clsx](https://img.shields.io/badge/clsx-2.1.1-gray?style=flat-square)
![tailwind-merge](https://img.shields.io/badge/tailwind--merge-3.5.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## Getting Started

### Prerequisites

- Node.js `>= 18`
- A Chromium-based browser with hardware acceleration enabled

### Installation

```bash
git clone https://github.com/ARSHIYASHAFIZADE/My-Jungle-.git
cd My-Jungle-
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> For the best experience, use Chrome or Edge with **sound on** and hardware acceleration enabled.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css         Design system: glass effects, neon colors,
│   │                       10+ keyframe animations, creature theming
│   ├── layout.tsx          Root layout with font loading and metadata
│   └── page.tsx            Main page: Canvas, ScrollControls, audio toggle
└── components/
    ├── AudioEngine.tsx     Web Audio API synthesizer — crash, whoosh,
    │                       ambient theme (chord pads, arpeggio, drone)
    ├── MeteorIntro.tsx     5-phase cinematic intro: gate → meteor →
    │                       explosion → "Made with Love" → crossfade
    ├── Overlay.tsx         All HTML scroll content: hero, purpose card,
    │                       6 creature dossiers, manifesto, depth map,
    │                       timeline, night bazaar, footer (1200+ lines)
    └── Scene.tsx           Full 3D environment: trees, lake, fish,
                            animals, fireflies, birds, flowers, orbs,
                            mountains, sun, clouds, post-processing
```

---

## Performance Notes

- Instanced meshes for 600 ground cover plants in a single draw call
- Single-pass EffectComposer composing 7 post-processing effects
- `THREE.Points` for 100 fireflies as a single geometry object
- All audio synthesized at runtime — zero network audio requests
- `ScrollControls` with damping for smooth 60fps scroll handling
- Module-level static data computed once, never re-created on render

---

## Browser Requirements

| Feature | Requirement |
|---------|-------------|
| WebGL 2 | Required for 3D scene |
| Web Audio API | Required for procedural audio |
| Backdrop Filter | Required for glassmorphism |
| ES2020+ | Required |

Tested on Chrome, Edge, and Firefox. Safari may have minor WebGL performance differences.

---

## Deployment

| Platform | Notes |
|----------|-------|
| **Vercel** (live) | Zero-config Next.js deployment |
| **Netlify** | Use the Next.js build plugin |
| **Docker** | Standard Next.js standalone Dockerfile |

---

## License

All rights reserved.

---

<div align="center">

*Built with Three.js · React Three Fiber · Framer Motion · Web Audio API*

[![GitHub](https://img.shields.io/badge/GitHub-ARSHIYASHAFIZADE-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ARSHIYASHAFIZADE)
[![Live](https://img.shields.io/badge/Live-my--jungle--seven.vercel.app-6366f1?style=flat-square&logo=vercel&logoColor=white)](https://my-jungle-seven.vercel.app)

</div>
