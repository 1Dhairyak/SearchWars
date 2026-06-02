/**
 * SoundToggle — Phase 5
 *
 * Mute/unmute button that persists to localStorage via soundManager.
 * Drop it anywhere in the UI; it manages its own subscribed state.
 */
import { useState, useCallback } from 'react'
import { soundManager } from '../../services/sounds'

export default function SoundToggle({ className = '' }) {
  const [muted, setMuted] = useState(() => soundManager.isMuted())

  const toggle = useCallback(() => {
    soundManager.init()
    const nowMuted = soundManager.toggleMute()
    setMuted(nowMuted)
    // Play a quick click if we just unmuted
    if (!nowMuted) soundManager.click()
  }, [])

  return (
    <button
      onClick={toggle}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker ${className}`}
      style={{
        background: muted
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(0,255,135,0.08)',
        border: muted
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid rgba(0,255,135,0.25)',
        color: muted ? 'rgba(255,255,255,0.35)' : 'rgba(0,255,135,0.8)',
      }}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-pressed={!muted}
      title={muted ? 'Sound off — click to enable' : 'Sound on — click to mute'}
    >
      <span aria-hidden="true" className="text-base leading-none select-none">
        {muted ? '🔇' : '🔊'}
      </span>
    </button>
  )
}
