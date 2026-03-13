/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // @ts-expect-error: test is injected by vitest Plugin
  test: {
    environment: 'jsdom',
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'log-request',
      configureServer(server) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        server.middlewares.use((req: any, _res, next) => {
          // @ts-ignore
          console.log(`[Vite] ${new Date().toISOString()} | ${req.method} ${req.url} | UA: ${req.headers['user-agent']}`);
          next();
        });
      }
    }
  ],
  server: {
    port: 5174,
    // Bind to all interfaces so Docker can expose the port
    host: '0.0.0.0',
    // Allow any host, including the random *.trycloudflare.com URLs
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
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
