import { motion } from 'framer-motion'

export default function VSCircle({ score, phase }) {
  const isCorrect = phase === 'correct'
  const isWrong   = phase === 'wrong'

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
      {/* VS Ring */}
      <div className="relative flex items-center justify-center">
        {/* Spinning conic gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute w-14 h-14 sm:w-24 sm:h-24 rounded-full"
          style={{
            background: isCorrect
              ? 'conic-gradient(from 0deg, #00FF87, #00C2FF, #00FF87)'
              : isWrong
              ? 'conic-gradient(from 0deg, #FF3C3C, #FF8C00, #FF3C3C)'
              : 'conic-gradient(from 0deg, #00FF87, #00C2FF, #FF3C3C, #FFD700, #00FF87)',
            padding: '2px',
          }}
        />
        {/* Inner circle */}
        <div
          className="relative z-10 w-12 h-12 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(5,10,15,0.95)',
          }}
        >
          <motion.span
            key={phase}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-lg sm:text-2xl tracking-wider"
            style={{
              color: isCorrect ? '#00FF87' : isWrong ? '#FF3C3C' : 'white',
              textShadow: isCorrect
                ? '0 0 20px rgba(0,255,135,0.8)'
                : isWrong
                ? '0 0 20px rgba(255,60,60,0.8)'
                : 'none',
            }}
          >
            {isCorrect ? '✓' : isWrong ? '✗' : 'VS'}
          </motion.span>
        </div>
      </div>

      {/* Score box — hidden on phones: it covers the bottom card, and the top bar already shows the score */}
      <motion.div
        key={score}
        animate={phase === 'correct' ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="hidden sm:flex flex-col items-center px-6 py-3 rounded-2xl"
        style={{
          background: 'rgba(5,10,15,0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <span className="text-white/50 text-xs font-mono tracking-[0.2em] uppercase">Score</span>
        <span
          className="font-display text-5xl text-white leading-none"
          style={{ textShadow: phase === 'correct' ? '0 0 20px rgba(0,255,135,0.8)' : 'none' }}
        >
          {score}
        </span>
      </motion.div>
    </div>
  )
}
