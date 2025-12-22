import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { getProducts, getCategories, getProductById, searchProductsByName } from './api/productApi';

// Track pending thunks to prevent duplicates
const pendingThunks = new Map();

// Helper to create deduplicated thunks
function createDedupedThunk(typePrefix, payloadCreator) {
  return createAsyncThunk(typePrefix, async (arg, thunkAPI) => {
    const key = JSON.stringify({ type: typePrefix, arg });

    // If there's already a pending request with the same params, wait for it
    if (pendingThunks.has(key)) {
      console.log(`[Redux] Reusing pending thunk: ${typePrefix}`);
      return pendingThunks.get(key);
    }

    // Create new request promise
    const promise = payloadCreator(arg, thunkAPI);
    pendingThunks.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up after request completes
      pendingThunks.delete(key);
    }
  });
}

export const fetchProducts = createDedupedThunk(
  'products/fetchProducts',
  async ({
    page = 1,
    limit = 8,
    userType,
    userRole,
    categoryIds, // Changed from categoryId to categoryIds (array)
    subcategoryId,
    minPrice,
    maxPrice,
    search,
    sortBy = 'featured',
    isActive = true,
    designNumber,
    minDesignNumber,
    maxDesignNumber
  }, { rejectWithValue }) => {
    try {
      const normalizedUserType = userType ? userType.toLowerCase() : null;

      // Convert categoryIds array to comma-separated string for API
      const categoryId = Array.isArray(categoryIds) && categoryIds.length > 0
        ? categoryIds.join(',')
        : '';

      console.log('[Redux] Fetching products with params:', {
        page, limit, userType: normalizedUserType, userRole, categoryId, subcategoryId,
        minPrice, maxPrice, search, sortBy, isActive, designNumber, minDesignNumber, maxDesignNumber
      });

      const data = await getProducts({
        page,
        limit,
        userType: normalizedUserType,
        userRole,
        categoryId, // API expects categoryId (comma-separated if multiple)
        subcategoryId,
        minPrice,
        maxPrice,
        search,
        sortBy,
        isActive,
        designNumber,
        minDesignNumber,
        maxDesignNumber
      });

      console.log('[Redux] Fetched products data:', data);
      return {
        products: data.products || [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
        count: data.count || 0,
        totalCount: data.totalCount || 0,
        activeCount: data.activeCount || 0,
        inactiveCount: data.inactiveCount || 0,
        userType: data.userType,
        userRole: data.userRole,
        filters: data.filters || {}
      };
    } catch (error) {
      console.error('[Redux] Error in fetchProducts thunk:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
    }
  }
);

export const fetchCategories = createDedupedThunk(
  'products/fetchCategories',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      // Check if categories are already loaded (only if no filters provided)
      const hasFilters = filters && Object.keys(filters).length > 0;
      const state = getState();

      if (!hasFilters && state.products.categories.length > 0 && state.products.categoriesLastFetch) {
        const timeSinceLastFetch = Date.now() - state.products.categoriesLastFetch;
        // If categories were fetched less than 5 minutes ago, return cached data
        if (timeSinceLastFetch < 5 * 60 * 1000) {
          console.log('[Redux] Using cached categories');
          return state.products.categories;
        }
      }

      // Default filters for tree structure (main categories with subcategories)
      const defaultFilters = {
        includeSubcategories: true,
        parentId: null,
        sortBy: 'name',
        sortOrder: 'ASC',
        ...filters
      };

      console.log('[Redux] Fetching categories from API with filters:', defaultFilters);
      const data = await getCategories(defaultFilters);
      console.log('[Redux] Fetched categories data:', data);

      // Return tree structure if available, otherwise return flat list
      if (data.success) {
        if (data.tree) {
          return data.tree;
        } else if (data.categories) {
          return data.categories;
        }
      } else if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.categories && Array.isArray(data.categories)) {
        return data.categories;
      } else {
        return [];
      }
    } catch (error) {
      console.error('[Redux] Error in fetchCategories thunk:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchProduct = createDedupedThunk(
  'products/fetchProduct',
  async ({ id, userRole, userType }, { rejectWithValue }) => {
    try {
      const normalizedUserType = userType ? userType.toLowerCase() : null;
      console.log(`[Redux] Fetching product with id: ${id}, userRole: ${userRole}, userType: ${normalizedUserType}`);
      const data = await getProductById({ id, userRole, userType: normalizedUserType });
      return data.product || data;
    } catch (error) {
      console.error(`[Redux] Error in fetchProduct thunk for id ${id}:`, error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createDedupedThunk(
  'products/searchProducts',
  async ({ name, userType, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const normalizedUserType = userType ? userType.toLowerCase() : null;
      console.log('[Redux] Searching products with name:', name, 'userType:', normalizedUserType);
      const data = await searchProductsByName({ name, userType: normalizedUserType, page, limit });
      return data;
    } catch (error) {
      console.error('[Redux] Error in searchProducts thunk:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search products');
    }
  }
);

const initialState = {
  // Product data
  products: [],
  currentProduct: null,

  // Categories data
  categories: [],
  categoriesLastFetch: null, // Track when categories were last fetched

  // Pagination
  totalPages: 1,
  currentPage: 1,
  count: 0,
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,

  // Filtering and display
  filters: {
    categoryIds: [], // Changed from categoryId string to categoryIds array for multi-select
    subcategoryId: '',
    minPrice: null,
    maxPrice: null,
    search: '',
    sortBy: 'featured',
    designNumber: '',
    minDesignNumber: '',
    maxDesignNumber: ''
  },
  viewMode: 'grid',

  // Loading and error states
  status: 'idle', // idle | loading | succeeded | failed
  categoriesStatus: 'idle', // Separate status for categories
  error: null,

  // Cache and optimization
  lastFetchParams: null,
  searchResults: [],
  searchStatus: 'idle',

  // Additional metadata
  userTypeFilter: null,
  userRoleFilter: null,
  appliedFilters: {}
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },

    clearFilters: (state) => {
      state.filters = {
        categoryIds: [], // Changed from categoryId
        subcategoryId: '',
        minPrice: null,
        maxPrice: null,
        search: '',
        sortBy: 'featured',
        designNumber: '',
        minDesignNumber: '',
        maxDesignNumber: ''
      };
      state.currentPage = 1;
    },

    setDesignNumberFilter: (state, action) => {
      state.filters.designNumber = action.payload;
    },

    setDesignNumberRange: (state, action) => {
      const { min, max } = action.payload;
      state.filters.minDesignNumber = min || '';
      state.filters.maxDesignNumber = max || '';
    },

    clearDesignNumberFilters: (state) => {
      state.filters.designNumber = '';
      state.filters.minDesignNumber = '';
      state.filters.maxDesignNumber = '';
    },

    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    nextPage: (state) => {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },

    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },

    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
    },

    setCategoryFilter: (state, action) => {
      const categoryId = action.payload.toString();
      const currentIds = state.filters.categoryIds || [];

      if (categoryId === '') {
        // Clear all categories
        state.filters.categoryIds = [];
        state.filters.subcategoryId = '';
      } else {
        // Toggle the category
        const index = currentIds.indexOf(categoryId);
        if (index > -1) {
          // Remove if already selected
          state.filters.categoryIds = currentIds.filter(id => id !== categoryId);
        } else {
          // Add if not selected
          state.filters.categoryIds = [...currentIds, categoryId];
        }
        // Clear subcategory when categories change
        state.filters.subcategoryId = '';
      }
    },

    setSubcategoryFilter: (state, action) => {
      state.filters.subcategoryId = action.payload;
    },

    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.filters.minPrice = min;
      state.filters.maxPrice = max;
    },

    resetProductsState: (state) => {
      state.products = [];
      state.status = 'idle';
      state.error = null;
      state.currentPage = 1;
      state.count = 0;
    },

    clearError: (state) => {
      state.error = null;
    },

    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },

    removeProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter(p => p.id !== productId);
      state.count = Math.max(0, state.count - 1);
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.count = action.payload.count || 0;
        state.totalCount = action.payload.totalCount || 0;
        state.activeCount = action.payload.activeCount || 0;
        state.inactiveCount = action.payload.inactiveCount || 0;
        state.userTypeFilter = action.payload.userType;
        state.userRoleFilter = action.payload.userRole;
        state.appliedFilters = action.payload.filters || {};
        state.lastFetchParams = action.meta.arg;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch products';
        state.products = [];
        state.count = 0;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        const categories = Array.isArray(action.payload) ? action.payload : [];
        state.categories = categories;
        state.categoriesLastFetch = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.error = action.payload || 'Failed to fetch categories';
        state.categories = [];
      })

      // Fetch Single Product
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
        const existingIndex = state.products.findIndex(p => p.id === action.payload.id);
        if (existingIndex !== -1) {
          state.products[existingIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch product';
        state.currentProduct = null;
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResults = action.payload.products || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.searchResults = [];
        state.error = action.payload || 'Failed to search products';
      });
  },
});

// Export actions
export const {
  setFilters,
  setFilter,
  clearFilters,
  setDesignNumberFilter,
  setDesignNumberRange,
  clearDesignNumberFilters,
  setPage,
  nextPage,
  prevPage,
  setViewMode,
  setSortBy,
  setSearchQuery,
  setCategoryFilter,
  setSubcategoryFilter,
  setPriceRange,
  resetProductsState,
  clearError,
  updateProduct,
  removeProduct
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;
export const selectCategoriesStatus = (state) => state.products.categoriesStatus;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = createSelector(
  [
    (state) => state.products.currentPage,
    (state) => state.products.totalPages,
    (state) => state.products.count,
    (state) => state.products.totalCount,
  ],
  (currentPage, totalPages, count, totalCount) => ({
    currentPage,
    totalPages,
    count,
    totalCount,
  })
);
export const selectViewMode = (state) => state.products.viewMode;
export const selectAppliedFilters = (state) => state.products.appliedFilters;

export default productSlice.reducer;