export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  console.log('Booking agent orders handler called with method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch the auth token from the backend server
    let authToken = '';
    
    try {
      console.log('Fetching auth token from backend server...');
      const authResponse = await fetch('https://app.escrowcourier.com/website-backend-services/api/auth/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        authToken = authData.token || authData.access_token || authData.bearer_token || authData.data?.token;
        console.log('Auth token fetched successfully from backend');
      } else {
        console.error('Failed to fetch auth token from backend:', authResponse.status);
      }
    } catch (authError) {
      console.error('Error fetching auth token from backend:', authError.message);
    }
    
    const apiUrl = 'https://app.escrowcourier.com/website-backend-services/api/bookingAgentOrders';
    console.log('Making request to:', apiUrl);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authToken ? `Bearer ${authToken}` : '',
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to create booking agent order',
        status: response.status,
        details: errorText
      });
    }
    
    const data = await response.json();
    console.log('Successfully created order:', data);
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
