'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Sparkles,
  Edges,
  useScroll,
  Scroll,
  Stars,
  Cloud,
  Float,
  MeshReflectorMaterial,
  Environment,
  CameraShake,
  Instances,
  Instance
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  BrightnessContrast,
} from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── ENHANCED JUNGLE TREE (with vines and palm variant) ─────────────────────
function JungleTree({ position, scale = 1, color = '#00ff9d', variant = 'normal' }: { position: [number, number, number]; scale?: number; color?: string; variant?: 'normal' | 'palm' }) {
  const group = useRef<THREE.Group>(null)
  const vineRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.5) * 0.05
    }
    vineRefs.current.forEach((vine, i) => {
      vine.rotation.x = Math.sin(t * 2 + i) * 0.1
      vine.rotation.z = Math.cos(t * 1.5 + i) * 0.1
    })
  })

  if (variant === 'palm') {
    return (
      <group ref={group} position={position} scale={scale}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
          <meshStandardMaterial color="#5d3a1a" roughness={0.7} emissive="#3a2a0a" emissiveIntensity={0.2} />
        </mesh>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.2, 4.2, Math.sin(angle) * 1.2]} rotation={[0.3, angle, 0.5]}>
              <coneGeometry args={[1.5, 2, 6]} />
              <meshStandardMaterial color="#0f3b1a" emissive={color} emissiveIntensity={0.1} flatShading />
              <Edges color={color} opacity={0.3} />
            </mesh>
          )
        })}
      </group>
    )
  }

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 3, 6]} />
        <meshStandardMaterial color="#3a2a1a" emissive="#2a1a0a" emissiveIntensity={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.5, 3, 6]} />
        <meshStandardMaterial color="#1a3a1a" emissive={color} emissiveIntensity={0.15} flatShading />
        <Edges color={color} opacity={0.3} />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.8, 2.5, 6]} />
        <meshStandardMaterial color="#1a4a1a" emissive={color} emissiveIntensity={0.25} flatShading />
        <Edges color={color} opacity={0.4} />
      </mesh>
      <mesh position={[0, 7.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color="#1a5a1a" emissive={color} emissiveIntensity={0.5} flatShading />
        <Edges color={color} opacity={0.6} />
      </mesh>
      {[...Array(4)].map((_, i) => (
        <mesh
          key={`vine-${i}`}
          ref={(el) => { if (el) vineRefs.current[i] = el }}
          position={[Math.sin(i) * 0.8, 5 + i * 0.2, Math.cos(i) * 0.8]}
          rotation={[0.2, 0, 0.1]}>
          <cylinderGeometry args={[0.03, 0.01, 1.5, 4]} />
          <meshStandardMaterial color="#2a6a1a" emissive="#aaff00" emissiveIntensity={0.2} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ─── JUMPING FISH ────────────────────────────────────────────────────────────
function JumpingFish({ position, phase, color }: { position: [number, number, number]; phase: number; color: string }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      const arc = Math.max(0, Math.sin(t * 2 + phase))
      group.current.position.y = position[1] + arc * 4
      group.current.rotation.z = arc * 1.5 - 0.75
    }
  })

  return (
    <group ref={group} position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.3, 3]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

// ─── WALKING ANIMAL ──────────────────────────────────────────────────────────
function WalkingAnimal({ initialPosition, speedOffset, color, scale }: { initialPosition: [number, number, number]; speedOffset: number; color: string; scale: number }) {
  const group = useRef<THREE.Group>(null)
  const leg1 = useRef<THREE.Group>(null)
  const leg2 = useRef<THREE.Group>(null)
  const leg3 = useRef<THREE.Group>(null)
  const leg4 = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * 1.5 + speedOffset
    if (group.current) {
      group.current.position.y = initialPosition[1] + Math.abs(Math.sin(t * 2)) * 0.1
      group.current.position.x = initialPosition[0] + Math.sin(t * 0.3) * 3
      group.current.position.z = initialPosition[2] + Math.cos(t * 0.3) * 1
      group.current.rotation.y = t * 0.3 + (Math.PI / 2)
    }
    const legWalk = Math.sin(t * 2) * 0.8
    if (leg1.current) leg1.current.rotation.z = legWalk
    if (leg2.current) leg2.current.rotation.z = -legWalk
    if (leg3.current) leg3.current.rotation.z = -legWalk
    if (leg4.current) leg4.current.rotation.z = legWalk
  })

  return (
    <group ref={group} position={initialPosition} scale={scale}>
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.15, 0.7, 4, 8]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2} wireframe />
      </mesh>
      <group position={[0.5, 0.7, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#000" emissive="#fff" emissiveIntensity={3} flatShading />
        </mesh>
      </group>
      <group position={[0.2, 0.3, 0.15]} ref={leg1}><mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.03, 0.02, 0.3]} /><meshStandardMaterial color="#000" emissive={color} emissiveIntensity={1} /></mesh></group>
      <group position={[0.2, 0.3, -0.15]} ref={leg2}><mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.03, 0.02, 0.3]} /><meshStandardMaterial color="#000" emissive={color} emissiveIntensity={1} /></mesh></group>
      <group position={[-0.2, 0.3, 0.15]} ref={leg3}><mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.03, 0.02, 0.3]} /><meshStandardMaterial color="#000" emissive={color} emissiveIntensity={1} /></mesh></group>
      <group position={[-0.2, 0.3, -0.15]} ref={leg4}><mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.03, 0.02, 0.3]} /><meshStandardMaterial color="#000" emissive={color} emissiveIntensity={1} /></mesh></group>
    </group>
  )
}

// ─── FIREFLIES ───────────────────────────────────────────────────────────────
function Fireflies({ count = 80, color = '#ffffaa' }) {
  const points = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.005
        positions[i + 1] += Math.cos(state.clock.elapsedTime + i) * 0.005
        positions[i + 2] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005
        if (positions[i] > 30) positions[i] = -30
        if (positions[i] < -30) positions[i] = 30
        if (positions[i + 1] > 10) positions[i + 1] = -5
        if (positions[i + 1] < -5) positions[i + 1] = 10
      }
      points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 60)), 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.4} color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// ─── BIRDS ───────────────────────────────────────────────────────────────────
function Birds({ count = 10, color = '#ffaa33' }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5
    if (group.current) {
      group.current.children.forEach((bird, i) => {
        bird.position.x = Math.sin(t + i) * 20
        bird.position.y = 12 + Math.sin(t * 2 + i) * 3
        bird.position.z = Math.cos(t + i) * 20
        bird.rotation.y = t + i
      })
    }
  })

  return (
    <group ref={group}>
      {[...Array(count)].map((_, i) => (
        <group key={i} position={[0, 12, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.2, 0.5, 3]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.15, 0.4, 3]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── GROUND COVER (grass/ferns) ──────────────────────────────────────────────
function GroundCover() {
  const count = 200
  return (
    <Instances limit={count} position={[0, -20, -25]}>
      <planeGeometry args={[0.5, 1]} />
      <meshStandardMaterial color="#1a4a1a" emissive="#224422" emissiveIntensity={0.2} side={THREE.DoubleSide} />
      {Array.from({ length: count }).map((_, i) => (
        <Instance
          key={i}
          position={[(Math.random() - 0.5) * 100, -20.5, (Math.random() - 0.5) * 100 - 25]}
          rotation={[0, Math.random() * Math.PI, 0]}
          scale={0.5 + Math.random() * 0.5}
        />
      ))}
    </Instances>
  )
}

// ─── FLOATING GLOWING ORBS ───────────────────────────────────────────────────
function GlowingOrbs({ count = 20 }) {
  return (
    <group position={[0, -15, -20]}>
      {Array.from({ length: count }).map((_, i) => {
        const pos: [number, number, number] = [
          (Math.random() - 0.5) * 60,
          Math.random() * 15,
          (Math.random() - 0.5) * 40 - 20
        ]
        return (
          <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={pos}>
              <sphereGeometry args={[0.2 + Math.random() * 0.3, 8, 8]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#ffaa33' : i % 3 === 1 ? '#13ffe1' : '#00ff9d'}
                emissive={i % 3 === 0 ? '#ffaa33' : i % 3 === 1 ? '#13ffe1' : '#00ff9d'}
                emissiveIntensity={2}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

// ─── FLOWER GROUP (original, but more flowers) ───────────────────────────────
const FLOWER_COUNT = 50
const FLOWER_DATA = Array.from({ length: FLOWER_COUNT }).map((_, i) => {
  const angle = (i / FLOWER_COUNT) * Math.PI * 2
  const radius = 27 + Math.random() * 8
  return {
    key: i,
    position: [Math.cos(angle) * radius, -5.9, -5 + Math.sin(angle) * radius] as [number, number, number],
    color: i % 3 === 0 ? '#ff6b35' : i % 3 === 1 ? '#13ffe1' : '#00ff9d'
  }
})

function FlowerGroup() {
  return (
    <>
      {FLOWER_DATA.map(f => (
        <mesh key={f.key} position={f.position}>
          <sphereGeometry args={[0.4 + Math.random() * 0.3, 6, 6]} />
          <meshStandardMaterial color="#000" emissive={f.color} emissiveIntensity={1.5 + Math.random()} />
        </mesh>
      ))}
    </>
  )
}

// ─── ENVIRONMENT ─────────────────────────────────────────────────────────────
function JungleEnvironment() {
  const scroll = useScroll()
  const sunRef = useRef<THREE.Mesh>(null)
  const envGroup = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((state, delta) => {
    const offset = scroll.offset
    if (sunRef.current) {
      sunRef.current.position.y = THREE.MathUtils.damp(sunRef.current.position.y, 20 - offset * 30, 3, delta)
    }
    if (envGroup.current) {
      envGroup.current.position.y = THREE.MathUtils.damp(envGroup.current.position.y, 0 + offset * 8, 3, delta)
      envGroup.current.position.z = THREE.MathUtils.damp(envGroup.current.position.z, 0 + offset * 10, 3, delta)
    }
    if (lightRef.current) {
      lightRef.current.color.setHSL(0.05 + offset * 0.1, 1, 0.5)
    }
  })

  // Generate tree positions
  const treePositions = [
    [-35, 15, -15], [-30, 10, -10], [-25, 5, -5], [-40, 20, -20],
    [35, 15, -15], [30, 10, -10], [25, 5, -5], [40, 20, -20],
    [-20, 8, -30], [20, 8, -30], [-15, 12, -40], [15, 12, -40],
    [-10, 6, -50], [10, 6, -50], [-5, 10, -60], [5, 10, -60],
    [-48, 25, -40], [52, 20, -45], [-28, 14, -15], [-22, 5, -8],
    [-38, 22, -10], [30, 10, -15], [24, 2, -5], [34, 18, -12],
    [44, 15, -20]
  ]

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        ref={lightRef}
        position={[5, 20, -10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}>
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50, 0.1, 100]} />
      </directionalLight>
      <pointLight position={[-10, 10, 10]} intensity={0.8} color="#ffaa33" />
      <pointLight position={[10, 5, 20]} intensity={0.6} color="#33aaff" />

      <Environment preset="forest" background blur={0.5} />

      <Cloud position={[-20, 10, -30]} speed={0.2} opacity={0.3} color="#aaccff" />
      <Cloud position={[20, 15, -40]} speed={0.3} opacity={0.2} color="#ffccaa" />

      <Stars radius={150} depth={80} count={6000} factor={6} saturation={1} fade speed={0.3} />

      <mesh ref={sunRef} position={[0, 20, -150]}>
        <sphereGeometry args={[35, 64, 64]} />
        <meshBasicMaterial color="#ffaa55" />
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[38, 2]} />
          <meshBasicMaterial color="#ff8844" wireframe transparent opacity={0.2} />
        </mesh>
      </mesh>

      <group ref={envGroup}>
        {/* Distant mountains */}
        <group position={[0, -10, -100]}>
          <mesh position={[-60, -15, 0]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
            <coneGeometry args={[50, 80, 8]} />
            <meshStandardMaterial color="#1a2a2a" emissive="#112211" flatShading />
            <Edges color="#44aa88" threshold={15} />
          </mesh>
          <mesh position={[60, -10, -10]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
            <coneGeometry args={[60, 90, 8]} />
            <meshStandardMaterial color="#1a2a2a" emissive="#112211" flatShading />
            <Edges color="#88aa44" />
          </mesh>
          <mesh position={[0, -50, -20]}>
            <coneGeometry args={[70, 60, 8]} />
            <meshStandardMaterial color="#1a2a2a" emissive="#112211" flatShading />
          </mesh>
        </group>

        {/* Midground cliffs */}
        <group position={[0, -14, -50]}>
          <mesh position={[-45, -5, 0]} rotation={[0, 0.4, 0]} castShadow receiveShadow>
            <coneGeometry args={[45, 60, 8]} />
            <meshStandardMaterial color="#1a3a2a" emissive="#112211" roughness={0.8} />
            <Edges color="#44aa88" threshold={25} />
          </mesh>
          <mesh position={[45, -8, -10]} rotation={[0, -0.3, 0]} castShadow receiveShadow>
            <coneGeometry args={[48, 70, 8]} />
            <meshStandardMaterial color="#1a3a2a" emissive="#112211" roughness={0.8} />
            <Edges color="#88aa44" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#1a2a1a" emissive="#112211" roughness={1} />
          </mesh>
        </group>

        {/* Lake area */}
        <group position={[0, -23, -22]}>
          {/* Lake with reflections */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.9, -5]} receiveShadow>
            <circleGeometry args={[30, 64]} />
            <MeshReflectorMaterial
              blur={[200, 80]}
              resolution={512}
              mixBlur={1}
              mixStrength={1}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#1a4a6a"
              metalness={0.5}
              emissive="#226688"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.8, -5]}>
            <ringGeometry args={[25, 28, 64]} />
            <meshStandardMaterial color="#33aaff" emissive="#33aaff" emissiveIntensity={0.5} transparent opacity={0.4} />
          </mesh>

          {/* Trees */}
          {treePositions.map((pos, i) => (
            <JungleTree
              key={`tree-${i}`}
              position={[pos[0], pos[1] - 20, pos[2]]}
              scale={1.5 + Math.random() * 1.5}
              color={i % 2 === 0 ? '#00ff9d' : '#13ffe1'}
              variant={i % 3 === 0 ? 'palm' : 'normal'}
            />
          ))}

          {/* Animals */}
          <WalkingAnimal initialPosition={[-18, -5, 5]} speedOffset={0} color="#00ff9d" scale={2.2} />
          <WalkingAnimal initialPosition={[14, -5, 2]} speedOffset={Math.PI / 2} color="#ff6b35" scale={2.0} />
          <WalkingAnimal initialPosition={[8, -5, 14]} speedOffset={Math.PI} color="#13ffe1" scale={2.5} />
          <WalkingAnimal initialPosition={[-8, -5, -5]} speedOffset={1.5} color="#ffaa33" scale={1.8} />
          <WalkingAnimal initialPosition={[20, -5, -10]} speedOffset={2.3} color="#88ff88" scale={2.1} />

          {/* Fish */}
          {([
            [-8, -5.5, 0, '#13ffe1'],
            [5, -5.5, -12, '#ff6b35'],
            [-12, -5.5, -8, '#00ff9d'],
            [10, -5.5, 8, '#13ffe1'],
            [-5, -5.5, 15, '#ffaa33'],
            [2, -5.5, -18, '#88ff88'],
          ] as [number, number, number, string][]).map(([x, y, z, col], i) => (
            <JumpingFish key={i} position={[x, y, z]} phase={i * 1.5} color={col} />
          ))}

          <FlowerGroup />
        </group>

        <Fireflies count={100} color="#ffff88" />
        <Birds count={12} color="#ffaa33" />
        <GlowingOrbs count={25} />
      </group>

      <GroundCover />
    </>
  )
}

// ─── MAIN SCENE ──────────────────────────────────────────────────────────────
export function WebGLScene() {
  const { height } = useThree((state) => state.viewport)

  return (
    <>
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={200} intensity={1.2} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <BrightnessContrast brightness={0.05} contrast={0.1} />
      </EffectComposer>

      <JungleEnvironment />

      <Scroll>
        <Sparkles count={600} scale={[80, height * 15, 60]} size={5} speed={0.3} opacity={0.3} color="#88ff88" position={[0, -height*4, -20]} />
        <Sparkles count={400} scale={[70, height * 15, 50]} size={8} speed={0.5} opacity={0.4} color="#ffaa33" position={[0, -height*4, -10]} />
      </Scroll>

      <CameraShake maxYaw={0.02} maxPitch={0.02} maxRoll={0.02} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.5} />
    </>
  )
}