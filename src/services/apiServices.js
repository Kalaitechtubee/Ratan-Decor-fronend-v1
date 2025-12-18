import axios from 'axios';

// Configure axios with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Category Service
export const CategoryService = {
  getCategories: async (filters = {}) => {
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
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        response = await apiClient.get(`/categories/subcategories/${parentPath}`, { params });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch subcategories');
        }

        const categories = response.data.subcategories || [];
        return {
          success: true,
          data: categories.map(category => ({
            id: category.id,
            name: category.name,
            brandName: category.brandName || null,
            parentId: category.parentId,
            isSubcategory: category.isSubcategory || !!category.parentId,
            productCount: category.productCount || 0,
            subcategoryCount: category.subcategoryCount || 0,
            description: `${category.productCount || 0} products available`,
            subCategories: category.subCategories || [],
            imageUrl: category.imageUrl || category.image || null
          })),
          categories,
          tree: null,
          paginatedCategories: categories,
          pagination: response.data.pagination || {},
          filters: response.data.filters || {},
          totalCategories: response.data.pagination?.totalItems || categories.length
        };
      } else {
        // For root/tree, use main endpoint (no pagination)
        if (search && search.trim() !== '') {
          // Use search endpoint if search provided
          response = await apiClient.get('/categories/search', { params: { q: search.trim() } });
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to search categories');
          }
          const categories = response.data.categories || [];
          return {
            success: true,
            data: categories.map(category => ({
              id: category.id,
              name: category.name,
              brandName: category.brandName || null,
              parentId: category.parentId,
              isSubcategory: category.isSubcategory || !!category.parentId,
              productCount: category.productCount || 0,
              subcategoryCount: category.subcategoryCount || 0,
              description: `${category.productCount || 0} products available`,
              subCategories: category.subCategories || [],
              imageUrl: category.imageUrl || category.image || null
            })),
            categories,
            tree: null,
            paginatedCategories: categories,
            pagination: {},
            filters: { query: search.trim() },
            totalCategories: response.data.totalResults || categories.length
          };
        } else {
          // Main tree endpoint
          response = await apiClient.get('/categories');
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch categories');
          }

          const categories = response.data.categories || [];
          return {
            success: true,
            data: categories.map(category => ({
              id: category.id,
              name: category.name,
              brandName: category.brandName || null,
              parentId: category.parentId,
              isSubcategory: category.isSubcategory || !!category.parentId,
              productCount: category.productCount || 0,
              subcategoryCount: category.subcategoryCount || 0,
              description: `${category.productCount || 0} products available`,
              subCategories: category.subCategories || [],
              imageUrl: category.imageUrl || category.image || null
            })),
            categories,
            tree: categories,
            paginatedCategories: null,
            pagination: {},
            filters: {},
            totalCategories: response.data.totalCategories || categories.length
          };
        }
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories. Please check your network or try again.');
    }
  },
  
  searchCategories: async (query) => {
    try {
      const response = await apiClient.get('/categories/search', { params: { q: query.trim() } });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search categories');
      }
      return response.data.categories || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search categories. Please check your network or try again.');
    }
  },

  getSubCategories: async (parentId, filters = {}) => {
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
        page,
        limit
      };
      if (search && search.trim() !== '') params.q = search.trim(); // Use 'q' to match backend
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const response = await apiClient.get(`/categories/subcategories/${parentPath}`, { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch subcategories');
      }

      return {
        success: true,
        subcategories: response.data.subcategories || [],
        pagination: response.data.pagination || {},
        filters: response.data.filters || {}
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategories. Please check your network or try again.');
    }
  },
  
  getSubcategoryProducts: async (subcategoryId) => {
    try {
      const response = await apiClient.get(`/categories/${subcategoryId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch subcategory products');
      }
      return response.data.category?.products || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subcategory products. Please check your network or try again.');
    }
  },
  
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get('/products', { 
        params: { 
          featured: true, 
          limit: 3, 
          page: 1,
          isActive: true 
        } 
      });
      if (response.data && response.data.products) {
        return response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price || product.generalPrice,
          discount: product.discount || '20% OFF',
          image: product.imageUrls?.[0] || product.imageUrl || product.image,
          description: product.description || `${product.name} - ₹${product.price || product.generalPrice}`
        }));
      }
      return [];
    } catch (error) {
      // Graceful fallback without logs in production
      return [];
    }
  }
};

// Product Search Service
export const ProductSearchService = {
  searchProducts: async (query, userType = null, limit = 5) => {
    try {
      const params = {
        search: query.trim(),
        limit,
        page: 1,
        isActive: true
      };
      if (userType && userType.toLowerCase() !== 'general') {
        params.userType = userType.toLowerCase();
      }
      const response = await apiClient.get('/products', { params });
      if (response.data && response.data.products) {
        return response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          type: 'product',
          price: product.price || product.generalPrice,
          description: product.description || `${product.name} - ₹${product.price || product.generalPrice}`,
          image: product.imageUrls?.[0] || product.imageUrl || product.image,
          categoryId: product.categoryId,
          categoryName: product.category?.name || 'Uncategorized',
          stock: product.stock || 0,
          averageRating: product.averageRating || 0
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  getRecentSearches: () => {
    try {
      const searches = localStorage.getItem('recentSearches');
      return searches ? JSON.parse(searches) : [];
    } catch {
      return [];
    }
  },

  saveRecentSearch: (query) => {
    try {
      const searches = ProductSearchService.getRecentSearches();
      const filteredSearches = searches.filter(s => s.toLowerCase() !== query.toLowerCase().trim());
      const newSearches = [query.trim(), ...filteredSearches].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch {}
  },

  getTrendingSearches: async () => {
    try {
      // In production, fetch from backend if available; fallback to static
      return ['Modern Sofa', 'Dining Table', 'Kitchen Cabinet', 'Office Chair', 'Wardrobe'];
    } catch {
      return ['Modern Sofa', 'Dining Table', 'Kitchen Cabinet'];
    }
  }
};

// Contact Service
export const ContactService = {
  submitContactForm: async (contactData) => {
    try {
      const response = await apiClient.post('/contact/submit', contactData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit contact form');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit contact form. Please try again.');
    }
  }
};