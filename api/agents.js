// Netlify/Vercel serverless function to proxy API requests
export default async function handler(req, res) {
  console.log('Handler called with method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', req.headers);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const apiUrl = 'https://app.escrowcourier.com/website-backend-services/api/pickup-points';
    console.log('Making request to:', apiUrl);
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch agents',
        status: response.status 
      });
    }
    
    const data = await response.json();
    console.log('Received data length:', Array.isArray(data) ? data.length : 'not array');
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
