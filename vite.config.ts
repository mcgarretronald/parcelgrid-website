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
      // Proxy the public agents API for local development. The API's CORS
      // allowlist only reflects `http://localhost:5173`/`:3000`, which silently
      // blocked the agent address/phone lookup on this dev server (port 5174).
      // Server-side proxying avoids CORS entirely; we send no Origin header, which
      // the API serves fine (it returns 500 for a non-allowlisted Origin).
      '/pickup-points-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/user-services/api/agents/public',
      },
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
