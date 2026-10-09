import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// @ts-expect-error local Vite plugin has no type declarations
import { pricingApiPlugin } from "./scripts/vite-pricing-api-plugin.mjs"
// @ts-expect-error local Vite plugin has no type declarations
import { ogSharePlugin } from "./scripts/vite-og-share-plugin.mjs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ogSharePlugin(), pricingApiPlugin()],
  server: {
    port: 5174,
    strictPort: true,
    // ngrok / tunnel hosts (Vite blocks unknown Host headers by default)
    allowedHosts: [
      'reprimand-persuader-saline.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
    ],
    proxy: {
      // Non-pricing /api/* → local Express when present. Pricing routes
      // (/api/weight-bands, /api/custom-parcels, /api/calculate-fee) are handled
      // first by pricingApiPlugin with a server-side auth token.
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
      // Booking-enabled agents (drop-off / send points). Strip Origin —
      // user-service CORS is oriented to server-to-server / allowlisted apps.
      '/dropoff-points-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/user-services/api/agents/allowed-drop-off-points',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
      // Proxy track lookups in local dev — the upstream API only allows
      // escrowcourier.com (and sometimes localhost:5173) in CORS, so browser
      // fetches from 127.0.0.1 / :5174 fail with "Failed to fetch".
      '/track-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) =>
          p.replace(/^\/track-api/, '/order-services/api/track'),
        headers: { origin: 'https://escrowcourier.com' },
      },
      // Contact form -> customer-support-service. Defaults to the live service; set
      // CONTACT_API_TARGET=http://127.0.0.1:3007 to test against a local one.
      '/contact-api': {
        target: process.env.CONTACT_API_TARGET || 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () =>
          process.env.CONTACT_API_TARGET ? '/api/contact' : '/customer-support/api/contact',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
      // Weight bands (same catalog as the ParcelGrid app). Server-side token+fetch
      // via production is awkward in Vite, so we hit pricing-services after the
      // browser obtains a website-backend token (Authorization forwarded).
      '/weight-bands-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/pricing-services/api/pricing/weight-bands',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
      '/custom-parcels-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/pricing-services/api/pricing/custom-parcels',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
      '/calculate-fee-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/pricing-services/api/pricing/calculate-delivery-fee',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
      // Website chat widget -> customer-support web chat.
      // Local: WEB_CHAT_API_TARGET=http://127.0.0.1:<port> (keeps browser Origin so
      //   config/webChat.js devOrigins allow localhost:5174).
      // Default: live gateway; rewrite Origin to escrowcourier.com because production
      //   NODE_ENV only trusts that host (and www).
      '/web-chat-api': {
        target: process.env.WEB_CHAT_API_TARGET || 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => {
          const suffix = p.replace(/^\/web-chat-api/, '');
          if (process.env.WEB_CHAT_API_TARGET) {
            return `/api/chat/web${suffix}`;
          }
          return `/customer-support/api/chat/web${suffix}`;
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            if (!process.env.WEB_CHAT_API_TARGET) {
              proxyReq.setHeader('origin', 'https://escrowcourier.com');
              proxyReq.setHeader('referer', 'https://escrowcourier.com/');
            }
          });
        },
      },
      // Log station-directory misses to location-service (admin not-found analytics).
      // Do not forward browser Origin — location-service CORS only allows
      // server-to-server calls with no Origin (same pattern as user-service).
      '/location-searches-api': {
        target: 'https://app.escrowcourier.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/location-service/api/location-searches',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
    }
  },
  build: {
    // Long-term caching: keep the framework in its own file so page changes don't bust it
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
