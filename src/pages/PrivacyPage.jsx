import { Link } from 'react-router-dom'

// Linked from the Google OAuth consent screen — keep it in sync with what the backend stores.
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-game-darker text-white/80 font-body px-4 py-12 animate-page">
      <div className="max-w-2xl mx-auto space-y-5 leading-relaxed">
        <h1 className="font-display text-4xl text-white tracking-wide">PRIVACY POLICY</h1>
        <p className="text-white/50 text-sm">Last updated: 27 October 2026</p>

        <p>SearchWars is a free game. This page explains what we store and why.</p>

        <h2 className="font-display text-2xl text-white tracking-wide">What we store</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>The player name you choose, and your scores, which appear on the public leaderboard.</li>
          <li>If you sign in with Google: your email address, name and Google account ID.</li>
          <li>If you sign up with email: your email address and a hashed (never plain-text) password.</li>
          <li>In your browser's local storage: your high score, player name and sound settings.</li>
        </ul>

        <h2 className="font-display text-2xl text-white tracking-wide">How we use it</h2>
        <p>
          Only to run the game: to sign you in, keep your name reserved for you and show your scores.
          We don't sell or share your data, and we don't use ads or analytics trackers.
        </p>

        <h2 className="font-display text-2xl text-white tracking-wide">Deleting your data</h2>
        <p>
          Email <a className="text-game-green underline" href="mailto:dhairyakumar490@gmail.com">dhairyakumar490@gmail.com</a> and
          we'll delete your account and scores. Clearing your browser's site data removes what's stored locally.
        </p>

        <Link to="/" className="inline-block pt-4 text-game-green underline">← Back to SearchWars</Link>
      </div>
    </main>
  )
}
