import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { playerService } from '../services/api'

// App-wide state: high score + player identity, persisted in localStorage.
const GameContext = createContext(null)

const PLAYER_KEY = 'sw_player'

// guestToken identifies this device to the backend, so a claimed name stays yours.
function loadPlayer() {
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(PLAYER_KEY)) || {} } catch { /* corrupt → reset */ }
  const player = {
    guestToken: saved.guestToken || crypto.randomUUID(),
    name:       saved.name || null,
    nameSkipped: Boolean(saved.nameSkipped), // skipped the game-over name prompt once → don't ask again
    authToken:  saved.authToken || null,
    email:      saved.email || null,
  }
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
  return player
}

export function GameProvider({ children }) {
  const [highScore, setHighScoreState] = useState(
    () => Number(localStorage.getItem('hl_highscore') || 0)
  )

  // Best before the current game, so GameOverPage can detect a new high score.
  // Re-snapshotted at each game start (useGame calls snapshotBest).
  const [prevBest, setPrevBest] = useState(
    () => Number(localStorage.getItem('hl_highscore') || 0)
  )
  const snapshotBest = useCallback(
    () => setPrevBest(Number(localStorage.getItem('hl_highscore') || 0)),
    []
  )

  const [player, setPlayer] = useState(loadPlayer)

  const updatePlayer = useCallback((changes) => {
    setPlayer((p) => {
      const next = { ...p, ...changes }
      localStorage.setItem(PLAYER_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const logout = useCallback(() => updatePlayer({ authToken: null, email: null }), [updatePlayer])

  const updateHighScore = useCallback(
    (score) => {
      if (score > highScore) {
        localStorage.setItem('hl_highscore', String(score))
        setHighScoreState(score)
      }
    },
    [highScore]
  )

  // Signed in (on load or right after login) → pull the account's best from the server,
  // so a score set on another device shows here. Server scores come from server-side games.
  useEffect(() => {
    if (!player.authToken) return
    playerService.getBest()
      .then(({ bestScore }) => {
        if (!(bestScore > Number(localStorage.getItem('hl_highscore') || 0))) return
        localStorage.setItem('hl_highscore', String(bestScore))
        setHighScoreState(bestScore)
        setPrevBest((p) => Math.max(p, bestScore))
      })
      .catch(() => {}) // offline / expired token: keep the local best
  }, [player.authToken])

  return (
    <GameContext.Provider value={{ highScore, prevBest, snapshotBest, updateHighScore, player, updatePlayer, logout }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within <GameProvider>')
  return ctx
}

// For non-React modules (api.js) that need the current tokens.
export function readPlayer() {
  try { return JSON.parse(localStorage.getItem(PLAYER_KEY)) || {} } catch { return {} }
}
