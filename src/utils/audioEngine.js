// Generative Web Audio Synthesizer for Museum Ambience & Acoustic Cues

class MuseumAudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.analyser = null
    this.droneGain = null
    this.isPlaying = false
    this.oscillators = []
    this.isMuted = true
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    this.ctx = new AudioContext()

    // Master Gain
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime)

    // Live Analyser for Visualizer Bars
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 64
    this.analyser.smoothingTimeConstant = 0.8

    this.masterGain.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)

    this.setupDrone()
  }

  setupDrone() {
    if (!this.ctx) return

    // Warm Low Pass Filter to create museum gallery acoustic echo
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(220, this.ctx.currentTime)
    filter.Q.setValueAtTime(3, this.ctx.currentTime)

    this.droneGain = this.ctx.createGain()
    this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime)

    // Fundamental tones: C2 (65.4Hz) and G2 (98.0Hz) with gentle detuning
    const freqs = [65.41, 65.8, 98.0, 130.81]
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      // Slow LFO for organic breath
      const lfo = this.ctx.createOscillator()
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.ctx.currentTime)
      const lfoGain = this.ctx.createGain()
      lfoGain.gain.setValueAtTime(2.5, this.ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      osc.connect(filter)
      osc.start()
      this.oscillators.push(osc, lfo)
    })

    filter.connect(this.droneGain)
    this.droneGain.connect(this.masterGain)
  }

  toggleSound() {
    this.init()
    if (!this.ctx) return false

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    if (this.isMuted) {
      this.unmute()
    } else {
      this.mute()
    }

    return !this.isMuted
  }

  unmute() {
    if (!this.ctx || !this.masterGain) return
    this.isMuted = false
    this.isPlaying = true
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 1.2)
  }

  mute() {
    if (!this.ctx || !this.masterGain) return
    this.isMuted = true
    this.isPlaying = false
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6)
  }

  playTransitionChime(hallIndex = 1) {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    // Harmonic pentatonic frequencies for distinct museum halls
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]
    const baseFreq = notes[(hallIndex - 1) % notes.length]

    osc.type = 'sine'
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 1.2)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 2.0)
  }

  playExhibitFocus() {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.3) // A5

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.09, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.9)
  }

  playHoverTick() {
    if (this.isMuted || !this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)

    gain.gain.setValueAtTime(0.015, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.06)
  }

  getFrequencyData() {
    if (!this.analyser || this.isMuted) {
      return new Uint8Array(16)
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)
    return dataArray
  }
}

export const audioEngine = new MuseumAudioEngine()
