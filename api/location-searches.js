import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  safeError,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, { methods: 'POST, OPTIONS' });

  if (req.method === 'OPTIONS') return handleOptions(req, res);
  if (req.method !== 'POST') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'POST only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'location-search', limit: 40, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    const searchQuery = String(body.searchQuery || '').trim().slice(0, 200);
    if (!searchQuery) {
      return safeError(res, 400, 'VALIDATION_ERROR', 'searchQuery is required');
    }

    const apiUrl = 'https://app.escrowcourier.com/location-service/api/location-searches';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery,
        notFound: Boolean(body.notFound),
        town: String(body.town || '').slice(0, 120) || undefined,
        county: String(body.county || '').slice(0, 120) || undefined,
        constituency: String(body.constituency || '').slice(0, 120) || undefined,
        address: String(body.address || '').slice(0, 300) || undefined,
        metadata:
          body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(res, 502, 'BAD_UPSTREAM', 'Invalid response from location service');
    }

    return res.status(response.status).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Location search unavailable');
  }
}
