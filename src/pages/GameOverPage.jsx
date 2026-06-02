/**
 * GameOverPage — Phase 5
 *
 * Phase 5 additions over Phase 4:
 *  - soundManager.highScore() fires when isNewHigh (celebratory fanfare)
 *  - soundManager.swipe() on Play Again / Home navigation
 *  - SoundToggle accessible from this screen
 *
 * Score recording is fully automatic (backend records on wrong guess).
 * The frontend does NOT POST to /api/leaderboard.
 */
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  usePageVariants,
  scoreReveal,
  staggerContainer,
  staggerItem,
} from '../animations/variants'
import { useGameContext } from '../context/GameContext'
import { soundManager } from '../services/sounds'
import Logo from '../components/ui/Logo'
import SoundToggle from '../components/ui/SoundToggle'

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
  const navigate     = useNavigate()
  const location     = useLocation()
  const pageVariants = usePageVariants()

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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen bg-game-darker overflow-hidden flex flex-col items-center justify-center px-4"
      role="main"
      aria-label="Game over screen"
    >

      {/* Sound toggle — top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <SoundToggle />
      </div>

      {/* Decorative rings */}
      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full pointer-events-none"
        style={{ width: 'min(700px, 90vw)', height: 'min(700px, 90vw)', border: '1px solid rgba(255,60,60,0.08)' }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full pointer-events-none"
        style={{ width: 'min(500px, 70vw)', height: 'min(500px, 70vw)', border: '1px solid rgba(0,255,135,0.08)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Logo size="md" animate={false} />
        </motion.div>

        {/* Score */}
        <motion.div
          variants={scoreReveal}
          initial="initial"
          animate="animate"
          className="mt-8 flex flex-col items-center"
        >
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
              filter: `drop-shadow(0 0 30px ${isGoodScore ? 'rgba(0,255,135,0.5)' : 'rgba(255,60,60,0.5)'})`,
            }}
          >
            {score}
          </div>
        </motion.div>

        {/* Meme message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-2 flex flex-col items-center gap-2"
        >
          <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
            {meme.msg}
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-body max-w-sm leading-relaxed px-4">
            {meme.sub}
          </p>
        </motion.div>

        {/* New high score badge */}
        {isNewHigh && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 12 }}
            role="status"
            aria-label="New high score!"
            className="mt-6 px-6 py-3 rounded-full flex items-center gap-3"
            style={{
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
          </motion.div>
        )}

        {highScore > 0 && !isNewHigh && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-5 flex items-center gap-3 text-white/40 text-sm font-mono"
            aria-label={`Your best score: ${highScore}`}
          >
            <span>🏆 Best:</span>
            <span className="text-game-gold">{highScore}</span>
          </motion.div>
        )}

        {/* Score auto-saved confirmation */}
        {score > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-5 flex items-center gap-2 text-white/30 text-xs font-mono"
            aria-label="Score saved to leaderboard"
          >
            <span aria-hidden="true" className="text-game-green">✓</span>
            <span>Score saved to leaderboard</span>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        >
          <motion.button
            variants={staggerItem}
            onClick={() => { soundManager.swipe(); navigate('/game') }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-body font-bold text-black text-base sm:text-lg tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={{
              background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
              boxShadow: '0 0 40px rgba(0,255,135,0.4)',
            }}
          >
            <span aria-hidden="true" className="text-xl">↺</span> Play Again
          </motion.button>

          <motion.button
            variants={staggerItem}
            onClick={() => { soundManager.swipe(); navigate('/') }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-body font-bold text-white text-base sm:text-lg tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-red focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,60,60,0.6)',
              boxShadow: '0 0 20px rgba(255,60,60,0.2)',
            }}
          >
            <span aria-hidden="true" className="text-xl">⌂</span> Home
          </motion.button>
        </motion.div>

        {/* Share / Leaderboard row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 flex items-center gap-3"
        >
          <button
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-body text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            style={{
              background: 'rgba(29,161,242,0.12)',
              border: '1px solid rgba(29,161,242,0.3)',
            }}
            onClick={() => {
              soundManager.click()
              if (navigator.share) {
                navigator.share({ title: 'Higher or Lower', text: `I scored ${score} on Higher or Lower!` })
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
        </motion.div>

      </div>
    </motion.div>
  )
}
