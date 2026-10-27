/**
 * Logo wordmark — plain markup (no Framer Motion on glyphs).
 * Motion + text-shadow + body overflow-x clipping caused a green smear above SEARCH.
 */
const SIZES = {
  sm: { higher: 'text-4xl', lower: 'text-4xl' },
  md: { higher: 'text-6xl', lower: 'text-6xl' },
  lg: { higher: 'text-8xl md:text-9xl', lower: 'text-8xl md:text-9xl' },
}

export default function Logo({ size = 'lg' }) {
  const s = SIZES[size] ?? SIZES.lg

  return (
    <div
      className="logo-wordmark flex flex-col items-center select-none"
      aria-label="Search Wars"
    >
      <span className={`logo-line logo-line-higher font-display block ${s.higher}`}>
        SEARCH
      </span>
      <span className={`logo-line logo-line-lower font-display block ${s.lower}`}>
        WARS
      </span>
    </div>
  )
}
