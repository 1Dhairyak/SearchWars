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
        className={`font-display ${s.higher} tracking-wider`}
        style={{ color: '#00FF87' }}
      >
        ↑HIGHER
      </motion.span>
      <motion.span
        variants={animate ? staggerItem : undefined}
        className={`font-display ${s.lower} tracking-wider`}
        style={{ color: '#FF3C3C' }}
      >
        LOWER↓
      </motion.span>
    </motion.div>
  )
}