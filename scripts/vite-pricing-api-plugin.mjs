/**
 * Dev-only Vite middleware: serves /api/* proxies with a server-side website-backend token.
 * Mirrors production hardening: validated inputs, order-bound STK amounts, no browser tokens.
 */

const AUTH_URL = 'https://app.escrowcourier.com/website-backend-services/api/auth/token';
const BANDS_URL = 'https://app.escrowcourier.com/pricing-services/api/pricing/weight-bands';
const CUSTOM_URL = 'https://app.escrowcourier.com/pricing-services/api/pricing/custom-parcels';
const FEE_URL =
  'https://app.escrowcourier.com/pricing-services/api/pricing/calculate-delivery-fee';
const BOOKING_ORDERS_URL =
  'https://app.escrowcourier.com/website-backend-services/api/booking-agent-orders';
const COURIER_FEE_PROMPT_URL =
  'https://app.escrowcourier.com/payment-services/api/payments/prompts/courier-fee';
const PAYMENT_STATUS_URL =
  'https://app.escrowcourier.com/payment-services/api/payments/status';
const ORDER_TRACKING_URL =
  'https://app.escrowcourier.com/order-services/api/orders/tracking';
const STANDARD_TIER_ID = 2;

const DEV_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]);

async function getToken() {
  const res = await fetch(AUTH_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`AUTH_${res.status}`);
  const data = await res.json();
  const token =
    data.token || data.access_token || data.bearer_token || data.data?.token;
  if (!token) throw new Error('AUTH_EMPTY');
  return token;
}

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

function normalizeKenyaPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  if (/^254\d{9}$/.test(digits)) return digits;
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  return null;
}

function isValidTrackingNo(raw) {
  const v = String(raw || '').trim().toUpperCase();
  return /^[A-Z]{2,6}#\d{4,8}$/.test(v) ? v : null;
}

async function lookupOrderShippingCharges(trackingNo) {
  try {
    // Public /track omits shippingCharges; authenticated tracking includes them.
    const token = await getToken();
    const res = await fetch(
      `${ORDER_TRACKING_URL}/${encodeURIComponent(trackingNo)}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data && typeof json.data === 'object' ? json.data : json;
    const order = data?.order?.[0] || data?.order || data?.parcel || data;
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

function sendJson(res, status, body, origin) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (origin && DEV_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export function pricingApiPlugin() {
  return {
    name: 'parcelgrid-pricing-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        if (
          url !== '/api/weight-bands' &&
          url !== '/api/custom-parcels' &&
          url !== '/api/calculate-fee' &&
          url !== '/api/booking-agent-orders' &&
          url !== '/api/payments/courier-fee' &&
          url !== '/api/payments/status'
        ) {
          return next();
        }

        const origin = String(req.headers.origin || '');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          if (origin && DEV_ORIGINS.has(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
          }
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Accept, Content-Type, X-Booking-Source',
          );
          return res.end();
        }

        try {
          const token = await getToken();
          const auth = {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          };

          if (url === '/api/weight-bands' && req.method === 'GET') {
            const upstream = await fetch(BANDS_URL, { headers: auth });
            const payload = await upstream.json();
            const raw = Array.isArray(payload) ? payload : payload?.data || [];
            return sendJson(res, 200, { success: true, data: normalizeBands(raw) }, origin);
          }

          if (url === '/api/custom-parcels' && req.method === 'GET') {
            const upstream = await fetch(CUSTOM_URL, { headers: auth });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' }, origin);
            }
            return sendJson(res, upstream.status, data, origin);
          }

          if (url === '/api/calculate-fee' && req.method === 'POST') {
            const body = await readBody(req);
            const upstream = await fetch(FEE_URL, {
              method: 'POST',
              headers: { ...auth, 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' }, origin);
            }
            return sendJson(res, upstream.status, data, origin);
          }

          if (url === '/api/booking-agent-orders' && req.method === 'POST') {
            const body = await readBody(req);
            const upstream = await fetch(BOOKING_ORDERS_URL, {
              method: 'POST',
              headers: {
                ...auth,
                'Content-Type': 'application/json',
                'X-Booking-Source': 'website',
              },
              body: JSON.stringify({
                ...body,
                bookingSource: 'website',
                fromWebsite: true,
              }),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(
                res,
                502,
                { success: false, error: 'BAD_UPSTREAM', message: 'Booking unavailable' },
                origin,
              );
            }
            return sendJson(res, upstream.status, data, origin);
          }

          if (url === '/api/payments/courier-fee' && req.method === 'POST') {
            const body = await readBody(req);
            const trackingNo = isValidTrackingNo(body.trackingNo);
            const phoneNumber = normalizeKenyaPhone(body.phoneNumber);
            if (!trackingNo) {
              return sendJson(
                res,
                400,
                { success: false, error: 'INVALID_TRACKING', message: 'Valid tracking number required' },
                origin,
              );
            }
            if (!phoneNumber) {
              return sendJson(
                res,
                400,
                { success: false, error: 'INVALID_PHONE', message: 'Valid Kenyan mobile required' },
                origin,
              );
            }
            const amount = await lookupOrderShippingCharges(trackingNo);
            if (!amount) {
              return sendJson(
                res,
                404,
                {
                  success: false,
                  error: 'ORDER_NOT_FOUND',
                  message: 'Could not resolve courier fee for this tracking number',
                },
                origin,
              );
            }
            const upstream = await fetch(COURIER_FEE_PROMPT_URL, {
              method: 'POST',
              headers: { ...auth, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phoneNumber,
                amount,
                trackingNo,
                paymentDesc: 'courierFee',
              }),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' }, origin);
            }
            return sendJson(res, upstream.status, data, origin);
          }

          if (url === '/api/payments/status' && req.method === 'POST') {
            const body = await readBody(req);
            const payload = {};
            if (body.merchantRequestId) payload.merchantRequestId = String(body.merchantRequestId);
            if (body.checkoutRequestId) payload.checkoutRequestId = String(body.checkoutRequestId);
            const trackingNo = isValidTrackingNo(body.trackingNo);
            if (trackingNo) payload.trackingNo = trackingNo;
            if (!payload.merchantRequestId && !payload.checkoutRequestId && !payload.trackingNo) {
              return sendJson(
                res,
                400,
                {
                  success: false,
                  error: 'VALIDATION_ERROR',
                  message: 'merchantRequestId, checkoutRequestId, or trackingNo required',
                },
                origin,
              );
            }
            const upstream = await fetch(PAYMENT_STATUS_URL, {
              method: 'POST',
              headers: { ...auth, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' }, origin);
            }
            return sendJson(res, upstream.status, data, origin);
          }

          return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED' }, origin);
        } catch (error) {
          return sendJson(
            res,
            500,
            {
              success: false,
              error: 'PROXY_ERROR',
              message: 'Pricing proxy failed',
            },
            origin,
          );
        }
      });
    },
  };
}
