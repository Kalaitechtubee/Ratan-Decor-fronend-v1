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
  if (minPrice && minPrice > 0) params.minPrice = minPrice;
  if (maxPrice && maxPrice > 0 && maxPrice !== 50000) params.maxPrice = maxPrice;
  if (search && search.trim() !== '') params.search = search.trim();
  if (sortBy && sortBy !== 'featured') params.sortBy = sortBy;
  if (isActive !== undefined) params.isActive = isActive;
  if (designNumber && designNumber.trim() !== '') params.designNumber = designNumber.trim();
  if (minDesignNumber && minDesignNumber.trim() !== '') params.minDesignNumber = minDesignNumber.trim();
  if (maxDesignNumber && maxDesignNumber.trim() !== '') params.maxDesignNumber = maxDesignNumber.trim();

  try {
    console.log('API Request params:', params);
    const response = await api.get('/products', { params });
    console.log('Products API Response:', response.data);
    
    // Handle your backend response format
    if (response.data) {
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
        designNumber: response.data.designNumber || designNumber,
        minDesignNumber: response.data.minDesignNumber || minDesignNumber,
        maxDesignNumber: response.data.maxDesignNumber || maxDesignNumber
      };
    } else {
      // Fallback for unexpected response structure
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
        designNumber,
        minDesignNumber,
        maxDesignNumber
      };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Enhanced error handling
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

    const params = {};
    if (page) params.page = page.toString();
    if (limit) params.limit = limit.toString();
    if (search) params.search = search;
    if (parentId !== null && parentId !== undefined) {
      params.parentId = parentId === null ? 'null' : parentId.toString();
    }
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (includeSubcategories) params.includeSubcategories = 'true';

    console.log('Categories API Request with filters:', filters);
    const response = await api.get('/categories', { params });
    console.log('Categories API Response:', response.data);
    
    // Handle different response formats from your backend
    if (response.data.success) {
      // Return full response structure with pagination and filters
      return {
        success: true,
        categories: response.data.categories || response.data.paginatedCategories || [],
        tree: response.data.categories || null,
        paginatedCategories: response.data.paginatedCategories || null,
        pagination: response.data.pagination || {},
        filters: response.data.filters || {},
        totalCategories: response.data.pagination?.totalItems || (response.data.categories || []).length
      };
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        categories: response.data.data,
        tree: response.data.data
      };
    } else if (Array.isArray(response.data)) {
      return {
        success: true,
        categories: response.data,
        tree: response.data
      };
    } else {
      console.warn('Unexpected categories response format:', response.data);
      return {
        success: false,
        categories: []
      };
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    
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

export const getProductById = async ({ id, userRole, userType }) => {
  try {
    const params = {};
    if (userRole && userRole !== '') params.userRole = userRole;
    if (userType && userType !== '') params.userType = userType;
    
    const response = await api.get(`/products/${id}`, { params });
    console.log('Single Product API Response:', response.data);
    
    // Handle different response formats
    if (response.data.product) {
      return { product: response.data.product };
    } else if (response.data.success && response.data.data) {
      return { product: response.data.data };
    } else {
      return { product: response.data };
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    
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
    console.log('Search Products API Response:', response.data);
    
    return {
      products: response.data.products || [],
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
      count: response.data.count || 0,
      userType: response.data.userType,
      userRole: response.data.userRole
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getProductByName = async ({ name, userType }) => {
  try {
    const params = {};
    if (userType && userType !== '') params.userType = userType;
    
    const response = await api.get(`/products/name/${encodeURIComponent(name)}`, { params });
    console.log('Product by Name API Response:', response.data);
    
    return {
      product: response.data.product || response.data,
      userType: response.data.userType,
      userRole: response.data.userRole
    };
  } catch (error) {
    console.error('Error fetching product by name:', error);
    throw error;
  }
};

// Category-specific API functions
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    console.log('Category by ID API Response:', response.data);
    
    if (response.data.success && response.data.category) {
      return response.data.category;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
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
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    console.log(`SubCategories API Request for parent ${parentPath} with filters:`, filters);
    const response = await api.get(`/categories/subcategories/${parentPath}`, { params });
    console.log('SubCategories API Response:', response.data);
    
    return {
      success: true,
      subcategories: response.data.subcategories || [],
      pagination: response.data.pagination || {},
      filters: response.data.filters || {}
    };
  } catch (error) {
    console.error(`Error fetching subcategories for parent ${parentId}:`, error);
    throw error;
  }
};

export const searchCategories = async (query) => {
  try {
    const response = await api.get('/categories/search', { params: { q: query } });
    console.log('Search Categories API Response:', response.data);
    
    return {
      results: response.data.results || [],
      count: response.data.count || 0,
      query: response.data.query
    };
  } catch (error) {
    console.error('Error searching categories:', error);
    throw error;
  }
};

// Product ratings API
export const getProductRatings = async (productId, page = 1, limit = 10) => {
  try {
    const params = { page, limit };
    const response = await api.get(`/products/${productId}/ratings`, { params });
    console.log('Product Ratings API Response:', response.data);
    
    return {
      ratings: response.data.ratings || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      totalPages: response.data.totalPages || 1
    };
  } catch (error) {
    console.error(`Error fetching ratings for product ${productId}:`, error);
    throw error;
  }
};

export const addProductRating = async (productId, { rating, review }) => {
  try {
    const response = await api.post(`/products/${productId}/rate`, { rating, review });
    console.log('Add Rating API Response:', response.data);

    return {
      rating: response.data.rating,
      productStats: response.data.productStats,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Error adding rating for product ${productId}:`, error);

    if (error.response?.status === 401) {
      throw new Error('Please login to rate this product');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid rating data');
    } else {
      throw new Error('Failed to add rating. Please try again.');
    }
  }
};

// User Role Management API functions
export const getAllRoles = async () => {
  try {
    const response = await api.get('/roles');
    console.log('Get All Roles API Response:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching roles:', error);

    // Handle access denied error gracefully for customer role
    if (error.response?.status === 403 && error.response.data?.message?.includes('Access denied')) {
      console.warn('Access denied for role customer when fetching roles');
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
    console.log('Get Users by Role API Response:', response.data);

    if (response.data.success) {
      return {
        users: response.data.data,
        pagination: response.data.pagination
      };
    } else {
      return { users: [], pagination: {} };
    }
  } catch (error) {
    console.error('Error fetching users by role:', error);

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
    console.log('Update User Role API Response:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update user role');
    }
  } catch (error) {
    console.error('Error updating user role:', error);

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
    console.log('Update User Status API Response:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update user status');
    }
  } catch (error) {
    console.error('Error updating user status:', error);

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
    console.log('Get Role Stats API Response:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error fetching role stats:', error);

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