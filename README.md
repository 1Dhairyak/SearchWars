# Higher or Lower 🔺🔻

> **Guess which gets Googled more.** One wrong answer ends your streak.

A full-stack web game comparing real Google search volumes. Built with React + Vite on the frontend and Spring Boot + PostgreSQL on the backend.

---

## Live Demo

| Environment | URL |
|-------------|-----|
| Frontend    | _Deploy and update this link_ |
| Backend API | _Deploy and update this link_ |

---

## Tech Stack

### Frontend
| Technology | Version | Role |
|------------|---------|------|
| React | 19 | UI framework |
| Vite | 5 | Build tool |
| Framer Motion | 11 | Animations |
| React Router DOM | 6 | SPA routing |
| Howler.js | 2.2 | Sound system |
| Tailwind CSS | 3 | Utility styling |
| Axios | 1.7 | HTTP client |

### Backend
| Technology | Version | Role |
|------------|---------|------|
| Spring Boot | 3 | REST API |
| PostgreSQL | 15 | Primary database |
| Flyway / schema.sql | — | DB migrations |
| Docker | — | Containerisation |

---

## Project Structure

```
higher-lower/
├── src/
│   ├── animations/
│   │   └── variants.js          # All Framer Motion variants (single source of truth)
│   ├── components/
│   │   ├── game/
│   │   │   ├── GuessButton.jsx  # Higher / Lower button
│   │   │   ├── ScorePopup.jsx   # Floating +1 animation
│   │   │   ├── SideCard.jsx     # Left & right item cards
│   │   │   └── VSCircle.jsx     # Central VS / score widget
│   │   └── ui/
│   │       ├── Logo.jsx         # Animated game logo
│   │       ├── Navbar.jsx       # Top navigation
│   │       ├── ParticleField.jsx# Floating particle bg
│   │       ├── SoundToggle.jsx  # Mute / unmute button  ← Phase 5
│   │       └── StarfieldBg.jsx  # Star field background
│   ├── context/
│   │   └── GameContext.jsx      # High score state (shared across pages)
│   ├── hooks/
│   │   └── useGame.js           # Core game logic + API calls + sounds
│   ├── pages/
│   │   ├── GameOverPage.jsx     # Score display + meme messages
│   │   ├── GamePage.jsx         # Main game screen
│   │   ├── LandingPage.jsx      # Home / marketing page
│   │   ├── LeaderboardPage.jsx  # Global leaderboard
│   │   └── NotFoundPage.jsx     # 404
│   └── services/
│       ├── api.js               # Axios client + game/leaderboard services
│       ├── formatters.js        # Search volume formatting
│       ├── imagePreloader.js    # Ahead-of-time image caching  ← Phase 5
│       ├── mockData.js          # Offline dev data
│       └── sounds.js            # Howler.js + Web Audio synth  ← Phase 5
├── public/
│   ├── favicon.svg
│   └── _redirects               # Netlify SPA routing fallback
├── .github/workflows/
│   └── ci.yml                   # Build + deploy pipeline
├── .env.example
├── index.html
├── netlify.toml                 # Netlify config (headers, redirects, build)
├── package.json
├── tailwind.config.js
├── vercel.json                  # Vercel config (alternative deployment)
└── vite.config.js               # Build config with compression + chunk splitting
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Running backend (see backend repo README)

### Local Development

```bash
# 1. Clone
git clone https://github.com/YOUR_ORG/higher-lower.git
cd higher-lower

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set VITE_API_BASE_URL to your backend URL

# 4. Start dev server (proxies /api → localhost:8080)
npm run dev
```

Open http://localhost:5173

### Production Build

```bash
npm run build         # outputs to dist/
npm run preview       # preview the built output locally
```

### Bundle Analysis

```bash
ANALYZE=true npm run build
# Opens dist/stats.html with interactive treemap
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | `/api` | Backend API base URL |

Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

---

## Deployment

### Netlify (recommended)

1. Push to GitHub.
2. Connect repository in Netlify UI.
3. Set **Build command**: `npm run build`  
   Set **Publish directory**: `dist`
4. Add environment variable `VITE_API_BASE_URL` in Site Settings → Environment.
5. Add secrets to GitHub for CI/CD:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
   - `VITE_API_BASE_URL`

The `netlify.toml` handles SPA redirects, cache headers, and security headers automatically.

### Vercel

1. Import the repository in the Vercel dashboard.
2. Framework preset: **Vite**
3. Add `VITE_API_BASE_URL` in Project Settings → Environment Variables.

The `vercel.json` handles rewrites and headers automatically.

### Manual / Any Static Host

```bash
npm run build
# Upload the contents of dist/ to your CDN/host
# Configure the host to serve index.html for all 404s (SPA routing)
```

---

## API Contract

All endpoints live under `VITE_API_BASE_URL` (default: `/api`).

### `POST /game/start`
Start a new game session.

**Request body** (optional):
```json
{ "playerName": "Alice" }
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "knownItem":     { "id": 1, "title": "...", "imageUrl": "...", "category": "...", "searchVolume": 50000 },
    "challengeItem": { "id": 2, "title": "...", "imageUrl": "...", "category": "...", "searchVolume": null },
    "currentScore": 0
  }
}
```

### `POST /game/guess`
Submit a guess for the current round.

**Request body**:
```json
{
  "sessionId": "uuid",
  "challengeItemId": 2,
  "guess": "HIGHER"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "correct": true,
    "score": 1,
    "revealedChallengeItem": { "id": 2, "searchVolume": 120000, ... },
    "nextRound": { "sessionId": "...", "knownItem": {...}, "challengeItem": {...}, "currentScore": 1 },
    "gameOver": false,
    "message": "Correct!"
  }
}
```

> `nextRound` is `null` when `gameOver` is `true`.  
> Scores are recorded server-side automatically on game over — no separate POST.

### `GET /leaderboard?limit=10`
Fetch top scores.

**Response**:
```json
{
  "success": true,
  "data": {
    "entries": [
      { "rank": 1, "playerName": "Alice", "score": 42, "achievedAt": "2026-05-31T..." }
    ],
    "totalEntries": 500,
    "generatedAt": "2026-05-31T..."
  }
}
```

---

## Phase 5 Features

### Sound System (Howler.js + Web Audio API)
- Zero external audio files — all sounds are synthesised programmatically
- Correct answer: ascending C-G-C chime
- Wrong answer: descending sawtooth dissonance
- Streak (every 5): C-E-G-C arpeggio  
- New high score: 5-note fanfare
- Page transitions: frequency-swept whoosh
- Mute/unmute persists in `localStorage`

### Image Preloading
- Next round's images are scheduled with `requestIdleCallback` during the 1.2s reveal window
- `isPreloaded()` guard prevents duplicate requests
- LRU-style cache cap at 60 entries to bound memory

### Performance Optimisations
- **Gzip + Brotli** pre-compressed assets via `vite-plugin-compression`
- **5-chunk vendor split**: react · router · motion · http · sound
- **Hidden sourcemaps** for error monitoring without exposing source
- **ES2020 target** — removes legacy polyfill bloat
- **8KB asset inline threshold** — avoids small-file round-trips
- **1-year immutable cache** on all hashed assets

### Deployment Config
- `netlify.toml` — build, redirects, cache + security headers
- `vercel.json` — rewrites + cache headers
- `public/_redirects` — Netlify SPA routing fallback
- `.github/workflows/ci.yml` — build CI + Netlify deploy on `main`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build (port 4173) |
| `npm run build:analyze` | Build + open bundle size visualiser |

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge 90+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Mobile Chrome / Safari | ✅ Full |

Requires ES2020 (`optional chaining`, `nullish coalescing`, `BigInt`).  
IE11 and legacy Edge are not supported.

---

## Accessibility

- All interactive elements have `focus-visible` styles
- `aria-label` on all game-state regions
- `aria-live="assertive"` on the game area for screen reader score announcements
- `prefers-reduced-motion` respected via `usePageVariants()` hook
- Color feedback always paired with text feedback (`✓`/`✗` in VSCircle)
- Keyboard: `↑` / `↓` arrow keys guess Higher / Lower in GamePage

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-change`
3. Commit with conventional commits: `git commit -m "feat: add XYZ"`
4. Push and open a pull request

Please do not introduce:
- New pages or routes without updating `App.jsx`
- Direct `localStorage` calls outside `GameContext` and `sounds.js`
- `console.log` statements in production code
- Breaking API contract changes without backend coordination

---

## License

MIT — see `LICENSE` for details.
