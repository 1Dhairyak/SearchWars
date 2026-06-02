/**
 * Vite Config — Phase 5
 *
 * Changes from Phase 4:
 *  - vite-plugin-compression: gzip + brotli for all text assets (> 10KB)
 *  - rollup-plugin-visualizer: opt-in (ANALYZE=true npm run build:analyze)
 *  - howler added to vendor chunk for long-term caching
 *  - assetsInlineLimit 8KB — fewer round-trips for small assets
 *  - sourcemap: 'hidden' in production — error monitoring without exposing source
 *  - target: 'es2020' — safe for all modern browsers
 *  - chunkFileNames / assetFileNames — deterministic paths for CDN caching
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const isProduction  = mode === 'production'
  const shouldAnalyze = process.env.ANALYZE === 'true'

  return {
    plugins: [
      react(),

      // Gzip — served as .gz pre-compressed by CDNs/servers that support it
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false,
        verbose: false,
      }),

      // Brotli — better ratio; supported by all modern browsers + CDNs
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
        verbose: false,
      }),

      // Bundle analysis — only when explicitly requested
      ...(shouldAnalyze
        ? [
            visualizer({
              open: false,
              filename: 'dist/stats.html',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },

    build: {
      // Hidden sourcemaps: for error tracking tools; not served to users
      sourcemap: isProduction ? 'hidden' : true,

      // Modern JS output — removes legacy polyfill bloat
      target: 'es2020',

      // Inline assets < 8KB as base64 data URIs
      assetsInlineLimit: 8192,

      // Warn at 600KB per chunk
      chunkSizeWarningLimit: 600,

      rollupOptions: {
        output: {
          // Chunk split by update frequency — stable deps cache longer
          manualChunks: {
            'vendor-react':  ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-http':   ['axios', 'clsx'],
            'vendor-sound':  ['howler'],
          },
          // Deterministic file names for CDN/browser caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },

      minify: 'esbuild',
    },

    // Preview server
    preview: {
      port: 4173,
      strictPort: false,
    },

    // Dev server with API proxy
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
