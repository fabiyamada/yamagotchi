import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-sw',
      writeBundle() {
        copyFileSync('service-worker.js', 'dist/service-worker.js')
      }
    }
  ],
  base: '/yamagotchi/',
  build: {
    outDir: 'dist',
  }
})
