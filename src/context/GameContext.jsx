import { createContext, useContext, useState, useCallback } from 'react'

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

  // Read once at mount, before any update, so GameOverPage can detect a new high score.
  const [prevBest] = useState(
    () => Number(localStorage.getItem('hl_highscore') || 0)
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

  return (
    <GameContext.Provider value={{ highScore, prevBest, updateHighScore, player, updatePlayer, logout }}>
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
