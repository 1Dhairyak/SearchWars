import { useState, useCallback, useRef, useEffect } from 'react'
import { gameService, normaliseItem } from '../services/api'
import { useGameContext } from '../context/GameContext'
import { soundManager } from '../services/sounds'
import { preloadImages } from '../services/imagePreloader'

export function useGame() {
  const { updateHighScore } = useGameContext()

  const sessionIdRef = useRef(null)

  const [leftItem,  setLeftItem]  = useState(null)
  const [rightItem, setRightItem] = useState(null)
  const [score,     setScore]     = useState(0)
  const [phase,     setPhase]     = useState('loading')
  const [lastGuess, setLastGuess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  const streakRef       = useRef(0)
  const mountedRef      = useRef(true)
  const advanceTimerRef = useRef(null)

  useEffect(() => () => { mountedRef.current = false }, [])
  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
  }, [])

  const init = useCallback(async () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    if (!mountedRef.current) return

    try { soundManager.init() } catch (_) {}
 
    streakRef.current = 0
    setIsLoading(true)
    setError(null)
    setPhase('loading')

    try {
      const raw = await gameService.startSession()

      // Handle both wrapped { data: {...} } and unwrapped shapes
      const round = raw?.sessionId ? raw : (raw?.data ?? raw)

      if (!mountedRef.current) return
      if (!round?.sessionId) {
        throw new Error('Invalid response from server')
      }

      sessionIdRef.current = round.sessionId

      const left  = normaliseItem(round.knownItem)
      const right = normaliseItem(round.challengeItem)

      setLeftItem(left)
      setRightItem(right)
      setScore(round.currentScore ?? 0)
      setLastGuess(null)
      setPhase('playing')

      preloadImages([left?.imageUrl, right?.imageUrl])
    } catch (err) {
      if (!mountedRef.current) return
      console.error('Game init error:', err)
      setError(err.message || 'Failed to connect to the server. Please try again.')
      setPhase('playing')
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => { init() }, [])

  const reset = useCallback(() => init(), [init])

  const guess = useCallback(
    async (direction) => {
      if (phase !== 'playing' || !leftItem || !rightItem) return
      if (!sessionIdRef.current) return

      try { soundManager.init() } catch (_) {}

      setLastGuess(direction)
      // Disable the buttons right away so the tap feels instant while the server answers
      setPhase('checking')

      try {
        const raw = await gameService.submitGuess(
          sessionIdRef.current,
          rightItem.id,
          direction
        )

        const result = raw?.correct !== undefined ? raw : (raw?.data ?? raw)

        if (!mountedRef.current) return

        if (result.revealedChallengeItem) {
          setRightItem(normaliseItem(result.revealedChallengeItem))
        }

        if (result.correct) {
          streakRef.current += 1

          try {
            if (streakRef.current > 0 && streakRef.current % 5 === 0) {
              soundManager.streak()
            } else {
              soundManager.correct()
            }
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
          }, 800)
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
    [phase, leftItem, rightItem, score, updateHighScore]
  )

  return {
    leftItem,
    rightItem,
    score,
    phase,
    lastGuess,
    isLoading,
    error,
    guess,
    reset,
  }
}
