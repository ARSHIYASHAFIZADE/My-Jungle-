'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { WebGLScene } from '@/components/Scene'
import { HTMLOverlay } from '@/components/Overlay'
import { ScrollControls, Scroll } from '@react-three/drei'
import { MeteorIntro } from '@/components/MeteorIntro'
import { stopTheme, startTheme, isThemePlaying } from '@/components/AudioEngine'

export default function Home() {
  const [meteorDone, setMeteorDone] = useState(false)
  const [muted, setMuted] = useState(false)
  const handleMeteorDone = useCallback(() => setMeteorDone(true), [])

  const toggleMute = useCallback(() => {
    if (muted) {
      startTheme()
      setMuted(false)
    } else {
      stopTheme()
      setMuted(true)
    }
  }, [muted])

  return (
    <main className="w-full h-screen relative bg-[#010508] overflow-hidden">
      {/* Meteor intro — sits above everything, unmounts after animation */}
      {!meteorDone && <MeteorIntro onDone={handleMeteorDone} />}

      {/* Audio toggle button */}
      {meteorDone && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9998,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(1, 5, 8, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(19, 255, 225, 0.2)',
            color: muted ? 'rgba(255,255,255,0.3)' : 'rgba(19, 255, 225, 0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: muted ? 'none' : '0 0 15px rgba(19,255,225,0.15)',
          }}
        >
          {muted ? (
            /* Muted icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            /* Sound on icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      )}

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ antialias: true }}>
          <color attach="background" args={['#010508']} />
          <Suspense fallback={null}>
            <ScrollControls pages={13.3} damping={0.25} distance={1.2}>
              <WebGLScene />
              <Scroll html style={{ width: '100vw' }}>
                <HTMLOverlay />
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </main>
  )
}
