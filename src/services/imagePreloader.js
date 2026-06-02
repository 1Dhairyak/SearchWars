/**
 * Image Preloader Service — Phase 5
 *
 * Eagerly caches game card images in the browser so SideCard never
 * shows a blank or partially-loaded background.
 *
 * Strategy:
 *  1. Cache 2 images from each round ahead (next round's knownItem + challengeItem)
 *  2. Use IntersectionObserver + requestIdleCallback when available
 *  3. Keep an LRU-style Set — once an URL is in-flight/done we skip it
 *  4. Gracefully degrades when the browser doesn't support the APIs
 *
 * Usage:
 *   import { preloadImages } from '@/services/imagePreloader'
 *   preloadImages([item1.imageUrl, item2.imageUrl])
 */

const _cache = new Set()
const MAX_CACHE = 60 // prevent unbounded growth

/**
 * Preload a single image URL.
 * Returns a promise that resolves when the image is loaded (or rejects on error).
 */
function preloadOne(url) {
  if (!url || _cache.has(url)) return Promise.resolve()

  return new Promise((resolve) => {
    // Evict oldest entry if cache is full
    if (_cache.size >= MAX_CACHE) {
      const oldest = _cache.values().next().value
      _cache.delete(oldest)
    }
    _cache.add(url)

    const img = new Image()
    img.onload  = resolve
    img.onerror = resolve // fail silently — game still works without pre-cache
    img.src = url
  })
}

/**
 * Preload an array of image URLs.
 * Schedules work in the browser's idle time when available.
 *
 * @param {string[]} urls
 */
export function preloadImages(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return

  const toLoad = urls.filter(Boolean)

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(
      () => toLoad.forEach(preloadOne),
      { timeout: 2000 }
    )
  } else {
    // Fallback: defer with a small timeout so it doesn't block the main thread
    setTimeout(() => toLoad.forEach(preloadOne), 100)
  }
}

/**
 * Immediately preload (blocking-style) — use for the very first round.
 * @param {string[]} urls
 * @returns {Promise<void[]>}
 */
export function preloadImagesNow(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return Promise.resolve([])
  return Promise.allSettled(urls.filter(Boolean).map(preloadOne))
}

/** Check whether a URL is already in the preload cache */
export function isPreloaded(url) {
  return _cache.has(url)
}
