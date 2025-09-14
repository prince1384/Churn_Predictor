import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow importing source from sibling apps
      '@login': path.resolve(__dirname, '../LoginPage/src'),
      '@dashboard': path.resolve(__dirname, '../Dashboard/src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to import sibling app code
      allow: ['..']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
