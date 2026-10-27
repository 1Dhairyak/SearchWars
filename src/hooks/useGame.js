import { useState, useCallback, useRef, useEffect } from 'react'
import { gameService, normaliseItem } from '../services/api'
import { useGameContext } from '../context/GameContext'
import { soundManager } from '../services/sounds'
import { preloadImages } from '../services/imagePreloader'

const NEXT_ROUND_DELAY_MS = 800

export function useGame() {
  const { updateHighScore, snapshotBest } = useGameContext()

  const [sessionId, setSessionId] = useState(null)
  const [leftItem,  setLeftItem]  = useState(null)
  const [rightItem, setRightItem] = useState(null)
  const [score,     setScore]     = useState(0)
  const [phase,     setPhase]     = useState('loading') // loading | playing | checking | correct | wrong
  const [error,     setError]     = useState(null)

  const streakRef       = useRef(0)
  const mountedRef      = useRef(true)
  const advanceTimerRef = useRef(null)

  useEffect(() => () => {
    mountedRef.current = false
    clearTimeout(advanceTimerRef.current)
  }, [])

  const init = useCallback(async () => {
    clearTimeout(advanceTimerRef.current)
    try { soundManager.init() } catch (_) {}

    streakRef.current = 0
    snapshotBest()
    setError(null)
    setPhase('loading')

    try {
      const round = await gameService.startSession()
      if (!mountedRef.current) return
      if (!round?.sessionId) throw new Error('Invalid response from server')

      const left  = normaliseItem(round.knownItem)
      const right = normaliseItem(round.challengeItem)
      setSessionId(round.sessionId)
      setLeftItem(left)
      setRightItem(right)
      setScore(round.currentScore ?? 0)
      setPhase('playing')
      preloadImages([left?.imageUrl, right?.imageUrl])
    } catch (err) {
      if (!mountedRef.current) return
      setError(err.message || 'Failed to connect to the server. Please try again.')
    }
  }, [snapshotBest])

  useEffect(() => { init() }, [init])

  const guess = useCallback(
    async (direction) => {
      if (phase !== 'playing' || !leftItem || !rightItem || !sessionId) return
      try { soundManager.init() } catch (_) {}

      // Disable the buttons right away so the tap feels instant while the server answers
      setPhase('checking')

      try {
        const result = await gameService.submitGuess(sessionId, rightItem.id, direction)
        if (!mountedRef.current) return

        if (result.revealedChallengeItem) {
          setRightItem(normaliseItem(result.revealedChallengeItem))
        }

        if (result.correct) {
          streakRef.current += 1
          try {
            if (streakRef.current % 5 === 0) soundManager.streak()
            else soundManager.correct()
          } catch (_) {}

          setPhase('correct')

          const nextLeft  = normaliseItem(result.nextRound?.knownItem)
          const nextRight = normaliseItem(result.nextRound?.challengeItem)
          preloadImages([nextLeft?.imageUrl, nextRight?.imageUrl])

          advanceTimerRef.current = setTimeout(() => {
            if (!mountedRef.current) return
            const newScore = result.score ?? 0
            setScore(newScore)
            updateHighScore(newScore)

            if (result.gameOver || !result.nextRound) {
              setPhase('wrong')
              return
            }
            setLeftItem(nextLeft)
            setRightItem(nextRight)
            setPhase('playing')
          }, NEXT_ROUND_DELAY_MS)
        } else {
          streakRef.current = 0
          try { soundManager.wrong() } catch (_) {}
          const finalScore = result.score ?? score
          setScore(finalScore)
          updateHighScore(finalScore)
          setPhase('wrong')
        }
      } catch (err) {
        if (!mountedRef.current) return
        setError(err.message || 'Network error. Check your connection.')
      }
    },
    [phase, leftItem, rightItem, sessionId, score, updateHighScore]
  )

  return { leftItem, rightItem, score, phase, error, sessionId, guess, reset: init }
}
