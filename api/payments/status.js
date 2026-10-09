/**
 * Payment status — only allows status checks for a validated tracking / request id shape.
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  isValidTrackingNo,
  safeError,
  fetchWebsiteToken,
  isAllowedBrowserOrigin,
} from '../_lib/security.js';

const STATUS_URL = 'https://app.escrowcourier.com/payment-services/api/payments/status';

function isSafeRequestId(raw) {
  const v = String(raw || '').trim();
  // Safaricom / Daraja style ids — alphanumeric, limited length
  return /^[A-Za-z0-9._-]{8,128}$/.test(v) ? v : null;
}

export default async function handler(req, res) {
  applyCors(req, res, {
    methods: 'POST, OPTIONS',
    headers: 'Accept, Content-Type',
  });

  if (req.method === 'OPTIONS') return handleOptions(req, res);
  if (req.method !== 'POST') {
    return safeError(res, 405, 'METHOD_NOT_ALLOWED', 'POST only');
  }
  if (!isAllowedBrowserOrigin(req)) {
    return safeError(res, 403, 'FORBIDDEN', 'Origin not allowed');
  }

  const limited = rateLimit(req, { key: 'pay-status', limit: 40, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    const out = {};
    const trackingNo = body.trackingNo ? isValidTrackingNo(body.trackingNo) : null;
    const merchantRequestId = body.merchantRequestId
      ? isSafeRequestId(body.merchantRequestId)
      : null;
    const checkoutRequestId = body.checkoutRequestId
      ? isSafeRequestId(body.checkoutRequestId)
      : null;

    if (trackingNo) out.trackingNo = trackingNo;
    if (merchantRequestId) out.merchantRequestId = merchantRequestId;
    if (checkoutRequestId) out.checkoutRequestId = checkoutRequestId;

    if (!out.trackingNo && !out.merchantRequestId && !out.checkoutRequestId) {
      return safeError(
        res,
        400,
        'MISSING_REF',
        'Provide a tracking number or payment request id',
      );
    }

    const token = await fetchWebsiteToken();
    if (!token) return safeError(res, 502, 'AUTH_FAILED', 'Payment service unavailable');

    const upstream = await fetch(STATUS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(out),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return safeError(res, 502, 'BAD_UPSTREAM', 'Payment service returned an invalid response');
    }
    return res.status(upstream.status).json(data);
  } catch {
    return safeError(res, 500, 'PROXY_ERROR', 'Failed to check payment status');
  }
}
