import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/buses': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/schedules': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/bookings': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/provider': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/customer': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
