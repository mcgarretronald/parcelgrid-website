export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  console.log('Pickup points handler called with method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    const apiUrl = 'https://app.escrowcourier.com/user-services/api/agents';
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
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch pickup points',
        status: response.status,
        details: errorText
      });
    }
    
    const data = await response.json();
    console.log('Successfully fetched data, length:', Array.isArray(data) ? data.length : 'not array');
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
