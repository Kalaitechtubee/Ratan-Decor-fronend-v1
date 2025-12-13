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

      console.log('Fetching categories from:', `${apiClient.defaults.baseURL}/categories`, 'with filters:', filters);
      const response = await apiClient.get('/categories', { params });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }

      // Handle both tree structure and flat list
      const categories = response.data.categories || response.data.paginatedCategories || [];
      
      return {
        success: true,
        data: categories.map(category => ({
          id: category.id,
          name: category.name,
          brandName: category.brandName,
          parentId: category.parentId,
          isSubcategory: category.isSubcategory || !!category.parentId,
          productCount: category.productCount || 0,
          subcategoryCount: category.subcategoryCount || 0,
          description: `${category.productCount || 0} products available`,
          subCategories: category.subCategories || [],
          imageUrl: category.imageUrl || category.image
        })),
        categories: categories,
        tree: response.data.categories || null,
        paginatedCategories: response.data.paginatedCategories || null,
        pagination: response.data.pagination || {},
        filters: response.data.filters || {},
        totalCategories: response.data.pagination?.totalItems || categories.length
      };
    } catch (error) {
      console.error('Error fetching categories:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch categories. Please check your network or try again.');
    }
  },
  
  searchCategories: async (query) => {
    try {
      console.log('Searching categories with query:', query);
      const response = await apiClient.get(`/categories/search?q=${encodeURIComponent(query)}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search categories');
      }
      return response.data.results || response.data.categories || [];
    } catch (error) {
      console.error('Error searching categories:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
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
        page: page.toString(),
        limit: limit.toString()
      };
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      console.log(`Fetching subcategories for parent ${parentPath} with filters:`, filters);
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
      console.error('Error fetching subcategories:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  
  getSubcategoryProducts: async (subcategoryId) => {
    try {
      console.log('Fetching products for subcategory ID:', subcategoryId);
      const response = await apiClient.get(`/categories/${subcategoryId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch subcategory products');
      }
      return response.data.category.products || [];
    } catch (error) {
      console.error('Error fetching subcategory products:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get('/products?featured=true&limit=3');
      if (response.data && response.data.products) {
        return response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount || '20% OFF',
          image: product.images?.[0] || product.image,
          description: product.description
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [
        { id: 1, name: 'Modern L-Shape Sofa', price: 45999, discount: '25% OFF' },
        { id: 2, name: 'Executive Office Chair', price: 12999, discount: '30% OFF' },
        { id: 3, name: 'Wooden Dining Table', price: 28999, discount: '15% OFF' }
      ];
    }
  }
};

// Product Search Service
export const ProductSearchService = {
  searchProducts: async (query, userType = null, limit = 5) => {
    try {
      const params = {
        search: query,
        limit,
        page: 1
      };
      if (userType && userType !== 'general') {
        params.userType = userType.toLowerCase();
      }
      console.log('Searching products with params:', params);
      const response = await apiClient.get('/products', { params });
      if (response.data && response.data.products) {
        return response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          type: 'product',
          price: product.price,
          description: product.description || `${product.name} - ₹${product.price}`,
          image: product.images?.[0] || product.image,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          stock: product.stock,
          averageRating: product.averageRating
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching products:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return [];
    }
  },

  getRecentSearches: () => {
    try {
      const searches = localStorage.getItem('recentSearches');
      return searches ? JSON.parse(searches) : [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  },

  saveRecentSearch: (query) => {
    try {
      const searches = ProductSearchService.getRecentSearches();
      const filteredSearches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
      const newSearches = [query, ...filteredSearches].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  },

  getTrendingSearches: async () => {
    try {
      return ['Modern Sofa', 'Dining Table', 'Kitchen Cabinet', 'Office Chair', 'Wardrobe'];
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return ['Modern Sofa', 'Dining Table', 'Kitchen Cabinet'];
    }
  }
};

// Contact Service
export const ContactService = {
  submitContactForm: async (contactData) => {
    try {
      console.log('Submitting contact form:', contactData);
      const response = await apiClient.post('/contact/submit', contactData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit contact form');
      }
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Failed to submit contact form. Please try again.');
    }
  }
};
