import { motion } from 'framer-motion'

// FIX COMP-01: Extracted from GamePage — now independently testable and reusable.
// FIX A11Y-02: aria-label reads "Guess higher/lower" not the triangle symbol.
export default function GuessButton({
  label,
  icon,
  color,
  glowColor,
  onClick,
  disabled = false,
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.04, boxShadow: `0 0 30px ${glowColor}` }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      aria-label={`Guess ${label.toLowerCase()}`}
      aria-disabled={disabled}
      className="w-full py-3.5 px-6 rounded-full font-body font-bold text-base tracking-widest uppercase flex items-center justify-center gap-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: `2px solid ${color}`,
        color: color,
        boxShadow: disabled ? 'none' : `0 0 20px ${glowColor}`,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        '--tw-ring-color': color,
      }}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </motion.button>
  )
}
