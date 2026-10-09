/**
 * Production proxy: POST /api/web-chat/session → customer-support web chat session.
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  safeError,
  isAllowedBrowserOrigin,
} from '../_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'POST, OPTIONS',
    headers: 'Accept, Content-Type, X-Chat-Session',
  });

  if (req.method === 'OPTIONS') {
    return handleOptions(req, res, {
      methods: 'POST, OPTIONS',
      headers: 'Accept, Content-Type, X-Chat-Session',
    });
  }
  if (req.method !== 'POST') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'POST only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'chat-session', limit: 10, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const response = await fetch(
      'https://app.escrowcourier.com/customer-support/api/chat/web/session',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Origin: 'https://escrowcourier.com',
          Referer: 'https://escrowcourier.com/',
        },
        body: '{}',
      },
    );
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(
        res,
        502,
        'BAD_UPSTREAM',
        'Chat unavailable. Call or WhatsApp 0745 111 555.',
      );
    }
    return res.status(response.status).json(data);
  } catch {
    return safeError(
      res,
      500,
      'PROXY_ERROR',
      'Chat unavailable. Call or WhatsApp 0745 111 555.',
    );
  }
}
