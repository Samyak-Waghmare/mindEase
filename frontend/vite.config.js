import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Forward API calls to the MindEase Express backend during development.
      '/api': 'http://localhost:3002',
    },
  },
})
