'use client'

/* ═══════════════════════════════════════════════════════════════
   AudioEngine — Web Audio API synthesized sounds
   
   • playCrash()    — layered explosion on meteor impact
   • startTheme()   — ambient atmospheric loop (generative)
   • stopTheme()    — fade out theme
   • resumeCtx()    — unlock AudioContext after user gesture
   ═══════════════════════════════════════════════════════════════ */

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let themeNodes: { gains: GainNode[]; oscs: OscillatorNode[]; stop: () => void } | null = null
let themeRunning = false

function getCtx() {
  if (!ctx) {
    ctx = new AudioContext()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.7
    masterGain.connect(ctx.destination)
  }
  return { ctx, master: masterGain! }
}

/** Call on first user gesture to unlock audio */
export function resumeCtx() {
  const { ctx: c } = getCtx()
  if (c.state === 'suspended') c.resume()
}

/* ─── Crash / Explosion Sound ─────────────────────────────────
   Layers:
   1. Low sub-boom (40-60 Hz sine, fast decay)
   2. Mid impact thud (100-200 Hz, distorted)
   3. Noise burst (filtered white noise, bandpass sweep)
   4. High crackle/debris (high-passed noise, scattered)
   5. Reverse reverb tail (convolver-like fade-in)
   ──────────────────────────────────────────────────────────── */
export function playCrash() {
  const { ctx: c, master } = getCtx()
  if (c.state === 'suspended') c.resume()
  const now = c.currentTime

  // ── 1. Sub boom ──
  const subOsc = c.createOscillator()
  const subGain = c.createGain()
  subOsc.type = 'sine'
  subOsc.frequency.setValueAtTime(55, now)
  subOsc.frequency.exponentialRampToValueAtTime(25, now + 1.5)
  subGain.gain.setValueAtTime(0.9, now)
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)
  subOsc.connect(subGain).connect(master)
  subOsc.start(now)
  subOsc.stop(now + 2.0)

  // ── 2. Mid thud with slight distortion ──
  const midOsc = c.createOscillator()
  const midGain = c.createGain()
  // Waveshaper for grit
  midOsc.type = 'sawtooth'
  midOsc.frequency.setValueAtTime(150, now)
  midOsc.frequency.exponentialRampToValueAtTime(40, now + 0.8)
  midGain.gain.setValueAtTime(0.5, now)
  midGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
  // Simple waveshaper for grit
  const shaper = c.createWaveShaper()
  const curve = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const x = (i / 128) - 1
    curve[i] = Math.tanh(x * 3)
  }
  shaper.curve = curve
  shaper.oversample = '2x'
  midOsc.connect(shaper).connect(midGain).connect(master)
  midOsc.start(now)
  midOsc.stop(now + 1.0)

  // ── 3. Noise burst — bandpass sweep ──
  const noiseLen = 2.5
  const noiseBuf = c.createBuffer(1, c.sampleRate * noiseLen, c.sampleRate)
  const noiseData = noiseBuf.getChannelData(0)
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1)
  }
  // Apply amplitude envelope to buffer directly
  const attackSamples = Math.floor(c.sampleRate * 0.005)
  const decaySamples = noiseData.length
  for (let i = 0; i < noiseData.length; i++) {
    let env: number
    if (i < attackSamples) {
      env = i / attackSamples
    } else {
      env = Math.pow(1 - (i - attackSamples) / (decaySamples - attackSamples), 2)
    }
    noiseData[i] *= env
  }

  const noiseSrc = c.createBufferSource()
  noiseSrc.buffer = noiseBuf
  const noiseFilter = c.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(2000, now)
  noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 1.5)
  noiseFilter.Q.value = 0.8
  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.6, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)
  noiseSrc.connect(noiseFilter).connect(noiseGain).connect(master)
  noiseSrc.start(now)

  // ── 4. High debris crackle ──
  const crackleLen = 1.8
  const crackleBuf = c.createBuffer(1, c.sampleRate * crackleLen, c.sampleRate)
  const crackleData = crackleBuf.getChannelData(0)
  for (let i = 0; i < crackleData.length; i++) {
    // Sparse crackle: mostly silence with random pops
    crackleData[i] = Math.random() < 0.03 ? (Math.random() * 2 - 1) * 0.8 : 0
  }
  const crackleSrc = c.createBufferSource()
  crackleSrc.buffer = crackleBuf
  const crackleHP = c.createBiquadFilter()
  crackleHP.type = 'highpass'
  crackleHP.frequency.value = 3000
  const crackleGain = c.createGain()
  crackleGain.gain.setValueAtTime(0.35, now)
  crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
  crackleSrc.connect(crackleHP).connect(crackleGain).connect(master)
  crackleSrc.start(now + 0.05) // slight delay for layering

  // ── 5. Tonal ring-out (metallic resonance) ──
  const ringFreqs = [220, 330, 440, 660]
  ringFreqs.forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.08, now + 0.02 * i)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5 + i * 0.3)
    osc.connect(gain).connect(master)
    osc.start(now + 0.02 * i)
    osc.stop(now + 3 + i * 0.3)
  })
}

/* ─── Ambient Theme Song ──────────────────────────────────────
   Generative ambient pad:
   - 4 detuned oscillators forming a lush chord
   - Slow LFO modulating filter cutoff
   - Gentle arpeggio layer on top
   - Everything loops indefinitely
   
   Key: A minor / Aeolian — dreamy, mysterious
   Chord voicing: Am9 → Fmaj7 → Cmaj7 → Em7 (cycle)
   ──────────────────────────────────────────────────────────── */

// Note frequencies
const NOTE = {
  A2: 110, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196,
  A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63,
  F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25,
}

// Chord progressions (each chord is an array of frequencies)
const CHORDS = [
  [NOTE.A2, NOTE.E3, NOTE.A3, NOTE.C4, NOTE.E4, NOTE.B4],  // Am9
  [NOTE.C3, NOTE.G3, NOTE.C4, NOTE.E4, NOTE.G4, NOTE.B4],  // Cmaj7
  [NOTE.D3, NOTE.A3, NOTE.D4, NOTE.A4],                      // Dm(add9) simplified
  [NOTE.E3, NOTE.B3, NOTE.E4, NOTE.G4, NOTE.B4],            // Em7
]

// Arpeggio notes (pentatonic A minor)
const ARP_NOTES = [NOTE.A4, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.C5, NOTE.A4, NOTE.G4, NOTE.E4]

export function startTheme() {
  if (themeRunning) return
  themeRunning = true

  const { ctx: c, master } = getCtx()
  if (c.state === 'suspended') c.resume()
  const now = c.currentTime

  const allOscs: OscillatorNode[] = []
  const allGains: GainNode[] = []

  // ── Master theme gain (for fade-in / fade-out) ──
  const themeGain = c.createGain()
  themeGain.gain.setValueAtTime(0, now)
  themeGain.gain.linearRampToValueAtTime(0.35, now + 3) // 3s fade-in
  themeGain.connect(master)
  allGains.push(themeGain)

  // ── PAD LAYER: 4 detuned sines per chord tone ──
  const padGain = c.createGain()
  padGain.gain.value = 0.12
  const padFilter = c.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 800
  padFilter.Q.value = 0.5
  padGain.connect(padFilter).connect(themeGain)
  allGains.push(padGain)

  // LFO for filter sweep
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.type = 'sine'
  lfo.frequency.value = 0.08 // Very slow sweep
  lfoGain.gain.value = 400
  lfo.connect(lfoGain).connect(padFilter.frequency)
  lfo.start(now)
  allOscs.push(lfo)

  // Create pad oscillators for initial chord
  const padOscs: OscillatorNode[] = []
  const padOscGains: GainNode[] = []
  
  // Use first chord tones to start
  const maxVoices = 8
  for (let v = 0; v < maxVoices; v++) {
    const osc = c.createOscillator()
    const oscGain = c.createGain()
    osc.type = v % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.value = CHORDS[0][v % CHORDS[0].length]
    // Slight detune for warmth
    osc.detune.value = (v - maxVoices / 2) * 6 + (Math.random() - 0.5) * 4
    oscGain.gain.value = v < CHORDS[0].length ? 0.15 : 0
    osc.connect(oscGain).connect(padGain)
    osc.start(now)
    padOscs.push(osc)
    padOscGains.push(oscGain)
    allOscs.push(osc)
    allGains.push(oscGain)
  }

  // ── Chord progression scheduler ──
  const CHORD_DUR = 8 // seconds per chord
  let chordIndex = 0
  let chordTimer: ReturnType<typeof setInterval>

  function advanceChord() {
    chordIndex = (chordIndex + 1) % CHORDS.length
    const chord = CHORDS[chordIndex]
    const t = c.currentTime

    padOscs.forEach((osc, v) => {
      const freq = chord[v % chord.length]
      osc.frequency.cancelScheduledValues(t)
      osc.frequency.setValueAtTime(osc.frequency.value, t)
      osc.frequency.linearRampToValueAtTime(freq, t + 2) // Smooth 2s glide

      // Fade unused voices
      const g = v < chord.length ? 0.15 : 0
      padOscGains[v].gain.cancelScheduledValues(t)
      padOscGains[v].gain.setValueAtTime(padOscGains[v].gain.value, t)
      padOscGains[v].gain.linearRampToValueAtTime(g, t + 1.5)
    })
  }

  chordTimer = setInterval(advanceChord, CHORD_DUR * 1000)

  // ── ARPEGGIO LAYER ──
  const arpGain = c.createGain()
  arpGain.gain.value = 0.06
  const arpFilter = c.createBiquadFilter()
  arpFilter.type = 'lowpass'
  arpFilter.frequency.value = 2000
  arpFilter.Q.value = 2
  arpGain.connect(arpFilter).connect(themeGain)
  allGains.push(arpGain)

  // LFO for arp filter
  const arpLfo = c.createOscillator()
  const arpLfoGain = c.createGain()
  arpLfo.type = 'sine'
  arpLfo.frequency.value = 0.15
  arpLfoGain.gain.value = 600
  arpLfo.connect(arpLfoGain).connect(arpFilter.frequency)
  arpLfo.start(now)
  allOscs.push(arpLfo)

  let arpIndex = 0
  let arpTimer: ReturnType<typeof setInterval>

  function playArpNote() {
    const freq = ARP_NOTES[arpIndex % ARP_NOTES.length]
    arpIndex++
    const t = c.currentTime

    const osc = c.createOscillator()
    const env = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.detune.value = (Math.random() - 0.5) * 8

    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(0.2, t + 0.05)
    env.gain.exponentialRampToValueAtTime(0.001, t + 1.8)

    osc.connect(env).connect(arpGain)
    osc.start(t)
    osc.stop(t + 2)
  }

  arpTimer = setInterval(playArpNote, 700) // ~85 BPM arp

  // ── SUB DRONE ──
  const droneOsc = c.createOscillator()
  const droneGain = c.createGain()
  droneOsc.type = 'sine'
  droneOsc.frequency.value = NOTE.A2
  droneGain.gain.value = 0.1
  droneOsc.connect(droneGain).connect(themeGain)
  droneOsc.start(now)
  allOscs.push(droneOsc)
  allGains.push(droneGain)

  // Drone pitch LFO (very subtle)
  const droneLfo = c.createOscillator()
  const droneLfoGain = c.createGain()
  droneLfo.type = 'sine'
  droneLfo.frequency.value = 0.05
  droneLfoGain.gain.value = 2
  droneLfo.connect(droneLfoGain).connect(droneOsc.frequency)
  droneLfo.start(now)
  allOscs.push(droneLfo)

  // ── HIGH SHIMMER (filtered noise, very quiet) ──
  const shimmerLen = 4
  const shimmerBuf = c.createBuffer(2, c.sampleRate * shimmerLen, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = shimmerBuf.getChannelData(ch)
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.3
    }
  }

  let shimmerTimer: ReturnType<typeof setInterval>
  function playShimmer() {
    const t = c.currentTime
    const src = c.createBufferSource()
    src.buffer = shimmerBuf
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 4000 + Math.random() * 3000
    bp.Q.value = 8
    const g = c.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.02, t + 1)
    g.gain.linearRampToValueAtTime(0, t + shimmerLen)
    src.connect(bp).connect(g).connect(themeGain)
    src.start(t)
  }

  shimmerTimer = setInterval(playShimmer, 5000)
  playShimmer() // initial

  // ── Store stop function ──
  themeNodes = {
    gains: allGains,
    oscs: allOscs,
    stop: () => {
      clearInterval(chordTimer)
      clearInterval(arpTimer)
      clearInterval(shimmerTimer)
      const t = c.currentTime
      themeGain.gain.cancelScheduledValues(t)
      themeGain.gain.setValueAtTime(themeGain.gain.value, t)
      themeGain.gain.linearRampToValueAtTime(0, t + 2)
      setTimeout(() => {
        allOscs.forEach(o => { try { o.stop() } catch {} })
        themeRunning = false
        themeNodes = null
      }, 2500)
    },
  }
}

export function stopTheme() {
  if (themeNodes) themeNodes.stop()
}

/** Check if theme is running */
export function isThemePlaying() {
  return themeRunning
}

/* ─── Approach whoosh sound (plays during meteor approach) ────── */
export function playApproachWhoosh() {
  const { ctx: c, master } = getCtx()
  if (c.state === 'suspended') c.resume()
  const now = c.currentTime
  const duration = 3.2 // match meteor approach duration

  // Rising pitch whoosh
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(60, now)
  osc.frequency.exponentialRampToValueAtTime(300, now + duration)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.3)
  gain.gain.linearRampToValueAtTime(0.35, now + duration * 0.9)
  gain.gain.linearRampToValueAtTime(0, now + duration)

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(200, now)
  filter.frequency.exponentialRampToValueAtTime(3000, now + duration)
  filter.Q.value = 1

  osc.connect(filter).connect(gain).connect(master)
  osc.start(now)
  osc.stop(now + duration)

  // Wind noise layer
  const noiseLen = duration + 0.5
  const noiseBuf = c.createBuffer(1, c.sampleRate * noiseLen, c.sampleRate)
  const noiseData = noiseBuf.getChannelData(0)
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1)
  }
  const noiseSrc = c.createBufferSource()
  noiseSrc.buffer = noiseBuf
  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0, now)
  noiseGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.5)
  noiseGain.gain.linearRampToValueAtTime(0.2, now + duration * 0.95)
  noiseGain.gain.linearRampToValueAtTime(0, now + duration)
  const noiseBP = c.createBiquadFilter()
  noiseBP.type = 'bandpass'
  noiseBP.frequency.setValueAtTime(400, now)
  noiseBP.frequency.exponentialRampToValueAtTime(2500, now + duration)
  noiseBP.Q.value = 0.5
  noiseSrc.connect(noiseBP).connect(noiseGain).connect(master)
  noiseSrc.start(now)
}
