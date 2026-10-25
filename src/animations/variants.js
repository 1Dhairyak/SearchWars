import { useReducedMotion } from 'framer-motion'

// ─── Page Transitions ─────────────────────────────────────────────────────────
// Opacity + y only — filter: blur on large text causes a green smear/ghost above the logo.
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
  },
}

// Minimal variant for prefers-reduced-motion users
export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// ─── Stagger Container ────────────────────────────────────────────────────────
// `initial` key — children need a baseline to animate FROM
export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Shake (wrong answer) ─────────────────────────────────────────────────────
export const shakeVariant = {
  shake: {
    x: [-8, 8, -8, 8, -4, 4, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

// ─── Score Reveal (Game Over) ─────────────────────────────────────────────────
export const scoreReveal = {
  initial: { scale: 0, rotate: -10 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.4 },
  },
}

// ─── usePageVariants — auto-picks reduced motion variant ─────────────────────
// Usage:  const variants = usePageVariants()
//         <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
export function usePageVariants() {
  const shouldReduce = useReducedMotion()
  return shouldReduce ? pageVariantsReduced : pageVariants
}
