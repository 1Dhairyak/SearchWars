import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import LandingPage from './pages/LandingPage'
import GamePage from './pages/GamePage'
import GameOverPage from './pages/GameOverPage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import DuelPage from './pages/DuelPage'
import { warmUp } from './services/api'

warmUp()

// Pages fade in with a CSS animation on mount (no exit animation, so navigation is instant).
export default function App() {
  return (
    <BrowserRouter>
      {/* GameProvider wraps the whole app so all pages share high score / player state */}
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/game-over" element={<GameOverPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/duel" element={<DuelPage />} />
          <Route path="/duel/:duelId" element={<DuelPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  )
}
