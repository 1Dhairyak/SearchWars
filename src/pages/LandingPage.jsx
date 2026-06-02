import { motion } from 'framer-motion'
import { soundManager } from '../services/sounds'
import { Link, useNavigate } from 'react-router-dom'
import { usePageVariants, staggerContainer, staggerItem } from '../animations/variants'
import { useGameContext } from '../context/GameContext'
import Logo from '../components/ui/Logo'
import Navbar from '../components/ui/Navbar'

const features = [
  {
    icon: 'Global Search Data',
    iconColor: '#00FF87',
    iconRGB: '0,255,135',
    title: 'Global Search Data',
    desc: 'Compare real search volumes from across the internet. No guessing - pure data.',
  },
  {
    icon: 'Speed Duel',
    iconColor: '#FFD700',
    iconRGB: '255,215,0',
    title: 'Speed Duel',
    desc: 'Lightning-fast rounds keep you sharp. How long can your streak last?',
  },
  {
    icon: 'Elimination Mode',
    iconColor: '#00C2FF',
    iconRGB: '0,194,255',
    title: 'Elimination Mode',
    desc: "One wrong guess and it's over. Think carefully before you click.",
  },
]

const heroContentVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 },
  },
}

export default function LandingPage() {
  const navigate     = useNavigate()
  const pageVariants = usePageVariants()
  const { highScore } = useGameContext()

  const goPlay = () => { soundManager.init(); soundManager.swipe(); navigate('/game') }

  return (
    <div className="relative min-h-screen bg-game-darker flex flex-col">
      <Navbar />

      {/* Hero — logo stays static; only copy/buttons animate (avoids compositor smear on Bebas) */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 text-center">
        <Logo size="lg" />

        <motion.div
          variants={heroContentVariants}
          initial="initial"
          animate="animate"
          className="w-full flex flex-col items-center"
        >
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
            <motion.button
              onClick={goPlay}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-full font-body font-bold text-lg text-black tracking-wide"
              style={{ background: 'linear-gradient(135deg, #00FF87 0%, #00C2FF 100%)' }}
            >
              START EXPLORING
            </motion.button>

            <Link to="/leaderboard">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-body font-semibold text-base text-white/70 hover:text-white tracking-wide transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Leaderboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features + footer — page transition only on lower sections */}
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col"
      >
        <section className="px-4 pb-20 max-w-6xl mx-auto w-full">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 rounded-3xl cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="font-display text-2xl mb-3 tracking-wide" style={{ color: f.iconColor }}>{f.title}</h3>
                <p className="text-white/55 font-body text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="px-4 py-24 text-center">
          <p className="font-display text-5xl md:text-7xl text-white mb-8 leading-none">
            READY TO <span style={{ color: '#00FF87' }}>TEST</span><br />YOUR KNOWLEDGE?
          </p>
          <motion.button
            onClick={goPlay}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="px-14 py-5 rounded-full font-body font-bold text-xl text-black tracking-wide"
            style={{ background: 'linear-gradient(135deg, #00FF87 0%, #00C2FF 100%)' }}
          >
            PLAY FOR FREE
          </motion.button>
        </section>

        <footer className="border-t border-white/5 py-8 px-4 text-center">
          <p className="text-white/25 text-xs font-mono tracking-widest">
            SEARCHWARS · GLOBAL SEARCH TRENDS · BUILT WITH REACT + SPRING BOOT
          </p>
        </footer>
      </motion.div>
    </div>
  )
}
