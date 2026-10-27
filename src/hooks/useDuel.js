import { useState, useEffect, useRef, useCallback } from 'react'
import { duelSocketUrl, normaliseItem } from '../services/api'
import { readPlayer } from '../context/GameContext'
import { soundManager } from '../services/sounds'
import { preloadImages } from '../services/imagePreloader'

const REVEAL_MS = 900       // show the revealed number before the next round (server allows 1.2 s)
const MAX_RETRY_MS = 10_000

/**
 * One duel over a WebSocket. The server is authoritative: it sends a complete
 * `state` after every change (so reconnecting = joining again), a `result` to
 * whoever guessed, and `error`s. Returns the latest state plus the round to show.
 */
export function useDuel(duelId) {
  const [state, setState] = useState(null)
  const [view, setView] = useState(null)        // { known, challenge, phase: playing|checking|correct|wrong }
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)
  const [clockOffset, setClockOffset] = useState(0) // server time − local time, ms

  const socketRef = useRef(null)
  const pendingRef = useRef(null)    // state that arrived during a reveal
  const revealingRef = useRef(false)
  const finishedRef = useRef(false)

  const apply = useCallback((msg) => {
    finishedRef.current = msg.status === 'FINISHED'
    setState(msg)
    setClockOffset(Date.parse(msg.serverTime) - Date.now())
    if (msg.known) {
      const known = normaliseItem(msg.known)
      const challenge = normaliseItem(msg.challenge)
      preloadImages([known.imageUrl, challenge.imageUrl])
      setView({ known, challenge, phase: 'playing' })
    } else {
      setView(null)
    }
  }, [])

  useEffect(() => {
    if (!duelId) return
    let closedByUs = false
    let retryMs = 1000
    let retryTimer

    const connect = () => {
      const ws = new WebSocket(duelSocketUrl())
      socketRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        retryMs = 1000
        const { guestToken, authToken } = readPlayer()
        ws.send(JSON.stringify({ type: 'join', duelId, guestToken, authToken }))
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.type === 'state') {
          setError(null)
          if (revealingRef.current) pendingRef.current = msg
          else apply(msg)
        } else if (msg.type === 'result') {
          try { msg.correct ? soundManager.correct() : soundManager.wrong() } catch (_) {}
          revealingRef.current = true
          setView((v) => v && { ...v, challenge: normaliseItem(msg.revealed), phase: msg.correct ? 'correct' : 'wrong' })
          setTimeout(() => {
            revealingRef.current = false
            if (pendingRef.current) { apply(pendingRef.current); pendingRef.current = null }
          }, REVEAL_MS)
        } else if (msg.type === 'error') {
          setError(msg.message)
          setView((v) => v && v.phase === 'checking' ? { ...v, phase: 'playing' } : v)
        }
      }

      ws.onclose = (event) => {
        setConnected(false)
        if (event.code === 4000) {   // this duel is now open in another tab: hand over, don't fight for the seat
          setState(null)
          setView(null)
          setError(event.reason)
          return
        }
        if (closedByUs || finishedRef.current) return
        // Backend asleep (Render free tier) or network blip: keep trying; joining again restores everything.
        retryTimer = setTimeout(connect, retryMs)
        retryMs = Math.min(retryMs * 2, MAX_RETRY_MS)
      }
    }

    connect()
    return () => {
      closedByUs = true
      clearTimeout(retryTimer)
      socketRef.current?.close()
      setState(null)
      setView(null)
      setError(null)
    }
  }, [duelId, apply])

  const send = (msg) => {
    const ws = socketRef.current
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
  }

  const guess = useCallback((direction) => {
    if (view?.phase !== 'playing') return
    try { soundManager.init() } catch (_) {}
    setView({ ...view, phase: 'checking' })
    send({ type: 'guess', guess: direction.toUpperCase() })
  }, [view])

  const rematch = useCallback(() => send({ type: 'rematch' }), [])

  return { state, view, error, connected, clockOffset, guess, rematch }
}
