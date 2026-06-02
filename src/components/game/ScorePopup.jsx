import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ScorePopup({ phase, score }) {
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (phase === 'correct') {
      setVisible(true)
      setKey(k => k + 1)
      const t = setTimeout(() => setVisible(false), 1100)
      return () => clearTimeout(t)
    }
  }, [phase, score])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={key}
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: [1, 1, 0], y: -120, scale: [0.5, 1.5, 1.2] }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 z-50"
          style={{ willChange: 'transform' }}
        >
          <span
            className="font-display text-6xl"
            style={{
              color: '#00FF87',
              textShadow: '0 0 30px rgba(0,255,135,1), 0 0 60px rgba(0,255,135,0.6)',
            }}
          >
            +1
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
