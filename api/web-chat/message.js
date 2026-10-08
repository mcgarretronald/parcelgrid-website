/**
 * Production proxy: POST /api/web-chat/message → customer-support web chat message.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, X-Chat-Session');

  if (req.method === 'OPTIONS') return res.status(200).json({});
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED', message: 'POST only' });
  }

  try {
    const sessionHeader = req.headers['x-chat-session'];
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const response = await fetch(
      'https://app.escrowcourier.com/customer-support/api/chat/web/message',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Origin: 'https://escrowcourier.com',
          Referer: 'https://escrowcourier.com/',
          ...(typeof sessionHeader === 'string' ? { 'X-Chat-Session': sessionHeader } : {}),
        },
        body: JSON.stringify({ message: body.message }),
      },
    );
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        error: 'BAD_UPSTREAM',
        message: 'Invalid response from chat service. Call or WhatsApp 0745 111 555.',
      });
    }
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'PROXY_ERROR',
      message: error?.message || 'Chat unavailable. Call or WhatsApp 0745 111 555.',
    });
  }
}
