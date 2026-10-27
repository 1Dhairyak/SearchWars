/**
 * GamePage — the game loop UI. All animation is CSS (transform/opacity only)
 * so it stays on the GPU on phones.
 */
import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { useGameContext } from '../context/GameContext'
import { soundManager } from '../services/sounds'
import SideCard from '../components/game/SideCard'
import VSCircle from '../components/game/VSCircle'
import ScorePopup from '../components/game/ScorePopup'
import SoundToggle from '../components/ui/SoundToggle'

export default function GamePage() {
  const navigate = useNavigate()
  const { leftItem, rightItem, score, phase, guess, reset, error, sessionId } = useGame()
  const { highScore } = useGameContext()

  // Keyboard controls (unchanged from Phase 4)
  const handleKeyDown = useCallback(
    (e) => {
      if (phase !== 'playing') return
      if (e.key === 'ArrowUp')   { e.preventDefault(); guess('higher') }
      if (e.key === 'ArrowDown') { e.preventDefault(); guess('lower')  }
    },
    [phase, guess]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Navigate to game over after wrong-answer feedback; fire gameOver sound
  useEffect(() => {
    if (phase !== 'wrong') return
    soundManager.gameOver()
    const t = setTimeout(() => {
      navigate('/game-over', { state: { score, highScore, sessionId } })
    }, 1600)
    return () => clearTimeout(t)
  }, [phase, score, highScore, sessionId, navigate])

  // Slow first load = backend waking from sleep (Render free tier)
  const [slowLoad, setSlowLoad] = useState(false)
  useEffect(() => {
    setSlowLoad(false)
    if (phase !== 'loading') return
    const t = setTimeout(() => setSlowLoad(true), 3000)
    return () => clearTimeout(t)
  }, [phase])

  // Error — could not reach backend (checked first: on error there are no items)
  if (error) {
    return (
      <div className="min-h-screen bg-game-darker flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6">
          <span className="text-5xl" aria-hidden="true">📡</span>
          <p className="text-game-red font-display text-3xl sm:text-4xl">CONNECTION ERROR</p>
          <p className="text-white/50 font-body max-w-xs">{error}</p>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-full font-body font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00C2FF)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Loading — waiting for session from backend
  if (phase === 'loading' || !leftItem || !rightItem) {
    return (
      <div className="min-h-screen bg-game-darker flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6">
          <div
            className="w-14 h-14 rounded-full animate-spin"
            style={{
              border: '3px solid rgba(0,255,135,0.15)',
              borderTopColor: '#00FF87',
            }}
          />
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
            {slowLoad ? 'Waking up server…' : 'Loading game…'}
          </p>
          {slowLoad && (
            <p className="text-white/30 font-body text-xs max-w-xs">
              First load after a while can take up to a minute.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-game-darker flex flex-col animate-fade-in"
      role="main"
      aria-label="SearchWars game"
    >
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div
        className="relative z-40 flex items-center justify-between px-4 sm:px-6 py-3 shrink-0"
        style={{
          background: 'rgba(5,10,15,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => { soundManager.swipe(); navigate('/') }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs sm:text-sm font-mono tracking-widest focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-game-green rounded"
          aria-label="Go back to home"
        >
          ← HOME
        </button>

        <div
          className="flex items-center gap-4 sm:gap-6"
          aria-label="Game scores"
          role="status"
        >
          <div className="text-center" aria-label={`Current score: ${score}`}>
            <div className="text-white/40 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
              Score
            </div>
            <div className="font-display text-xl sm:text-2xl text-white">{score}</div>
          </div>
          <div
            className="w-px h-8"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            aria-hidden="true"
          />
          <div className="text-center" aria-label={`Best score: ${highScore}`}>
            <div className="text-white/40 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
              Best
            </div>
            <div
              className="font-display text-xl sm:text-2xl text-game-gold"
              style={{ textShadow: '0 0 10px rgba(255,215,0,0.4)' }}
            >
              {highScore}
            </div>
          </div>
        </div>

        {/* Phase 5: sound toggle + restart side by side */}
        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            onClick={() => { soundManager.swipe(); reset() }}
            className="text-white/50 hover:text-game-green transition-colors text-xs sm:text-sm font-mono tracking-widest focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-game-green rounded"
            aria-label="Restart game"
          >
            RESTART
          </button>
        </div>
      </div>

      {/* ── Game area ────────────────────────────────────────────────────────── */}
      <div
        className={`relative flex flex-col sm:flex-row flex-1 overflow-hidden ${phase === 'wrong' ? 'animate-shake' : ''}`}
        aria-live="assertive"
        aria-atomic="true"
      >
        <ScorePopup phase={phase} score={score} />

        {/* LEFT CARD — re-mounts (new key) each round, which replays the fade */}
        <div
          key={`left-${leftItem.id}`}
          className="flex-1 relative sm:h-full overflow-hidden animate-fade-in"
        >
          <SideCard item={leftItem} side="left" showVolume phase={phase} />
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="absolute sm:inset-y-0 sm:left-1/2 sm:w-px inset-x-0 top-1/2 h-px sm:h-auto z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />

        {/* RIGHT CARD */}
        <div
          key={`right-${rightItem.id}`}
          className="flex-1 relative sm:h-full overflow-hidden animate-slide-in-right"
        >
          <SideCard
            item={rightItem}
            side="right"
            showVolume={phase === 'correct' || phase === 'wrong'}
            phase={phase}
            onGuess={guess}
            compareItemName={leftItem.name}
          />
        </div>

        <VSCircle score={score} phase={phase} />

        {/* Full-screen feedback flash (translucent colour, faded in) */}
        {phase === 'correct' && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-20 bg-game-green/[0.08] animate-fade-in" />
        )}
        {phase === 'wrong' && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-20 bg-game-red/[0.12] animate-fade-in" />
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-40 flex items-center justify-between px-4 sm:px-6 py-2 shrink-0"
        style={{
          background: 'rgba(5,10,15,0.95)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <span className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-widest">
          🏆 Best: <span className="text-game-gold">{highScore}</span>
        </span>
        <span className="hidden sm:block text-white/20 text-xs font-mono">
          ↑ ↓ arrow keys to guess
        </span>
      </div>
    </div>
  )
}

