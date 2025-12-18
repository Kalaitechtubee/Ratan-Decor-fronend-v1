// api/products.js (corrected and production-ready)
import api from '../../../services/axios';

export const getProducts = async ({
  page = 1,
  limit = 8,
  userType,
  userRole,
  categoryId,
  minPrice,
  maxPrice,
  search,
  sortBy = 'featured',
  isActive = true,
  designNumber,
  minDesignNumber,
  maxDesignNumber
}) => {
  const params = { page, limit };
 
  // Add optional parameters only if they have meaningful values
  if (userType && userType !== '') params.userType = userType;
  if (userRole && userRole !== '') params.userRole = userRole;
  if (categoryId && categoryId !== '' && categoryId !== 'all') params.categoryId = categoryId;
  
  // FIXED: Ensure price values are properly sent as numbers
  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    const minPriceNum = Number(minPrice);
    if (!isNaN(minPriceNum) && minPriceNum > 0) {
      params.minPrice = minPriceNum;
    }
  }
  
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    const maxPriceNum = Number(maxPrice);
    if (!isNaN(maxPriceNum) && maxPriceNum > 0 && maxPriceNum !== 50000) {
      params.maxPrice = maxPriceNum;
    }
  }
  
  if (search && search.trim() !== '') params.search = search.trim();
  if (sortBy && sortBy !== 'featured') params.sortBy = sortBy;
  if (isActive !== undefined) params.isActive = isActive;
  if (designNumber && designNumber.trim() !== '') params.designNumber = designNumber.trim();
  if (minDesignNumber && minDesignNumber.trim() !== '') params.minDesignNumber = minDesignNumber.trim();
  if (maxDesignNumber && maxDesignNumber.trim() !== '') params.maxDesignNumber = maxDesignNumber.trim();
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('Fetching products with params:', params);
  }
  
  try {
    const response = await api.get('/products', { params });
   
    if (response.data) {
      // Debug logging in development
      if (import.meta.env.DEV && response.data.appliedPriceRange) {
        console.log('Price filtering applied:', response.data.appliedPriceRange);
      }
      
      return {
        products: response.data.products || [],
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || page,
        count: response.data.count || 0,
        totalCount: response.data.totalCount || response.data.count || 0,
        activeCount: response.data.activeCount || response.data.count || 0,
        inactiveCount: response.data.inactiveCount || 0,
        userType: response.data.userType || userType,
        userRole: response.data.userRole || userRole,
        isActiveFilter: response.data.isActiveFilter,
        designNumberFilter: response.data.designNumberFilter || designNumber,
        minDesignNumberFilter: response.data.minDesignNumberFilter || minDesignNumber,
        maxDesignNumberFilter: response.data.maxDesignNumberFilter || maxDesignNumber,
        appliedPriceRange: response.data.appliedPriceRange
      };
    } else {
      return {
        products: [],
        totalPages: 1,
        currentPage: page,
        count: 0,
        totalCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        userType,
        userRole,
        designNumberFilter: designNumber,
        minDesignNumberFilter: minDesignNumber,
        maxDesignNumberFilter: maxDesignNumber
      };
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const getProductById = async ({ id, userRole, userType }) => {
  try {
    const params = {};
    if (userRole && userRole !== '') params.userRole = userRole;
    if (userType && userType !== '') params.userType = userType;
   
    const response = await api.get(`/products/${id}`, { params });
   
    // Handle different response formats
    if (response.data.product) {
      return { product: response.data.product };
    } else if (response.data.success && response.data.data) {
      return { product: response.data.data };
    } else {
      return { product: response.data };
    }
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Product not found');
    } else if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch product';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const searchProductsByName = async ({ name, userType, page = 1, limit = 20 }) => {
  try {
    const params = { name, page, limit };
    if (userType && userType !== '') params.userType = userType;
   
    const response = await api.get('/products/search', { params });
   
    return {
      products: response.data.products || [],
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
      count: response.data.count || 0,
      userType: response.data.userType,
      userRole: response.data.userRole
    };
  } catch (error) {
    throw error;
  }
};

export const getProductByName = async ({ name, userType }) => {
  try {
    const params = {};
    if (userType && userType !== '') params.userType = userType;
   
    const response = await api.get(`/products/name/${encodeURIComponent(name)}`, { params });
   
    return {
      product: response.data.product || response.data,
      userType: response.data.userType,
      userRole: response.data.userRole
    };
  } catch (error) {
    throw error;
  }
};

// Category-specific API functions
export const getCategories = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      parentId = null,
      sortBy = 'name',
      sortOrder = 'ASC',
      includeSubcategories = true
    } = filters;
    
    let response;
    
    // If parentId provided, use subcategories endpoint
    if (parentId !== null && parentId !== undefined) {
      const parentPath = parentId === null ? 'null' : parentId;
      const params = { page, limit };
      if (search) params.q = search; // Note: subcategories doesn't have search, but searchCategories does
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      response = await api.get(`/categories/subcategories/${parentPath}`, { params });
      
      if (response.data.success) {
        return {
          success: true,
          categories: response.data.subcategories || [],
          pagination: response.data.pagination || {},
          totalCategories: response.data.pagination?.totalItems || 0
        };
      }
    } else {
      // For root/tree, use main endpoint (no pagination)
      const params = {};
      if (search && search.trim() !== '') {
        params.q = search.trim();
        response = await api.get('/categories/search', { params });
        if (response.data.success) {
          return {
            success: true,
            categories: response.data.categories || [],
            totalResults: response.data.totalResults || 0,
            query: response.data.query
          };
        }
      } else {
        response = await api.get('/categories');
        if (response.data.success) {
          return {
            success: true,
            categories: response.data.categories || [],
            tree: response.data.categories || null,
            totalCategories: response.data.totalCategories || 0
          };
        }
      }
    }
    
    // Fallback
    return {
      success: true,
      categories: response.data.categories || [],
      totalCategories: (response.data.categories || []).length
    };
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
   
    if (response.data.success && response.data.category) {
      return response.data.category;
    } else {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getSubCategories = async (parentId, filters = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      sortBy = 'name',
      sortOrder = 'ASC'
    } = filters;
    const parentPath = parentId === null ? 'null' : parentId;
    const params = {
      page: page.toString(),
      limit: limit.toString()
    };
    if (search) params.q = search; // Align with backend search param
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    
    const response = await api.get(`/categories/subcategories/${parentPath}`, { params });
   
    return {
      success: true,
      subcategories: response.data.subcategories || [],
      pagination: response.data.pagination || {},
      filters: response.data.filters || {}
    };
  } catch (error) {
    throw error;
  }
};

export const searchCategories = async (query) => {
  try {
    const response = await api.get('/categories/search', { params: { q: query } });
   
    return {
      results: response.data.categories || [], // Align with backend response
      count: response.data.totalResults || 0,
      query: response.data.query
    };
  } catch (error) {
    throw error;
  }
};

// Product ratings API
export const getProductRatings = async (productId, page = 1, limit = 10) => {
  try {
    const params = { page, limit };
    const response = await api.get(`/products/${productId}/ratings`, { params });
   
    return {
      ratings: response.data.ratings || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      totalPages: response.data.totalPages || 1
    };
  } catch (error) {
    throw error;
  }
};

export const addProductRating = async (productId, { rating, review }) => {
  try {
    const response = await api.post(`/products/${productId}/rate`, { rating, review });
    return {
      rating: response.data.rating,
      productStats: response.data.productStats,
      message: response.data.message
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to rate this product');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid rating data');
    } else {
      throw new Error('Failed to add rating. Please try again.');
    }
  }
};

// User Role Management API functions (unchanged, logs removed)
export const getAllRoles = async () => {
  try {
    const response = await api.get('/roles');
    if (response.data.success) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    // Handle access denied error gracefully for customer role
    if (error.response?.status === 403 && error.response.data?.message?.includes('Access denied')) {
      return []; // Return empty array instead of throwing error
    }
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const getUsersByRole = async ({ role, status, page = 1, limit = 10, search }) => {
  try {
    const params = { page, limit };
    if (role) params.role = role;
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/roles/users', { params });
    if (response.data.success) {
      return {
        users: response.data.data,
        pagination: response.data.pagination
      };
    } else {
      return { users: [], pagination: {} };
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const updateUserRole = async (id, { role, status, userTypeId }) => {
  try {
    const response = await api.put(`/roles/users/${id}/role`, { role, status, userTypeId });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update user role');
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const updateUserStatus = async (id, { status, reason }) => {
  try {
    const response = await api.put(`/roles/users/${id}/status`, { status, reason });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update user status');
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};

export const getRoleStats = async () => {
  try {
    const response = await api.get('/roles/stats');
    if (response.data.success) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to server');
    } else {
      throw new Error('Request configuration error: ' + error.message);
    }
  }
};