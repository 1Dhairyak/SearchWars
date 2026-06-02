import { motion } from 'framer-motion'
import { formatSearchVolume } from '../../services/formatters'
import GuessButton from './GuessButton'

// FIX BUG-02 + COMP-01: This is the canonical SideCard implementation.
// The original dead ItemCard.jsx and the inline SideCard in GamePage are merged here.
// FIX A11Y-05: alt text includes category for screen reader context.
// FIX MOBILE-01: Responsive font sizes with clamp — no overflow on small screens.
export default function SideCard({
  item,
  side = 'left',
  showVolume = true,
  phase = 'playing',
  onGuess,
  compareItemName = '',
}) {
  if (!item) return null

  const isRight = side === 'right'
  const isCorrect = phase === 'correct'
  const isWrong = phase === 'wrong'
  const isPlaying = phase === 'playing'

  const accentColor = isRight ? '#00FF87' : '#FF8080'

  // FIX A11Y-04: Color flash has text equivalent (✓/✗) in VSCircle;
  // state is also communicated via borderGlow change here.
  const borderGlow = isCorrect
    ? 'inset 0 0 80px rgba(0,255,135,0.2)'
    : isWrong
    ? 'inset 0 0 80px rgba(255,60,60,0.2)'
    : isRight
    ? 'inset 0 0 40px rgba(0,255,135,0.06)'
    : 'inset 0 0 40px rgba(255,60,60,0.06)'

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      aria-label={`${item.name} — ${item.category}`}
    >
      {/* Background image — eager loading for no blank flash */}
      <img
        src={item.imageUrl}
        alt={`${item.name} — ${item.category}`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.35) saturate(1.3) contrast(1.1)' }}
        loading="eager"
      />

      {/* Color tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: isRight
            ? 'linear-gradient(145deg, rgba(0,40,20,0.7) 0%, transparent 60%)'
            : 'linear-gradient(225deg, rgba(40,0,15,0.7) 0%, transparent 60%)',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(5,10,15,0.75) 100%)',
        }}
      />

      {/* Phase feedback border */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{ boxShadow: borderGlow }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 sm:px-10 text-center max-w-lg w-full">
        {/* Category badge */}
        <span
          className="text-xs font-mono font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: `1px solid ${accentColor}40`,
            color: accentColor,
          }}
        >
          {item.category}
        </span>

        {/* FIX MOBILE-01: clamp prevents overflow on small screens */}
        <h2
          className="font-display text-white leading-none tracking-wide"
          style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            textShadow: '0 4px 30px rgba(0,0,0,0.9)',
          }}
        >
          &ldquo;{item.name}&rdquo;
        </h2>

        <p className="text-white/60 text-base sm:text-lg font-body">has</p>

        {/* Revealed search volume */}
        {showVolume ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            className="flex flex-col items-center gap-2"
            aria-live="polite"
            aria-label={`${formatSearchVolume(item.searchVolume)} average monthly searches`}
          >
            <span
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                color: isRight ? '#00FF87' : '#FF3C3C',
                textShadow: isRight
                  ? '0 0 40px rgba(0,255,135,0.9), 0 0 80px rgba(0,255,135,0.4)'
                  : '0 0 40px rgba(255,60,60,0.9), 0 0 80px rgba(255,60,60,0.4)',
              }}
            >
              {formatSearchVolume(item.searchVolume)}
            </span>
            <span className="text-white/50 text-xs sm:text-sm font-mono tracking-wider uppercase">
              avg. monthly searches
            </span>
          </motion.div>
        ) : (
          /* Interactive state — guess buttons */
          <div className="flex flex-col items-center gap-4 sm:gap-5 w-full">
            <div
              className="h-px w-24 rounded-full"
              style={{ background: 'rgba(0,255,135,0.25)' }}
            />
            {compareItemName && (
              <p className="text-white/40 text-sm font-body tracking-wide">
                searches than{' '}
                <span className="text-white/70 font-semibold">{compareItemName}</span>
              </p>
            )}

            <div
              className="flex flex-col gap-3 w-full max-w-[240px]"
              role="group"
              aria-label="Make your guess"
            >
              <GuessButton
                label="Higher"
                icon="▲"
                color="#00FF87"
                glowColor="rgba(0,255,135,0.35)"
                onClick={() => onGuess?.('higher')}
                disabled={!isPlaying}
              />
              <GuessButton
                label="Lower"
                icon="▼"
                color="#FF3C3C"
                glowColor="rgba(255,60,60,0.35)"
                onClick={() => onGuess?.('lower')}
                disabled={!isPlaying}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
