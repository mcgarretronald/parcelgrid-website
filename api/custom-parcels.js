/**
 * Proxy special parcel categories (TVs, cookers, mattresses, …) from pricing-service.
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  safeError,
  fetchWebsiteToken,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

const CUSTOM_URL = 'https://app.escrowcourier.com/pricing-services/api/pricing/custom-parcels';

export default async function handler(req, res) {
  applyCors(req, res, { methods: 'GET, OPTIONS' });

  if (req.method === 'OPTIONS') return handleOptions(req, res, { methods: 'GET, OPTIONS' });
  if (req.method !== 'GET') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'GET only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'custom-parcels', limit: 40, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const token = await fetchWebsiteToken();
    if (!token) return safeError(res, 502, 'AUTH_FAILED', 'Pricing unavailable');

    const upstream = await fetch(CUSTOM_URL, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
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
    return safeError(res, 500, 'PROXY_ERROR', 'Failed to load special parcels');
  }
}
