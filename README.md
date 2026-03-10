# The Neon Canopy

A premium 3D interactive wildlife experience built with Next.js, React Three Fiber, and procedurally generated audio. Descend into a bioluminescent jungle populated by six mythical creatures, each with hand-drawn SVG illustrations, glassmorphic dossier cards, and a fully synthesized ambient soundtrack.

---

## Features

### Cinematic Meteor Intro

The site opens with a five-phase cinematic sequence:

1. **Gate** — Dark star field with "The Neon Canopy" title and a pulsing "Click to Enter" prompt. A "best with sound on" hint prepares the user for audio.
2. **Meteor Approach** (3.2s) — A canvas-rendered fireball grows from a distant dot, using quartic easing for the first 85% then decelerating into impact. Includes organic wobble, a tapered gradient trail, radial halo, hot white center, and orbiting sparks. A synthesized rising whoosh plays alongside.
3. **Explosion** — Screen shake, a crater bloom expanding to 6x scale, five colored shockwave rings (orange, amber, cyan, green, purple), 80 debris particles flying outward, a warm residual glow, and a soft white flash (70% peak). A layered crash sound fires on impact.
4. **"Made with Love"** (2.2s) — Staggered text fades in: "Made with" in subtle white, a pulsing orange heart with glow, gradient "Love" text, and "The Neon Canopy" tagline below. The ambient theme song begins here.
5. **Crossfade** (1s) — The overlay fades to transparent, revealing the main 3D site.

### Six Mythical Creatures

Each creature has a full-screen section with a hand-drawn inline SVG illustration and an animated glassmorphic dossier card featuring stat bars, ability pills, and specimen data.

| Creature | Role | Color | Abilities |
|----------|------|-------|-----------|
| **Phantom Tiger** | Apex Predator | Orange `#ff6b35` | Phase Walk, Thermal Lock, Silent Stalk |
| **Azure Macaws** | Canopy Dweller | Cyan `#13ffe1` | Echo Burst, Dive Bomb, Signal Mimic |
| **The Silverback** | Forest Guardian | Green `#00ff9d` | Ground Slam, Pack Bond, Resonance Field |
| **Neon Tree Python** | Canopy Coiler | Green `#00ff9d` | Heat Sense, Scale Cloak, Death Coil |
| **Bioluminescent Frog** | Toxic Beauty | Cyan `#13ffe1` | Toxic Aura, Light Burst, Leap Strike |
| **Void Jaguar** | Void Entity | Purple `#bf5fff` | Void Phase, Dark Pulse, Signal Erase, Rift Step |

### Immersive 3D Environment

Powered by React Three Fiber and Three.js, the scene features:

- **25 procedural jungle trees** (normal and palm variants) with animated swaying vines
- **6 jumping neon fish** arcing out of a reflective lake
- **5 walking wireframe animals** with animated leg cycles roaming the terrain
- **100 drifting fireflies** with additive blending and procedural sine/cos movement
- **12 circling birds** orbiting at altitude with emissive materials
- **600 instanced grass/fern** ground cover plants
- **25 floating glow orbs** cycling through neon colors
- **50 emissive flowers** arranged in a ring around the lake
- **Reflective lake** with `MeshReflectorMaterial`, blur, and glowing edge ring
- **Animated sun** that descends with scroll, wrapped in a wireframe icosahedron shell
- **Distant mountains and midground cliffs** with emissive edges
- **6,000 stars**, dual cloud layers, and forest environment map
- **Scroll-reactive lighting** — colors shift through HSL as you scroll

### Post-Processing Pipeline

Seven effects composed in a single pass:

| Effect | Configuration |
|--------|--------------|
| Bloom | Luminance threshold 0.2, intensity 1.5 |
| Depth of Field | Bokeh scale 2 |
| Film Noise | Opacity 0.02 |
| Vignette | Darkness 1.2 |
| Chromatic Aberration | Offset [0.001, 0.001] |
| Brightness/Contrast | +0.05 / +0.1 |
| Hue/Saturation | +0.2 saturation |

### Procedural Audio Engine

All audio is synthesized in real-time using the Web Audio API — zero external audio files.

**Ambient Theme Song** (generative, loops indefinitely):
- 8-voice pad layer with chord progression (Am9 → Cmaj7 → Dm → Em7), 8 seconds per chord with 2-second smooth frequency glides
- LFO-modulated lowpass filter for evolving timbre
- Pentatonic arpeggio layer at ~85 BPM with per-note gain envelopes
- Sub drone on A2 (110 Hz) with subtle pitch LFO
- High shimmer layer (bandpass-filtered noise bursts every 5 seconds)
- 3-second fade-in on start, 2-second fade-out on stop

**Sound Effects:**
- **Meteor approach whoosh** — Rising-pitch sawtooth oscillator (60→300 Hz) layered with bandpass-filtered wind noise, crescendoing over 3.2 seconds
- **Impact crash** — Five-layer synthesis: sub boom (55→25 Hz sine), distorted mid thud (150→40 Hz sawtooth through waveshaper), bandpass noise sweep (2000→200 Hz), sparse high-frequency crackle, and metallic ring-out overtones (220/330/440/660 Hz)

**Controls:**
- Mute/unmute toggle button in the bottom-right corner appears after the intro completes

### Content Sections

The site is organized as a 13.3-page scroll experience:

| Section | Description |
|---------|-------------|
| **Hero** | Transparent overlay showing the full 3D scene with animated scroll indicator |
| **Signal Transmission 001** | Mission statement with animated conic-gradient border beam, 4 stat tiles, and tag pills |
| **6 Creature Dossiers** | Full-screen cards for each creature with inline SVGs and animated stat bars |
| **Manifesto** | "We Believe the Jungle Lives in Code" with decorative corner marks and stat grid |
| **Depth Map** | 4 habitat layer cards (Canopy Crown, Mid-Canopy, Forest Floor, Void Stratum) |
| **Expedition Timeline** | 5-step journey from Mist Gate to Apex Overlook with glowing vertical timeline |
| **Night Bazaar** | Marketplace with 4 stalls (Kinetic Loom, Echo Smiths, Pulse Tea, Drift Berries) and a live Firefly Session event card |
| **Join The Cause** | Conservation CTA footer with neon button |

### Design System

- **Glassmorphism** — Dark glass panels (`rgba(1,5,8,0.85)`, `backdrop-filter: blur(30px)`) with light refraction pseudo-elements
- **4 neon accent colors** — Orange `#ff6b35`, Cyan `#13ffe1`, Green `#00ff9d`, Purple `#bf5fff`
- **Typography** — Outfit (body sans-serif), Playfair Display (display headings)
- **Responsive** — Mobile-first layout with Tailwind CSS breakpoints
- **Scroll-driven animations** — Framer Motion `whileInView` triggers and `useScroll` / `useTransform` parallax effects
- **Per-creature theming** — Each creature card has unique border colors, hover glow escalation, accent lines, and ability pill colors

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5 |
| 3D Engine | Three.js | 0.183.2 |
| React 3D Renderer | @react-three/fiber | 9.5.0 |
| 3D Helpers | @react-three/drei | 10.7.7 |
| Post-Processing | @react-three/postprocessing | 3.0.4 |
| Animation | Framer Motion | 12.35.2 |
| Styling | Tailwind CSS | 4 |
| Audio | Web Audio API | Native |
| Fonts | Google Fonts (Outfit, Playfair Display) | via next/font |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css            # Design system: glass effects, neon colors, 10+ keyframe
│   │                          #   animations, creature card theming, grid/aurora overlays
│   ├── layout.tsx             # Root layout with font loading and metadata
│   └── page.tsx               # Main page: Canvas, ScrollControls, audio mute toggle
└── components/
    ├── AudioEngine.tsx        # Web Audio API synthesizer — crash, whoosh, ambient
    │                          #   theme song (chord pads, arpeggio, drone, shimmer)
    ├── MeteorIntro.tsx        # 5-phase cinematic intro: gate → meteor → explosion
    │                          #   → "Made with Love" → crossfade
    ├── Overlay.tsx            # All HTML scroll content: hero, purpose card, 6 creature
    │                          #   dossiers, manifesto, depth map, timeline, night
    │                          #   bazaar, footer (1200+ lines)
    └── Scene.tsx              # Full 3D environment: trees, lake, fish, animals,
                               #   fireflies, birds, flowers, orbs, mountains, sun,
                               #   clouds, stars, post-processing (500+ lines)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ recommended
- **npm**, **yarn**, **pnpm**, or **bun**

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

> For the best experience, use a Chromium-based browser with hardware acceleration enabled and **sound on**.

### Production Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Browser Compatibility

| Feature | Requirement |
|---------|------------|
| WebGL 2 | Required for 3D scene rendering |
| Web Audio API | Required for procedural audio synthesis |
| Backdrop Filter | Required for glassmorphism effects |
| ES2020+ | Required (async/await, optional chaining) |

Tested on Chrome, Edge, and Firefox. Safari may have minor WebGL performance differences.

---

## Performance Notes

- **Instanced meshes** for ground cover (600 instances in a single draw call)
- **Single-pass post-processing** composing 7 effects via EffectComposer
- **Points geometry** for fireflies (100 vertices in one `THREE.Points` object)
- **Procedural audio** synthesized at runtime with zero network requests
- **Scroll management** handled by drei's `ScrollControls` with damping for smooth 60fps
- **Module-level constants** for debris particles and other static data (computed once, never re-rendered)

---

## Deployment

Deploy to any platform that supports Next.js:

| Platform | Command |
|----------|---------|
| **Vercel** (recommended) | `vercel deploy` |
| **Netlify** | Use the Next.js build plugin |
| **Docker** | Standard Next.js Dockerfile |

---

## License

All rights reserved.

---

*Built with Three.js, WebGL, Framer Motion, Web Audio API, and custom shaders.*
