'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

function useParallax(value: any, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

interface StatProps {
  label: string
  percentage: string
  colorClass: string
}

function Stat({ label, percentage, colorClass }: StatProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs sm:text-sm uppercase tracking-wider text-white mb-1.5 font-semibold">
        <span>{label}</span><span>{percentage}</span>
      </div>
      <div className="stat-bar">
        <motion.div 
          className={`stat-fill ${colorClass}`} 
          initial={{ width: '0%' }}
          whileInView={{ width: percentage }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </div>
  )
}

export function HTMLOverlay() {
  const { scrollYProgress } = useScroll()
  const glowShift = useSpring(useTransform(scrollYProgress, [0, 1], [0, 360]), { stiffness: 80, damping: 20 })
  const glowHue = useTransform(glowShift, (v) => `hue-rotate(${v}deg)`)
  const ribbonParallax = useParallax(scrollYProgress, 400)
  const ribbonTilt = useTransform(glowShift, (v) => v * 0.1)
  const heroParallax = useParallax(scrollYProgress, 200)
  const timelineGlow = useTransform(scrollYProgress, [0, 1], [0.25, 1])
  const gridDrift = useParallax(scrollYProgress, 320)
  const gridTilt = useTransform(glowShift, (v) => v * 0.02)
  const pulseScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.08])
  const pulseOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1])

  return (
    <div className="w-full pointer-events-none text-white relative z-50">
      <div className="fixed inset-0 -z-10 mix-blend-screen opacity-50">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,157,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(19,255,225,0.12),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(255,107,53,0.12),transparent_30%)]"
          style={{ filter: glowHue, opacity: 0.8 }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,255,157,0.05),rgba(19,255,225,0.05),rgba(255,107,53,0.05))]"
          style={{ y: ribbonParallax, rotate: ribbonTilt }}
        />
        <motion.div
          className="absolute inset-0 grid-waves"
          style={{ y: gridDrift, rotate: gridTilt, opacity: pulseOpacity, scale: pulseScale }}
        />
      </div>
      
      {/* 0. Hero (100vh) — transparent so the full 3D scene is visible */}
      <section className="h-screen w-full relative pointer-events-none">
        {/* Small top-left title */}
        <motion.div
          className="absolute top-8 left-8"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="flex flex-col leading-none" style={{ gap: '2px' }}>
            <p className="text-[10px] sm:text-xs text-white/50 tracking-[0.2em] font-medium uppercase m-0 p-0">
              Descend into the glowing heart of the wild
            </p>
            <h1 className="text-sm sm:text-base font-bold uppercase tracking-[0.3em] text-white/50 m-0 p-0">
              The Neon Canopy
            </h1>
          </div>
        </motion.div>
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40 text-[10px] uppercase tracking-[0.2em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span>Scroll to Descend</span>
          <div className="mouse-icon scale-75">
            <div className="wheel"></div>
          </div>
        </motion.div>
      </section>

      {/* 1. Purpose (100vh) */}
      <section className="h-screen w-full flex items-center justify-center px-6 pointer-events-auto relative purpose-section">
        {/* Animated background orbs */}
        <div className="purpose-orb purpose-orb-1" />
        <div className="purpose-orb purpose-orb-2" />
        <div className="purpose-orb purpose-orb-3" />

        <motion.div
          className="purpose-card max-w-4xl w-full"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated border beam */}
          <div className="purpose-border-beam" />

          {/* Top eyebrow row */}
          <div className="flex items-center gap-3 mb-8">
            <div className="purpose-eyebrow-dot" />
            <span className="purpose-eyebrow">Signal Transmission 001</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            <span className="purpose-eyebrow opacity-40">NEON CANOPY OS v1.0</span>
          </div>

          {/* Main title with per-word neon color animation */}
          <h2 className="purpose-title mb-6">
            <span className="purpose-word-green">Encode</span>{' '}
            <span className="purpose-word-cyan">the</span>{' '}
            <span className="purpose-word-orange">Wild.</span>{' '}
            <span className="purpose-word-purple">Refuse</span>{' '}
            <span className="purpose-word-green">to</span>{' '}
            <span className="purpose-word-cyan">Forget.</span>
          </h2>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
            The Neon Canopy is an act of remembrance rendered in light. Every glowing node, every animated creature, every pulse of color is a signal that ecosystems are living networks — and that losing one thread unravels the whole canopy.
          </p>

          {/* 4 colorful stat tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { value: '6',    label: 'Apex Species',   color: 'orange', icon: '◈' },
              { value: '3',    label: 'Habitat Layers', color: 'cyan',   icon: '▣' },
              { value: '1.2M', label: 'Firefly Nodes',  color: 'green',  icon: '✦' },
              { value: '∞',    label: 'Signal Loops',   color: 'purple', icon: '⟳' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className={`purpose-stat purpose-stat-${s.color}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
              >
                <span className="purpose-stat-icon">{s.icon}</span>
                <span className="purpose-stat-val">{s.value}</span>
                <span className="purpose-stat-lbl">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom pill row */}
          <div className="flex flex-wrap gap-2">
            {['Bioluminescence', 'Procedural Animation', '3D WebGL', 'Neon Ecosystems', 'Living Code'].map((tag, i) => (
              <motion.span
                key={tag}
                className="purpose-tag"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.5 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>



      {/* 2. Tiger (100vh) */}
      <section className="h-screen w-full flex items-center justify-center pointer-events-auto px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mx-auto">
          <motion.div 
            className="glass creature-card-orange order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="mb-6">
              <span className="badge neon-orange">Apex Predator</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Playfair_Display'] mb-4 text-white glow-text leading-tight">The Phantom Tiger</h2>
            </div>
            <p className="text-white/70 mb-8 text-base sm:text-lg font-light leading-relaxed">In the Neon Canopy, predators are made of light. The Phantom Tiger moves through glowing terrain like a shadow in a system that never sleeps. It exists not as flesh, but as motion, energy, and code.</p>
            <div className="dossier-id">SPEC-001 // Apex Predator Class</div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <Stat label="Stealth" percentage="98%" colorClass="orange" />
              <Stat label="Agility" percentage="92%" colorClass="orange" />
              <Stat label="Night Vision" percentage="96%" colorClass="orange" />
              <Stat label="Strike Speed" percentage="89%" colorClass="orange" />
            </div>
            <div className="ability-row">
              <span className="ability-pill orange">Phase Walk</span>
              <span className="ability-pill orange">Thermal Lock</span>
              <span className="ability-pill orange">Silent Stalk</span>
            </div>
          </motion.div>
          
          <motion.div className="flex justify-center order-1 lg:order-2" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="animal-svg-container">
              <svg className="w-full h-full" viewBox="0 0 280 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="catGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="catSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <radialGradient id="catBodyGrad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%"  stopColor="#c8895a"/>
                    <stop offset="45%" stopColor="#a06030"/>
                    <stop offset="100%" stopColor="#5a3010"/>
                  </radialGradient>
                  <radialGradient id="catBellyGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"  stopColor="#f0d0a0"/>
                    <stop offset="100%" stopColor="#c8895a" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="catFaceGrad" cx="50%" cy="45%" r="55%">
                    <stop offset="0%"  stopColor="#d9a070"/>
                    <stop offset="70%" stopColor="#b87040"/>
                    <stop offset="100%" stopColor="#7a4520"/>
                  </radialGradient>

                  <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#ff6b35" stopOpacity="0"/>
                  </radialGradient>
                </defs>

                {/* Ambient neon glow under cat */}
                <ellipse cx="140" cy="270" rx="70" ry="18" fill="#ff6b35" opacity="0.18" filter="url(#catSoftGlow)"/>

                {/* Tail — curling to right side */}
                <path stroke="#7a4520" strokeWidth="11" strokeLinecap="round" fill="none"
                  d="M 195 240 C 228 235 248 215 242 192 C 237 172 220 168 224 148"/>
                <path stroke="#c8895a" strokeWidth="8" strokeLinecap="round" fill="none"
                  d="M 195 240 C 228 235 248 215 242 192 C 237 172 220 168 224 148"/>
                {/* Tail tip */}
                <ellipse cx="224" cy="146" rx="7" ry="9" fill="#a06030"/>

                {/* Body */}
                <ellipse cx="140" cy="210" rx="62" ry="55" fill="url(#catBodyGrad)"/>
                {/* Belly patch */}
                <ellipse cx="140" cy="220" rx="32" ry="36" fill="url(#catBellyGrad)" opacity="0.75"/>
                {/* Body stripes — tabby markings */}
                <path stroke="#5a3010" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"
                  d="M 105 190 C 102 198 103 210 107 218"/>
                <path stroke="#5a3010" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"
                  d="M 118 183 C 114 195 115 210 119 220"/>
                <path stroke="#5a3010" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"
                  d="M 162 183 C 166 195 165 210 161 220"/>
                <path stroke="#5a3010" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"
                  d="M 175 190 C 178 198 177 210 173 218"/>

                {/* Front paws sitting on ground */}
                <ellipse cx="113" cy="258" rx="22" ry="14" fill="#a06030"/>
                <ellipse cx="167" cy="258" rx="22" ry="14" fill="#a06030"/>
                {/* Paw toes */}
                <ellipse cx="104" cy="263" rx="7" ry="5" fill="#b87040"/>
                <ellipse cx="113" cy="265" rx="7" ry="5" fill="#b87040"/>
                <ellipse cx="122" cy="263" rx="7" ry="5" fill="#b87040"/>
                <ellipse cx="158" cy="263" rx="7" ry="5" fill="#b87040"/>
                <ellipse cx="167" cy="265" rx="7" ry="5" fill="#b87040"/>
                <ellipse cx="176" cy="263" rx="7" ry="5" fill="#b87040"/>

                {/* Neck */}
                <ellipse cx="140" cy="162" rx="28" ry="20" fill="#b87040"/>

                {/* Head */}
                <ellipse cx="140" cy="128" rx="48" ry="44" fill="url(#catFaceGrad)"/>

                {/* Forehead tabby stripes */}
                <path stroke="#7a4520" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"
                  d="M 125 92 C 126 100 126 108 124 114"/>
                <path stroke="#7a4520" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"
                  d="M 136 88 C 137 98 137 108 135 115"/>
                <path stroke="#7a4520" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"
                  d="M 147 88 C 147 98 148 108 148 115"/>
                <path stroke="#7a4520" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"
                  d="M 157 92 C 157 100 156 108 155 114"/>

                {/* Ears */}
                <polygon points="100,98 86,64 118,90" fill="#b87040"/>
                <polygon points="100,98 90,68 116,90" fill="#e8b090" opacity="0.6"/>
                <polygon points="180,98 194,64 162,90" fill="#b87040"/>
                <polygon points="180,98 190,68 164,90" fill="#e8b090" opacity="0.6"/>

                {/* Muzzle / cheek puffs */}
                <ellipse cx="122" cy="142" rx="20" ry="16" fill="#e8c090" opacity="0.8"/>
                <ellipse cx="158" cy="142" rx="20" ry="16" fill="#e8c090" opacity="0.8"/>
                <ellipse cx="140" cy="148" rx="16" ry="12" fill="#f0d4a8" opacity="0.6"/>

                {/* Nose — small pink triangle */}
                <path d="M 136 132 Q 140 128 144 132 L 142 137 Q 140 139 138 137 Z" fill="#e07090"/>
                {/* Mouth */}
                <path stroke="#a05050" strokeWidth="1.5" strokeLinecap="round" fill="none"
                  d="M 140 137 C 136 141 132 142 130 141 M 140 137 C 144 141 148 142 150 141"/>
                {/* Whiskers */}
                <line x1="95"  y1="136" x2="120" y2="140" stroke="#fff8f0" strokeWidth="1.2" opacity="0.7"/>
                <line x1="92"  y1="142" x2="120" y2="143" stroke="#fff8f0" strokeWidth="1.2" opacity="0.7"/>
                <line x1="94"  y1="148" x2="120" y2="146" stroke="#fff8f0" strokeWidth="1.0" opacity="0.6"/>
                <line x1="185" y1="136" x2="160" y2="140" stroke="#fff8f0" strokeWidth="1.2" opacity="0.7"/>
                <line x1="188" y1="142" x2="160" y2="143" stroke="#fff8f0" strokeWidth="1.2" opacity="0.7"/>
                <line x1="186" y1="148" x2="160" y2="146" stroke="#fff8f0" strokeWidth="1.0" opacity="0.6"/>

                {/* Eyes — big cute round eyes */}
                {/* Left eye */}
                <circle cx="118" cy="120" r="15" fill="#1a0f05"/>
                <circle cx="118" cy="120" r="11" fill="#6b4020"/>
                <circle cx="118" cy="120" r="7"  fill="#2a1505"/>
                <circle cx="113" cy="115" r="4"  fill="#fff" opacity="0.9"/>
                <circle cx="123" cy="118" r="2"  fill="#fff" opacity="0.5"/>

                {/* Right eye */}
                <circle cx="162" cy="120" r="15" fill="#1a0f05"/>
                <circle cx="162" cy="120" r="11" fill="#6b4020"/>
                <circle cx="162" cy="120" r="7"  fill="#2a1505"/>
                <circle cx="157" cy="115" r="4"  fill="#fff" opacity="0.9"/>
                <circle cx="167" cy="118" r="2"  fill="#fff" opacity="0.5"/>

                {/* ── HEADPHONES ── */}
                {/* Headband arc over the top */}
                <path stroke="#e8e8e8" strokeWidth="9" strokeLinecap="round" fill="none"
                  d="M 93 105 C 93 60 187 60 187 105"/>
                <path stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none"
                  d="M 93 105 C 93 62 187 62 187 105" opacity="0.6"/>
                {/* Headband highlight */}
                <path stroke="#f0f0f0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"
                  d="M 103 78 C 120 62 160 62 177 78"/>

                {/* Left ear cup */}
                <rect x="78" y="98" width="28" height="34" rx="10" fill="#d8d8d8"/>
                <rect x="80" y="100" width="24" height="30" rx="8"  fill="#eeeeee"/>
                <rect x="83" y="103" width="18" height="24" rx="6"  fill="#c0c0c0"/>

                {/* Right ear cup */}
                <rect x="174" y="98" width="28" height="34" rx="10" fill="#d8d8d8"/>
                <rect x="176" y="100" width="24" height="30" rx="8"  fill="#eeeeee"/>
                <rect x="179" y="103" width="18" height="24" rx="6"  fill="#c0c0c0"/>

                {/* ── BOW ── */}
                {/* Left lobe */}
                <path d="M 140 82 C 128 72 114 68 112 76 C 110 84 122 88 140 90 Z" fill="#f060a0"/>
                <path d="M 140 82 C 128 72 114 68 112 76 C 110 84 122 88 140 90 Z"
                  fill="none" stroke="#ff80c0" strokeWidth="1" opacity="0.6"/>
                {/* Right lobe */}
                <path d="M 140 82 C 152 72 166 68 168 76 C 170 84 158 88 140 90 Z" fill="#f060a0"/>
                <path d="M 140 82 C 152 72 166 68 168 76 C 170 84 158 88 140 90 Z"
                  fill="none" stroke="#ff80c0" strokeWidth="1" opacity="0.6"/>
                {/* Center knot */}
                <circle cx="140" cy="85" r="7" fill="#e04090"/>
                <circle cx="140" cy="85" r="4" fill="#f860b0"/>
                {/* Bow shine */}
                <ellipse cx="130" cy="77" rx="5" ry="3" fill="#ffa0d0" opacity="0.6" transform="rotate(-20 130 77)"/>
                <ellipse cx="150" cy="77" rx="5" ry="3" fill="#ffa0d0" opacity="0.6" transform="rotate(20 150 77)"/>
              </svg>
              <div className="glow-orb orange-orb"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Macaw (100vh) */}
      <section className="h-screen w-full flex items-center justify-center pointer-events-auto px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mx-auto">
            <motion.div className="flex justify-center order-1" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="animal-svg-container">
                
                <svg className="w-full h-full" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="macawGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="3.5" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <linearGradient id="wingBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00ff9d"/>
                      <stop offset="50%" stopColor="#13ffe1"/>
                      <stop offset="100%" stopColor="#0088aa"/>
                    </linearGradient>
                    <linearGradient id="wingFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#13ffe1"/>
                      <stop offset="60%" stopColor="#00ccbb"/>
                      <stop offset="100%" stopColor="#006699"/>
                    </linearGradient>
                    <linearGradient id="tailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#13ffe1"/>
                      <stop offset="50%" stopColor="#00ff9d"/>
                      <stop offset="100%" stopColor="#0066cc"/>
                    </linearGradient>
                  </defs>

                  {/* Back wing — behind body */}
                  <g>
                    <path fill="url(#wingBackGrad)" opacity="0.85" filter="url(#macawGlow)"
                      d="M 128 138 C 95 110 48 80 28 55 C 18 42 28 30 40 38 C 60 50 88 78 110 108 Z"/>
                    {/* feather detail lines */}
                    <path stroke="#00ff9d" strokeWidth="1" opacity="0.4" fill="none"
                      d="M 128 138 C 100 115 68 88 42 60"/>
                    <path stroke="#13ffe1" strokeWidth="0.8" opacity="0.3" fill="none"
                      d="M 125 145 C 96 122 62 94 36 68"/>
                    <path stroke="#00ff9d" strokeWidth="0.8" opacity="0.3" fill="none"
                      d="M 120 150 C 92 128 60 100 34 75"/>
                  </g>

                  {/* Tail feathers */}
                  <path fill="url(#tailGrad)" opacity="0.9" filter="url(#macawGlow)"
                    d="M 130 185 C 118 200 105 230 108 248 C 110 258 118 258 122 248 C 126 235 128 210 132 200 Z"/>
                  <path fill="#13ffe1" opacity="0.7"
                    d="M 134 186 C 128 202 124 232 128 248 C 130 258 138 256 138 244 C 138 228 136 210 138 198 Z"/>
                  <path fill="#00ff9d" opacity="0.6"
                    d="M 138 185 C 136 200 138 226 144 242 C 147 252 155 249 153 238 C 150 224 144 205 142 192 Z"/>
                  {/* Tail spine */}
                  <line x1="130" y1="186" x2="118" y2="246" stroke="#13ffe1" strokeWidth="1" opacity="0.5"/>
                  <line x1="134" y1="186" x2="130" y2="246" stroke="#00ff9d" strokeWidth="1" opacity="0.5"/>

                  {/* Body */}
                  <ellipse cx="130" cy="162" rx="30" ry="38" fill="#006688" filter="url(#macawGlow)"/>
                  <ellipse cx="130" cy="162" rx="22" ry="28" fill="#008899" opacity="0.6"/>
                  {/* Breast feathers pattern */}
                  <path stroke="#13ffe1" strokeWidth="1" opacity="0.3" fill="none"
                    d="M 112 148 Q 130 144 148 148"/>
                  <path stroke="#13ffe1" strokeWidth="1" opacity="0.25" fill="none"
                    d="M 108 158 Q 130 153 152 158"/>
                  <path stroke="#13ffe1" strokeWidth="1" opacity="0.2" fill="none"
                    d="M 110 168 Q 130 163 150 168"/>

                  {/* Front wing */}
                  <g>
                    <path fill="url(#wingFrontGrad)" opacity="0.9" filter="url(#macawGlow)"
                      d="M 128 145 C 158 118 198 88 222 62 C 234 48 226 34 214 42 C 192 54 162 82 140 112 Z"/>
                    <path stroke="#13ffe1" strokeWidth="1.2" opacity="0.45" fill="none"
                      d="M 128 145 C 158 118 194 90 218 66"/>
                    <path stroke="#00ff9d" strokeWidth="1" opacity="0.35" fill="none"
                      d="M 131 152 C 160 126 194 100 216 76"/>
                    <path stroke="#13ffe1" strokeWidth="0.8" opacity="0.3" fill="none"
                      d="M 133 158 C 162 133 194 108 214 86"/>
                  </g>

                  {/* Neck */}
                  <ellipse cx="130" cy="128" rx="20" ry="16" fill="#007799"/>

                  {/* Head */}
                  <circle cx="130" cy="105" r="28" fill="#008899" filter="url(#macawGlow)"/>
                  {/* Head feather cap */}
                  <path fill="#00ff9d" opacity="0.7"
                    d="M 118 82 C 114 70 110 56 116 48 C 120 42 126 44 128 52 C 130 44 136 42 140 48 C 146 56 142 70 138 82 C 135 76 130 74 125 76 Z"/>
                  <path stroke="#13ffe1" strokeWidth="1.5" opacity="0.6" fill="none"
                    d="M 124 82 C 122 70 120 58 122 50"/>
                  <path stroke="#00ff9d" strokeWidth="1.5" opacity="0.6" fill="none"
                    d="M 130 80 C 130 68 130 56 130 48"/>
                  <path stroke="#13ffe1" strokeWidth="1.5" opacity="0.6" fill="none"
                    d="M 136 82 C 138 70 140 58 138 50"/>

                  {/* Face patch */}
                  <ellipse cx="120" cy="110" rx="10" ry="8" fill="#fff" opacity="0.12"/>
                  <ellipse cx="140" cy="110" rx="10" ry="8" fill="#fff" opacity="0.12"/>

                  {/* Beak */}
                  <path fill="#ffcc44"
                    d="M 118 108 C 114 112 112 120 116 124 C 118 126 122 124 124 120 L 124 108 Z"/>
                  <path fill="#ffaa00"
                    d="M 124 108 L 124 120 C 126 122 130 121 130 118 L 128 108 Z"/>
                  <path stroke="#cc8800" strokeWidth="1" fill="none"
                    d="M 118 114 C 120 116 124 116 128 114"/>

                  {/* Eye */}
                  <circle cx="138" cy="103" r="8" fill="#010508" filter="url(#macawGlow)"/>
                  <circle cx="138" cy="103" r="5" fill="#13ffe1" opacity="0.8"/>
                  <circle cx="138" cy="103" r="2.5" fill="#000"/>
                  <circle cx="140" cy="101" r="1.5" fill="#fff" opacity="0.9"/>

                  {/* Feet / perch */}
                  <path stroke="#ffaa44" strokeWidth="3" strokeLinecap="round" fill="none"
                    d="M 118 196 L 112 212 M 112 212 L 106 222 M 112 212 L 116 222 M 112 212 L 120 220"/>
                  <path stroke="#ffaa44" strokeWidth="3" strokeLinecap="round" fill="none"
                    d="M 140 196 L 146 212 M 146 212 L 140 222 M 146 212 L 150 222 M 146 212 L 156 220"/>

                  {/* Neon circuit trace on body */}
                  <path stroke="#13ffe1" strokeWidth="0.8" fill="none" opacity="0.3" strokeDasharray="3 4"
                    d="M 116 155 L 130 150 L 144 155"/>
                </svg>
                <div className="glow-orb cyan-orb"></div>
              </div>
            </motion.div>

            <motion.div className="glass creature-card-cyan order-2" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="mb-6">
                <span className="badge neon-cyan">Canopy Dweller</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Playfair_Display'] mb-4 text-white glow-text leading-tight">Azure Macaws</h2>
              </div>
              <p className="text-white/70 mb-8 text-base sm:text-lg font-light leading-relaxed">Living among the highest peaks of the canopy, they navigate the thick foliage with acrobatic precision. Their vibrant feathers act as complex social signals in deep foliage environments.</p>
              <div className="dossier-id">SPEC-002 // Canopy Dweller Class</div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <Stat label="Flight Speed" percentage="85%" colorClass="cyan" />
                <Stat label="Intelligence" percentage="95%" colorClass="cyan" />
                <Stat label="Echo Range" percentage="88%" colorClass="cyan" />
                <Stat label="Wing Sync" percentage="90%" colorClass="cyan" />
              </div>
              <div className="ability-row">
                <span className="ability-pill cyan">Echo Burst</span>
                <span className="ability-pill cyan">Dive Bomb</span>
                <span className="ability-pill cyan">Signal Mimic</span>
              </div>
            </motion.div>
        </div>
      </section>

      {/* 4. Gorilla (100vh) */}
      <section className="h-screen w-full flex items-center justify-center pointer-events-auto px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mx-auto">
            <motion.div className="glass creature-card-green order-2 lg:order-1" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="mb-6">
                <span className="badge neon-green">Forest Guardian</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Playfair_Display'] mb-4 text-white glow-text leading-tight">The Silverback</h2>
              </div>
              <p className="text-white/70 mb-8 text-base sm:text-lg font-light leading-relaxed">With strength unmatched, the mighty gorilla acts as the silent protector of the deep woods. They possess complex familial bonds, immense empathy, and power unmatched by other dwellers.</p>
              <div className="dossier-id">SPEC-003 // Forest Guardian Class</div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <Stat label="Strength" percentage="100%" colorClass="green" />
                <Stat label="Empathy" percentage="88%" colorClass="green" />
                <Stat label="Rhythm" percentage="82%" colorClass="green" />
                <Stat label="Signal Sense" percentage="90%" colorClass="green" />
              </div>
              <div className="ability-row">
                <span className="ability-pill green">Ground Slam</span>
                <span className="ability-pill green">Pack Bond</span>
                <span className="ability-pill green">Resonance Field</span>
              </div>
            </motion.div>

            <motion.div className="flex justify-center order-1 lg:order-2" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <div className="animal-svg-container">
                
                <svg className="w-full h-full" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="gorillaGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="4" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <radialGradient id="gorillaBodyGrad" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#00cc7a"/>
                      <stop offset="60%" stopColor="#00ff9d"/>
                      <stop offset="100%" stopColor="#004433"/>
                    </radialGradient>
                    <radialGradient id="gorillaSilver" cx="50%" cy="30%" r="50%">
                      <stop offset="0%" stopColor="#aaffdd" stopOpacity="0.7"/>
                      <stop offset="100%" stopColor="#00ff9d" stopOpacity="0"/>
                    </radialGradient>
                  </defs>

                  {/* Legs */}
                  <rect x="90" y="204" width="28" height="42" rx="14" fill="#005533" filter="url(#gorillaGlow)"/>
                  <rect x="142" y="204" width="28" height="42" rx="14" fill="#005533" filter="url(#gorillaGlow)"/>
                  {/* Feet */}
                  <ellipse cx="104" cy="245" rx="18" ry="9" fill="#004428"/>
                  <ellipse cx="156" cy="245" rx="18" ry="9" fill="#004428"/>

                  {/* Body */}
                  <path fill="url(#gorillaBodyGrad)" filter="url(#gorillaGlow)"
                    d="M 70 220 C 62 190 60 150 70 128 C 80 108 105 98 130 98 C 155 98 180 108 190 128 C 200 150 198 190 190 220 Z"/>

                  {/* Silver back patch */}
                  <path fill="url(#gorillaSilver)"
                    d="M 88 145 C 85 130 90 115 130 112 C 170 115 175 130 172 145 C 168 160 150 165 130 165 C 110 165 92 160 88 145 Z"
                    opacity="0.5"/>

                  {/* Chest */}
                  <ellipse cx="130" cy="155" rx="38" ry="30" fill="#00dd88" opacity="0.4"/>

                  {/* Arms */}
                  <path stroke="#005533" strokeWidth="26" strokeLinecap="round" fill="none"
                    d="M 80 130 C 52 150 38 175 40 200" filter="url(#gorillaGlow)"/>
                  <path stroke="#007744" strokeWidth="22" strokeLinecap="round" fill="none"
                    d="M 80 130 C 52 150 38 175 40 200"/>
                  <path stroke="#005533" strokeWidth="26" strokeLinecap="round" fill="none"
                    d="M 180 130 C 208 150 222 175 220 200" filter="url(#gorillaGlow)"/>
                  <path stroke="#007744" strokeWidth="22" strokeLinecap="round" fill="none"
                    d="M 180 130 C 208 150 222 175 220 200"/>

                  {/* Knuckle fists */}
                  <circle cx="42" cy="200" r="16" fill="#004428"/>
                  <circle cx="42" cy="200" r="10" fill="#005533"/>
                  <circle cx="218" cy="200" r="16" fill="#004428"/>
                  <circle cx="218" cy="200" r="10" fill="#005533"/>
                  {/* Knuckle lines */}
                  <path stroke="#00ff9d" strokeWidth="1" opacity="0.4" fill="none"
                    d="M 34 196 Q 42 194 50 196 M 34 200 Q 42 198 50 200 M 34 204 Q 42 202 50 204"/>
                  <path stroke="#00ff9d" strokeWidth="1" opacity="0.4" fill="none"
                    d="M 210 196 Q 218 194 226 196 M 210 200 Q 218 198 226 200 M 210 204 Q 218 202 226 204"/>

                  {/* Neck */}
                  <rect x="112" y="94" width="36" height="26" rx="18" fill="#006644" filter="url(#gorillaGlow)"/>

                  {/* Head */}
                  <ellipse cx="130" cy="78" rx="40" ry="36" fill="url(#gorillaBodyGrad)" filter="url(#gorillaGlow)"/>

                  {/* Sagittal crest */}
                  <path fill="#004433"
                    d="M 118 46 C 118 34 122 26 130 24 C 138 26 142 34 142 46 C 138 42 130 40 122 42 Z"
                    opacity="0.8"/>

                  {/* Brow ridge */}
                  <path fill="#003322"
                    d="M 96 68 C 100 62 112 58 130 58 C 148 58 160 62 164 68 C 158 64 144 62 130 62 C 116 62 102 64 96 68 Z"/>

                  {/* Face — lighter skin area */}
                  <ellipse cx="130" cy="82" rx="26" ry="22" fill="#005533" opacity="0.5"/>

                  {/* Nostrils */}
                  <ellipse cx="122" cy="84" rx="6" ry="4" fill="#002211" opacity="0.8"/>
                  <ellipse cx="138" cy="84" rx="6" ry="4" fill="#002211" opacity="0.8"/>
                  <ellipse cx="122" cy="84" rx="3" ry="2" fill="#001108"/>
                  <ellipse cx="138" cy="84" rx="3" ry="2" fill="#001108"/>

                  {/* Mouth */}
                  <path stroke="#002211" strokeWidth="2.5" strokeLinecap="round" fill="none"
                    d="M 118 96 C 122 100 130 101 138 100 C 142 99 146 96 148 96"/>

                  {/* Eyes */}
                  <ellipse cx="112" cy="71" rx="9" ry="8" fill="#010508"/>
                  <ellipse cx="148" cy="71" rx="9" ry="8" fill="#010508"/>
                  <ellipse cx="112" cy="71" rx="5" ry="5" fill="#00ff9d" opacity="0.8"/>
                  <ellipse cx="148" cy="71" rx="5" ry="5" fill="#00ff9d" opacity="0.8"/>
                  <ellipse cx="112" cy="71" rx="2.5" ry="3" fill="#000"/>
                  <ellipse cx="148" cy="71" rx="2.5" ry="3" fill="#000"/>
                  <circle cx="114" cy="69" r="1.8" fill="#fff" opacity="0.8"/>
                  <circle cx="150" cy="69" r="1.8" fill="#fff" opacity="0.8"/>

                  {/* Ears */}
                  <ellipse cx="90" cy="74" rx="12" ry="10" fill="#005533"/>
                  <ellipse cx="170" cy="74" rx="12" ry="10" fill="#005533"/>
                  <ellipse cx="90" cy="74" rx="7" ry="6" fill="#003322" opacity="0.7"/>
                  <ellipse cx="170" cy="74" rx="7" ry="6" fill="#003322" opacity="0.7"/>

                  {/* Neon circuit lines */}
                  <path stroke="#00ff9d" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4 3"
                    d="M 100 155 L 130 148 L 160 155"/>
                  <path stroke="#00ff9d" strokeWidth="0.8" fill="none" opacity="0.2" strokeDasharray="3 4"
                    d="M 95 170 L 130 163 L 165 170"/>
                </svg>
                <div className="glow-orb green-orb"></div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* 5. Tree Python (100vh) */}
      <section className="h-screen w-full flex items-center justify-center pointer-events-auto px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mx-auto">
            <motion.div className="flex justify-center order-1" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
               <div className="animal-svg-container">
                 
                 <svg className="w-full h-full" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <defs>
                     <filter id="pythonGlow" x="-40%" y="-40%" width="180%" height="180%">
                       <feGaussianBlur stdDeviation="4" result="blur"/>
                       <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                     </filter>
                     <linearGradient id="pythonBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#00ff9d"/>
                       <stop offset="50%" stopColor="#13ffe1"/>
                       <stop offset="100%" stopColor="#006644"/>
                     </linearGradient>
                   </defs>

                   {/* Outer coil — large loop */}
                   <path stroke="#006644" strokeWidth="22" strokeLinecap="round" fill="none"
                     d="M 130 240 C 60 240 28 190 28 140 C 28 82 72 40 130 40 C 188 40 232 82 232 140 C 232 190 200 240 130 240"/>
                   <path stroke="url(#pythonBodyGrad)" strokeWidth="18" strokeLinecap="round" fill="none"
                     filter="url(#pythonGlow)"
                     d="M 130 240 C 60 240 28 190 28 140 C 28 82 72 40 130 40 C 188 40 232 82 232 140 C 232 190 200 240 130 240"/>
                   {/* Scale pattern on outer coil */}
                   <path stroke="#004433" strokeWidth="1.5" fill="none" opacity="0.6"
                     strokeDasharray="8 6"
                     d="M 130 236 C 64 234 34 188 34 140 C 34 86 76 46 130 46 C 184 46 226 86 226 140 C 226 188 196 234 130 236"/>

                   {/* Middle coil */}
                   <path stroke="#004433" strokeWidth="20" strokeLinecap="round" fill="none"
                     d="M 130 210 C 82 210 58 178 58 148 C 58 110 90 80 130 80 C 170 80 202 110 202 148 C 202 178 178 210 130 210"/>
                   <path stroke="#00dd88" strokeWidth="16" strokeLinecap="round" fill="none"
                     filter="url(#pythonGlow)"
                     d="M 130 210 C 82 210 58 178 58 148 C 58 110 90 80 130 80 C 170 80 202 110 202 148 C 202 178 178 210 130 210"/>
                   <path stroke="#002211" strokeWidth="1.5" fill="none" opacity="0.5"
                     strokeDasharray="7 5"
                     d="M 130 206 C 86 204 62 176 62 148 C 62 114 92 84 130 84 C 168 84 198 114 198 148 C 198 176 174 204 130 206"/>

                   {/* Inner coil */}
                   <path stroke="#003322" strokeWidth="18" strokeLinecap="round" fill="none"
                     d="M 130 180 C 100 180 82 162 82 142 C 82 118 104 100 130 100 C 156 100 178 118 178 142 C 178 162 160 180 130 180"/>
                   <path stroke="#13ffe1" strokeWidth="14" strokeLinecap="round" fill="none"
                     filter="url(#pythonGlow)"
                     d="M 130 180 C 100 180 82 162 82 142 C 82 118 104 100 130 100 C 156 100 178 118 178 142 C 178 162 160 180 130 180"/>

                   {/* Center highlight */}
                   <circle cx="130" cy="140" r="22" fill="#001a11" opacity="0.7"/>
                   <circle cx="130" cy="140" r="14" fill="#00ff9d" opacity="0.15" filter="url(#pythonGlow)"/>

                   {/* Head — emerging from top */}
                   <ellipse cx="130" cy="38" rx="22" ry="18" fill="#004433" filter="url(#pythonGlow)"/>
                   <ellipse cx="130" cy="38" rx="18" ry="14" fill="#00cc77"/>
                   {/* Head pattern */}
                   <path fill="#003322" opacity="0.7"
                     d="M 118 30 C 122 24 138 24 142 30 C 138 28 122 28 118 30 Z"/>
                   {/* Jaw */}
                   <path fill="#008844" opacity="0.9"
                     d="M 112 40 C 112 50 122 56 130 56 C 138 56 148 50 148 40"/>
                   {/* Tongue */}
                   <path stroke="#ff3366" strokeWidth="1.5" strokeLinecap="round" fill="none"
                     d="M 130 56 L 130 66 M 130 66 L 125 72 M 130 66 L 135 72"/>

                   {/* Eyes */}
                   <ellipse cx="118" cy="34" rx="7" ry="6" fill="#010508"/>
                   <ellipse cx="142" cy="34" rx="7" ry="6" fill="#010508"/>
                   <ellipse cx="118" cy="34" rx="4" ry="4" fill="#00ff9d" opacity="0.9"/>
                   <ellipse cx="142" cy="34" rx="4" ry="4" fill="#00ff9d" opacity="0.9"/>
                   <ellipse cx="118" cy="34" rx="1.5" ry="4" fill="#000"/>
                   <ellipse cx="142" cy="34" rx="1.5" ry="4" fill="#000"/>
                   <circle cx="120" cy="32" r="1.5" fill="#fff" opacity="0.8"/>
                   <circle cx="144" cy="32" r="1.5" fill="#fff" opacity="0.8"/>
                 </svg>
                 <div className="glow-orb green-orb"></div>
               </div>
            </motion.div>

            <motion.div className="glass creature-card-green order-2" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="mb-6">
                <span className="badge neon-green">Canopy Coiler</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Playfair_Display'] mb-4 text-white glow-text leading-tight">Neon Tree Python</h2>
              </div>
              <p className="text-white/70 mb-8 text-base sm:text-lg font-light leading-relaxed">Coiled perfectly among the branches, this serpentine predator operates almost entirely by thermal detection. Its neon scales act as an evolutionary warning to rivals.</p>
              <div className="dossier-id">SPEC-005 // Canopy Coiler Class</div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <Stat label="Thermal Vision" percentage="100%" colorClass="green" />
                <Stat label="Constriction" percentage="90%" colorClass="green" />
                <Stat label="Camouflage" percentage="84%" colorClass="green" />
                <Stat label="Stillness" percentage="93%" colorClass="green" />
              </div>
              <div className="ability-row">
                <span className="ability-pill green">Heat Sense</span>
                <span className="ability-pill green">Scale Cloak</span>
                <span className="ability-pill green">Death Coil</span>
              </div>
            </motion.div>
        </div>
      </section>

      {/* 6. Dart Frog (100vh) */}
      <section className="h-screen w-full flex items-center justify-center pointer-events-auto px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mx-auto">
            <motion.div className="glass creature-card-cyan order-2 lg:order-1" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="mb-6">
                <span className="badge neon-cyan">Toxic Beauty</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Playfair_Display'] mb-4 text-white glow-text leading-tight">Bioluminescent Frog</h2>
              </div>
              <p className="text-white/70 mb-8 text-base sm:text-lg font-light leading-relaxed">Engineered by centuries of adaptation, the neon frog pulses with toxic light. Its glow is both warning and weapon — a signal in a digital forest where survival depends on visibility.</p>
              <div className="dossier-id">SPEC-004 // Toxic Beauty Class</div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <Stat label="Toxicity" percentage="99%" colorClass="cyan" />
                <Stat label="Agility" percentage="85%" colorClass="cyan" />
                <Stat label="Pulse Range" percentage="91%" colorClass="cyan" />
                <Stat label="Biolume Glow" percentage="97%" colorClass="cyan" />
              </div>
              <div className="ability-row">
                <span className="ability-pill cyan">Toxic Aura</span>
                <span className="ability-pill cyan">Light Burst</span>
                <span className="ability-pill cyan">Leap Strike</span>
              </div>
            </motion.div>

            <motion.div className="flex justify-center order-1 lg:order-2" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
               <div className="animal-svg-container">
                 
                 <svg className="w-full h-full" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <defs>
                     <filter id="frogGlow" x="-40%" y="-40%" width="180%" height="180%">
                       <feGaussianBlur stdDeviation="5" result="blur"/>
                       <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                     </filter>
                     <filter id="frogEyeGlow" x="-100%" y="-100%" width="300%" height="300%">
                       <feGaussianBlur stdDeviation="4" result="blur"/>
                       <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                     </filter>
                     <radialGradient id="frogBodyGrad" cx="50%" cy="45%" r="55%">
                       <stop offset="0%" stopColor="#80ffee"/>
                       <stop offset="40%" stopColor="#13ffe1"/>
                       <stop offset="100%" stopColor="#006677"/>
                     </radialGradient>
                     <radialGradient id="frogBellyGrad" cx="50%" cy="50%" r="50%">
                       <stop offset="0%" stopColor="#ccffff" stopOpacity="0.7"/>
                       <stop offset="100%" stopColor="#13ffe1" stopOpacity="0"/>
                     </radialGradient>
                   </defs>

                   {/* Back legs */}
                   <path stroke="#006677" strokeWidth="14" strokeLinecap="round" fill="none"
                     d="M 90 190 C 60 195 38 210 30 225" filter="url(#frogGlow)"/>
                   <path stroke="#13ffe1" strokeWidth="10" strokeLinecap="round" fill="none"
                     d="M 90 190 C 60 195 38 210 30 225"/>
                   {/* Back foot */}
                   <path stroke="#13ffe1" strokeWidth="3" strokeLinecap="round" fill="none"
                     d="M 30 225 L 18 232 M 30 225 L 22 238 M 30 225 L 28 240 M 30 225 L 36 238"/>

                   <path stroke="#006677" strokeWidth="14" strokeLinecap="round" fill="none"
                     d="M 170 190 C 200 195 222 210 230 225" filter="url(#frogGlow)"/>
                   <path stroke="#13ffe1" strokeWidth="10" strokeLinecap="round" fill="none"
                     d="M 170 190 C 200 195 222 210 230 225"/>
                   <path stroke="#13ffe1" strokeWidth="3" strokeLinecap="round" fill="none"
                     d="M 230 225 L 242 232 M 230 225 L 238 238 M 230 225 L 232 240 M 230 225 L 224 238"/>

                   {/* Front legs */}
                   <path stroke="#006677" strokeWidth="11" strokeLinecap="round" fill="none"
                     d="M 100 190 C 72 196 54 208 48 218" filter="url(#frogGlow)"/>
                   <path stroke="#13ffe1" strokeWidth="8" strokeLinecap="round" fill="none"
                     d="M 100 190 C 72 196 54 208 48 218"/>
                   <path stroke="#13ffe1" strokeWidth="2.5" strokeLinecap="round" fill="none"
                     d="M 48 218 L 38 222 M 48 218 L 44 228 M 48 218 L 52 228 M 48 218 L 56 222"/>

                   <path stroke="#006677" strokeWidth="11" strokeLinecap="round" fill="none"
                     d="M 160 190 C 188 196 206 208 212 218" filter="url(#frogGlow)"/>
                   <path stroke="#13ffe1" strokeWidth="8" strokeLinecap="round" fill="none"
                     d="M 160 190 C 188 196 206 208 212 218"/>
                   <path stroke="#13ffe1" strokeWidth="2.5" strokeLinecap="round" fill="none"
                     d="M 212 218 L 222 222 M 212 218 L 216 228 M 212 218 L 208 228 M 212 218 L 204 222"/>

                   {/* Body */}
                   <ellipse cx="130" cy="172" rx="62" ry="44" fill="url(#frogBodyGrad)" filter="url(#frogGlow)"/>
                   {/* Belly highlight */}
                   <ellipse cx="130" cy="178" rx="38" ry="26" fill="url(#frogBellyGrad)" opacity="0.6"/>

                   {/* Bioluminescent spots */}
                   {[
                     [105, 162, 6], [130, 158, 5], [155, 162, 6],
                     [118, 178, 5], [142, 178, 5],
                     [105, 188, 4], [155, 188, 4],
                   ].map(([cx, cy, r], i) => (
                     <g key={i}>
                       <circle cx={cx} cy={cy} r={r} fill="#ff6b35" opacity="0.6"/>
                       <circle cx={cx} cy={cy} r={r - 1.5} fill="#ffaa44" opacity="0.9"/>
                     </g>
                   ))}

                   {/* Eye stalks / protrusions */}
                   <ellipse cx="96" cy="130" rx="20" ry="20" fill="#008899" filter="url(#frogGlow)"/>
                   <ellipse cx="164" cy="130" rx="20" ry="20" fill="#008899" filter="url(#frogGlow)"/>

                   {/* Eyes */}
                   <circle cx="96" cy="130" r="16" fill="#010508" filter="url(#frogEyeGlow)"/>
                   <circle cx="164" cy="130" r="16" fill="#010508" filter="url(#frogEyeGlow)"/>
                   {/* Iris */}
                   <circle cx="96" cy="130" r="11" fill="#13ffe1" opacity="0.85"/>
                   <circle cx="164" cy="130" r="11" fill="#13ffe1" opacity="0.85"/>
                   {/* Horizontal slit pupil */}
                   <ellipse cx="96" cy="130" rx="9" ry="4" fill="#000"/>
                   <ellipse cx="164" cy="130" rx="9" ry="4" fill="#000"/>
                   {/* Eye shine */}
                   <circle cx="100" cy="125" r="3" fill="#fff" opacity="0.8"/>
                   <circle cx="168" cy="125" r="3" fill="#fff" opacity="0.8"/>

                   {/* Snout / mouth */}
                   <path fill="#007788" d="M 116 158 C 116 150 144 150 144 158 C 144 163 138 165 130 165 C 122 165 116 163 116 158 Z"/>
                   <path stroke="#001122" strokeWidth="2" fill="none" d="M 112 156 C 120 162 140 162 148 156"/>
                   {/* Nostrils */}
                   <circle cx="122" cy="153" r="2.5" fill="#004455" opacity="0.8"/>
                   <circle cx="138" cy="153" r="2.5" fill="#004455" opacity="0.8"/>

                   {/* Neon body circuit trace */}
                   <path stroke="#13ffe1" strokeWidth="0.8" fill="none" opacity="0.35" strokeDasharray="4 3"
                     d="M 100 168 L 130 163 L 160 168"/>
                 </svg>
                 <div className="glow-orb cyan-orb"></div>
               </div>
            </motion.div>
        </div>
      </section>

      {/* 6.2 Void Jaguar (100vh) */}
      <section className="h-screen w-full flex items-center justify-center pointer-events-auto px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mx-auto">
          <motion.div className="glass creature-card-purple order-2 lg:order-1" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}>
            <div className="mb-6">
              <span className="badge neon-purple">Void Entity</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Playfair_Display'] mb-4 text-white leading-tight" style={{ textShadow: '0 0 15px rgba(191,95,255,0.8), 0 0 30px rgba(191,95,255,0.4)' }}>The Void Jaguar</h2>
            </div>
            <p className="text-white/70 mb-8 text-base sm:text-lg font-light leading-relaxed">Neither fully here nor entirely gone. The Void Jaguar phases between digital states — a spectral predator stitched from dark matter and dream code. It is the rarest signal in the canopy: visible only when the jungle chooses to reveal it.</p>
            <div className="dossier-id">SPEC-006 // Void Entity Class — CLASSIFIED</div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <Stat label="Phase Shift" percentage="100%" colorClass="purple" />
              <Stat label="Void Sense" percentage="97%" colorClass="purple" />
              <Stat label="Dark Speed" percentage="95%" colorClass="purple" />
              <Stat label="Invisibility" percentage="99%" colorClass="purple" />
            </div>
            <div className="ability-row">
              <span className="ability-pill purple">Void Phase</span>
              <span className="ability-pill purple">Dark Pulse</span>
              <span className="ability-pill purple">Signal Erase</span>
              <span className="ability-pill purple">Rift Step</span>
            </div>
          </motion.div>

          <motion.div className="flex justify-center order-1 lg:order-2" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <div className="animal-svg-container">
              
              <svg className="w-full h-full" viewBox="0 0 260 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* === VOID JAGUAR — front-facing, simple bold shapes === */}

                {/* Tail — starts from right edge of body, curls down */}
                <path d="M 182 238 C 215 245 232 262 222 272 C 214 278 204 274 206 268" stroke="#7722aa" strokeWidth="11" strokeLinecap="round" fill="none"/>
                <path d="M 182 238 C 215 245 232 262 222 272 C 214 278 204 274 206 268" stroke="#aa44dd" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5"/>

                {/* Back legs (behind body, darker) — start below body bottom */}
                <rect x="85" y="234" width="24" height="40" rx="12" fill="#6611aa"/>
                <rect x="151" y="234" width="24" height="40" rx="12" fill="#6611aa"/>
                {/* Back paws */}
                <ellipse cx="97" cy="275" rx="18" ry="9" fill="#7722aa"/>
                <ellipse cx="163" cy="275" rx="18" ry="9" fill="#7722aa"/>

                {/* Body */}
                <ellipse cx="130" cy="195" rx="56" ry="46" fill="#8822bb"/>
                {/* Belly highlight */}
                <ellipse cx="130" cy="208" rx="30" ry="24" fill="#aa44dd" opacity="0.4"/>

                {/* Spots on body */}
                <circle cx="108" cy="182" r="9" fill="#550077" opacity="0.7"/>
                <circle cx="108" cy="182" r="5" fill="#200030" opacity="0.8"/>
                <circle cx="130" cy="175" r="10" fill="#550077" opacity="0.7"/>
                <circle cx="130" cy="175" r="6" fill="#200030" opacity="0.8"/>
                <circle cx="152" cy="182" r="9" fill="#550077" opacity="0.7"/>
                <circle cx="152" cy="182" r="5" fill="#200030" opacity="0.8"/>
                <circle cx="116" cy="202" r="7" fill="#550077" opacity="0.6"/>
                <circle cx="116" cy="202" r="4" fill="#200030" opacity="0.7"/>
                <circle cx="143" cy="202" r="7" fill="#550077" opacity="0.6"/>
                <circle cx="143" cy="202" r="4" fill="#200030" opacity="0.7"/>

                {/* Front legs (in front of body, brighter) — start below body bottom */}
                <rect x="94" y="236" width="24" height="40" rx="12" fill="#9933cc"/>
                <rect x="142" y="236" width="24" height="40" rx="12" fill="#9933cc"/>
                {/* Front paws */}
                <ellipse cx="106" cy="277" rx="18" ry="9" fill="#aa44dd"/>
                <ellipse cx="154" cy="277" rx="18" ry="9" fill="#aa44dd"/>

                {/* Neck */}
                <rect x="112" y="133" width="36" height="36" rx="14" fill="#9933cc"/>

                {/* Head */}
                <ellipse cx="130" cy="115" rx="48" ry="42" fill="#9933cc"/>

                {/* Ears */}
                <polygon points="90,88 78,52 108,78" fill="#7722aa"/>
                <polygon points="92,86 82,58 106,78" fill="#cc66ff" opacity="0.6"/>
                <polygon points="170,88 182,52 152,78" fill="#7722aa"/>
                <polygon points="168,86 178,58 154,78" fill="#cc66ff" opacity="0.6"/>

                {/* Cheeks (jowl puffs) */}
                <ellipse cx="98" cy="122" rx="20" ry="16" fill="#8822bb" opacity="0.8"/>
                <ellipse cx="162" cy="122" rx="20" ry="16" fill="#8822bb" opacity="0.8"/>

                {/* Muzzle */}
                <ellipse cx="130" cy="125" rx="22" ry="17" fill="#660099"/>
                {/* Nose */}
                <path d="M 124 114 Q 130 110 136 114 L 133 120 Q 130 122 127 120 Z" fill="#cc44ff"/>
                {/* Mouth — cat W-shape: center dip down, two sides up */}
                <path d="M 120 128 Q 125 134 130 129 Q 135 134 140 128" stroke="#ee88ff" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

                {/* Whiskers */}
                <line x1="108" y1="118" x2="82" y2="113" stroke="#cc88ff" strokeWidth="1.2" opacity="0.6"/>
                <line x1="108" y1="124" x2="80" y2="124" stroke="#cc88ff" strokeWidth="1.2" opacity="0.6"/>
                <line x1="152" y1="118" x2="178" y2="113" stroke="#cc88ff" strokeWidth="1.2" opacity="0.6"/>
                <line x1="152" y1="124" x2="180" y2="124" stroke="#cc88ff" strokeWidth="1.2" opacity="0.6"/>

                {/* Eyes */}
                <ellipse cx="112" cy="100" rx="13" ry="12" fill="#0a0010"/>
                <ellipse cx="112" cy="100" rx="9" ry="8" fill="#bf5fff"/>
                <ellipse cx="112" cy="100" rx="3" ry="7" fill="#000"/>
                <circle cx="116" cy="96" r="2.5" fill="#fff" opacity="0.8"/>

                <ellipse cx="148" cy="100" rx="13" ry="12" fill="#0a0010"/>
                <ellipse cx="148" cy="100" rx="9" ry="8" fill="#bf5fff"/>
                <ellipse cx="148" cy="100" rx="3" ry="7" fill="#000"/>
                <circle cx="152" cy="96" r="2.5" fill="#fff" opacity="0.8"/>

                {/* Head spots */}
                <circle cx="118" cy="85" r="5" fill="#550077" opacity="0.6"/>
                <circle cx="142" cy="85" r="5" fill="#550077" opacity="0.6"/>
                <circle cx="130" cy="78" r="4" fill="#550077" opacity="0.5"/>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6.3 Manifesto (80vh) */}
      <section className="min-h-[80vh] w-full flex items-center justify-center pointer-events-auto px-6 lg:px-16 relative">
        <motion.div
          className="manifesto-card max-w-4xl w-full"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="manifesto-corner tl" />
          <div className="manifesto-corner tr" />
          <div className="manifesto-corner bl" />
          <div className="manifesto-corner br" />
          <p className="subtitle mb-4">Manifesto</p>
          <h2 className="glow-text text-4xl sm:text-5xl font-['Playfair_Display'] leading-tight mb-6">
            We Believe the Jungle Lives in Code
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Every creature here is a protest against forgetting. We encode the wild in light because the real wild is vanishing. The Neon Canopy is not escapism — it is a signal flare. A reminder that ecosystems are systems, and every node matters. Lose a node; lose the network.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '6', label: 'Apex Species' },
              { value: '3', label: 'Habitat Layers' },
              { value: '1.2M', label: 'Firefly Nodes' },
              { value: '∞', label: 'Signal Loops' },
            ].map((s) => (
              <div key={s.label} className="manifesto-stat">
                <span className="manifesto-stat-value">{s.value}</span>
                <span className="manifesto-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6.4 Depth Map (100vh) */}
      <section className="min-h-[100vh] w-full flex items-center justify-center pointer-events-auto px-6 lg:px-16 relative">
        <div className="max-w-6xl w-full space-y-10">
          <div className="text-center space-y-3">
            <p className="subtitle">Depth Map</p>
            <h2 className="glow-text text-4xl sm:text-5xl font-['Playfair_Display']">Navigate the Strata</h2>
            <p className="text-white/60 max-w-xl mx-auto text-base">Four distinct habitat layers, each with its own light signature, inhabitants, and audio frequency band.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[{
              z: 'Z-Layer 01',
              name: 'Canopy Crown',
              desc: 'Macaws, solar moths, and cloud-touch vines. Frequency: 12–16 kHz.',
              color: '#13ffe1',
            }, {
              z: 'Z-Layer 02',
              name: 'Mid-Canopy',
              desc: 'Pythons, glider lizards, bridge-web spiders. Frequency: 6–10 kHz.',
              color: '#00ff9d',
            }, {
              z: 'Z-Layer 03',
              name: 'Forest Floor',
              desc: 'Tigers, gorillas, dart frogs. Frequency: 2–5 kHz.',
              color: '#ff6b35',
            }, {
              z: 'Z-Layer 04',
              name: 'Void Stratum',
              desc: 'Jaguar territory. No light. No sound. Only signal. Sub-frequency: 0–1 Hz.',
              color: '#bf5fff',
            }].map((layer, i) => (
              <motion.div
                key={layer.z}
                className="depth-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                style={{ borderColor: `${layer.color}33` }}
              >
                <div className="depth-z">{layer.z}</div>
                <h4 className="text-xl font-semibold mb-2" style={{ color: layer.color, textShadow: `0 0 10px ${layer.color}80` }}>{layer.name}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{layer.desc}</p>
                <div className="mt-4 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${layer.color}, transparent)`, opacity: 0.5 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.5 Expedition Timeline (130vh) */}
      <section className="min-h-[130vh] w-full flex items-center justify-center pointer-events-auto px-6 lg:px-16 relative">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div className="space-y-6">
            <p className="subtitle">Long Descent</p>
            <h2 className="glow-text text-4xl sm:text-5xl font-['Playfair_Display'] leading-tight">Layers of the Electric Wild</h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">Each scroll notch is a new layer of habitat. Bioluminescent moss fields give way to thunder bloom caves, then to the signal marsh where insects talk in codes. Follow the map to keep your bearings.</p>
          </div>
          <motion.div className="timeline glass" style={{ filter: glowHue }}>
            {[{
              title: '01 // Mist Gate',
              copy: 'Low fog, floating seeds, and whispering reeds. The entry point to calibrate your senses.'
            }, {
              title: '02 // Ember Grove',
              copy: 'Trees sweat sparks. Heat-reactive leaves pulse in sync with distant drums.'
            }, {
              title: '03 // Thunder Bloom',
              copy: 'Stalactites resonate like tuned chimes. Every footstep records a chord.'
            }, {
              title: '04 // Signal Marsh',
              copy: 'Fireflies form digital constellations. The water mirrors your movement in neon ripples.'
            }, {
              title: '05 // Apex Overlook',
              copy: 'A ridge of glassy stone. See every glow source at once before the plunge.'
            }].map((step, i) => (
              <motion.div
                key={step.title}
                className="timeline-row"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.08, duration: 0.7 }}
              >
                <motion.div className="timeline-dot" style={{ opacity: timelineGlow }} />
                <div className="timeline-copy">
                  <h4 className="font-semibold tracking-wide text-lg">{step.title}</h4>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">{step.copy}</p>
                </div>
              </motion.div>
            ))}
            <div className="timeline-line" />
          </motion.div>
        </div>
      </section>

      {/* 6.8 Night Bazaar */}
      <section className="w-full flex items-center justify-center pointer-events-auto px-6 lg:px-16 py-24 relative">
        <div className="absolute inset-0 aurora" />
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 relative">
          <motion.div className="glass col-span-1" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <p className="subtitle">Night Bazaar</p>
            <h3 className="glow-text text-4xl sm:text-5xl mb-4 font-['Playfair_Display']">Trade in Light, Leave in Legend</h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-6">Welcome to the market where nothing weighs more than a photon. Swap stories for bioluminescent dyes, trade footsteps for synthesized thunder, and collect talismans that hum when the jungle approves your path.</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {['Glow dye vials', 'Echo cards', 'Hummingstone charms', 'Fractal fabrics', 'Firefly loops'].map((item) => (
                <span key={item} className="chip chip-ghost">{item}</span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{
                title: 'Kinetic Loom',
                copy: 'Weave fabric that ripples with your heartbeat; colors follow your pulse.'
              }, {
                title: 'Echo Smiths',
                copy: 'Forge rings that store laughter. Break one to release chorus lanterns.'
              }, {
                title: 'Pulse Tea',
                copy: 'Sip biolume leaves steeped in thunderwater. Your voice glows for hours.'
              }, {
                title: 'Drift Berries',
                copy: 'Fruit that levitates until sung to. Perfect lantern snacks.'
              }].map((item, i) => (
                <div key={item.title} className="glass-thin space-y-2" style={{ animationDelay: `${i * 0.05}s` }}>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">Stall {i + 1}</p>
                  <h4 className="text-xl glow-text">{item.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{item.copy}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div className="glass-thin flex flex-col gap-4 justify-between" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.9 }}>
            <div className="space-y-2">
              <span className="badge neon-green">Live Loop</span>
              <h4 className="text-2xl glow-text">Firefly Session</h4>
              <p className="text-white/70 text-sm leading-relaxed">Every full moon, the canopy hosts a live soundscape. You bring the motion; the insects bring the lights.</p>
            </div>
            <div className="glass-thin nested-card">
              <div className="flex items-center justify-between text-white/80 text-xs uppercase tracking-[0.2em]">
                <span>Queue</span>
                <span>02:00 AM</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px] text-white/60">
                <div className="flex items-center gap-2"><span className="dot" />Bring footsteps</div>
                <div className="flex items-center gap-2"><span className="dot" />Leave silence</div>
                <div className="flex items-center gap-2"><span className="dot" />Trade resonance</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer (100vh) */}
      <section className="h-screen w-full flex flex-col items-center justify-center pointer-events-auto bg-[#010203] text-center px-6 relative z-50 shadow-[0_-50px_100px_#010203]">
        <h2 className="glow-text text-4xl sm:text-5xl md:text-7xl mb-8 font-['Playfair_Display']">Join The Cause</h2>
        <p className="max-w-2xl mx-auto text-white/60 mb-12 text-lg sm:text-xl font-light leading-relaxed">
          The future of the Neon Canopy relies on actions taken in the real world. Help us ensure these species remain more than just a digital memory.
        </p>
        <button className="px-10 py-5 bg-transparent border border-[#13ffe1] text-[#13ffe1] uppercase tracking-[0.2em] rounded-full hover:bg-[#13ffe1] hover:text-[#010203] transition-all duration-300 font-bold shadow-[0_0_20px_rgba(19,255,225,0.2)] hover:shadow-[0_0_40px_rgba(19,255,225,0.8)] cursor-pointer">
          Support Conservation
        </button>
        <p className="mt-16 text-xs sm:text-sm text-white/40 tracking-[0.2em] uppercase font-bold">
          Built with Three.js, WebGL, Framer Motion, and custom shaders
        </p>
      </section>

    </div>
  )
}
