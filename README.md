# SearchWars 🔺🔻

> **Guess which gets Googled more.** One wrong answer ends your streak.

Live: **https://search-wars.vercel.app**

## Stack

- **Frontend (this repo):** React 19, Vite 5, Tailwind CSS 3 (all animations are CSS), React Router, native fetch. Sounds are synthesized with the Web Audio API (no audio files). Hosted on Vercel.
- **Backend:** Spring Boot 3 + PostgreSQL — [1Dhairyak/searchwars-backend](https://github.com/1Dhairyak/searchwars-backend), hosted on Render with a Neon database.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

`.env.local` (not committed) points the app at the local backend:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Deploy

Vercel builds on every push to `main` (`vercel.json` sets SPA rewrites and cache headers).
Set `VITE_API_BASE_URL` (type **Config**) in Vercel to the backend URL, e.g. `https://<service>.onrender.com/api`, then redeploy.

## Structure

```
src/
  pages/        Landing, Game, GameOver, Leaderboard, NotFound
  components/   game/ (SideCard, VSCircle, GuessButton, ScorePopup), ui/ (Navbar, LoginModal, Logo, SoundToggle, StarfieldBg)
  hooks/        useGame — game loop against the API
  context/      GameContext — high score + player name / guest token / login (localStorage)
  services/     api, sounds, formatters, imagePreloader
```
