import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      // Proxy all /api/* requests to the local Express backend
      // This allows the backend to handle authentication, token refresh, and API calls
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      // Proxy the escrow pickup-points API for local development.
      // The API's CORS allowlist rejects http://localhost:5174 (it only allows
      // escrowcourier.com + localhost:5173), which silently blocked the pickup
      // station address/phone lookup on /track. Server-side proxying avoids CORS
      // entirely, and we send an allowed Origin so the API doesn't 500.
      '/pickup-points-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/website-backend-services/api/pickup-points',
        headers: { origin: 'https://escrowcourier.com' },
      },
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
