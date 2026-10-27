import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useGameContext } from '../context/GameContext'
import { leaderboardService } from '../services/api'
import { getRankColor, getRankRGB } from '../services/formatters'
import StarfieldBg from '../components/ui/StarfieldBg'
import Navbar from '../components/ui/Navbar'

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }
const STAGGERED_ROWS = 10 // rows beyond this appear without delay

function RankBadge({ rank }) {
  const color = getRankColor(rank)
  const medal = RANK_MEDALS[rank]
  const rgb   = getRankRGB(rank)

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg shrink-0"
      aria-label={medal ? `Rank ${rank} — ${medal}` : `Rank ${rank}`}
      style={{
        background: rank <= 3
          ? `radial-gradient(circle, rgba(${rgb},0.2), transparent)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid rgba(${rgb},0.3)`,
        color,
        textShadow: rank <= 3 ? `0 0 10px ${color}` : 'none',
      }}
    >
      {medal || rank}
    </div>
  )
}

function SkeletonRow({ index }) {
  return (
    <div
      className="flex items-center gap-4 px-6 py-4 rounded-2xl mb-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="w-10 h-10 rounded-full shrink-0 animate-pulse"
        style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 rounded animate-pulse"
          style={{ background: 'rgba(255,255,255,0.08)', width: `${55 + (index % 3) * 15}%` }} />
        <div className="h-2 rounded animate-pulse"
          style={{ background: 'rgba(255,255,255,0.05)', width: '30%' }} />
      </div>
      <div className="w-10 h-6 rounded animate-pulse"
        style={{ background: 'rgba(255,255,255,0.08)' }} />
    </div>
  )
}

const formatDate = (iso) => iso
  ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  : '—'

export default function LeaderboardPage() {
  const [entries,   setEntries]   = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState(null)
  const { highScore, player } = useGameContext()

  const load = useCallback((isCancelled = () => false) => {
    setIsLoading(true)
    setError(null)
    leaderboardService.getTop(50)
      .then((payload) => {
        if (isCancelled()) return
        setEntries((payload?.entries ?? []).map((e) => ({ ...e, date: formatDate(e.achievedAt) })))
      })
      .catch((err) => { if (!isCancelled()) setError(err.message || 'Failed to load leaderboard') })
      .finally(() => { if (!isCancelled()) setIsLoading(false) })
  }, [])

  useEffect(() => {
    let cancelled = false
    load(() => cancelled)
    return () => { cancelled = true }
  }, [load])

  return (
    <div className="relative min-h-screen bg-game-darker overflow-hidden animate-page">
      <StarfieldBg variant="green" />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-28 pb-20">

        {/* Header */}
        <div className="text-center mb-10">
          <div aria-hidden="true" className="text-5xl mb-4">🏆</div>
          <h1
            className="font-display text-5xl sm:text-6xl md:text-8xl text-white tracking-wider"
            style={{ textShadow: '0 0 40px rgba(255,215,0,0.4)' }}
          >
            LEADERBOARD
          </h1>
          <p className="mt-3 text-white/40 font-mono text-sm tracking-widest uppercase">
            Top scores from around the world
          </p>
        </div>

        {/* Your best score */}
        {highScore > 0 && (
          <div
            className="mb-8 flex items-center justify-between px-6 py-4 rounded-2xl animate-pop"
            role="status"
            aria-label={`Your best score: ${highScore}`}
            style={{
              animationDelay: '0.2s',
              background: 'rgba(0,255,135,0.06)',
              border: '1px solid rgba(0,255,135,0.2)',
              boxShadow: '0 0 20px rgba(0,255,135,0.05)',
            }}
          >
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="text-2xl">⚡</span>
              <div>
                <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Your Best</p>
                <p className="text-white font-body font-semibold">{player.name || 'You'}</p>
              </div>
            </div>
            <span
              className="font-display text-3xl sm:text-4xl text-game-green"
              style={{ textShadow: '0 0 20px rgba(0,255,135,0.6)' }}
            >
              {highScore}
            </span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div
            className="mb-6 flex flex-col items-center gap-4 px-6 py-8 rounded-2xl text-center animate-fade-in-up"
            role="alert"
            style={{
              background: 'rgba(255,60,60,0.06)',
              border: '1px solid rgba(255,60,60,0.2)',
            }}
          >
            <span aria-hidden="true" className="text-3xl">📡</span>
            <p className="text-white/70 font-body text-sm">{error}</p>
            <button
              onClick={() => load()}
              className="px-6 py-2 rounded-full font-body font-bold text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green"
              style={{ background: 'linear-gradient(135deg, #00FF87, #00C2FF)' }}
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading && Array.from({ length: 10 }, (_, i) => <SkeletonRow key={i} index={i} />)}

        {!isLoading && !error && entries.length === 0 && (
          <div className="text-center py-16 text-white/30 font-mono text-sm animate-fade-in">
            No scores yet. Be the first!
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          // Rows are flex, so the table is laid out as blocks; header row
          // mirrors the body row's padding/gap/column widths to line up.
          <table className="block w-full" aria-label="Leaderboard rankings">
            <thead className="block">
              <tr style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem 0.75rem' }}>
                <th scope="col" className="text-left" style={{ width: '3rem', flexShrink: 0, paddingLeft: '0.5rem' }}>
                  <span className="text-white/25 text-xs font-mono tracking-widest uppercase">#</span>
                </th>
                <th scope="col" className="text-left" style={{ flex: 1 }}>
                  <span className="text-white/25 text-xs font-mono tracking-widest uppercase">Player</span>
                </th>
                <th scope="col" className="text-right" style={{ width: '4rem', flexShrink: 0 }}>
                  <span className="text-white/25 text-xs font-mono tracking-widest uppercase">Score</span>
                </th>
              </tr>
            </thead>
            <tbody className="block">
              {entries.map((entry, i) => {
                const rankColor = getRankColor(entry.rank)
                const rankRGB   = getRankRGB(entry.rank)
                const isTop3    = entry.rank <= 3

                return (
                  <tr
                    key={entry.rank}
                    className="relative overflow-hidden animate-fade-in-up transition-transform duration-200 sm:hover:translate-x-1 sm:hover:scale-[1.01]"
                    style={{
                      animationDelay: `${Math.min(i, STAGGERED_ROWS) * 0.05}s`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderRadius: '1rem',
                      marginBottom: '0.5rem',
                      background: isTop3 ? `rgba(${rankRGB},0.06)` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isTop3 ? `rgba(${rankRGB},0.15)` : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: isTop3 ? `0 0 20px rgba(${rankRGB},0.06)` : 'none',
                    }}
                  >
                    {isTop3 && (
                      <td aria-hidden="true" style={{
                        position: 'absolute', inset: '0 auto 0 0',
                        width: '3px', borderRadius: '0 2px 2px 0',
                        background: rankColor, boxShadow: `0 0 10px ${rankColor}`,
                      }} />
                    )}
                    <td style={{ flexShrink: 0, paddingLeft: '0.5rem' }}>
                      <RankBadge rank={entry.rank} />
                    </td>
                    <td style={{ flex: 1, minWidth: 0 }}>
                      <span
                        className="font-body font-semibold text-sm sm:text-base block truncate"
                        style={{ color: isTop3 ? rankColor : 'white' }}
                      >
                        {entry.playerName}
                      </span>
                      <span className="text-white/30 text-xs font-mono">{entry.date}</span>
                    </td>
                    <td style={{ width: '4rem', textAlign: 'right', flexShrink: 0 }}>
                      <span
                        className="font-display text-2xl sm:text-3xl"
                        style={{
                          color: isTop3 ? rankColor : 'white',
                          textShadow: isTop3 ? `0 0 15px rgba(${rankRGB},0.5)` : 'none',
                        }}
                      >
                        {entry.score}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* CTA */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-white/30 text-sm font-body mb-6">
            Think you can crack the top 10?
          </p>
          <Link
            to="/game"
            className="inline-block px-10 py-4 rounded-full font-body font-bold text-black text-lg tracking-wide transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-gold focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              boxShadow: '0 0 30px rgba(255,215,0,0.3)',
            }}
          >
            🎮 BEAT THE LEADERBOARD
          </Link>
        </div>
      </div>
    </div>
  )
}
