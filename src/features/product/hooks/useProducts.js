import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchProduct,
  searchProducts,
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
  selectProducts,
  selectCategories,
  selectCurrentProduct,
  selectProductsStatus,
  selectProductsError,
  selectFilters,
  selectPagination,
  selectViewMode,
  selectAppliedFilters
} from '../productSlice';

export default function useProducts() {
  const dispatch = useDispatch();
  
  // Selectors
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const currentProduct = useSelector(selectCurrentProduct);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const viewMode = useSelector(selectViewMode);
  const appliedFilters = useSelector(selectAppliedFilters);
  
  // Additional state
  const searchResults = useSelector((state) => state.products.searchResults);
  const searchStatus = useSelector((state) => state.products.searchStatus);
  const lastFetchParams = useSelector((state) => state.products.lastFetchParams);
  const userTypeFilter = useSelector((state) => state.products.userTypeFilter);
  const userRoleFilter = useSelector((state) => state.products.userRoleFilter);

  // Memoized computed values
  const isLoading = useMemo(() => status === 'loading', [status]);
  const hasError = useMemo(() => status === 'failed' && !!error, [status, error]);
  const hasProducts = useMemo(() => products.length > 0, [products]);
  const isEmpty = useMemo(() => status === 'succeeded' && products.length === 0, [status, products]);

  // Applied filters count
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId && filters.categoryId !== '') count++;
    if (filters.subcategoryId && filters.subcategoryId !== '') count++;
    if (filters.search && filters.search.trim() !== '') count++;
    if (filters.minPrice !== null && filters.minPrice !== '') count++;
    if (filters.maxPrice !== null && filters.maxPrice !== '') count++;
    if (filters.sortBy !== 'featured') count++;
    if (filters.designNumber && filters.designNumber.trim() !== '') count++;
    if (filters.minDesignNumber && filters.minDesignNumber.trim() !== '') count++;
    if (filters.maxDesignNumber && filters.maxDesignNumber.trim() !== '') count++;
    return count;
  }, [filters]);

  // Categories with "All" option
  const categoriesWithAll = useMemo(() => {
    return [
     
      ...categories
    ];
  }, [categories, pagination.count]);

  // Action dispatchers
  const loadProducts = useCallback((params = {}) => {
    return dispatch(fetchProducts(params));
  }, [dispatch]);

  const loadCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);

  const loadProduct = useCallback((id, userRole, userType) => {
    return dispatch(fetchProduct({ id, userRole, userType }));
  }, [dispatch]);

  const performSearch = useCallback((searchParams) => {
    return dispatch(searchProducts(searchParams));
  }, [dispatch]);

  // Filter management
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const updateFilter = useCallback((key, value) => {
    dispatch(setFilter({ key, value }));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Design number specific filters
  const filterByDesignNumber = useCallback((designNumber) => {
    dispatch(setDesignNumberFilter(designNumber));
  }, [dispatch]);

  const filterByDesignNumberRange = useCallback((min, max) => {
    dispatch(setDesignNumberRange({ min, max }));
  }, [dispatch]);

  const clearDesignFilters = useCallback(() => {
    dispatch(clearDesignNumberFilters());
  }, [dispatch]);

  // Pagination
  const changePage = useCallback((page) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const goToNextPage = useCallback(() => {
    dispatch(nextPage());
  }, [dispatch]);

  const goToPrevPage = useCallback(() => {
    dispatch(prevPage());
  }, [dispatch]);

  // View management
  const changeViewMode = useCallback((mode) => {
    dispatch(setViewMode(mode));
  }, [dispatch]);

  const changeSortBy = useCallback((sortBy) => {
    dispatch(setSortBy(sortBy));
  }, [dispatch]);

  // Quick filters
  const searchByQuery = useCallback((query) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const filterByCategory = useCallback((categoryId) => {
    dispatch(setCategoryFilter(categoryId));
  }, [dispatch]);

  const filterBySubcategory = useCallback((subcategoryId) => {
    dispatch(setSubcategoryFilter(subcategoryId));
  }, [dispatch]);

  const filterByPriceRange = useCallback((min, max) => {
    dispatch(setPriceRange({ min, max }));
  }, [dispatch]);

  // State management
  const resetState = useCallback(() => {
    dispatch(resetProductsState());
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Utility functions
  const getProductById = useCallback((id) => {
    return products.find(product => product.id === id);
  }, [products]);

  const getCategoryById = useCallback((id) => {
    const findInTree = (cats) => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subCategories?.length > 0) {
          const found = findInTree(cat.subCategories);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(categories);
  }, [categories]);

  const getFilteredProducts = useCallback((additionalFilters = {}) => {
    return products.filter(product => {
      if (additionalFilters.minRating && product.averageRating < additionalFilters.minRating) {
        return false;
      }
      if (additionalFilters.maxRating && product.averageRating > additionalFilters.maxRating) {
        return false;
      }
      if (additionalFilters.inStock && (!product.stock || product.stock <= 0)) {
        return false;
      }
      return true;
    });
  }, [products]);

  // Advanced filtering
  const getProductsByCategory = useCallback((categoryId) => {
    return products.filter(product => product.categoryId === categoryId);
  }, [products]);

  const getProductsByPriceRange = useCallback((min, max) => {
    return products.filter(product => 
      product.price >= min && product.price <= max
    );
  }, [products]);

  const getProductsByDesignNumber = useCallback((designNumber) => {
    return products.filter(product => 
      product.designNumber?.toLowerCase().includes(designNumber.toLowerCase())
    );
  }, [products]);

  const getProductsByDesignRange = useCallback((min, max) => {
    return products.filter(product => {
      if (!product.designNumber) return false;
      const designNum = parseFloat(product.designNumber);
      if (isNaN(designNum)) return false;
      return (!min || designNum >= parseFloat(min)) && (!max || designNum <= parseFloat(max));
    });
  }, [products]);

  const getFeaturedProducts = useCallback(() => {
    return products.filter(product => product.isFeatured || product.isNew);
  }, [products]);

  return {
    // State
    products,
    categories: categoriesWithAll,
    currentProduct,
    searchResults,
    filters,
    pagination,
    viewMode,
    appliedFilters,
    
    // Status
    status,
    searchStatus,
    error,
    isLoading,
    hasError,
    hasProducts,
    isEmpty,
    appliedFiltersCount,
    
    // Metadata
    userTypeFilter,
    userRoleFilter,
    lastFetchParams,
    
    // Actions
    loadProducts,
    loadCategories,
    loadProduct,
    performSearch,
    
    // Filter management
    updateFilters,
    updateFilter,
    resetFilters,
    searchByQuery,
    filterByCategory,
    filterBySubcategory,
    filterByPriceRange,
    filterByDesignNumber,
    filterByDesignNumberRange,
    clearDesignFilters,
    
    // Pagination
    changePage,
    goToNextPage,
    goToPrevPage,
    
    // View management
    changeViewMode,
    changeSortBy,
    
    // State management
    resetState,
    dismissError,
    
    // Utility functions
    getProductById,
    getCategoryById,
    getFilteredProducts,
    getProductsByCategory,
    getProductsByPriceRange,
    getProductsByDesignNumber,
    getProductsByDesignRange,
    getFeaturedProducts,
  };
}