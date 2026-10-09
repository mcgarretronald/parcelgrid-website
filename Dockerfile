# Stage 1: Build the SPA (+ prerendered SEO routes)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve static dist + /api proxies (payments, agents, pricing, chat, …)
# Production was nginx-only, so every /api/* returned SPA HTML 404 and the
# browser fell through to CORS-blocked upstream calls.
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY api ./api
COPY scripts/render-server.mjs ./scripts/render-server.mjs

EXPOSE 80

CMD ["node", "scripts/render-server.mjs"]
