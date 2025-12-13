import { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, X, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import AdvancedProductFilters from '../components/AdvancedProductFilters';
import { 
  fetchProducts, 
  fetchCategories, 
  setFilters, 
  setPage, 
  setViewMode,
  clearFilters,
  resetProductsState
} from '../productSlice';
import { useAuth } from '../../auth/hooks/useAuth';

function ProductPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userRole } = useAuth();
  const { userType } = useSelector((state) => state.userType);
  
  const { 
    products, 
    categories, 
    filters, 
    currentPage, 
    totalPages, 
    status, 
    error, 
    viewMode,
    count,
    totalCount,
    activeCount,
    inactiveCount
  } = useSelector((state) => state.products);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to prevent duplicate requests
  const hasFetchedCategoriesRef = useRef(false);
  const lastFetchParamsRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const isFirstMountRef = useRef(true);
  const isFetchingRef = useRef(false);

  const getCurrentUserType = () => userType || localStorage.getItem('userType') || 'General';

  // Fetch categories ONCE on mount
  useEffect(() => {
    if (!hasFetchedCategoriesRef.current && categories.length === 0) {
      hasFetchedCategoriesRef.current = true;
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Sync URL params to filters ONLY on initial mount
  useEffect(() => {
    if (isFirstMountRef.current) {
      const urlParams = Object.fromEntries(searchParams);
      if (Object.keys(urlParams).length > 0) {
        const newFilters = { ...filters };
        if (urlParams.search) newFilters.search = urlParams.search;
        if (urlParams.categoryId) newFilters.categoryId = urlParams.categoryId;
        if (urlParams.minPrice) newFilters.minPrice = urlParams.minPrice;
        if (urlParams.maxPrice) newFilters.maxPrice = urlParams.maxPrice;
        if (urlParams.minDesignNumber) newFilters.minDesignNumber = urlParams.minDesignNumber;
        if (urlParams.maxDesignNumber) newFilters.maxDesignNumber = urlParams.maxDesignNumber;
        dispatch(setFilters(newFilters));
      }
      isFirstMountRef.current = false;
    }
  }, []); // Empty dependency array - runs once

  // Single unified effect for fetching products
  useEffect(() => {
    // Cancel any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Prevent concurrent requests
    if (isFetchingRef.current) {
      return;
    }

    const activeUserType = getCurrentUserType();
    const storedUserRole = userRole || 'customer';
    
    const fetchParams = { 
      ...filters, 
      page: currentPage, 
      userType: activeUserType, 
      userRole: storedUserRole, 
      limit: 12,
      categoryId: filters.categoryId || ''
    };

    // Check if params have actually changed
    const paramsString = JSON.stringify(fetchParams);
    if (lastFetchParamsRef.current === paramsString) {
      return;
    }

    // Debounce for filter changes (but not for initial load or page changes)
    const debounceTime = isInitialLoad ? 0 : 300;

    fetchTimeoutRef.current = setTimeout(() => {
      lastFetchParamsRef.current = paramsString;
      isFetchingRef.current = true;

      dispatch(fetchProducts(fetchParams))
        .unwrap()
        .then(() => {
          setRetryCount(0);
          setIsInitialLoad(false);
        })
        .catch(() => {
          setIsInitialLoad(false);
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
    }, debounceTime);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [dispatch, currentPage, userType, userRole, filters, isInitialLoad]);

  // Handle storage change for userType
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userType' && e.newValue && e.newValue !== getCurrentUserType()) {
        lastFetchParamsRef.current = null;
        dispatch(resetProductsState());
        dispatch(setPage(1));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // Update URL search params (passive, no side effects)
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'featured') {
        params.set(key, value.toString());
      }
    });
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (viewMode !== 'grid') params.set('viewMode', viewMode);
    
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    
    if (newSearch !== currentSearch) {
      setSearchParams(params, { replace: true, preventScrollReset: true });
    }
  }, [filters, currentPage, viewMode]); // Removed setSearchParams from dependencies

  // Calculate applied filters count
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId && filters.categoryId !== '') count++;
    if (filters.search && filters.search.trim()) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice && filters.maxPrice !== 10000) count++;
    if (filters.minDesignNumber) count++;
    if (filters.maxDesignNumber) count++;
    return count;
  }, [filters]);

  // Optimized handlers - no duplicate fetches
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
    lastFetchParamsRef.current = null; // Force re-fetch with new params
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setPage(1));
    lastFetchParamsRef.current = null;
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lastFetchParamsRef.current = null;
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    lastFetchParamsRef.current = null;
    isFetchingRef.current = false;
    dispatch(resetProductsState());
  };

  // Loading state for initial load
  if (isInitialLoad && status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ProductGridSkeleton viewMode={viewMode} count={12} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <span>{status === 'loading' ? 'Loading...' : `${count.toLocaleString()} products found`}</span>
            {appliedFiltersCount > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                {appliedFiltersCount} filter{appliedFiltersCount > 1 ? 's' : ''} applied
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              User Type: {getCurrentUserType()}
            </span>
          </div>
        </div>

        <div className="flex gap-8 relative">
          <div className="hidden lg:block w-full lg:w-1/4">
            <AdvancedProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              appliedFiltersCount={appliedFiltersCount}
              productCount={count}
              isLoading={status === 'loading'}
            />
          </div>

          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <AdvancedProductFilters
                      categories={categories}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClearFilters={() => {
                        handleClearFilters();
                        setShowMobileFilters(false);
                      }}
                      appliedFiltersCount={appliedFiltersCount}
                      productCount={count}
                      isLoading={status === 'loading'}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0">
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {status === 'loading' ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2 text-primary" />
                    Loading...
                  </span>
                ) : status === 'failed' ? (
                  <span className="flex items-center text-red-500">
                    <AlertCircle className="w-4 h-4 mr-2" /> Failed to load
                  </span>
                ) : (
                  `${count.toLocaleString()} products found`
                )}
              </span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span>Filters</span>
                  {appliedFiltersCount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-primary rounded-full">
                      {appliedFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <motion.div
              key={`${currentPage}-${status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductGrid 
                products={products} 
                viewMode={viewMode}
                status={status}
                error={error}
                onRetry={handleRetry}
              />
            </motion.div>

            {totalPages > 1 && status === 'succeeded' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex justify-center"
              >
                <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let page = currentPage <= 4 ? i + 1 : currentPage >= totalPages - 3 ? totalPages - 6 + i : currentPage - 3 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentPage === page ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'succeeded' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{count}</div>
                    <div className="text-xs text-gray-500">Current Results</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                    <div className="text-xs text-gray-500">Active Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-400">{inactiveCount}</div>
                    <div className="text-xs text-gray-500">Inactive Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                    <div className="text-xs text-gray-500">Total Products</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;