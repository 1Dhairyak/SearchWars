// aria-label reads "Guess higher/lower", not the triangle symbol.
// Hover/tap scale is a CSS transform; the glow is static (animating box-shadow repaints every frame).
export default function GuessButton({
  label,
  icon,
  color,
  glowColor,
  onClick,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Guess ${label.toLowerCase()}`}
      aria-disabled={disabled}
      className={`w-full py-3.5 px-4 sm:px-6 rounded-full font-body font-bold text-base tracking-widest uppercase flex items-center justify-center gap-3 transition-[transform,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker ${disabled ? '' : 'hover:scale-[1.04] active:scale-[0.96]'}`}
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
    </button>
  )
}
