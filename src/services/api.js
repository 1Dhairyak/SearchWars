/**
 * All backend calls, using the browser's fetch (no HTTP library).
 * Game/leaderboard endpoints return { success, message, data } and are unwrapped
 * to `data`; auth endpoints return plain JSON. Errors throw Error(message) with `.status`.
 */
import { readPlayer } from '../context/GameContext'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TIMEOUT_MS = 60_000 // Render free tier cold start can take ~30-60s

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const { authToken } = readPlayer()
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let res
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    throw new Error(err.name === 'AbortError' ? 'The server took too long to respond.' : 'Network Error')
  } finally {
    clearTimeout(timer)
  }

  const json = await res.json().catch(() => null)
  if (!res.ok || json?.success === false) {
    const err = new Error(json?.message || json?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return json && 'data' in json && 'success' in json ? json.data : json
}

// Retries network/5xx failures with backoff (0.5s, 1s); never retries 4xx.
async function withRetry(fn, retries = 2, delayMs = 500) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt >= retries || (err.status >= 400 && err.status < 500)) throw err
      await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt))
    }
  }
}

// ── Item field normaliser ─────────────────────────────────────────────────────
// Backend ItemDto uses `title`; the frontend (SideCard, GamePage) expects `name`.
export function normaliseItem(item) {
  if (!item) return null
  return {
    ...item,
    name: item.title ?? item.name ?? '',
    monthlyViews: item.monthlyViews ?? item.searchVolume, // ponytail: drop the searchVolume fallback once the backend rename is live
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

export const gameService = {
  // → { sessionId, knownItem, challengeItem, currentScore }
  startSession: () =>
    request('POST', '/game/start', { guestToken: readPlayer().guestToken }),

  // → { correct, score, revealedChallengeItem, nextRound, message, gameOver }
  submitGuess: (sessionId, challengeItemId, direction) =>
    request('POST', '/game/guess', {
      sessionId,
      challengeItemId,
      guess: direction.toUpperCase(), // backend enum HIGHER | LOWER
    }),
}

export const leaderboardService = {
  // → { entries: [{ rank, playerName, score, achievedAt }], totalEntries, generatedAt }
  getTop: (limit = 10) => withRetry(() => request('GET', `/leaderboard?limit=${limit}`)),
}

export const playerService = {
  // Claims a unique name for this device/account; 409 if someone else has it.
  // With sessionId, that game's leaderboard entry is renamed too. → { name }
  claimName: (name, sessionId) =>
    request('POST', '/players/name', { name, guestToken: readPlayer().guestToken, sessionId }),

  // Signed-in user's best score across all devices (401 when logged out). → { bestScore }
  getBest: () => withRetry(() => request('GET', '/players/best')),
}

export const authService = {
  // All → { token, email, displayName, playerName }
  login:    (email, password) =>
    request('POST', '/auth/login', { email, password, guestToken: readPlayer().guestToken }),
  register: (email, password) =>
    request('POST', '/auth/register', { email, password, guestToken: readPlayer().guestToken }),
  google:   (idToken) =>
    request('POST', '/auth/google', { idToken, guestToken: readPlayer().guestToken }),
}

// Wake a sleeping backend as soon as the app loads; errors are irrelevant here.
export const warmUp = () => request('GET', '/leaderboard?limit=1').catch(() => {})
