import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageVariants } from '../animations/variants'
import StarfieldBg from '../components/ui/StarfieldBg'

export default function NotFoundPage() {
  const pageVariants = usePageVariants()

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen bg-game-darker flex items-center justify-center overflow-hidden"
      role="main"
      aria-label="404 — Page not found"
    >
      <StarfieldBg variant="red" />

      <div className="relative z-10 text-center px-4 max-w-xl">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          {/* FIX MOBILE-02: clamp prevents overflow on mobile */}
          <span
            className="font-display leading-none block"
            style={{
              fontSize: 'clamp(6rem, 20vw, 12rem)',
              background: 'linear-gradient(135deg, #FF3C3C, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(255,60,60,0.6))',
            }}
          >
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="font-display text-4xl text-white mt-2 mb-4 tracking-wide">
            PAGE NOT FOUND
          </h2>
          <p className="text-white/50 font-body text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Looks like this page got a lower search volume than expected.
            It doesn't exist — or maybe it never did.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-body font-bold text-black text-base tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
                style={{
                  background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
                  boxShadow: '0 0 30px rgba(0,255,135,0.3)',
                }}
              >
                ← Go Home
              </motion.button>
            </Link>
            <Link to="/game">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-body font-bold text-white text-base tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                🎮 Play Game
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-16 text-8xl"
          aria-hidden="true"
        >
          🤷
        </motion.div>
      </div>
    </motion.div>
  )
}
