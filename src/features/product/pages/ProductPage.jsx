import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, X, Loader2, AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw } from 'lucide-react';
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
  } = useSelector((state) => state.products, shallowEqual);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to prevent duplicate requests
  const hasFetchedCategoriesRef = useRef(false);
  const lastFetchParamsRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const isFirstMountRef = useRef(true);
  const isFetchingRef = useRef(false);

  const getCurrentUserType = useCallback(() => userType || localStorage.getItem('userType') || 'General', [userType]);

  // Fetch categories ONCE on mount
  useEffect(() => {
    if (!hasFetchedCategoriesRef.current && categories.length === 0) {
      hasFetchedCategoriesRef.current = true;
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Sync URL params to filters and handle navigation updates
  useEffect(() => {
    const urlParams = Object.fromEntries(searchParams);
    if (Object.keys(urlParams).length === 0 && isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    const newFilters = { ...filters };
    let hasChanges = false;

    // Handle Search
    if (urlParams.search !== undefined && urlParams.search !== filters.search) {
      newFilters.search = urlParams.search;
      hasChanges = true;
    }

    // Handle categoryIds - can be comma-separated in URL
    const urlCategoryIds = urlParams.categoryIds ? urlParams.categoryIds.split(',').filter(Boolean) :
      urlParams.categoryId ? [urlParams.categoryId] : [];

    const currentCategoryIds = filters.categoryIds || [];
    if (JSON.stringify(urlCategoryIds.sort()) !== JSON.stringify([...currentCategoryIds].sort())) {
      newFilters.categoryIds = urlCategoryIds;
      hasChanges = true;
    }

    // Handle Prices
    if (urlParams.minPrice !== undefined && urlParams.minPrice !== filters.minPrice) {
      newFilters.minPrice = urlParams.minPrice;
      hasChanges = true;
    }
    if (urlParams.maxPrice !== undefined && urlParams.maxPrice !== filters.maxPrice) {
      newFilters.maxPrice = urlParams.maxPrice;
      hasChanges = true;
    }

    // Handle Design Numbers moved to search

    if (hasChanges) {
      dispatch(setFilters(newFilters));
      if (urlParams.page) {
        dispatch(setPage(parseInt(urlParams.page)));
      } else {
        dispatch(setPage(1));
      }
    }

    isFirstMountRef.current = false;
  }, [dispatch, searchParams]); // Remove filters from deps to avoid loops, searchParams is the trigger

  // Memoized fetch params to avoid unnecessary re-renders
  const fetchParams = useMemo(() => {
    const activeUserType = getCurrentUserType();
    const storedUserRole = userRole || 'customer';
    return {
      ...filters,
      page: currentPage,
      userType: activeUserType,
      userRole: storedUserRole,
      limit: 12, // Standardized limit
      categoryIds: filters.categoryIds || []
    };
  }, [filters, currentPage, userRole, getCurrentUserType]);

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
        .catch((err) => {
          console.error('Fetch products error:', err);
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
  }, [dispatch, fetchParams, isInitialLoad]); // Use memoized fetchParams

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
  }, [dispatch, getCurrentUserType]);

  // Handle mobile filters toggle via custom event from MobileBottomNav
  useEffect(() => {
    const handleToggleFilters = () => {
      setShowMobileFilters(prev => !prev);
    };
    window.addEventListener('toggleMobileFilters', handleToggleFilters);
    return () => window.removeEventListener('toggleMobileFilters', handleToggleFilters);
  }, []);

  // Handle openFilters via search param (when coming from other pages)
  useEffect(() => {
    if (searchParams.get('openFilters') === 'true') {
      setShowMobileFilters(true);
      // Remove param from URL to prevent reopening on refresh
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('openFilters');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Update URL search params (passive, no side effects) - memoized filters string
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      // Handle categoryIds array specially
      if (key === 'categoryIds' && Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (value && value !== '' && value !== 'featured' && !Array.isArray(value)) {
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
  }, [filtersString, currentPage, viewMode, setSearchParams, searchParams]); // Use filtersString to avoid object ref issues

  // Calculate applied filters count
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categoryIds && filters.categoryIds.length > 0) count += filters.categoryIds.length;
    if (filters.search && filters.search.trim()) count++;
    if (filters.minPrice && parseFloat(filters.minPrice) > 0) count++;
    if (filters.maxPrice && parseFloat(filters.maxPrice) < 10000) count++;
    return count;
  }, [filters]);

  // Optimized handlers - no duplicate fetches
  const handleFilterChange = useCallback((keyOrUpdates, value) => {
    let newFilters;
    if (typeof keyOrUpdates === 'object' && keyOrUpdates !== null) {
      newFilters = { ...filters, ...keyOrUpdates };
    } else if (keyOrUpdates === 'categoryId') {
      // Handle category toggle for multi-select
      const currentIds = filters.categoryIds || [];
      const categoryId = value.toString();

      if (categoryId === '') {
        // Clear all categories
        newFilters = { ...filters, categoryIds: [] };
      } else {
        // Toggle the category
        const isSelected = currentIds.includes(categoryId);
        if (isSelected) {
          newFilters = { ...filters, categoryIds: currentIds.filter(id => id !== categoryId) };
        } else {
          newFilters = { ...filters, categoryIds: [...currentIds, categoryId] };
        }
      }
    } else if (keyOrUpdates === 'categoryIds') {
      // Direct setting of categoryIds array (e.g., clearing all)
      newFilters = { ...filters, categoryIds: Array.isArray(value) ? value : [] };
    } else {
      newFilters = { ...filters, [keyOrUpdates]: value };
    }
    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
    lastFetchParamsRef.current = null; // Force re-fetch with new params
  }, [dispatch, filters]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(setPage(1));
    lastFetchParamsRef.current = null;
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lastFetchParamsRef.current = null;
  }, [dispatch]);

  const handleViewModeChange = useCallback((mode) => {
    dispatch(setViewMode(mode));
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    lastFetchParamsRef.current = null;
    isFetchingRef.current = false;
    dispatch(resetProductsState());
  }, [dispatch]);

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
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
                  <div className="p-4">
                    <AdvancedProductFilters
                      isMobile={true}
                      onClose={() => setShowMobileFilters(false)}
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
                    Loading products...
                  </span>
                ) : status === 'failed' ? (
                  <span className="flex items-center text-red-500">
                    <AlertCircle className="w-4 h-4 mr-2" /> Failed to load products
                  </span>
                ) : (
                  <span className="text-gray-600 font-medium">
                    {count === 0 && 'No products found'}
                  </span>
                )}
              </span>
              <div className="flex items-center space-x-3">
                {appliedFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="flex lg:hidden items-center space-x-2 px-3 py-2 bg-red-50 text-[#ff4747] border border-red-100 rounded-lg hover:bg-red-100 transition-all duration-200 text-xs font-semibold"
                    aria-label="Clear all filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Filter Clear</span>
                  </button>
                )}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <motion.div
              key={`${currentPage}-${status}-${JSON.stringify(filters)}`} // Key on filters to remount on changes
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
                retryCount={retryCount}
              />
            </motion.div>

            {totalPages > 1 && status === 'succeeded' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-16 flex flex-col items-center gap-6 pb-12"
              >
                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:flex p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm group"
                  >
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="hidden md:inline text-sm font-semibold">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5 mx-2">
                    {(() => {
                      const pages = [];
                      const maxVisible = 3;

                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        let startPage = Math.max(1, currentPage - 1);
                        let endPage = startPage + maxVisible - 1;

                        if (endPage > totalPages) {
                          endPage = totalPages;
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }
                      }

                      return pages.map((page, index) => {
                        if (page === '...') {
                          return (
                            <span key={`dots-${index}`} className="w-10 text-center text-gray-400 font-medium">
                              ...
                            </span>
                          );
                        }

                        const isActive = currentPage === page;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[42px] h-[42px] flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-300 ${isActive
                              ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110 ring-2 ring-primary ring-offset-2'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary hover:bg-primary/5 shadow-sm'
                              }`}
                            aria-label={`Page ${page}`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm group"
                  >
                    <span className="hidden md:inline text-sm font-semibold">Next</span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest leading-none">
                  Page {currentPage} of {totalPages}
                </p>
              </motion.div>
            )}


          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
}

export default ProductPage;