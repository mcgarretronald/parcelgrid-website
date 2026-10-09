import {
  applyCors,
  handleOptions,
  rateLimit,
  isValidTrackingNo,
  safeError,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, { methods: 'GET, OPTIONS' });

  if (req.method === 'OPTIONS') {
    return handleOptions(req, res, { methods: 'GET, OPTIONS' });
  }
  if (req.method !== 'GET') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'GET only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'track', limit: 60, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const raw =
      (typeof req.query?.tracking === 'string' && req.query.tracking) ||
      (typeof req.query?.trackingNo === 'string' && req.query.trackingNo) ||
      '';

    const pathTail = String(req.url || '')
      .split('?')[0]
      .replace(/^\/api\/track\/?/i, '')
      .replace(/^\/+/g, '');

    const trackingNo = isValidTrackingNo(decodeURIComponent(raw || pathTail || ''));
    if (!trackingNo) {
      return safeError(res, 400, 'INVALID_TRACKING', 'Valid tracking number is required');
    }

    const apiUrl = `https://app.escrowcourier.com/order-services/api/track/${encodeURIComponent(trackingNo)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Origin: 'https://escrowcourier.com',
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(res, 502, 'BAD_UPSTREAM', 'Invalid response from tracking service');
    }

    return res.status(response.status).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Tracking unavailable');
  }
}
