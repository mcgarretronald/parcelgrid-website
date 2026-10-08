/**
 * Proxy weight bands from pricing-service (same source as the ParcelGrid app).
 * Uses the website-backend token so the browser never talks to pricing-services directly.
 */
const AUTH_URL = 'https://app.escrowcourier.com/website-backend-services/api/auth/token';
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).json({});
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const tokenRes = await fetch(AUTH_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!tokenRes.ok) {
      return res.status(502).json({
        success: false,
        error: 'AUTH_FAILED',
        message: 'Could not authorize weight-band lookup',
      });
    }
    const tokenData = await tokenRes.json();
    const token =
      tokenData.token ||
      tokenData.access_token ||
      tokenData.bearer_token ||
      tokenData.data?.token;
    if (!token) {
      return res.status(502).json({
        success: false,
        error: 'AUTH_FAILED',
        message: 'No auth token for weight bands',
      });
    }

    const bandsRes = await fetch(BANDS_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!bandsRes.ok) {
      const details = await bandsRes.text();
      return res.status(bandsRes.status).json({
        success: false,
        error: 'WEIGHT_BANDS_UPSTREAM',
        details,
      });
    }

    const payload = await bandsRes.json();
    const raw = Array.isArray(payload) ? payload : payload?.data || [];
    const data = normalizeBands(raw);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'PROXY_ERROR',
      message: error?.message || 'Failed to load weight bands',
    });
  }
}
