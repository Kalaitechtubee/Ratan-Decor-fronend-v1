/**
 * Unified API Request Handler
 * Handles consistent error handling
 * Tokens are now managed via secure httpOnly cookies - no frontend token handling needed
 */

// Use the same BASE_URL pattern as other API files
// VITE_API_URL should already include /api if needed
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Handle API response
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed response data
 */
export const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    // Handle access denied errors specifically
    if (response.status === 403 && data.message?.includes('Access denied')) {
      throw new Error(`Access denied: ${data.message}`);
    }
    
    // Handle 401 errors
    if (response.status === 401) {
      const errorMessage = data.message || 'Unauthorized';
      throw new Error(errorMessage);
    }
    
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

/**
 * Make an authenticated API request
 * Tokens are automatically sent via secure httpOnly cookies
 * @param {string} url - Full URL or endpoint path
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} Parsed response data
 */
export const makeAuthenticatedRequest = async (url, options = {}) => {
  // If URL is already a full URL, use it as-is
  // Otherwise, construct full URL from BASE_URL
  // If BASE_URL doesn't end with /api and url doesn't start with /api, add /api prefix
  let fullUrl;
  if (url.startsWith('http')) {
    fullUrl = url;
  } else {
    const baseUrl = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
    fullUrl = url.startsWith('/api') ? `${BASE_URL}${url}` : `${baseUrl}${url}`;
  }
  
  // Prepare request options
  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Always include cookies (access token and refresh token)
  };

  // Stringify body if it's an object and Content-Type is JSON
  if (requestOptions.body && typeof requestOptions.body === 'object' && !(requestOptions.body instanceof FormData)) {
    // Only stringify if Content-Type is JSON (or not set, defaulting to JSON)
    const contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];
    if (!contentType || contentType.includes('application/json')) {
      requestOptions.body = JSON.stringify(requestOptions.body);
      // Ensure Content-Type is set
      if (!contentType) {
        requestOptions.headers['Content-Type'] = 'application/json';
      }
    }
  }

  const response = await fetch(fullUrl, requestOptions);
  return await handleResponse(response);
};

/**
 * Convenience methods for different HTTP methods
 */
export const apiGet = (url, options = {}) => 
  makeAuthenticatedRequest(url, { ...options, method: 'GET' });

export const apiPost = (url, body, options = {}) => 
  makeAuthenticatedRequest(url, { 
    ...options, 
    method: 'POST',
    body: JSON.stringify(body)
  });

export const apiPut = (url, body, options = {}) => 
  makeAuthenticatedRequest(url, { 
    ...options, 
    method: 'PUT',
    body: JSON.stringify(body)
  });

export const apiPatch = (url, body, options = {}) => 
  makeAuthenticatedRequest(url, { 
    ...options, 
    method: 'PATCH',
    body: JSON.stringify(body)
  });

export const apiDelete = (url, options = {}) => 
  makeAuthenticatedRequest(url, { ...options, method: 'DELETE' });

export default {
  handleResponse,
  makeAuthenticatedRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete
};

