import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// FIX PERF-01: ParticleField now respects reduced-motion and returns null
// so AnimatePresence doesn't keep it running during page exit transitions.
// FIX MOBILE-04: Canvas scaled by devicePixelRatio for crisp retina rendering.
// FIX COMP-03: isAlive guard prevents draw() after unmount; cleanup is thorough.
export default function ParticleField({ count = 60, color = '#00FF87' }) {
  const canvasRef = useRef(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    function setSize() {
      const W = window.innerWidth
      const H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.scale(dpr, dpr)
      return { W, H }
    }

    let { W, H } = setSize()

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
    }))

    let rafId
    let isAlive = true

    function draw() {
      if (!isAlive) return
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
      }
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    draw()

    function handleResize() {
      ;({ W, H } = setSize())
      for (const p of particles) {
        p.x = Math.random() * W
        p.y = Math.random() * H
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      isAlive = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [count, color, shouldReduce])

  if (shouldReduce) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    />
  )
}
