/**
 * Link-preview bots (WhatsApp, Facebook, etc.) need absolute og:image URLs and
 * do not execute JS. On tunnels (ngrok) the Host header is the public origin —
 * rewrite share image meta tags to that origin so previews don't fall back to
 * the favicon/logo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.resolve(__dirname, '../index.html');
const SHARE_IMAGE = '/share_banner.jpg';

const BOT_UA =
  /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|Discordbot|TelegramBot|SkypeUriPreview|Applebot|Googlebot|bingbot|Baiduspider/i;

function requestOrigin(req) {
  const xfHost = req.headers['x-forwarded-host'];
  const host = String(xfHost || req.headers.host || '')
    .split(',')[0]
    .trim();
  if (!host) return null;
  const xfProto = req.headers['x-forwarded-proto'];
  const proto = String(xfProto || 'https')
    .split(',')[0]
    .trim();
  return `${proto}://${host}`;
}

function absoluteShareHtml(html, origin) {
  const absolute = `${origin}${SHARE_IMAGE}`;
  return html
    .replace(
      /(<meta[^>]+property=["']og:image["'][^>]+content=["'])[^"']+(["'])/gi,
      `$1${absolute}$2`,
    )
    .replace(
      /(<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["'])[^"']+(["'])/gi,
      `$1${absolute}$2`,
    )
    .replace(
      /(<meta[^>]+name=["']twitter:image["'][^>]+content=["'])[^"']+(["'])/gi,
      `$1${absolute}$2`,
    )
    .replace(
      /(<meta[^>]+content=["'])[^"']+(["'][^>]+property=["']og:image["'])/gi,
      `$1${absolute}$2`,
    )
    .replace(
      /(<meta[^>]+content=["'])[^"']+(["'][^>]+name=["']twitter:image["'])/gi,
      `$1${absolute}$2`,
    );
}

export function ogSharePlugin() {
  return {
    name: 'parcelgrid-og-share',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ua = String(req.headers['user-agent'] || '');
        if (!BOT_UA.test(ua)) return next();

        const urlPath = (req.url || '/').split('?')[0];
        // SPA: treat document navigations as index for crawlers
        const isDoc =
          urlPath === '/' ||
          urlPath === '/index.html' ||
          (!path.extname(urlPath) && !urlPath.startsWith('/api'));
        if (!isDoc) return next();

        const origin = requestOrigin(req);
        if (!origin) return next();

        let html;
        try {
          html = fs.readFileSync(INDEX_PATH, 'utf8');
        } catch {
          return next();
        }

        html = absoluteShareHtml(html, origin);
        // Also force og:url / canonical to this host so previews match the tunnel
        html = html
          .replace(
            /(<meta[^>]+property=["']og:url["'][^>]+content=["'])[^"']+(["'])/gi,
            `$1${origin}/$2`,
          )
          .replace(
            /(<link[^>]+rel=["']canonical["'][^>]+href=["'])[^"']+(["'])/gi,
            `$1${origin}/$2`,
          );

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(html);
      });
    },
  };
}
