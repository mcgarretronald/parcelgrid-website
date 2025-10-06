import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // proxy /api/pickup-points to the external agents API during dev
      '/api/pickup-points': {
        target: 'https://app.escrowcourier.com/user-services/api/agents',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pickup-points/, ''),
        configure: (proxy) => {
          // attach Authorization header if VITE_AGENTS_API_KEY is present
          const token = process.env.VITE_AGENTS_API_KEY || process.env.AGENTS_API_KEY
          if (token) {
            // debug log so devs see whether the token was picked up
            // eslint-disable-next-line no-console
            console.debug('Vite proxy will attach Authorization header for pickup points API')
            proxy.on('proxyReq', (proxyReq: any) => {
              proxyReq.setHeader('Authorization', `Bearer ${token}`)
            })
          } else {
            // eslint-disable-next-line no-console
            console.debug('Vite proxy: no pickup points API token found in environment')
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
