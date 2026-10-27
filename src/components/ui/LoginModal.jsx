import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { authService } from '../../services/api'
import { useGameContext } from '../../context/GameContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Google Identity Services script, fetched only the first time a modal opens.
let gisPromise = null
function loadGoogle() {
  gisPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve(window.google)
    s.onerror = () => { gisPromise = null; reject(new Error('Could not load Google sign-in')) }
    document.head.appendChild(s)
  })
  return gisPromise
}

export default function LoginModal({ onClose }) {
  const { player, updatePlayer } = useGameContext()
  const [mode, setMode]         = useState('login') // login | register
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [busy, setBusy]         = useState(false)
  const googleBtnRef = useRef(null)

  const finish = (res) => {
    updatePlayer({ authToken: res.token, email: res.email, name: res.playerName ?? player.name })
    onClose()
  }

  const run = async (fn) => {
    setBusy(true)
    setError(null)
    try { finish(await fn()) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let alive = true
    loadGoogle()
      .then((google) => {
        if (!alive || !googleBtnRef.current) return
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => run(() => authService.google(credential)),
        })
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', width: 280,
        })
      })
      .catch((err) => alive && setError(err.message))
    return () => { alive = false }
  }, []) // render the Google button once per open

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    run(() => (mode === 'login' ? authService.login : authService.register)(email.trim(), password))
  }

  const input = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-game-green/60'

  // Portal to <body>: an animated (transformed) ancestor would otherwise trap the fixed overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-7 animate-pop"
        style={{ background: '#070D13', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-5 text-white/40 hover:text-white text-xl">×</button>

        <h2 className="font-display text-3xl text-white tracking-wide text-center">
          {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </h2>
        <p className="mt-1 text-center text-white/40 text-xs font-body">
          Optional — keeps your name and scores on every device.
        </p>

        {GOOGLE_CLIENT_ID && (
          <>
            <div ref={googleBtnRef} className="mt-6 flex justify-center min-h-[44px]" />
            <div className="my-5 flex items-center gap-3 text-white/25 text-xs font-mono">
              <div className="flex-1 h-px bg-white/10" /> OR <div className="flex-1 h-px bg-white/10" />
            </div>
          </>
        )}

        <form onSubmit={submit} className={`flex flex-col gap-3 ${GOOGLE_CLIENT_ID ? '' : 'mt-6'}`}>
          <input className={input} type="email" required autoComplete="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={input} type="password" required minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Password (min 6 characters)"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-game-red text-xs font-body" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 py-3 rounded-full font-body font-bold text-black tracking-wide transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00C2FF)' }}
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-white/40 text-xs font-body">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button
            className="text-game-green hover:underline"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>,
    document.body
  )
}
