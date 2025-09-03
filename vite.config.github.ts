import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-static-files',
      writeBundle() {
        // Copiar service worker
        copyFileSync('service-worker.js', 'dist/service-worker.js')
        // Copiar manifest
        copyFileSync('manifest.json', 'dist/manifest.json')
      }
    }
  ],
  base: '/yamagotchi/',
  build: {
    outDir: 'dist',
  }
})
