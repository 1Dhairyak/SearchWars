import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Vercel compresses (gzip/brotli) at the edge, so no compression plugin here.
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    // Inline assets < 8KB as base64 data URIs
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        // Hashed names under /assets get the immutable cache header in vercel.json
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
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
})
