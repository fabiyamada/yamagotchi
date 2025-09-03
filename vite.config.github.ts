import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/yamagotchi/', // subcarpeta del repo
  plugins: [react()],
});
