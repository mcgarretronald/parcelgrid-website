/**
 * Proxy delivery-fee calculation to pricing-service (weight bands + special sub-items).
 */
const AUTH_URL = 'https://app.escrowcourier.com/website-backend-services/api/auth/token';
const FEE_URL =
  'https://app.escrowcourier.com/pricing-services/api/pricing/calculate-delivery-fee';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).json({});
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
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

    const upstream = await fetch(FEE_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, error: 'BAD_UPSTREAM', details: text });
    }
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'PROXY_ERROR',
      message: error?.message || 'Failed to calculate fee',
    });
  }
}
