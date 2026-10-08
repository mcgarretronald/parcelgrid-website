/**
 * Proxy website prepaid bookings to website-backend (avoids browser CORS).
 * Upstream: POST /website-backend-services/api/booking-agent-orders
 */
const AUTH_URL = 'https://app.escrowcourier.com/website-backend-services/api/auth/token';
const ORDERS_URL =
  'https://app.escrowcourier.com/website-backend-services/api/booking-agent-orders';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, X-Booking-Source',
  );

  if (req.method === 'OPTIONS') return res.status(200).json({});
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const tokenRes = await fetch(AUTH_URL, { headers: { Accept: 'application/json' } });
    if (!tokenRes.ok) {
      return res.status(502).json({ success: false, error: 'AUTH_FAILED' });
    }
    const tokenData = await tokenRes.json();
    const token =
      tokenData.token ||
      tokenData.access_token ||
      tokenData.bearer_token ||
      tokenData.data?.token;
    if (!token) {
      return res.status(502).json({ success: false, error: 'AUTH_FAILED' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const upstream = await fetch(ORDERS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
      return res.status(502).json({
        success: false,
        error: 'BAD_UPSTREAM',
        details: text?.slice?.(0, 500) || text,
      });
    }
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'PROXY_ERROR',
      message: error?.message || 'Failed to create booking',
    });
  }
}
