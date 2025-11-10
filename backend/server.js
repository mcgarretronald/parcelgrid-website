const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Token cache
let cachedToken = null;
let tokenExpiry = null;
let refreshTimer = null;

// API Configuration
const API_CONFIG = {
  loginUrl: 'https://app.escrowcourier.com/auth-services/auth/login',
  agentsUrl: 'https://app.escrowcourier.com/user-services/api/agents',
  pickupPointsUrl: 'https://app.escrowcourier.com/user-services/api/pickup-points',
  // Credentials embedded for automatic auth
  phone: '+254734736444',
  password: '123456',
};

/**
 * Login and get fresh token
 */
async function loginAndGetToken() {
  console.log('🔑 Logging in to get new token...');
  
  try {
    const response = await fetch(API_CONFIG.loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: API_CONFIG.phone,
        password: API_CONFIG.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Extract token from response (adjust property name based on actual API response)
    cachedToken = data.access_token || data.token || data.data?.token || data.data?.access_token;
    
    if (!cachedToken) {
      console.error('Token not found in response:', data);
      throw new Error('No token in response');
    }

    // Calculate expiry (refresh at 80% of lifetime)
    if (data.expires_in) {
      const expiresInMs = data.expires_in * 1000;
      tokenExpiry = Date.now() + (expiresInMs * 0.8);
    } else {
      // Try to decode JWT to get expiration
      const exp = getTokenExpiration(cachedToken);
      if (exp) {
        const timeUntilExpiry = (exp * 1000) - Date.now();
        tokenExpiry = Date.now() + (timeUntilExpiry * 0.8);
      } else {
        // Default: refresh in 50 minutes (assuming 1 hour token lifetime)
        tokenExpiry = Date.now() + (50 * 60 * 1000);
      }
    }

    console.log(`✅ Token obtained. Will refresh at ${new Date(tokenExpiry).toLocaleString()}`);
    
    // Schedule automatic refresh
    scheduleTokenRefresh();
    
    return cachedToken;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}

/**
 * Get token expiration from JWT
 */
function getTokenExpiration(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.exp || null;
  } catch {
    return null;
  }
}

/**
 * Schedule automatic token refresh
 */
function scheduleTokenRefresh() {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  if (!tokenExpiry) return;

  const timeUntilRefresh = tokenExpiry - Date.now();
  
  if (timeUntilRefresh > 0) {
    console.log(`⏰ Token refresh scheduled in ${Math.round(timeUntilRefresh / 60000)} minutes`);
    
    refreshTimer = setTimeout(async () => {
      console.log('🔄 Auto-refreshing token...');
      try {
        await loginAndGetToken();
        console.log('✅ Token auto-refresh successful');
      } catch (error) {
        console.error('❌ Token auto-refresh failed:', error);
        // Retry in 1 minute
        setTimeout(() => loginAndGetToken(), 60000);
      }
    }, timeUntilRefresh);
  }
}

/**
 * Get valid token (cached or fresh)
 */
async function getValidToken() {
  // Check if cached token is still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Token expired or doesn't exist, get new one
  return await loginAndGetToken();
}

/**
 * Proxy endpoint for agents API
 */
app.get('/api/agents', async (req, res) => {
  try {
    const token = await getValidToken();

    const response = await fetch(API_CONFIG.agentsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token might be invalid, clear cache and retry once
      console.log('⚠️  Token rejected, getting fresh token...');
      cachedToken = null;
      tokenExpiry = null;
      
      const newToken = await getValidToken();
      const retryResponse = await fetch(API_CONFIG.agentsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!retryResponse.ok) {
        throw new Error(`API request failed after retry: ${retryResponse.status}`);
      }

      const retryData = await retryResponse.json();
      return res.status(200).json(retryData);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch agents', 
      message: error.message 
    });
  }
});

/**
 * Proxy endpoint for pickup points (if needed)
 */
app.get('/api/pickup-points', async (req, res) => {
  try {
    const token = await getValidToken();

    const response = await fetch(API_CONFIG.agentsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Pickup points error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pickup points',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasToken: !!cachedToken,
    tokenExpiresAt: tokenExpiry ? new Date(tokenExpiry).toISOString() : null,
    nextRefreshIn: tokenExpiry ? Math.round((tokenExpiry - Date.now()) / 60000) + ' minutes' : null
  });
});

// Start server and login immediately
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  
  // Get initial token on startup
  try {
    await getValidToken();
    console.log('✅ Initial authentication successful');
  } catch (error) {
    console.error('❌ Failed to get initial token:', error);
    console.log('⏰ Will retry in 30 seconds...');
    setTimeout(() => getValidToken(), 30000);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, clearing refresh timer');
  if (refreshTimer) clearTimeout(refreshTimer);
  process.exit(0);
});
