'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resumeCtx, playApproachWhoosh, playCrash, startTheme } from './AudioEngine'

/* ─── Stable debris (module-level, never recomputed) ─────────── */
const DEBRIS_COLORS = ['#ff6b35', '#00ff9d', '#13ffe1', '#bf5fff', '#ffffff', '#ffaa33']
const DEBRIS = Array.from({ length: 80 }, (_, i) => {
  const angle = i * 2.399963 + Math.random() * 0.3
  return {
    angle,
    dist: 120 + (i % 10) * 50 + Math.random() * 40,
    delay: (i % 8) * 0.025,
    size: 2 + (i % 6) * 1.5,
    color: DEBRIS_COLORS[i % DEBRIS_COLORS.length],
    duration: 1.6 + (i % 5) * 0.3,
  }
})

/* ─── Shockwave ring ─────────────────────────────────────────── */
function ShockRing({ delay, finalScale, color, thickness = 2, duration = 2.2 }: {
  delay: number; finalScale: number; color: string; thickness?: number; duration?: number
}) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 80, height: 80, borderRadius: '50%',
        border: `${thickness}px solid ${color}`,
        boxShadow: `0 0 12px ${color}, 0 0 30px ${color}`,
        translateX: '-50%', translateY: '-50%',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0.9, scale: 0.02 }}
      animate={{ opacity: 0, scale: finalScale }}
      transition={{ duration, delay, ease: [0.05, 0.6, 0.35, 1] }}
    />
  )
}

/* ─── Debris particle ────────────────────────────────────────── */
function DebrisPiece({ angle, dist, delay, size, color, duration }: {
  angle: number; dist: number; delay: number; size: number; color: string; duration: number
}) {
  const tx = Math.cos(angle) * dist
  const ty = Math.sin(angle) * dist
  return (
    <motion.div
      style={{
        position: 'absolute', left: '50%', top: '50%',
        width: size, height: size, borderRadius: '50%',
        background: color, boxShadow: `0 0 ${size * 3}px ${color}`,
        translateX: '-50%', translateY: '-50%',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x: tx, y: ty, scale: 0 }}
      transition={{ duration, delay, ease: [0.08, 0.5, 0.3, 1] }}
    />
  )
}

/* ─── Canvas-driven meteor (rAF loop for organic feel) ──────── */
function MeteorCanvas({ onImpact }: { onImpact: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startTime = useRef<number | null>(null)
  const rafRef    = useRef<number>(0)
  const impactFired = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const W = canvas.width  = window.innerWidth
    const H = canvas.height = window.innerHeight
    const cx = W / 2
    const cy = H / 2

    const DURATION = 3200

    function draw(now: number) {
      if (!startTime.current) startTime.current = now
      const elapsed = now - startTime.current
      const raw = Math.min(elapsed / DURATION, 1)

      let t: number
      if (raw < 0.85) {
        const n = raw / 0.85
        t = n * n * n * n * 0.85
      } else {
        const n = (raw - 0.85) / 0.15
        t = 0.85 + n * (2 - n) * 0.15
      }

      ctx.clearRect(0, 0, W, H)

      const radius = 1.5 + t * (Math.min(W, H) * 0.52)
      const blurPx = Math.max(0, 30 * (1 - t * 1.3))
      const speed = raw < 0.85 ? (raw / 0.85) ** 3 : 1
      const trailLen = 15 + speed * 500
      const wobbleX = Math.sin(elapsed * 0.002) * (1 - t) * 12
      const wobbleY = Math.cos(elapsed * 0.0015) * (1 - t) * 6
      const mx = cx + wobbleX
      const my = cy + wobbleY

      // TRAIL
      const trailGrad = ctx.createLinearGradient(mx, my - radius * 0.3, mx, my - radius * 0.3 - trailLen)
      trailGrad.addColorStop(0,   `rgba(255, 220, 100, ${0.3 + t * 0.4})`)
      trailGrad.addColorStop(0.25, `rgba(255, 160,  50, ${0.2 + t * 0.25})`)
      trailGrad.addColorStop(0.6, `rgba(255,  80,  10, ${0.08 + t * 0.12})`)
      trailGrad.addColorStop(1,   'rgba(255, 60, 0, 0)')
      ctx.save()
      ctx.filter = blurPx > 0 ? `blur(${blurPx * 0.4}px)` : 'none'
      const trailW = Math.max(2, radius * 0.2)
      ctx.beginPath()
      ctx.moveTo(mx - trailW / 2, my - radius * 0.3)
      ctx.lineTo(mx + trailW / 2, my - radius * 0.3)
      ctx.lineTo(mx + trailW * 0.08, my - radius * 0.3 - trailLen)
      ctx.lineTo(mx - trailW * 0.08, my - radius * 0.3 - trailLen)
      ctx.closePath()
      ctx.fillStyle = trailGrad
      ctx.fill()
      ctx.restore()

      // OUTER ATMOSPHERE
      ctx.save()
      ctx.filter = `blur(${Math.max(3, blurPx * 0.6 + radius * 0.1)}px)`
      const haloGrad = ctx.createRadialGradient(mx, my, 0, mx, my, radius * 2.5)
      haloGrad.addColorStop(0,   `rgba(255, 210, 90,  ${0.5 + t * 0.3})`)
      haloGrad.addColorStop(0.35, `rgba(255, 120, 30,  ${0.25 + t * 0.2})`)
      haloGrad.addColorStop(0.7, `rgba(255,  50,  0,  ${0.1 + t * 0.08})`)
      haloGrad.addColorStop(1,   'rgba(255, 30, 0, 0)')
      ctx.beginPath()
      ctx.arc(mx, my, radius * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = haloGrad
      ctx.fill()
      ctx.restore()

      // CORE FIREBALL
      ctx.save()
      ctx.filter = blurPx > 1 ? `blur(${blurPx * 0.25}px)` : 'none'
      const coreGrad = ctx.createRadialGradient(mx, my, 0, mx, my, radius)
      coreGrad.addColorStop(0,    '#ffffff')
      coreGrad.addColorStop(0.12, '#fff8d0')
      coreGrad.addColorStop(0.35, '#ffcc44')
      coreGrad.addColorStop(0.65, '#ff6600')
      coreGrad.addColorStop(1,    'rgba(200, 30, 0, 0)')
      ctx.beginPath()
      ctx.arc(mx, my, radius, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.fill()
      ctx.restore()

      // HOT WHITE CENTER
      if (radius > 5) {
        ctx.save()
        const hotGrad = ctx.createRadialGradient(mx, my, 0, mx, my, radius * 0.2)
        hotGrad.addColorStop(0, 'rgba(255,255,255,1)')
        hotGrad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.arc(mx, my, radius * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = hotGrad
        ctx.fill()
        ctx.restore()
      }

      // SPARKS
      if (t > 0.4) {
        const sparkCount = Math.floor((t - 0.4) * 16)
        for (let i = 0; i < sparkCount; i++) {
          const sa = (elapsed * 0.002 + i * 1.1) % (Math.PI * 2)
          const sd = radius * (0.8 + (i % 4) * 0.12)
          const sx = mx + Math.cos(sa) * sd
          const sy = my + Math.sin(sa) * sd
          const sr = Math.max(0.8, radius * 0.03)
          ctx.save()
          ctx.beginPath()
          ctx.arc(sx, sy, sr, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 230, 120, ${0.3 + (i % 3) * 0.15})`
          ctx.shadowBlur = sr * 5
          ctx.shadowColor = '#ffcc66'
          ctx.fill()
          ctx.restore()
        }
      }

      if (raw >= 1 && !impactFired.current) {
        impactFired.current = true
        onImpact()
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onImpact])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}

/* ─── Phases ─────────────────────────────────────────────────── */
type Phase = 'gate' | 'meteor' | 'explosion' | 'message' | 'fadeout'

/* ─── Main component ─────────────────────────────────────────── */
export function MeteorIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('gate')
  const [show, setShow] = useState(true)

  const handleEnter = useCallback(() => {
    // Unlock audio context on user gesture
    resumeCtx()
    // Start the whoosh sound as meteor begins
    playApproachWhoosh()
    // Transition to meteor phase
    setPhase('meteor')
  }, [])

  const handleImpact = useCallback(() => {
    // Play crash sound
    playCrash()
    setPhase('explosion')

    // After explosion settles, show "Made with love" and start theme
    setTimeout(() => {
      setPhase('message')
      startTheme()
    }, 2200)

    // Message holds, then fade out
    setTimeout(() => setPhase('fadeout'), 4400)

    // Final cleanup
    setTimeout(() => { setShow(false); onDone() }, 5400)
  }, [onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="meteor-overlay"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#010508', overflow: 'hidden',
          }}
          animate={phase === 'fadeout' ? { opacity: 0 } : { opacity: 1 }}
          transition={phase === 'fadeout' ? { duration: 1.0, ease: [0.4, 0, 0.2, 1] } : undefined}
        >
          {/* Star field */}
          <div className="meteor-stars" />

          {/* ── Phase: Click to Enter gate ── */}
          {phase === 'gate' && (
            <motion.div
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 30,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              onClick={handleEnter}
            >
              {/* Title */}
              <motion.h1
                style={{
                  margin: 0, fontSize: 18,
                  fontWeight: 700, letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              >
                The Neon Canopy
              </motion.h1>

              {/* Divider line */}
              <motion.div
                style={{
                  width: 60, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(19,255,225,0.5), transparent)',
                  margin: '20px 0',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              />

              {/* Click prompt */}
              <motion.p
                style={{
                  margin: 0, fontSize: 12,
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: 'rgba(19,255,225,0.6)',
                  fontWeight: 300,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 0.6, 1, 0.6], y: 0 }}
                transition={{
                  opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                  y: { duration: 0.8, delay: 0.8, ease: 'easeOut' },
                }}
              >
                Click to Enter
              </motion.p>

              {/* Sound hint */}
              <motion.p
                style={{
                  margin: 0, marginTop: 12,
                  fontSize: 10, letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.25)',
                  fontWeight: 300,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
              >
                best with sound on
              </motion.p>
            </motion.div>
          )}

          {/* ── Phase: Meteor approach ── */}
          {phase === 'meteor' && <MeteorCanvas onImpact={handleImpact} />}

          {/* ── Phase: Explosion ── */}
          {(phase === 'explosion' || phase === 'message' || phase === 'fadeout') && (
            <motion.div style={{ position: 'absolute', inset: 0 }}>
              {/* Screen shake wrapper */}
              <motion.div
                style={{ position: 'absolute', inset: 0 }}
                initial={{ x: 0, y: 0 }}
                animate={{
                  x: phase === 'explosion' ? [0, -12, 10, -7, 5, -3, 1, 0] : 0,
                  y: phase === 'explosion' ? [0, 10, -7, 5, -3, 2, -1, 0] : 0,
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                {/* Crater bloom */}
                <motion.div
                  style={{
                    position: 'absolute', left: '50%', top: '50%',
                    translateX: '-50%', translateY: '-50%',
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,200,80,0.6) 20%, rgba(255,100,20,0.3) 45%, transparent 70%)',
                    filter: 'blur(10px)',
                    pointerEvents: 'none',
                  }}
                  initial={{ scale: 0.05, opacity: 1 }}
                  animate={{ scale: 6, opacity: 0 }}
                  transition={{ duration: 2.5, ease: [0.06, 0.5, 0.3, 1] }}
                />

                {/* Shockwave rings */}
                <ShockRing delay={0}    finalScale={14} color="#ff6b35"  thickness={3} duration={2.5} />
                <ShockRing delay={0.12} finalScale={20} color="#ffaa33"  thickness={2.5} duration={2.5} />
                <ShockRing delay={0.28} finalScale={28} color="#13ffe1"  thickness={2} duration={2.8} />
                <ShockRing delay={0.45} finalScale={36} color="#00ff9d"  thickness={1.5} duration={3.0} />
                <ShockRing delay={0.65} finalScale={44} color="#bf5fff"  thickness={1} duration={3.2} />

                {/* Debris */}
                {DEBRIS.map((d, i) => <DebrisPiece key={i} {...d} />)}

                {/* Residual center glow */}
                <motion.div
                  style={{
                    position: 'absolute', left: '50%', top: '50%',
                    translateX: '-50%', translateY: '-50%',
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,180,60,0.3) 0%, rgba(255,80,0,0.1) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 3, delay: 0.5, ease: 'easeOut' }}
                />
              </motion.div>

              {/* White flash */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: '#ffffff',
                  pointerEvents: 'none', zIndex: 10,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 0.8, times: [0, 0.08, 1], ease: 'easeOut' }}
              />
            </motion.div>
          )}

          {/* ── Phase: "Made with love" message ── */}
          <AnimatePresence>
            {(phase === 'message' || phase === 'fadeout') && (
              <motion.div
                key="love-message"
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  zIndex: 20, pointerEvents: 'none',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {/* "Made with" */}
                <motion.p
                  style={{
                    margin: 0, fontSize: 14,
                    letterSpacing: '0.35em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 300,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                >
                  Made with
                </motion.p>

                {/* Heart + "love" */}
                <motion.div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    marginTop: 8,
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
                >
                  {/* Glowing heart */}
                  <motion.span
                    style={{
                      fontSize: 28,
                      filter: 'drop-shadow(0 0 8px rgba(255,107,53,0.6)) drop-shadow(0 0 20px rgba(255,107,53,0.3))',
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      filter: [
                        'drop-shadow(0 0 8px rgba(255,107,53,0.6)) drop-shadow(0 0 20px rgba(255,107,53,0.3))',
                        'drop-shadow(0 0 14px rgba(255,107,53,0.9)) drop-shadow(0 0 30px rgba(255,107,53,0.5))',
                        'drop-shadow(0 0 8px rgba(255,107,53,0.6)) drop-shadow(0 0 20px rgba(255,107,53,0.3))',
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff6b35" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </motion.span>

                  <motion.span
                    style={{
                      fontSize: 38,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ff8855 40%, #ffaa66 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 12px rgba(255,107,53,0.4))',
                    }}
                  >
                    Love
                  </motion.span>
                </motion.div>

                {/* Subtle tagline */}
                <motion.p
                  style={{
                    margin: 0, marginTop: 20,
                    fontSize: 11, letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    fontWeight: 300,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
                >
                  The Neon Canopy
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
