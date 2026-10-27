import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGameContext } from '../../context/GameContext'
import Logo from './Logo'
import LoginModal from './LoginModal'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/game', label: 'Play' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

const playNowStyle = {
  background: 'linear-gradient(135deg, #00FF87, #00C2FF)',
  boxShadow: '0 0 20px rgba(0,255,135,0.4)',
}

// Desktop links + Login button; hamburger menu on phones.
export default function Navbar() {
  const { pathname } = useLocation()
  const { player, logout } = useGameContext()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen]   = useState(false)
  const loggedIn = Boolean(player.authToken)

  const openLogin = () => { setMobileOpen(false); setLoginOpen(true) }

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <nav
        // Phones: solid bar (the stacked logo sits low, so a fade lets content show through).
        className="flex items-center justify-between px-6 py-4 bg-[rgba(5,10,15,0.97)] border-b border-white/5 sm:border-b-0 sm:bg-[linear-gradient(to_bottom,rgba(5,10,15,0.97)_0%,rgba(5,10,15,0.85)_70%,transparent_100%)]"
        aria-label="Main navigation"
      >
        <Link to="/" aria-label="SearchWars — go to home">
          <Logo size="sm" />
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
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px bg-game-green"
                    style={{ boxShadow: '0 0 8px rgba(0,255,135,0.8)' }}
                  />
                )}
              </Link>
            )
          })}

          {loggedIn ? (
            <button
              onClick={logout}
              title="Log out"
              className="ml-2 px-4 py-2 text-sm font-body text-white/60 hover:text-white transition-colors"
            >
              {player.name || player.email} · Log out
            </button>
          ) : (
            <button
              onClick={openLogin}
              className="ml-2 px-4 py-2 rounded-full text-sm font-body font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
            >
              Login
            </button>
          )}

          <Link
            to="/game"
            className="ml-3 px-5 py-2 rounded-full font-body font-semibold text-sm text-black tracking-wide transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green focus-visible:ring-offset-2 focus-visible:ring-offset-game-darker"
            style={playNowStyle}
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
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden animate-fade-in"
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
            {loggedIn ? (
              <button
                onClick={() => { logout(); setMobileOpen(false) }}
                className="px-4 py-3 rounded-xl text-left text-sm font-body text-white/60 hover:text-white hover:bg-white/5"
              >
                {player.name || player.email} · Log out
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="px-4 py-3 rounded-xl text-left text-sm font-body font-medium text-white/60 hover:text-white hover:bg-white/5"
              >
                Login
              </button>
            )}
            <Link
              to="/game"
              onClick={() => setMobileOpen(false)}
              className="mt-2 text-center px-5 py-3 rounded-full font-body font-bold text-sm text-black tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-green"
              style={playNowStyle}
            >
              PLAY NOW
            </Link>
          </div>
        </div>
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </header>
  )
}
