import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  safeError,
  isAllowedBrowserOrigin,
} from '../_lib/security.js';

const MAX_CHARS = 1000;

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

  const limited = rateLimit(req, { key: 'chat-msg', limit: 20, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const sessionHeader = req.headers['x-chat-session'];
    if (typeof sessionHeader !== 'string' || sessionHeader.length < 8 || sessionHeader.length > 512) {
      return safeError(res, 401, 'SESSION_REQUIRED', 'Start a chat session first');
    }

    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    const message = String(body.message || '').trim().slice(0, MAX_CHARS);
    if (!message) {
      return safeError(res, 400, 'EMPTY_MESSAGE', 'Message is required');
    }

    const response = await fetch(
      'https://app.escrowcourier.com/customer-support/api/chat/web/message',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Origin: 'https://escrowcourier.com',
          Referer: 'https://escrowcourier.com/',
          'X-Chat-Session': sessionHeader,
        },
        body: JSON.stringify({ message }),
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
