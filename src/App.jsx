import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { GameProvider } from './context/GameContext'
import LandingPage from './pages/LandingPage'
import GamePage from './pages/GamePage'
import GameOverPage from './pages/GameOverPage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotFoundPage from './pages/NotFoundPage'

// FIX BUG-01: AnimatePresence needs a changing `key` to fire exit animations.
// Wrap Routes in a component that calls useLocation() to get that key.
// This is the canonical React Router v6 + Framer Motion solution.
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game-over" element={<GameOverPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* FIX ARCH-01: GameProvider wraps the whole app so all pages share
          highScore state without redundant localStorage.getItem calls */}
      <GameProvider>
        <AnimatedRoutes />
      </GameProvider>
    </BrowserRouter>
  )
}
