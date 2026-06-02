/**
 * API Service Layer — Phase 4 (corrected against real backend)
 *
 * All backend calls go through here. Single place to:
 *  - Swap base URL per environment (VITE_API_BASE_URL)
 *  - Unwrap the { success, message, data } envelope every endpoint returns
 *  - Normalize error shapes across the whole app
 *  - Add retry logic with exponential backoff
 *
 * ── Real backend contracts ────────────────────────────────────────────────────
 *
 *  POST /api/game/start                          (was GET — fixed in production)
 *    body: { playerName?: string }               (body is optional)
 *    → ApiResponse<GameRoundDto>
 *      .data: { sessionId, knownItem, challengeItem, currentScore }
 *      knownItem / challengeItem: { id, title, imageUrl, category, searchVolume }
 *      challengeItem.searchVolume is null (hidden until guess resolves)
 *
 *  POST /api/game/guess
 *    body: { sessionId, challengeItemId, guess: "HIGHER" | "LOWER" }
 *    → ApiResponse<GuessResultDto>
 *      .data: { correct, score, revealedChallengeItem, nextRound, message, gameOver }
 *      nextRound: GameRoundDto | null
 *
 *  GET  /api/leaderboard?limit=10
 *    → ApiResponse<LeaderboardDto>
 *      .data: { entries: [{ rank, playerName, score, achievedAt, sessionId }],
 *               totalEntries, generatedAt }
 *
 *  NOTE: There is NO POST /api/leaderboard.
 *  The backend records scores automatically when a game ends (handleWrongGuess).
 *  Score submission from the frontend is NOT needed.
 *
 * ── Field name note ───────────────────────────────────────────────────────────
 *  ItemDto uses `title` (not `name`) — all frontend code normalises this on receipt.
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  // Phase 5: inject JWT
  // const token = localStorage.getItem('hl_token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor ──────────────────────────────────────────────────────
// Every endpoint returns { success, message, data, timestamp }.
// We unwrap to `res.data.data` so callers receive the actual payload directly.
apiClient.interceptors.response.use(
  (res) => {
    const envelope = res.data
    // If the backend signals failure inside a 2xx (shouldn't happen, but guard it)
    if (envelope && envelope.success === false) {
      return Promise.reject(new Error(envelope.message || 'Server returned an error'))
    }
    // Return the inner data payload
    return envelope?.data ?? envelope
  },
  (err) => {
    // HTTP error responses — backend wraps these in ApiResponse too
    const envelope = err.response?.data
    const message =
      envelope?.message ||
      err.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ── Retry helper ──────────────────────────────────────────────────────────────
// Exponential backoff: attempt 0 → immediate, 1 → 500ms, 2 → 1000ms
// Never retries 4xx — those are caller/validation errors, not transient faults.
async function withRetry(fn, retries = 2, delayMs = 500) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      const status = err?.response?.status
      if (status && status >= 400 && status < 500) throw err
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt))
      }
    }
  }
  throw lastError
}

// ── Item field normaliser ─────────────────────────────────────────────────────
// Backend ItemDto uses `title`; the frontend (SideCard, GamePage) expects `name`.
// Normalise once here so no page component needs to know about the field rename.
export function normaliseItem(item) {
  if (!item) return null
  return {
    ...item,
    name: item.title ?? item.name ?? '',   // prefer title, fall back to name
  }
}

// ── Game Service ──────────────────────────────────────────────────────────────

export const gameService = {
  /**
   * Start a new game session.
   * POST /api/game/start
   * body: { playerName? }
   * → GameRoundDto: { sessionId, knownItem, challengeItem, currentScore }
   */
  startSession: (playerName) =>
    apiClient.post('/game/start', playerName ? { playerName } : {}),
  /**
   * Submit a guess for the current challenge item.
   * POST /api/game/guess
   * body: { sessionId, challengeItemId, guess: "HIGHER" | "LOWER" }
   * → GuessResultDto: { correct, score, revealedChallengeItem, nextRound, message, gameOver }
   */
  submitGuess: (sessionId, challengeItemId, direction) =>
    apiClient.post('/game/guess', {
      sessionId,
      challengeItemId,
      // Backend enum: HIGHER | LOWER (uppercase required — Spring @NotNull GuessType)
      guess: direction.toUpperCase(),
    }),
}

// ── Leaderboard Service ───────────────────────────────────────────────────────

export const leaderboardService = {
  /**
   * Fetch the top-N leaderboard.
   * GET /api/leaderboard?limit=10
   * → LeaderboardDto: { entries: [...], totalEntries, generatedAt }
   *
   * NOTE: score submission is handled automatically server-side on game over.
   * There is no POST /api/leaderboard endpoint.
   */
  getTop: (limit = 10) =>
    withRetry(() => apiClient.get('/leaderboard', { params: { limit } })),
}
