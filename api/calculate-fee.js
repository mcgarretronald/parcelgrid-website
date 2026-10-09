/**
 * Proxy delivery-fee calculation to pricing-service (weight bands + special sub-items).
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  safeError,
  fetchWebsiteToken,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

const FEE_URL =
  'https://app.escrowcourier.com/pricing-services/api/pricing/calculate-delivery-fee';

export default async function handler(req, res) {
  applyCors(req, res, { methods: 'POST, OPTIONS' });

  if (req.method === 'OPTIONS') return handleOptions(req, res);
  if (req.method !== 'POST') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'POST only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'calc-fee', limit: 40, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    const token = await fetchWebsiteToken();
    if (!token) return safeError(res, 502, 'AUTH_FAILED', 'Pricing unavailable');

    const upstream = await fetch(FEE_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(res, 502, 'BAD_UPSTREAM', 'Invalid response from pricing');
    }
    return res.status(upstream.status).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Failed to calculate fee');
  }
}
