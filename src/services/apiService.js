/**
 * Enhanced API Service with request deduplication and better caching
 */

class ApiService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map(); // Track in-flight requests
    this.baseURL = import.meta.env.VITE_API_URL ;
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  // Get cached data if available and not expired
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.expiry) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  // Cache data with expiry time
  setCachedData(key, data, expiryMinutes = 5) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiryMinutes * 60 * 1000
    });
  }

  // Get authorization headers
  getAuthHeaders() {
    // Check multiple token sources for compatibility
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Sleep function for retry delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate a unique key for the request
  getRequestKey(endpoint, options = {}) {
    const method = options.method || 'GET';
    const params = JSON.stringify(options.params || {});
    return `${method}-${endpoint}-${params}`;
  }

  // Main API request method with retry logic and deduplication
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestKey = this.getRequestKey(endpoint, options);

    // Check cache for GET requests first
    if (options.method === 'GET' || !options.method) {
      const cachedData = this.getCachedData(requestKey);
      if (cachedData) {
        console.log(`[API] Using cached data for: ${endpoint}`);
        return cachedData;
      }

      // Check if there's already a pending request for this endpoint
      if (this.pendingRequests.has(requestKey)) {
        console.log(`[API] Reusing pending request for: ${endpoint}`);
        return this.pendingRequests.get(requestKey);
      }
    }

    // Create the request promise
    const requestPromise = this._executeRequest(url, options, requestKey);

    // Store pending request for GET requests
    if (options.method === 'GET' || !options.method) {
      this.pendingRequests.set(requestKey, requestPromise);
    }

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  // Execute the actual request with retry logic and token refresh
  async _executeRequest(url, options, requestKey) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include', // Always include cookies for authentication
      timeout: 10000,
      ...options
    };

    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[API] Fetching: ${url} (attempt ${attempt})`);
        
        const makeRequest = async () => {
          return await fetch(url, config);
        };

        const response = await makeRequest();

        // Import unified handler for token refresh
        const { handleResponse } = await import('../utils/apiRequestHandler.js');
        const data = await handleResponse(response, async () => {
          // Retry with new token if refresh happened
          return await makeRequest();
        });

        // Handle different HTTP status codes
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || attempt * 2;
          await this.sleep(retryAfter * 1000);
          continue;
        }

        if (!data.success && data.success !== undefined) {
          throw new Error(data.message || 'API request failed');
        }

        // Cache successful GET requests
        if ((options.method === 'GET' || !options.method) && data.success !== false) {
          this.setCachedData(requestKey, data);
        }

        return data;

      } catch (error) {
        lastError = error;

        // Don't retry on certain errors
        if (error.name === 'AbortError' || (error.message.includes('Unauthorized') && attempt > 1)) {
          break;
        }

        if (attempt < this.maxRetries) {
          console.warn(`[API] Retry ${attempt}/${this.maxRetries} for: ${url}`);
          await this.sleep(this.retryDelay * Math.pow(2, attempt - 1));
        }
      }
    }

    console.error(`[API] Failed after ${this.maxRetries} attempts:`, lastError);
    throw lastError;
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('[API] Cache cleared');
  }

  // Clear specific cache key
  clearCacheKey(key) {
    this.cache.delete(key);
  }

  // Get pending requests count (for debugging)
  getPendingRequestsCount() {
    return this.pendingRequests.size;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export convenience methods
export const api = {
  get: (endpoint, options) => apiService.get(endpoint, options),
  post: (endpoint, data, options) => apiService.post(endpoint, data, options),
  put: (endpoint, data, options) => apiService.put(endpoint, data, options),
  delete: (endpoint, options) => apiService.delete(endpoint, options),
  clearCache: () => apiService.clearCache(),
  clearCacheKey: (key) => apiService.clearCacheKey(key),
  getPendingRequestsCount: () => apiService.getPendingRequestsCount()
};