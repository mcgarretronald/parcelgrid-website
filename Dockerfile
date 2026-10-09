# Stage 1: Build the SPA (+ prerendered SEO routes)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: nginx (static + /api reverse-proxy) + Node (Netlify-style /api handlers).
# Pure-Node image failed readiness on DOKS and traffic stayed on the previous
# nginx-only pod — so pickup worked (nginx proxy) while pricing /api 404ed.
FROM node:22-alpine

RUN apk add --no-cache nginx wget \
  && mkdir -p /run/nginx

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/dist ./dist
COPY api ./api
COPY scripts/render-server.mjs ./scripts/render-server.mjs
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
COPY nginx.conf /etc/nginx/http.d/default.conf

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
