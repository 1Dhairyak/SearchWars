import { formatViews } from '../../services/formatters'
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
      {/* Background image — eager loading for no blank flash.
          Darkened with an overlay, not a CSS filter: filters on full-screen images are slow on phones. */}
      <img
        src={item.imageUrl}
        alt={`${item.name} — ${item.category}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/65" />

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
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: borderGlow }}
      />

      {/* Content */}
      {/* Phones stack the cards: leave room for the VS badge on the shared edge */}
      <div className={`relative z-10 flex flex-col items-center justify-center gap-2 sm:gap-4 px-6 sm:px-10 sm:py-0 text-center max-w-lg w-full ${isRight ? 'pt-8' : 'pb-8'}`}>
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

        {/* Revealed monthly views */}
        {showVolume ? (
          <div
            className="flex flex-col items-center gap-2 animate-pop"
            aria-live="polite"
            aria-label={`${formatViews(item.monthlyViews)} Wikipedia views last month`}
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
              {formatViews(item.monthlyViews)}
            </span>
            <span className="text-white/50 text-xs sm:text-sm font-mono tracking-wider uppercase">
              Wikipedia views last month
            </span>
          </div>
        ) : (
          /* Interactive state — guess buttons */
          <div className="flex flex-col items-center gap-3 sm:gap-5 w-full">
            <div
              className="hidden sm:block h-px w-24 rounded-full"
              style={{ background: 'rgba(0,255,135,0.25)' }}
            />
            {compareItemName && (
              <p className="text-white/40 text-sm font-body tracking-wide">
                views than{' '}
                <span className="text-white/70 font-semibold">{compareItemName}</span>
              </p>
            )}

            <div
              className="flex flex-row sm:flex-col gap-3 w-full max-w-[320px] sm:max-w-[240px]"
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
