import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    // Bind to all interfaces so Docker can expose the port
    host: '0.0.0.0',
    // Allow any host, including the random *.trycloudflare.com URLs
    allowedHosts: true,
    proxy: {
      // Inside the Docker network both services run in the same container,
      // so 'localhost' resolves correctly. When switching to a multi-container
      // setup, change the target to 'http://app:3002'.
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
})
