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

// FIX FM-05: Minimal variant for prefers-reduced-motion users
export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// ─── Stagger Container ────────────────────────────────────────────────────────
// FIX FM-01: Added `initial` key — children need a baseline to animate FROM
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

/** Fade-only stagger for large display type (avoids motion smear on hero logo). */
export const logoStaggerItem = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Card Animations ──────────────────────────────────────────────────────────
export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: [0.55, 0, 1, 0.45] },
  },
}

// ─── Shake (wrong answer) ─────────────────────────────────────────────────────
export const shakeVariant = {
  shake: {
    x: [-8, 8, -8, 8, -4, 4, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

// ─── Fade + Scale ─────────────────────────────────────────────────────────────
export const fadeScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
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

// ─── Reveal Up ────────────────────────────────────────────────────────────────
export const revealUp = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Float variant (used in LandingPage) ─────────────────────────────────────
export const floatVariant = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

// ─── Score pop (FIX FM-04: single source of truth) ───────────────────────────
export const scorePop = {
  initial: { opacity: 1, y: 0, scale: 0.5 },
  animate: { opacity: [1, 1, 0], y: -120, scale: [0.5, 1.5, 1.2] },
  transition: { duration: 1.1, ease: 'easeOut' },
}

// ─── usePageVariants — auto-picks reduced motion variant ─────────────────────
// FIX FM-05: All pages call this instead of importing pageVariants directly.
// Usage:  const variants = usePageVariants()
//         <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
export function usePageVariants() {
  const shouldReduce = useReducedMotion()
  return shouldReduce ? pageVariantsReduced : pageVariants
}
