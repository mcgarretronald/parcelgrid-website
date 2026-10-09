/**
 * STK courier-fee prompt — amount is taken from the order, never trusted from client.
 */
import {
  applyCors,
  handleOptions,
  rateLimit,
  parseJsonBody,
  normalizeKenyaPhone,
  isValidTrackingNo,
  safeError,
  fetchWebsiteToken,
  lookupOrderShippingCharges,
  isAllowedBrowserOrigin,
} from '../_lib/security.js';

const PROMPT_URL =
  'https://app.escrowcourier.com/payment-services/api/payments/prompts/courier-fee';

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

  const limited = rateLimit(req, { key: 'stk-prompt', limit: 8, windowMs: 60_000 });
  if (limited !== true) {
    res.setHeader('Retry-After', String(limited.body.retryAfterSeconds || 60));
    return res.status(limited.status).json(limited.body);
  }

  try {
    const body = parseJsonBody(req);
    if (!body) return safeError(res, 400, 'INVALID_JSON', 'Invalid request body');

    const trackingNo = isValidTrackingNo(body.trackingNo);
    const phoneNumber = normalizeKenyaPhone(body.phoneNumber);
    if (!trackingNo) {
      return safeError(res, 400, 'INVALID_TRACKING', 'Valid tracking number required');
    }
    if (!phoneNumber) {
      return safeError(res, 400, 'INVALID_PHONE', 'Valid Kenyan mobile required');
    }

    // Bind amount to the order — ignore client amount
    const orderAmount = await lookupOrderShippingCharges(trackingNo);
    if (!orderAmount) {
      return safeError(
        res,
        400,
        'ORDER_AMOUNT_UNKNOWN',
        'Could not verify the courier fee for this tracking number. Confirm the booking first.',
      );
    }

    const token = await fetchWebsiteToken();
    if (!token) return safeError(res, 502, 'AUTH_FAILED', 'Payment service unavailable');

    const upstream = await fetch(PROMPT_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phoneNumber,
        amount: orderAmount,
        trackingNo,
        paymentDesc: 'courierFee',
      }),
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
    return safeError(res, 500, 'PROXY_ERROR', 'Failed to send payment prompt');
  }
}
