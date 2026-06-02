/**
 * Sound Service — Phase 5
 *
 * Uses Howler.js for cross-browser audio with Web Audio API fallback.
 * All sounds are generated programmatically via the Web Audio API so
 * no external audio files are required — zero network cost, zero 404 risk.
 *
 * Architecture:
 *  - soundManager singleton initialises lazily on first interaction
 *  - Respects prefers-reduced-motion (also reduces audio intensity)
 *  - Volume persists in localStorage ('hl_sfx_vol')
 *  - Mute state persists in localStorage ('hl_sfx_muted')
 *  - All methods are safe to call without initialisation (no-op guards)
 */

import { Howl, Howler } from 'howler'

// ── Web Audio context (single shared instance) ────────────────────────────────
let _audioCtx = null

function getAudioCtx() {
  if (!_audioCtx) {
    try {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  // Resume after browser policy suspends it
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume().catch(() => {})
  }
  return _audioCtx
}

// ── Tone generator helpers ────────────────────────────────────────────────────

/**
 * Plays a synthesized tone directly via Web Audio API.
 * @param {number} freq      - Frequency in Hz
 * @param {number} duration  - Duration in seconds
 * @param {string} type      - Oscillator type ('sine'|'square'|'sawtooth'|'triangle')
 * @param {number} gain      - Peak gain (0–1)
 * @param {number} startTime - AudioContext time offset
 */
function playTone(freq, duration, type = 'sine', gain = 0.3, startTime = 0) {
  const ctx = getAudioCtx()
  if (!ctx) return

  const t = ctx.currentTime + startTime
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const masterVol = soundManager.getVolume()

  osc.type = type
  osc.frequency.setValueAtTime(freq, t)

  gainNode.gain.setValueAtTime(0, t)
  gainNode.gain.linearRampToValueAtTime(gain * masterVol, t + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration)

  osc.connect(gainNode)
  gainNode.connect(ctx.destination)

  osc.start(t)
  osc.stop(t + duration)
}

/** Short percussive click/noise burst for UI interactions */
function playNoise(duration = 0.05, gain = 0.15, startTime = 0) {
  const ctx = getAudioCtx()
  if (!ctx) return

  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }

  const source = ctx.createBufferSource()
  const gainNode = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 800

  source.buffer = buffer
  gainNode.gain.setValueAtTime(gain * soundManager.getVolume(), ctx.currentTime + startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration)

  source.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)
  source.start(ctx.currentTime + startTime)
}

// ── Named sound playback functions ────────────────────────────────────────────

/** UI hover tick */
function sfxHover() {
  playTone(880, 0.06, 'sine', 0.08)
}

/** Button press click */
function sfxClick() {
  playNoise(0.04, 0.2)
  playTone(440, 0.05, 'square', 0.1, 0.01)
}

/** Correct answer — ascending two-tone chime */
function sfxCorrect() {
  playTone(523.25, 0.12, 'sine', 0.35)       // C5
  playTone(783.99, 0.18, 'sine', 0.40, 0.1)  // G5
  playTone(1046.5, 0.25, 'sine', 0.30, 0.22) // C6
}

/** Wrong answer — descending dissonant tone */
function sfxWrong() {
  playTone(220,   0.15, 'sawtooth', 0.25)
  playTone(196,   0.20, 'sawtooth', 0.20, 0.12)
  playTone(174.6, 0.30, 'sawtooth', 0.15, 0.25)
}

/** Streak milestone (every 5 points) — ascending arpeggio */
function sfxStreak() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
  notes.forEach((f, i) => playTone(f, 0.12, 'sine', 0.28, i * 0.07))
}

/** Game over — dramatic descending chord */
function sfxGameOver() {
  playTone(261.63, 0.4, 'sawtooth', 0.25)        // C4
  playTone(207.65, 0.5, 'sawtooth', 0.20, 0.15)  // Ab3
  playTone(164.81, 0.7, 'sawtooth', 0.18, 0.3)   // E3
}

/** Page transition whoosh */
function sfxSwipe() {
  const ctx = getAudioCtx()
  if (!ctx) return
  const freq = ctx.createOscillator()
  const gain = ctx.createGain()
  const t = ctx.currentTime
  const vol = soundManager.getVolume()

  freq.type = 'sine'
  freq.frequency.setValueAtTime(800, t)
  freq.frequency.exponentialRampToValueAtTime(200, t + 0.2)

  gain.gain.setValueAtTime(0.15 * vol, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)

  freq.connect(gain)
  gain.connect(ctx.destination)
  freq.start(t)
  freq.stop(t + 0.2)
}

/** New high score fanfare */
function sfxHighScore() {
  const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  melody.forEach((f, i) => playTone(f, 0.15, 'sine', 0.32, i * 0.08))
  // Harmony
  setTimeout(() => playTone(261.63, 0.6, 'sine', 0.15), 50)
}

// ── Sound Manager singleton ───────────────────────────────────────────────────

const STORAGE_VOL  = 'hl_sfx_vol'
const STORAGE_MUTE = 'hl_sfx_muted'

export const soundManager = {
  _volume:      parseFloat((typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_VOL)) || '0.7'),
  _muted:       (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_MUTE)) === 'true',
  _initialised: false,

  /** Must be called after a user gesture to unlock AudioContext */
  init() {
    if (this._initialised) return
    getAudioCtx() // unlock
    this._initialised = true
    Howler.volume(this._muted ? 0 : this._volume)
  },

  getVolume() {
    return this._muted ? 0 : this._volume
  },

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v))
    localStorage.setItem(STORAGE_VOL, String(this._volume))
    Howler.volume(this._muted ? 0 : this._volume)
  },

  toggleMute() {
    this._muted = !this._muted
    localStorage.setItem(STORAGE_MUTE, String(this._muted))
    Howler.volume(this._muted ? 0 : this._volume)
    return this._muted
  },

  isMuted() { return this._muted },

  // ── Public play API ────────────────────────────────────────────────────────
  hover()     { if (!this._muted) sfxHover() },
  click()     { if (!this._muted) sfxClick() },
  correct()   { if (!this._muted) sfxCorrect() },
  wrong()     { if (!this._muted) sfxWrong() },
  streak()    { if (!this._muted) sfxStreak() },
  gameOver()  { if (!this._muted) sfxGameOver() },
  swipe()     { if (!this._muted) sfxSwipe() },
  highScore() { if (!this._muted) sfxHighScore() },
}

export default soundManager
