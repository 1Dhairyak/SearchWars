# GitHub Assets Checklist — Higher or Lower

Complete every item before the public launch. Items are grouped by who
owns them (Dev / Design / DevOps).

---

## Repository Setup

- [ ] Repository created on GitHub (public or private)
- [ ] Default branch set to `main`
- [ ] Branch protection rule on `main`:
  - [ ] Require pull request before merging
  - [ ] Require status checks to pass (CI build)
  - [ ] Require at least 1 approving review
- [ ] Repository description filled in: _"Guess which gets Googled more — a Higher or Lower search-volume game"_
- [ ] Repository website URL set to live frontend URL
- [ ] Topics/tags added: `react`, `vite`, `game`, `spring-boot`, `typescript`, `tailwindcss`

---

## Repository Files

- [x] `README.md` — comprehensive, production-ready
- [x] `.env.example` — all variables documented, no secrets
- [x] `.gitignore` — covers `.env.local`, `dist/`, `node_modules/`, `*.local`, sourcemaps
- [ ] `LICENSE` — add MIT or your chosen license file
- [ ] `CONTRIBUTING.md` — optional but recommended for open source
- [ ] `CODE_OF_CONDUCT.md` — optional but recommended
- [x] `.github/workflows/ci.yml` — CI build + Netlify deploy

---

## GitHub Secrets (Settings → Secrets and Variables → Actions)

Add all secrets before the CI pipeline runs:

- [ ] `NETLIFY_AUTH_TOKEN` — from Netlify User Settings → Applications → Personal access tokens
- [ ] `NETLIFY_SITE_ID` — from Netlify Site Settings → General → Site ID
- [ ] `VITE_API_BASE_URL` — production backend URL (e.g. `https://your-app.onrender.com/api`)

---

## Issues & Project Board

- [ ] GitHub Issues enabled
- [ ] Issue templates created:
  - [ ] Bug report template (`.github/ISSUE_TEMPLATE/bug_report.md`)
  - [ ] Feature request template (`.github/ISSUE_TEMPLATE/feature_request.md`)
- [ ] GitHub Project (kanban board) created and linked to repository
- [ ] Milestone created: `v1.0 Launch`

---

## Social Preview / Branding

- [ ] Social preview image uploaded (Settings → General → Social preview)
  - Recommended: 1280×640px PNG
  - Content: game screenshot or logo on dark background
  - File: `github-social-preview.png` (keep in repo root for reference)

---

## Releases

- [ ] Initial tag created: `git tag v1.0.0 && git push origin v1.0.0`
- [ ] GitHub Release created for `v1.0.0`:
  - [ ] Release title: `v1.0.0 — Initial Launch`
  - [ ] Release notes list all phases (1–5)
  - [ ] Mark as latest release

---

## Deployment Verification

- [ ] Frontend deployed to Netlify / Vercel
- [ ] Backend deployed to Render / Railway / Fly.io
- [ ] `VITE_API_BASE_URL` set correctly in frontend deployment
- [ ] CORS configured on backend to allow frontend origin
- [ ] HTTPS working on both frontend and backend
- [ ] SPA routing verified: navigate to `/leaderboard` directly in browser → loads correctly
- [ ] `netlify.toml` / `vercel.json` security headers verified with [securityheaders.com](https://securityheaders.com)

---

## CI/CD Verification

- [ ] Push a commit to `main` → CI pipeline triggers automatically
- [ ] CI build passes (green checkmark)
- [ ] Netlify deploy succeeds after CI
- [ ] Pull request preview deploys working (Netlify preview URLs in PR comments)

---

## Performance Baseline

Run these after deployment and record results:

- [ ] Lighthouse (Chrome DevTools) on production URL:
  - [ ] Performance: **≥ 90**
  - [ ] Accessibility: **≥ 90**
  - [ ] Best Practices: **≥ 90**
  - [ ] SEO: **≥ 80**
- [ ] Bundle sizes verified (from build output):
  - `index.js` gzip: **< 75 KB** ✅ (currently ~71 KB)
  - `vendor-motion` gzip: **< 40 KB** ✅ (currently ~38 KB)
  - `vendor-sound` gzip: **< 12 KB** ✅ (currently ~10 KB)
- [ ] Time to Interactive on mobile (Lighthouse): **< 4s on 3G**

---

## Functionality Smoke Test

Run through these manually on the production URL before announcing launch:

- [ ] Landing page loads without errors
- [ ] "Start Exploring" / "Play For Free" navigates to game
- [ ] First round loads (items appear on both sides)
- [ ] "Higher" guess — correct: score increments, next round loads
- [ ] "Lower" guess — wrong: shake animation plays, navigate to Game Over
- [ ] Game Over page: score displays, meme message correct, "Play Again" works
- [ ] Leaderboard page: entries load, back navigation works
- [ ] Sound: correct answer plays chime, wrong plays dissonant tone
- [ ] Sound toggle: 🔊 → 🔇 → back, state persists on refresh
- [ ] Streak sound: play 5 correct answers in a row → streak fanfare plays
- [ ] New high score: badge appears + fanfare plays
- [ ] Keyboard: ↑ guesses Higher, ↓ guesses Lower
- [ ] Mobile: layout correct on 375px width (iPhone SE)
- [ ] 404 page: navigate to `/nonexistent` → NotFoundPage renders
- [ ] Dark mode / prefers-color-scheme: UI is always dark (no light mode flash)

---

## Open Graph / SEO

- [ ] `og:title` set in `index.html`
- [ ] `og:description` set in `index.html`
- [ ] `og:image` URL set and image accessible (1200×630px recommended)
- [ ] `og:url` set to production frontend URL
- [ ] `<meta name="theme-color">` set to `#050A0F` ✅ (already in index.html)
- [ ] Verify OG tags with [opengraph.xyz](https://www.opengraph.xyz)

---

## Post-Launch Monitoring

- [ ] Error monitoring set up (Sentry / LogRocket / Datadog RUM)
  - Upload sourcemaps from `dist/*.map` to your error tracker
  - Sourcemaps are `hidden` in production build (not served to users)
- [ ] Uptime monitor configured for frontend URL
- [ ] Uptime monitor configured for backend health endpoint (`/actuator/health`)
- [ ] Analytics installed (Plausible / Fathom / GA4)

---

## Documentation

- [x] `README.md` — setup, API contract, deployment, scripts
- [x] `ARCHITECTURE_REPORT.md` — component decisions and phase notes
- [ ] API documented (Swagger/OpenAPI at `/swagger-ui.html` on backend) — verify accessible
- [ ] Link to backend README from frontend README (and vice versa)

---

**Legend:**  
✅ Already done in Phase 5 codebase  
[ ] Needs manual action before launch
