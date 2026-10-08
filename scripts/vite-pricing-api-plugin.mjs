/**
 * Dev-only Vite middleware: serves /api/weight-bands, /api/custom-parcels,
 * /api/calculate-fee with a server-side website-backend token.
 *
 * Browser calls from localhost cannot get that token (CORS) and cannot call
 * pricing-services directly (CORS), so these must be fulfilled in Node.
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
const STANDARD_TIER_ID = 2;

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

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
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

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Accept, Content-Type, Authorization, X-Booking-Source',
          );
          return res.end('{}');
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
            return sendJson(res, 200, { success: true, data: normalizeBands(raw) });
          }

          if (url === '/api/custom-parcels' && req.method === 'GET') {
            const upstream = await fetch(CUSTOM_URL, { headers: auth });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' });
            }
            return sendJson(res, upstream.status, data);
          }

          if (url === '/api/calculate-fee' && req.method === 'POST') {
            const body = await readBody(req);
            const upstream = await fetch(FEE_URL, {
              method: 'POST',
              headers: {
                ...auth,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' });
            }
            return sendJson(res, upstream.status, data);
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
              return sendJson(res, 502, {
                success: false,
                error: 'BAD_UPSTREAM',
                details: text?.slice?.(0, 500) || text,
              });
            }
            return sendJson(res, upstream.status, data);
          }

          if (url === '/api/payments/courier-fee' && req.method === 'POST') {
            const body = await readBody(req);
            const upstream = await fetch(COURIER_FEE_PROMPT_URL, {
              method: 'POST',
              headers: {
                ...auth,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' });
            }
            return sendJson(res, upstream.status, data);
          }

          if (url === '/api/payments/status' && req.method === 'POST') {
            const body = await readBody(req);
            const upstream = await fetch(PAYMENT_STATUS_URL, {
              method: 'POST',
              headers: {
                ...auth,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
            const text = await upstream.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              return sendJson(res, 502, { success: false, error: 'BAD_UPSTREAM' });
            }
            return sendJson(res, upstream.status, data);
          }

          return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED' });
        } catch (error) {
          return sendJson(res, 500, {
            success: false,
            error: 'PROXY_ERROR',
            message: error?.message || 'Pricing proxy failed',
          });
        }
      });
    },
  };
}
