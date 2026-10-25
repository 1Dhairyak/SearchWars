/**
 * Warms the browser cache for the next round's card images so SideCard
 * never shows a blank background. Runs in idle time; failures are ignored.
 */

const _cache = new Set()
const MAX_CACHE = 60 // prevent unbounded growth

function preloadOne(url) {
  if (!url || _cache.has(url)) return
  if (_cache.size >= MAX_CACHE) _cache.delete(_cache.values().next().value)
  _cache.add(url)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

export function preloadImages(urls) {
  const toLoad = (urls || []).filter(Boolean)
  if (toLoad.length === 0) return
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => toLoad.forEach(preloadOne), { timeout: 2000 })
  } else {
    setTimeout(() => toLoad.forEach(preloadOne), 100)
  }
}
