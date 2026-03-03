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
    {
      name: 'log-plus-cache-bust',
      configureServer(server) {
        server.middlewares.use((req: any, res, next) => {
          const url = req.url || '';
          if (url.includes('node_modules')) return next();

          console.log(`[Vite-IN] ${req.method} ${url}`);

          const originalSetHeader = res.setHeader;
          res.setHeader = function (name: string, value: any) {
            const lowName = name.toLowerCase();

            // Force no-cache for diagnostic phase
            if (lowName === 'cache-control') {
              value = 'no-cache, no-store, must-revalidate';
            }
            if (lowName === 'pragma') value = 'no-cache';
            if (lowName === 'expires') value = '0';

            const path = url.split('?')[0];
            const isJS = path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js') || path.endsWith('.jsx') || url.includes('@vite/client') || url.includes('@react-refresh');

            if (lowName === 'content-type' && isJS) {
              // iOS can be extremely picky about MIME and charset for modules
              value = 'application/javascript; charset=utf-8';
              console.log(`[Vite-MW] FORCED: ${url} -> ${value}`);
            }
            if (lowName === 'content-type' && url === '/') {
              value = 'text/html; charset=utf-8';
            }

            console.log(`[Vite-OUT] ${url} | ${name}: ${value}`);
            return originalSetHeader.apply(this, [name, value]);
          };

          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('X-TMA-Debug', 'true');
          next();
        });
      }
    },
    react(),
    tailwindcss(),
    /* {
      name: 'disable-rocket-loader',
      transformIndexHtml(html) {
        return html.replace(/<script/g, '<script data-cfasync="false"');
      }
    } */
  ],
  server: {
    port: 5174,
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: {
      clientPort: 443,
    },
    proxy: {
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
