/**
 * Shared hardening for Netlify/Vercel-style /api proxies.
 * - Strict CORS allowlist
 * - In-memory rate limits (best-effort per instance)
 * - Input validators
 * - Safe error responses (no upstream dumps)
 */

const ALLOWED_ORIGINS = new Set([
  'https://escrowcourier.com',
  'https://www.escrowcourier.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]);

// Extra origins from env (comma-separated), e.g. preview URLs
for (const o of String(process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)) {
  ALLOWED_ORIGINS.add(o);
}

function isDeployPreviewOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return (
      host.endsWith('.netlify.app') ||
      host.endsWith('.vercel.app') ||
      host.endsWith('.onrender.com')
    );
  } catch {
    return false;
  }
}

/** @type {Map<string, { count: number, resetAt: number }>} */
const buckets = new Map();

export function clientIp(req) {
  const xf = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();
  return xf || req.socket?.remoteAddress || req.headers['x-real-ip'] || 'unknown';
}

export function applyCors(req, res, { methods = 'POST, OPTIONS', headers = 'Accept, Content-Type' } = {}) {
  const origin = String(req.headers.origin || '');
  if (origin && (ALLOWED_ORIGINS.has(origin) || isDeployPreviewOrigin(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  // Do not reflect arbitrary origins; never use *
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export function handleOptions(req, res, opts) {
  applyCors(req, res, opts);
  return res.status(204).end();
}

/**
 * @returns {true | { status: number, body: object }} true if allowed
 */
export function rateLimit(req, { key, limit = 30, windowMs = 60_000 } = {}) {
  const ip = clientIp(req);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  let entry = buckets.get(bucketKey);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(bucketKey, entry);
  }
  entry.count += 1;
  if (entry.count > limit) {
    const retry = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return {
      status: 429,
      body: {
        success: false,
        error: 'RATE_LIMITED',
        message: `Too many requests. Try again in ${retry}s.`,
        retryAfterSeconds: retry,
      },
    };
  }
  // Opportunistic cleanup
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }
  return true;
}

export function parseJsonBody(req) {
  try {
    if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
    if (req.body && typeof req.body === 'object') return req.body;
    return {};
  } catch {
    return null;
  }
}

/** Kenyan mobile → 254XXXXXXXXX or null */
export function normalizeKenyaPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  if (/^254\d{9}$/.test(digits)) return digits;
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  return null;
}

/** Tracking like WEB#12345, MARK#12345, ECN#12345 */
export function isValidTrackingNo(raw) {
  const v = String(raw || '').trim().toUpperCase();
  return /^[A-Z]{2,6}#\d{4,8}$/.test(v) ? v : null;
}

export function clampAmount(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  // ParcelGrid courier fees are modest; reject absurd STK amounts
  if (n > 500_000) return null;
  return Math.round(n * 100) / 100;
}

export function safeError(res, status, code, message) {
  return res.status(status).json({
    success: false,
    error: code,
    message: message || 'Request failed',
  });
}

export async function fetchWebsiteToken() {
  const tokenRes = await fetch(
    'https://app.escrowcourier.com/website-backend-services/api/auth/token',
    { headers: { Accept: 'application/json' } },
  );
  if (!tokenRes.ok) return null;
  const tokenData = await tokenRes.json();
  return (
    tokenData.token ||
    tokenData.access_token ||
    tokenData.bearer_token ||
    tokenData.data?.token ||
    null
  );
}

/**
 * Load order shipping charge for a tracking number.
 * Uses authenticated /orders/tracking/:id — public /track omits shippingCharges.
 */
export async function lookupOrderShippingCharges(trackingNo) {
  try {
    const token = await fetchWebsiteToken();
    if (!token) return null;
    const res = await fetch(
      `https://app.escrowcourier.com/order-services/api/orders/tracking/${encodeURIComponent(trackingNo)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data && typeof json.data === 'object' ? json.data : json;
    const order =
      data?.order?.[0] ||
      data?.order ||
      data?.parcel ||
      data;
    const fee =
      order?.shippingCharges ??
      order?.shipping_charges ??
      order?.courierFee ??
      order?.deliveryFee ??
      data?.shippingCharges;
    const n = Number(fee);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function isAllowedBrowserOrigin(req) {
  const origin = String(req.headers.origin || '');
  if (!origin) return true; // same-origin navigations / no Origin
  return ALLOWED_ORIGINS.has(origin) || isDeployPreviewOrigin(origin);
}
