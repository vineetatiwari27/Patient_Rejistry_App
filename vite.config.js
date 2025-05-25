// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'], // Prevents Vite from trying to pre-bundle pglite
  },
  worker: {
    format: 'es', // Ensures Web Workers are bundled as ES modules
  },
})
