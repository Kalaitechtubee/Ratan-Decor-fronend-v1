import { handleResponse, makeAuthenticatedRequest } from '../../../utils/apiRequestHandler.js';

const BASE_URL = import.meta.env.VITE_API_URL;

// Cache for user types with timestamp
let userTypesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Track pending requests to prevent duplicates
let pendingRequest = null;

// Check if cache is valid
const isCacheValid = () => {
  if (!userTypesCache || !cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_DURATION;
};

// User Type API Calls
const UserTypeAPI = {
  // Get all active user types (Public) - With caching and deduplication
  getAllUserTypes: async (forceRefresh = false) => {
    try {
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && isCacheValid()) {
        console.log('[UserTypeAPI] Using cached user types');
        return { data: userTypesCache, cached: true };
      }

      // If there's already a pending request, wait for it
      if (pendingRequest) {
        console.log('[UserTypeAPI] Reusing pending request for user types');
        return pendingRequest;
      }

      // Create new request
      console.log('[UserTypeAPI] Fetching user types from API');
      pendingRequest = (async () => {
        const makeRequest = async () => {
          return await fetch(`${BASE_URL}/user-types`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for refresh token
          });
        };

        const response = await makeRequest();
        const data = await handleResponse(response, async () => {
          // Retry with new token if refresh happened
          return await makeRequest();
        });

        // Cache the results
        userTypesCache = data.data;
        cacheTimestamp = Date.now();
        console.log('[UserTypeAPI] User types cached successfully');
        return { data: data.data, cached: false };
      })()
        .catch(error => {
          // If request fails and we have cached data, return it
          if (userTypesCache) {
            console.warn('[UserTypeAPI] Request failed, using stale cache');
            return { data: userTypesCache, cached: true, stale: true };
          }
          throw error;
        })
        .finally(() => {
          // Clear pending request
          pendingRequest = null;
        });

      return pendingRequest;
    } catch (error) {
      throw new Error(`Failed to fetch user types: ${error.message}`);
    }
  },

  // Get user type by ID (Public)
  getUserTypeById: async (id) => {
    try {
      // Check cache first
      if (isCacheValid() && userTypesCache) {
        const cachedType = userTypesCache.find(type => type.id === id);
        if (cachedType) {
          console.log('[UserTypeAPI] Using cached user type by ID');
          return { data: cachedType, cached: true };
        }
      }

      const makeRequest = async () => {
        return await fetch(`${BASE_URL}/user-types/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for refresh token
        });
      };

      const response = await makeRequest();
      const data = await handleResponse(response, async () => {
        // Retry with new token if refresh happened
        return await makeRequest();
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch user type ${id}: ${error.message}`);
    }
  },

  // Create new user type (Protected - Admin/Manager)
  createUserType: async (userTypeData) => {
    try {
      const result = await makeAuthenticatedRequest('/user-types', {
        method: 'POST',
        body: userTypeData
      });
      
      // Invalidate cache after creation
      userTypesCache = null;
      cacheTimestamp = null;
      console.log('[UserTypeAPI] Cache invalidated after create');
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create user type: ${error.message}`);
    }
  },

  // Update user type (Protected - Admin/Manager)
  updateUserType: async (id, userTypeData) => {
    try {
      const result = await makeAuthenticatedRequest(`/user-types/${id}`, {
        method: 'PUT',
        body: userTypeData
      });
      
      // Invalidate cache after update
      userTypesCache = null;
      cacheTimestamp = null;
      console.log('[UserTypeAPI] Cache invalidated after update');
      
      return result;
    } catch (error) {
      throw new Error(`Failed to update user type ${id}: ${error.message}`);
    }
  },

  // Delete user type (Protected - Admin only)
  deleteUserType: async (id) => {
    try {
      const result = await makeAuthenticatedRequest(`/user-types/${id}`, { method: 'DELETE' });
      
      // Invalidate cache after deletion
      userTypesCache = null;
      cacheTimestamp = null;
      console.log('[UserTypeAPI] Cache invalidated after delete');
      
      return result;
    } catch (error) {
      throw new Error(`Failed to delete user type ${id}: ${error.message}`);
    }
  },

  // Utility method to clear cache manually
  clearCache: () => {
    userTypesCache = null;
    cacheTimestamp = null;
    pendingRequest = null;
    console.log('[UserTypeAPI] Cache cleared manually');
  },

  // Utility method to check cache status
  getCacheStatus: () => ({
    hasCachedData: !!userTypesCache,
    cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    isValid: isCacheValid(),
    hasPendingRequest: !!pendingRequest,
  }),
};

export { UserTypeAPI };