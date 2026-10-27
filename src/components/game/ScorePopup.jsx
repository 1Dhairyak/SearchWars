// "+1" that floats up after a correct guess. Re-keyed per score so the CSS animation replays;
// `forwards` leaves it invisible at the end, so it can stay mounted.
export default function ScorePopup({ phase, score }) {
  if (phase !== 'correct') return null

  return (
    <div
      key={score}
      className="pointer-events-none absolute top-1/2 left-1/2 z-50 animate-score-float"
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
    </div>
  )
}
