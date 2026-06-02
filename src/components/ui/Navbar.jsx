import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/game', label: 'Play' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

// FIX MOBILE-03: Mobile hamburger menu added.
// FIX A11Y: aria-current, aria-label, aria-expanded, aria-controls added.
export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50"
      role="banner"
    >
      <nav
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,10,15,0.95) 0%, transparent 100%)',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="Main navigation"
      >
        <Link to="/" aria-label="Higher Lower — go to home">
          <Logo size="sm" animate={false} />
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                role="listitem"
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative px-4 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200 rounded-lg',
                  isActive ? 'text-game-green' : 'text-white/60 hover:text-white',
                ].join(' ')}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-game-green"
                    style={{ boxShadow: '0 0 8px rgba(0,255,135,0.8)' }}
                  />
                )}
              </Link>
            )
          })}

          <Link
            to="/game"
            className="ml-4 px-5 py-2 rounded-full font-body font-semibold text-sm text-black tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={{
              background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
              boxShadow: '0 0 20px rgba(0,255,135,0.4)',
            }}
          >
            PLAY NOW
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden"
            style={{
              background: 'rgba(5,10,15,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex flex-col px-4 pb-4 pt-2 gap-1" role="list">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive = pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    role="listitem"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      'px-4 py-3 rounded-xl text-sm font-body font-medium transition-colors',
                      isActive
                        ? 'text-game-green bg-game-green/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                )
              })}
              <Link
                to="/game"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center px-5 py-3 rounded-full font-body font-bold text-sm text-black tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green"
                style={{
                  background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
                  boxShadow: '0 0 20px rgba(0,255,135,0.4)',
                }}
              >
                PLAY NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
