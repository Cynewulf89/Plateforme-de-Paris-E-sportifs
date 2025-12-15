// API configuration utility
const getApiUrl = () => {
  // Check for Docker environment variable first (from docker-compose.yml)
  const dockerApiUrl = import.meta.env.VITE_API_URL;
  if (dockerApiUrl) {
    return dockerApiUrl;
  }

  // In production, use the production API URL
  if (import.meta.env.PROD) {
    // Check if we have a production API URL configured
    const prodApiUrl = import.meta.env.VITE_PROD_API_URL;
    if (prodApiUrl && prodApiUrl !== 'https://your-backend-url.coolify.io/api') {
      return prodApiUrl;
    }

    // For Coolify deployment: construct backend URL from frontend URL
    const currentHost = window.location.host;
    if (currentHost.includes('31.220.75.92.sslip.io')) {
      // Coolify deployment: backend should be accessible via internal network
      // In Coolify, services communicate via service names or internal URLs
      // For now, try the backend URL pattern used in Coolify
      return 'http://backend:5000/api';
    }
  }

  // Development: use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiUrl();

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API Request:', options.method || 'GET', url);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
};