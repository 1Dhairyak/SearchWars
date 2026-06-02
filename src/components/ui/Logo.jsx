import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/variants'

const SIZES = {
  sm: { higher: 'text-4xl', lower: 'text-4xl' },
  md: { higher: 'text-6xl', lower: 'text-6xl' },
  lg: { higher: 'text-8xl md:text-9xl', lower: 'text-8xl md:text-9xl' },
  xl: { higher: 'text-9xl', lower: 'text-9xl' },
}

export default function Logo({ size = 'lg', animate = true }) {
  const s = SIZES[size] ?? SIZES.lg

  return (
    <motion.div
      className="flex flex-col items-center leading-none select-none"
      variants={animate ? staggerContainer : undefined}
      initial={animate ? 'initial' : undefined}
      animate={animate ? 'animate' : undefined}
    >
      <motion.span
        variants={animate ? staggerItem : undefined}
        className={`font-display ${s.higher}`}
        style={{
          color: '#00FF87',
          textShadow: '0 0 25px rgba(0,255,135,0.35)',
        }}
      >
        SEARCH
      </motion.span>

      <motion.span
        variants={animate ? staggerItem : undefined}
        className={`font-display ${s.lower}`}
        style={{
          color: '#FF3C3C',
          textShadow: '0 0 25px rgba(255,60,60,0.35)',
        }}
      >
        WARS
      </motion.span>
    </motion.div>
  )
}
