/**
 * All backend calls. Every endpoint returns { success, message, data }; the
 * response interceptor unwraps it so callers get `data` directly.
 * Scores are recorded server-side on game over (no POST /leaderboard).
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // Render free tier cold start can take ~30-60s
  timeout: 60_000,
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
    imageUrl: smallerImage(item.imageUrl),
  }
}

// Seed images are full-size (1200px+). Ask the CDNs for a phone-friendly size.
function smallerImage(url) {
  if (!url) return url
  if (url.includes('i.pinimg.com/1200x/')) return url.replace('/1200x/', '/736x/')
  if (url.startsWith('https://images.unsplash.com/')) {
    const u = new URL(url)
    u.searchParams.set('w', '800')
    u.searchParams.set('q', '70')
    u.searchParams.set('auto', 'format')
    return u.toString()
  }
  return url
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

// Wake a sleeping backend as soon as the app loads; errors are irrelevant here.
export const warmUp = () =>
  apiClient.get('/leaderboard', { params: { limit: 1 } }).catch(() => {})
