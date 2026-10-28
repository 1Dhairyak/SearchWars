/**
 * DuelPage — real-time 1v1. /duel creates a duel; /duel/:duelId plays it.
 * Both players get the same chain of items; scores update live over a WebSocket.
 */
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDuel } from '../hooks/useDuel'
import { duelService } from '../services/api'
import { soundManager } from '../services/sounds'
import SideCard from '../components/game/SideCard'
import VSCircle from '../components/game/VSCircle'
import SoundToggle from '../components/ui/SoundToggle'
import Navbar from '../components/ui/Navbar'

const OUT_REASON = {
  wrong: 'wrong guess',
  timeout: 'ran out of time',
  left: 'left the duel',
  finished: 'cleared every item!',
}

const primaryBtn = 'px-8 py-4 rounded-full font-body font-bold text-black transition-transform duration-200 hover:scale-105 active:scale-95'
const primaryStyle = { background: 'linear-gradient(135deg, #00FF87, #00C2FF)' }
const secondaryBtn = 'px-8 py-4 rounded-full font-body font-semibold text-white/80 hover:text-white transition-transform duration-200 hover:scale-105 active:scale-95'
const secondaryStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }

export default function DuelPage() {
  const { duelId } = useParams()
  return duelId ? <Duel duelId={duelId.toUpperCase()} /> : <CreateDuel />
}

// ── /duel ────────────────────────────────────────────────────────────────────

function CreateDuel() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const create = async () => {
    soundManager.init()
    setBusy(true)
    setError(null)
    try {
      const { duelId } = await duelService.create()
      navigate(`/duel/${duelId}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Screen withNav>
      <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide">1V1 DUEL</h1>
      <p className="text-white/60 font-body max-w-sm">
        Same items, same numbers, live scores. One wrong guess and you're out. Outlast your friend.
      </p>
      <button onClick={create} disabled={busy} className={primaryBtn} style={primaryStyle}>
        {busy ? 'Creating…' : '⚔️ Challenge a friend'}
      </button>
      {busy && <p className="text-white/30 text-xs font-body">If the server was asleep, waking it can take 2–3 minutes.</p>}
      {error && <p className="text-game-red font-body text-sm">{error}</p>}
    </Screen>
  )
}

// ── /duel/:duelId ────────────────────────────────────────────────────────────

function Duel({ duelId }) {
  const navigate = useNavigate()
  const { state, view, error, connected, clockOffset, guess, rematch } = useDuel(duelId)

  // Keyboard: ↑ higher, ↓ lower
  const onKey = useCallback((e) => {
    if (e.key === 'ArrowUp')   { e.preventDefault(); guess('higher') }
    if (e.key === 'ArrowDown') { e.preventDefault(); guess('lower') }
  }, [guess])
  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  // Rematch: the server seats both players in the new duel, so both follow it.
  useEffect(() => {
    if (state?.rematchId) navigate(`/duel/${state.rematchId}`, { replace: true })
  }, [state?.rematchId, navigate])

  // Re-render during the start countdown (nothing else changes then)
  const [, setTick] = useState(0)
  const counting = state?.status === 'PLAYING' && Date.parse(state.startsAt) > Date.now() + clockOffset
  useEffect(() => {
    if (!counting) return
    const t = setInterval(() => setTick((n) => n + 1), 200)
    return () => clearInterval(t)
  }, [counting])

  // Result sound once
  const status = state?.status
  useEffect(() => {
    if (status !== 'FINISHED') return
    try { state.winner === state.you ? soundManager.highScore() : soundManager.gameOver() } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  if (!state) {
    return (
      <Screen withNav>
        {error ? (
          <>
            <p className="text-game-red font-display text-3xl">{error}</p>
            <Link to="/duel" className={primaryBtn} style={primaryStyle}>Start a new duel</Link>
          </>
        ) : (
          <>
            <Spinner />
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
              {connected ? 'Joining duel…' : 'Connecting…'}
            </p>
          </>
        )}
      </Screen>
    )
  }

  const me = state.players[state.you]
  const them = state.players[1 - state.you]

  if (state.status === 'WAITING') return <Waiting duelId={duelId} />
  if (state.status === 'FINISHED') return <Result state={state} me={me} them={them} onRematch={rematch} />

  const now = Date.now() + clockOffset
  const startsIn = Date.parse(state.startsAt) - now
  if (startsIn > 0) return <Countdown ms={startsIn} me={me} them={them} />

  return (
    <div className="relative w-full h-screen overflow-hidden bg-game-darker flex flex-col animate-fade-in" role="main" aria-label="1v1 duel">
      <ScoreBar me={me} them={them} connected={connected} />
      {view && <RoundTimer deadline={state.deadline} clockOffset={clockOffset} phase={view.phase} />}

      {view ? (
        <div className={`relative flex flex-col sm:flex-row flex-1 overflow-hidden ${view.phase === 'wrong' ? 'animate-shake' : ''}`} aria-live="assertive">
          <div key={`l-${view.known.id}`} className="flex-1 relative sm:h-full overflow-hidden animate-fade-in">
            <SideCard item={view.known} side="left" showVolume phase={view.phase} />
          </div>
          <div key={`r-${view.challenge.id}`} className="flex-1 relative sm:h-full overflow-hidden animate-slide-in-right">
            <SideCard
              item={view.challenge}
              side="right"
              showVolume={view.phase === 'correct' || view.phase === 'wrong'}
              phase={view.phase}
              onGuess={guess}
              compareItemName={view.known.name}
            />
          </div>
          <VSCircle score={me.score} phase={view.phase} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 text-center">
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase">You're out — {OUT_REASON[me.outReason]}</p>
          <p className="font-display text-6xl text-white">{me.score}</p>
          <p className="text-white/70 font-body">
            {them.name} is still playing: <span className="font-display text-3xl text-game-gold align-middle">{them.score}</span>
          </p>
          <p className="text-white/40 font-body text-sm">
            {them.score >= me.score ? `${them.name} has caught you. ` : ''}If they miss before passing {me.score}, you win.
          </p>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/80 text-game-red text-sm font-body">
          {error}
        </div>
      )}
    </div>
  )
}

// ── Pieces ───────────────────────────────────────────────────────────────────

function Screen({ children, withNav = false }) {
  return (
    <div className="relative min-h-screen bg-game-darker flex flex-col animate-page">
      {withNav && <Navbar />}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">{children}</div>
    </div>
  )
}

function Spinner() {
  return <div className="w-14 h-14 rounded-full animate-spin" style={{ border: '3px solid rgba(0,255,135,0.15)', borderTopColor: '#00FF87' }} />
}

function Waiting({ duelId }) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/duel/${duelId}`

  const share = async () => {
    const text = "Bet you can't beat me at SearchWars ⚔️ Which got more Wikipedia views?"
    try {
      if (navigator.share) await navigator.share({ title: 'SearchWars 1v1', text, url })
      else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
      }
    } catch (_) { /* share sheet dismissed */ }
  }

  return (
    <Screen withNav>
      <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase">Duel code</p>
      <p className="font-display text-6xl sm:text-7xl text-white tracking-[0.2em]">{duelId}</p>
      <button onClick={share} className={primaryBtn} style={primaryStyle}>
        {copied ? '✓ Link copied' : '📤 Send invite link'}
      </button>
      <div className="flex items-center gap-3 text-white/50 font-body">
        <span className="w-2 h-2 rounded-full bg-game-green animate-pulse" aria-hidden="true" />
        Waiting for your opponent to open the link…
      </div>
    </Screen>
  )
}

function Countdown({ ms, me, them }) {
  return (
    <Screen>
      <p className="text-white/70 font-body text-lg">
        <span className="text-game-green font-semibold">{me.name}</span>
        <span className="text-white/30"> vs </span>
        <span className="text-game-red font-semibold">{them.name}</span>
      </p>
      <p key={Math.ceil(ms / 1000)} className="font-display text-[8rem] leading-none text-white animate-pop">
        {Math.max(1, Math.ceil(ms / 1000))}
      </p>
      <p className="text-white/40 font-body text-sm">Same items for both of you. 15 seconds per guess.</p>
    </Screen>
  )
}

function ScoreBar({ me, them, connected }) {
  const navigate = useNavigate()
  return (
    <div className="relative z-40 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 shrink-0" style={{ background: 'rgba(5,10,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => navigate('/')} className="text-white/50 hover:text-white text-xs sm:text-sm font-mono tracking-widest" aria-label="Leave duel">
        ← LEAVE
      </button>
      <div className="flex items-center gap-4 sm:gap-8" role="status" aria-label={`You ${me.score}, ${them.name} ${them.score}`}>
        <PlayerScore label="You" player={me} color="#00FF87" />
        <span className="font-display text-white/30 text-lg">VS</span>
        <PlayerScore label={them.name} player={them} color="#FF5C5C" />
      </div>
      <div className="flex items-center gap-2">
        {!connected && <span className="text-game-gold text-xs font-mono">reconnecting…</span>}
        <SoundToggle />
      </div>
    </div>
  )
}

function PlayerScore({ label, player, color }) {
  return (
    <div className="text-center min-w-[64px]">
      <div className="text-white/40 text-[10px] sm:text-xs font-mono tracking-widest uppercase truncate max-w-[110px]">
        {label}{!player.connected && !player.out ? ' · away' : ''}
      </div>
      <div key={player.score} className="font-display text-2xl sm:text-3xl animate-score-bump" style={{ color: player.out ? 'rgba(255,255,255,0.3)' : color }}>
        {player.score}{player.out ? ' ✗' : ''}
      </div>
    </div>
  )
}

// Shrinks over the time left for this guess. Pure CSS (transform), restarted per deadline.
function RoundTimer({ deadline, clockOffset, phase }) {
  // Fixed per deadline: recomputing on every render (opponent updates) would make the bar jump.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const left = useMemo(() => Math.max(0, Date.parse(deadline) - (Date.now() + clockOffset)), [deadline])
  if (!deadline) return null
  return (
    <div className="h-1 w-full bg-white/5 shrink-0" aria-hidden="true">
      <div
        key={deadline}
        className="h-full w-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #FF3C3C, #FFD700 40%, #00FF87)',
          animation: `shrinkX ${left}ms linear forwards`,
          animationPlayState: phase === 'playing' ? 'running' : 'paused',
        }}
      />
    </div>
  )
}

function Result({ state, me, them, onRematch }) {
  const [asked, setAsked] = useState(false)
  const won = state.winner === state.you
  const draw = state.winner === -1
  const title = draw ? "IT'S A DRAW" : won ? 'YOU WIN!' : `${them.name.toUpperCase()} WINS`
  const color = draw ? '#FFD700' : won ? '#00FF87' : '#FF3C3C'

  return (
    <Screen withNav>
      <p className="font-display text-5xl sm:text-7xl tracking-wide animate-pop" style={{ color, textShadow: `0 0 40px ${color}66` }}>
        {title}
      </p>
      <div className="flex items-center gap-8 sm:gap-12">
        <FinalScore name="You" player={me} highlight={won} />
        <span className="font-display text-3xl text-white/30">–</span>
        <FinalScore name={them.name} player={them} highlight={!won && !draw} />
      </div>
      {me.score === them.score && !draw && (
        <p className="text-white/40 font-body text-sm">Tied score — {won ? 'you' : them.name} got there first.</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => { setAsked(true); onRematch() }} disabled={asked} className={primaryBtn} style={primaryStyle}>
          {asked ? 'Starting rematch…' : '🔁 Rematch'}
        </button>
        <Link to="/duel" className={secondaryBtn} style={secondaryStyle}>New opponent</Link>
      </div>
    </Screen>
  )
}

function FinalScore({ name, player, highlight }) {
  return (
    <div className="text-center">
      <p className="text-white/50 font-mono text-xs tracking-widest uppercase max-w-[140px] truncate">{name}</p>
      <p className="font-display text-6xl" style={{ color: highlight ? '#FFD700' : 'white' }}>{player.score}</p>
      <p className="text-white/30 font-body text-xs">{OUT_REASON[player.outReason] ?? ''}</p>
    </div>
  )
}
