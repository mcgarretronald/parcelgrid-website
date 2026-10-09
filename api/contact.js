import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  normalizeKenyaPhone,
  safeError,
  clientIp,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, { methods: 'POST, OPTIONS', headers: 'Accept, Content-Type' });

  if (req.method === 'OPTIONS') return handleOptions(req, res);
  if (req.method !== 'POST') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'POST only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'contact', limit: 5, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    // Honeypot — bots fill "website"
    if (String(body.website || '').trim()) {
      return res.status(200).json({ success: true, message: 'Thanks' });
    }

    const fullName = String(body.fullName || '').trim().slice(0, 120);
    const phone = normalizeKenyaPhone(body.phone);
    const message = String(body.message || '').trim().slice(0, 2000);
    const senderType = String(body.senderType || '').trim().slice(0, 40);
    const sourcePage = String(body.sourcePage || '').trim().slice(0, 200);

    if (!fullName || !phone || !message) {
      return safeError(res, 400, 'VALIDATION_ERROR', 'Name, phone, and message are required');
    }

    const response = await fetch(
      'https://app.escrowcourier.com/customer-support/api/contact',
      {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          senderType,
          message,
          website: '',
          sourcePage,
          // Server-derived IP only — never trust client-supplied clientIp
          clientIp: clientIp(req),
        }),
      },
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(res, 502, 'BAD_UPSTREAM', 'Contact service unavailable');
    }
    return res.status(response.status).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Could not send your message');
  }
}
