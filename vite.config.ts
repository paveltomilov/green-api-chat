import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/green-api': {
        target: 'https://api.green-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/green-api/, ''),
      },
    },
  },
})