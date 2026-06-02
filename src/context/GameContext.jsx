import { createContext, useContext, useState, useCallback } from 'react'

// FIX ARCH-01: Centralized game state so all pages read the same highScore
// without independently calling localStorage.getItem everywhere.
const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [highScore, setHighScoreState] = useState(
    () => Number(localStorage.getItem('hl_highscore') || 0)
  )

  // FIX BUG-04: Track prevBest BEFORE updating so GameOverPage can correctly
  // detect a new high score. Previously hl_prev_best was never written.
  const [prevBest] = useState(
    () => Number(localStorage.getItem('hl_highscore') || 0)
  )

  const updateHighScore = useCallback(
    (score) => {
      if (score > highScore) {
        // Persist old best so GameOverPage can compare after navigation
        localStorage.setItem('hl_prev_best', String(highScore))
        localStorage.setItem('hl_highscore', String(score))
        setHighScoreState(score)
      }
    },
    [highScore]
  )

  return (
    <GameContext.Provider value={{ highScore, prevBest, updateHighScore }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within <GameProvider>')
  return ctx
}
