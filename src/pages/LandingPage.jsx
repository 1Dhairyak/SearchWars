import { soundManager } from '../services/sounds'
import { Link, useNavigate } from 'react-router-dom'
import { useGameContext } from '../context/GameContext'
import Logo from '../components/ui/Logo'
import Navbar from '../components/ui/Navbar'

const features = [
  {
    color: '#00FF87',
    title: 'Global Search Data',
    desc: 'Compare real search volumes from across the internet. No guessing - pure data.',
  },
  {
    color: '#FFD700',
    title: 'Speed Duel',
    desc: 'Lightning-fast rounds keep you sharp. How long can your streak last?',
  },
  {
    color: '#00C2FF',
    title: 'Elimination Mode',
    desc: "One wrong guess and it's over. Think carefully before you click.",
  },
]

const pressable = 'inline-block transition-transform duration-200 hover:scale-105 active:scale-95'

export default function LandingPage() {
  const navigate = useNavigate()
  const { highScore } = useGameContext()

  const goPlay = () => { soundManager.init(); soundManager.swipe(); navigate('/game') }

  return (
    <div className="relative min-h-screen bg-game-darker flex flex-col">
      <Navbar />

      {/* Hero — logo stays static; only copy/buttons animate (avoids compositor smear on Bebas) */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 text-center">
        <Logo size="lg" />

        <div className="w-full flex flex-col items-center animate-fade-in-up">
          <div className="mt-6">
            <p className="text-xl md:text-2xl font-body font-semibold text-white">
              What gets Googled more?{' '}
              <span style={{ color: '#00FF87' }}>Fresh Global Data.</span>
            </p>
            <p className="mt-3 text-white/50 text-base font-body max-w-md mx-auto leading-relaxed">
              Duel with up-to-the-minute global search trends across 9 categories.
            </p>
          </div>

          {highScore > 0 && (
            <div
              className="mt-6 flex items-center gap-3 px-6 py-3 rounded-2xl"
              style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}
            >
              <div>
                <p className="text-white/50 text-xs font-mono tracking-widest uppercase">Your Best</p>
                <p className="font-display text-2xl text-game-gold">{highScore}</p>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={goPlay}
              className={`px-10 py-4 rounded-full font-body font-bold text-lg text-black tracking-wide ${pressable}`}
              style={{ background: 'linear-gradient(135deg, #00FF87 0%, #00C2FF 100%)' }}
            >
              START EXPLORING
            </button>

            <Link
              to="/leaderboard"
              className={`px-8 py-4 rounded-full font-body font-semibold text-base text-white/70 hover:text-white tracking-wide transition-colors ${pressable}`}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </section>

      <div className="flex flex-col">
        <section className="px-4 pb-20 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="relative p-8 rounded-3xl cursor-default animate-fade-in-up transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  animationDelay: `${0.2 + i * 0.08}s`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <h3 className="font-display text-2xl mb-3 tracking-wide" style={{ color: f.color }}>{f.title}</h3>
                <p className="text-white/55 font-body text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-24 text-center">
          <p className="font-display text-5xl md:text-7xl text-white mb-8 leading-none">
            READY TO <span style={{ color: '#00FF87' }}>TEST</span><br />YOUR KNOWLEDGE?
          </p>
          <button
            onClick={goPlay}
            className={`px-14 py-5 rounded-full font-body font-bold text-xl text-black tracking-wide ${pressable}`}
            style={{ background: 'linear-gradient(135deg, #00FF87 0%, #00C2FF 100%)' }}
          >
            PLAY FOR FREE
          </button>
        </section>

        <footer className="border-t border-white/5 py-8 px-4 text-center">
          <p className="text-white/25 text-xs font-mono tracking-widest">
            SEARCHWARS · GLOBAL SEARCH TRENDS · BUILT WITH REACT + SPRING BOOT
          </p>
        </footer>
      </div>
    </div>
  )
}
