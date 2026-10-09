import {
  applyCors,
  handleOptions,
  rateLimit,
  safeError,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

/** Same public agents catalog as /api/agents — kept for existing client paths. */
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

  const limited = rateLimit(req, { key: 'pickup', limit: 60, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const apiUrl = 'https://app.escrowcourier.com/user-services/api/agents/public';
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return safeError(res, response.status, 'UPSTREAM_ERROR', 'Failed to fetch pickup points');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Pickup points unavailable');
  }
}
