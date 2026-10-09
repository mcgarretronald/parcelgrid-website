/**
 * Website prepaid booking proxy — allowlisted CORS, rate-limited, validated fields.
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  normalizeKenyaPhone,
  clampAmount,
  safeError,
  fetchWebsiteToken,
  isAllowedBrowserOrigin,
} from './_lib/security.js';

const ORDERS_URL =
  'https://app.escrowcourier.com/website-backend-services/api/booking-agent-orders';

function cleanStr(v, max = 200) {
  const s = String(v ?? '').trim();
  if (!s) return null;
  return s.slice(0, max);
}

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'POST, OPTIONS',
    headers: 'Accept, Content-Type, X-Booking-Source',
  });

  if (req.method === 'OPTIONS') return handleOptions(req, res, {
    methods: 'POST, OPTIONS',
    headers: 'Accept, Content-Type, X-Booking-Source',
  });
  if (req.method !== 'POST') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'POST only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'booking', limit: 10, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    const customerPhone = normalizeKenyaPhone(body.customerPhone);
    const vendorPhone = normalizeKenyaPhone(body.vendorPhone || body.senderPhone);
    const shippingCharges = clampAmount(body.shippingCharges);
    const customerName = cleanStr(body.customerName, 120);
    const vendorName = cleanStr(body.vendorName || body.senderName, 120);
    const agentId = Number(body.agentId);
    const originAgentId = Number(body.originAgentId || body.expectedDropoffPoint);

    if (!customerPhone || !vendorPhone) {
      return safeError(res, 400, 'INVALID_PHONE', 'Valid Kenyan mobiles required for sender and receiver');
    }
    if (!customerName || !vendorName) {
      return safeError(res, 400, 'VALIDATION_ERROR', 'Sender and receiver names are required');
    }
    if (!shippingCharges) {
      return safeError(res, 400, 'INVALID_FEE', 'Valid delivery fee is required');
    }
    if (!Number.isFinite(agentId) || agentId <= 0) {
      return safeError(res, 400, 'VALIDATION_ERROR', 'Pickup station is required');
    }

    const token = await fetchWebsiteToken();
    if (!token) return safeError(res, 502, 'AUTH_FAILED', 'Booking service unavailable');

    const payload = {
      ...body,
      customerName,
      vendorName,
      senderName: vendorName,
      customerPhone,
      vendorPhone,
      senderPhone: vendorPhone,
      shippingCharges,
      agentId,
      ...(Number.isFinite(originAgentId) && originAgentId > 0
        ? { originAgentId, expectedDropoffPoint: originAgentId }
        : {}),
      // Force website attribution — never trust client overrides for privilege
      bookingSource: 'website',
      fromWebsite: true,
      isCod: false,
      codAmount: 0,
    };

    const upstream = await fetch(ORDERS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Booking-Source': 'website',
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(res, 502, 'BAD_UPSTREAM', 'Booking service returned an invalid response');
    }
    return res.status(upstream.status).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Failed to create booking');
  }
}
