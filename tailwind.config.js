/** @type {import('tailwindcss').Config} */
const easeOut = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const spring  = 'cubic-bezier(0.34, 1.56, 0.64, 1)' // overshoot, feels like a spring

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'game-green': '#00FF87',
        'game-red': '#FF3C3C',
        'game-gold': '#FFD700',
        'game-blue': '#00C2FF',
        'game-dark': '#050A0F',
        'game-darker': '#020508',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // All animations touch only transform/opacity so phones run them on the GPU.
      // `both` fill keeps the start frame during animation-delay (for staggers).
      animation: {
        // opacity only: a lingering transform would make the page the containing block
        // for position:fixed children (the navbar would scroll away)
        'page':           `fadeIn 0.4s ${easeOut} both`,
        'fade-in':        `fadeIn 0.4s ${easeOut} both`,
        'fade-in-up':     `fadeInUp 0.6s ${easeOut} both`,
        'pop':            `pop 0.5s ${spring} both`,
        'slide-in-right': `slideInRight 0.5s ${easeOut} both`,
        'shake':          'shake 0.5s ease-in-out',
        'score-bump':     'scoreBump 0.4s ease-out',
        'score-float':    'scoreFloat 0.8s ease-out forwards', // = the pause before the next round
        'wiggle':         'wiggle 4s ease-in-out infinite',
        'spin-6':         'spin 6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          from: { opacity: '0', transform: 'scale(0.6)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%, 45%': { transform: 'translateX(-8px)' },
          '30%, 60%': { transform: 'translateX(8px)' },
          '75%':      { transform: 'translateX(-4px)' },
          '90%':      { transform: 'translateX(4px)' },
        },
        scoreBump: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%':      { transform: 'scale(1.4)' },
        },
        // includes translateX(-50%) because the popup is centred with a transform
        scoreFloat: {
          '0%':   { opacity: '1', transform: 'translate(-50%, 0) scale(0.5)' },
          '40%':  { opacity: '1', transform: 'translate(-50%, -50px) scale(1.5)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -120px) scale(1.2)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '33%':      { transform: 'rotate(10deg)' },
          '66%':      { transform: 'rotate(-10deg)' },
        },
      },
    },
  },
  plugins: [],
}
