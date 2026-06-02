// ─── Pure formatting utilities ────────────────────────────────────────────────
// FIX ARCH-02: Separated from mockData.js — these are stateless, testable helpers.

export function formatSearchVolume(vol) {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`
  if (vol >= 1_000) return `${Math.round(vol / 1_000)}K`
  return vol.toLocaleString()
}

export function getRankColor(rank) {
  if (rank === 1) return '#FFD700'
  if (rank === 2) return '#C0C0C0'
  if (rank === 3) return '#CD7F32'
  return '#6B7280'
}

export function getRankRGB(rank) {
  if (rank === 1) return '255,215,0'
  if (rank === 2) return '192,192,192'
  if (rank === 3) return '205,127,50'
  return '107,114,128'
}
