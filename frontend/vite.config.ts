import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-slick', 'slick-carousel'],
  },
  build: {
    commonjsOptions: {
      include: [/react-slick/, /slick-carousel/, /node_modules/],
    },
  },
})
