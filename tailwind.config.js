/** @type {import('tailwindcss').Config} */
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
        'game-surface': 'rgba(255,255,255,0.04)',
        'game-border': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glow-green': 'radial-gradient(ellipse at center, rgba(0,255,135,0.15) 0%, transparent 70%)',
        'glow-red': 'radial-gradient(ellipse at center, rgba(255,60,60,0.15) 0%, transparent 70%)',
        'glow-gold': 'radial-gradient(ellipse at center, rgba(255,215,0,0.12) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'particle': 'particle 8s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'score-pop': 'scorePop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,255,135,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(0,255,135,0.8), 0 0 100px rgba(0,255,135,0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scorePop: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.4)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
