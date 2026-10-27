import { Link } from 'react-router-dom'
import StarfieldBg from '../components/ui/StarfieldBg'

const pressable = 'inline-block transition-transform duration-200 hover:scale-105 active:scale-95'

export default function NotFoundPage() {
  return (
    <div
      className="relative min-h-screen bg-game-darker flex items-center justify-center overflow-hidden animate-page"
      role="main"
      aria-label="404 — Page not found"
    >
      <StarfieldBg variant="red" />

      <div className="relative z-10 text-center px-4 max-w-xl">
        <div className="animate-pop">
          {/* clamp prevents overflow on mobile */}
          <span
            className="font-display leading-none block"
            style={{
              fontSize: 'clamp(6rem, 20vw, 12rem)',
              background: 'linear-gradient(135deg, #FF3C3C, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="font-display text-4xl text-white mt-2 mb-4 tracking-wide">
            PAGE NOT FOUND
          </h2>
          <p className="text-white/50 font-body text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Looks like this page got fewer views than expected.
            It doesn't exist — or maybe it never did.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className={`px-8 py-4 rounded-full font-body font-bold text-black text-base tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker ${pressable}`}
              style={{
                background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
                boxShadow: '0 0 30px rgba(0,255,135,0.3)',
              }}
            >
              ← Go Home
            </Link>
            <Link
              to="/game"
              className={`px-8 py-4 rounded-full font-body font-bold text-white text-base tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker ${pressable}`}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              🎮 Play Game
            </Link>
          </div>
        </div>

        <div className="mt-16 text-8xl animate-wiggle" aria-hidden="true">
          🤷
        </div>
      </div>
    </div>
  )
}
