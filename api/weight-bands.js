/**
 * Proxy weight bands from pricing-service (same source as the ParcelGrid app).
 * Uses the website-backend token so the browser never talks to pricing-services directly.
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  safeError,
  fetchWebsiteToken,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

const BANDS_URL = 'https://app.escrowcourier.com/pricing-services/api/pricing/weight-bands';
const STANDARD_TIER_ID = 2;

function formatFixed(n) {
  return Number(n).toFixed(1);
}

function normalizeBands(raw) {
  const list = Array.isArray(raw) ? raw : [];
  const standard = list.filter(
    (b) => Number(b.pricingTierId) === STANDARD_TIER_ID && !b.deletedAt,
  );
  const source = standard.length ? standard : list.filter((b) => !b.deletedAt);
  const byRange = new Map();

  for (const b of source) {
    const min = Number(b.minWeight);
    const max = Number(b.maxWeight);
    if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
    const value = `${formatFixed(min)} - ${formatFixed(max)}`;
    if (byRange.has(value)) continue;
    byRange.set(value, {
      id: Number(b.id) || byRange.size + 1,
      label: `${formatFixed(min)} – ${formatFixed(max)} kg`,
      value,
      minWeight: min,
      maxWeight: max,
    });
  }

  return [...byRange.values()].sort(
    (a, b) => a.minWeight - b.minWeight || a.maxWeight - b.maxWeight,
  );
}

export default async function handler(req, res) {
  applyCors(req, res, { methods: 'GET, OPTIONS' });

  if (req.method === 'OPTIONS') return handleOptions(req, res, { methods: 'GET, OPTIONS' });
  if (req.method !== 'GET') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'GET only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'weight-bands', limit: 60, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const token = await fetchWebsiteToken();
    if (!token) {
      return safeError(res, 502, 'AUTH_FAILED', 'Could not authorize weight-band lookup');
    }

    const bandsRes = await fetch(BANDS_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!bandsRes.ok) {
      return safeError(res, bandsRes.status, 'WEIGHT_BANDS_UPSTREAM', 'Failed to load weight bands');
    }

    const payload = await bandsRes.json();
    const raw = Array.isArray(payload) ? payload : payload?.data || [];
    const data = normalizeBands(raw);
    return res.status(200).json({ success: true, data });
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Failed to load weight bands');
  }
}
