/**
 * GameOverPage — score, meme line, high-score badge, actions.
 * Score recording is automatic (backend records on wrong guess).
 */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGameContext } from '../context/GameContext'
import { playerService } from '../services/api'
import { soundManager } from '../services/sounds'
import Logo from '../components/ui/Logo'
import SoundToggle from '../components/ui/SoundToggle'
import LoginModal from '../components/ui/LoginModal'

// Asks for a unique leaderboard name once per device/account (skippable),
// then shows "Saved as X · change". Claiming also renames this game's entry.
function NameCard({ sessionId }) {
  const { player, updatePlayer } = useGameContext()
  const [editing, setEditing] = useState(!player.name && !player.nameSkipped)
  const [name, setName]       = useState(player.name || '')
  const [error, setError]     = useState(null)
  const [busy, setBusy]       = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await playerService.claimName(name.trim(), sessionId)
      updatePlayer({ name: res.name })
      setEditing(false)
    } catch (err) {
      setError(err.status === 409 ? 'That name is taken — try another.' : err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!editing) {
    return (
      <div className="mt-5 text-white/40 text-xs font-mono animate-fade-in" style={{ animationDelay: '1s' }}>
        {player.name
          ? <>Saved as <span className="text-white/80">{player.name}</span> · </>
          : <>Playing without a name · </>}
        <button className="text-game-green hover:underline" onClick={() => setEditing(true)}>
          {player.name ? 'change' : 'add your name'}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={save}
      className="mt-6 w-full max-w-sm rounded-2xl p-5 text-left animate-fade-in-up"
      style={{ animationDelay: '0.9s', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <label htmlFor="player-name" className="block font-display text-xl text-white tracking-wide">
        What is your name?
      </label>
      <p className="text-white/40 text-xs font-body mb-3">It goes on the leaderboard. Names are unique.</p>
      <div className="flex gap-2">
        <input
          id="player-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={20}
          pattern="[A-Za-z0-9 ._\-]+"
          title="2–20 letters, numbers, spaces, . _ -"
          placeholder="e.g. Rahul"
          autoComplete="nickname"
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-game-green/60"
        />
        <button
          type="submit"
          disabled={busy}
          className="px-5 rounded-xl font-body font-bold text-sm text-black disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #00FF87, #00C2FF)' }}
        >
          {busy ? '…' : 'Save'}
        </button>
      </div>
      {error && <p className="mt-2 text-game-red text-xs font-body" role="alert">{error}</p>}
      <div className="mt-3 flex items-center justify-between text-xs font-body">
        <button
          type="button"
          className="text-white/40 hover:text-white"
          onClick={() => { updatePlayer({ nameSkipped: true }); setEditing(false) }}
        >
          Skip
        </button>
        {!player.authToken && (
          <button type="button" className="text-game-green hover:underline" onClick={() => setLoginOpen(true)}>
            Sign in with Google instead
          </button>
        )}
      </div>
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </form>
  )
}

// ── Meme messages (unchanged from Phase 4) ────────────────────────────────────
const MEME_MESSAGES = [
  { threshold: 0,  msg: "That's Genuinely Terrible",  sub: "My grandma could do better, and she doesn't own a phone." },
  { threshold: 3,  msg: "Below Average... Sorry",      sub: "The internet is clearly not your natural habitat." },
  { threshold: 7,  msg: "Getting There!",              sub: "Room for improvement, but at least you tried." },
  { threshold: 12, msg: "Solid Performance!",          sub: "You actually know things. Impressive." },
  { threshold: 20, msg: "Internet Wizard 🧙",          sub: "You've clearly spent too much time online. We respect it." },
  { threshold: 30, msg: "LEGENDARY STATUS 🔥",         sub: "Are you even human? Incredible." },
]

function getMemeMessage(score) {
  return MEME_MESSAGES.reduce(
    (best, m) => (score >= m.threshold ? m : best),
    MEME_MESSAGES[0]
  )
}

export default function GameOverPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const score = location.state?.score ?? 0

  const { highScore, prevBest } = useGameContext()
  const isNewHigh   = score > 0 && score > prevBest
  const isGoodScore = score >= 10
  const meme = getMemeMessage(score)

  // Phase 5: fire high-score fanfare once on mount when applicable
  useEffect(() => {
    if (isNewHigh) {
      // Short delay so it aligns with the badge animation
      const t = setTimeout(() => soundManager.highScore(), 900)
      return () => clearTimeout(t)
    }
  }, [isNewHigh])

  return (
    <div
      className="relative min-h-screen bg-game-darker overflow-hidden flex flex-col items-center justify-center px-4 py-10 animate-page"
      role="main"
      aria-label="Game over screen"
    >

      {/* Sound toggle — top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <SoundToggle />
      </div>

      {/* Decorative rings (static: rotating a uniform circle looks identical but redraws every frame) */}
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{ width: 'min(700px, 90vw)', height: 'min(700px, 90vw)', border: '1px solid rgba(255,60,60,0.08)' }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{ width: 'min(500px, 70vw)', height: 'min(500px, 70vw)', border: '1px solid rgba(0,255,135,0.08)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

        <div className="animate-fade-in">
          <Logo size="md" />
        </div>

        {/* Score */}
        <div className="mt-8 flex flex-col items-center animate-pop" style={{ animationDelay: '0.3s' }}>
          <p
            className="text-white/50 text-sm font-mono tracking-[0.3em] uppercase mb-2"
            aria-label="Your score"
          >
            You scored
          </p>
          <div
            className="font-display leading-none"
            aria-label={`${score} points`}
            style={{
              fontSize: 'clamp(5rem, 20vw, 10rem)',
              background: isGoodScore
                ? 'linear-gradient(135deg, #00FF87, #00C2FF)'
                : 'linear-gradient(135deg, #FF3C3C, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {score}
          </div>
        </div>

        {/* Meme message */}
        <div className="mt-2 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
            {meme.msg}
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-body max-w-sm leading-relaxed px-4">
            {meme.sub}
          </p>
        </div>

        {/* New high score badge */}
        {isNewHigh && (
          <div
            role="status"
            aria-label="New high score!"
            className="mt-6 px-6 py-3 rounded-full flex items-center gap-3 animate-pop"
            style={{
              animationDelay: '0.9s',
              background: 'rgba(255,215,0,0.1)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 30px rgba(255,215,0,0.3)',
            }}
          >
            <span aria-hidden="true" className="text-2xl">🎉</span>
            <span className="font-display text-lg sm:text-xl text-game-gold"
              style={{ textShadow: '0 0 15px rgba(255,215,0,0.8)' }}>
              NEW HIGH SCORE!
            </span>
            <span aria-hidden="true" className="text-2xl">🎉</span>
          </div>
        )}

        {highScore > 0 && !isNewHigh && (
          <div
            className="mt-5 flex items-center gap-3 text-white/40 text-sm font-mono animate-fade-in"
            style={{ animationDelay: '0.8s' }}
            aria-label={`Your best score: ${highScore}`}
          >
            <span>🏆 Best:</span>
            <span className="text-game-gold">{highScore}</span>
          </div>
        )}

        {/* Score auto-saved confirmation */}
        {score > 0 && (
          <div
            className="mt-5 flex items-center gap-2 text-white/30 text-xs font-mono animate-fade-in"
            style={{ animationDelay: '1s' }}
            aria-label="Score saved to leaderboard"
          >
            <span aria-hidden="true" className="text-game-green">✓</span>
            <span>Score saved to leaderboard</span>
          </div>
        )}

        <NameCard sessionId={location.state?.sessionId} />

        {/* Action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={() => { soundManager.swipe(); navigate('/game') }}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-body font-bold text-black text-base sm:text-lg tracking-wide animate-fade-in-up transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={{
              animationDelay: '0.2s',
              background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
              boxShadow: '0 0 40px rgba(0,255,135,0.4)',
            }}
          >
            <span aria-hidden="true" className="text-xl">↺</span> Play Again
          </button>

          <button
            onClick={() => { soundManager.swipe(); navigate('/') }}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-body font-bold text-white text-base sm:text-lg tracking-wide animate-fade-in-up transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-red focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={{
              animationDelay: '0.28s',
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,60,60,0.6)',
              boxShadow: '0 0 20px rgba(255,60,60,0.2)',
            }}
          >
            <span aria-hidden="true" className="text-xl">⌂</span> Home
          </button>
        </div>

        {/* Share / Leaderboard row */}
        <div className="mt-8 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '1.1s' }}>
          <button
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-body text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            style={{
              background: 'rgba(29,161,242,0.12)',
              border: '1px solid rgba(29,161,242,0.3)',
            }}
            onClick={() => {
              soundManager.click()
              if (navigator.share) {
                navigator.share({ title: 'SearchWars', text: `I scored ${score} on SearchWars!` })
              }
            }}
          >
            𝕏 Share Score
          </button>

          <button
            onClick={() => { soundManager.swipe(); navigate('/leaderboard') }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-body text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-game-gold"
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
          >
            🏆 Leaderboard
          </button>
        </div>

      </div>
    </div>
  )
}


