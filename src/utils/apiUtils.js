
import { handleResponse as handleTokenResponse } from './apiRequestHandler.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Token management removed - tokens are now in secure httpOnly cookies
export const getAuthToken = () => null; // Tokens are in cookies, not accessible to JS
export const setAuthToken = () => {}; // No-op - tokens managed by backend
export const clearAuthToken = () => {}; // No-op - tokens cleared by backend on logout

export const getAuthHeaders = (additionalHeaders = {}) => {
  // No Authorization header needed - tokens are in secure cookies
  return {
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
};


export const handleApiResponse = async (response, retryRequest = null) => {
  try {

    return await handleTokenResponse(response, retryRequest);
  } catch (error) {

    if (error.status === 401 && !retryRequest) {

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw error;
  }
};


export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = 30000,
    ...otherOptions
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const requestOptions = {
    method,
    headers: getAuthHeaders(headers),
    credentials: 'include',
    ...otherOptions
  };

 
  if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }


  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const makeRequest = async () => {
      return await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });
    };

    const response = await makeRequest();
    clearTimeout(timeoutId);
    
    return await handleApiResponse(response, async () => {

      return await makeRequest();
    });
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw error;
  }
};


export const apiGet = (endpoint, options = {}) => 
  apiRequest(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint, body, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'POST', body });

export const apiPut = (endpoint, body, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = (endpoint, body, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = (endpoint, options = {}) =>
  apiRequest(endpoint, { ...options, method: 'DELETE' });


export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  

  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  // No Authorization header needed - tokens are in secure cookies
  // Don't set Content-Type for FormData - browser will set it with boundary

  return apiRequest(endpoint, {
    method: 'POST',
    body: formData,
    headers: {} // Let browser set Content-Type for FormData
  });
};


export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};


export const buildApiUrl = (endpoint, params = {}) => {
  const baseUrl = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const queryString = buildQueryParams(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};


export const validateResponse = (response, requiredFields = []) => {
  if (!response) {
    throw new Error('No response received from server');
  }
  
  if (response.success === false) {
    throw new Error(response.message || 'Request failed');
  }
  
  requiredFields.forEach(field => {
    if (response[field] === undefined) {
      throw new Error(`Missing required field in response: ${field}`);
    }
  });
  
  return response;
};


export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      if (error.status && [400, 401, 403, 404, 422].includes(error.status)) {
        throw error;
      }
      
      if (attempt < maxRetries) {

        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  throw lastError;
};


export const logApiCall = (endpoint, options, response) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`API Call: ${options?.method || 'GET'} ${endpoint}`);
    console.log('Options:', options);
    console.log('Response:', response);
    console.groupEnd();
  }
};

export default {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  uploadFile,
  buildQueryParams,
  buildApiUrl,
  validateResponse,
  retryRequest,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getAuthHeaders,
  handleApiResponse,
  logApiCall
};