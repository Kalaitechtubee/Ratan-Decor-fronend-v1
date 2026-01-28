import { motion, AnimatePresence } from 'framer-motion';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import EnhancedProductCard from './EnhancedProductCard';

function ProductGrid({
  products = [],
  viewMode = 'grid',
  status = 'idle',
  error = null,
  onRetry = null
}) {
  console.log('ProductGrid received:', { products: products.length, viewMode, status, error });

  // Loading state
  if (status === 'loading') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Products</h3>
          <p className="text-gray-600">Please wait while we fetch the latest products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'failed' && error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            {error || 'Something went wrong while loading products. Please try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-12"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gray-100 rounded-full">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            We couldn't find any products matching your current search criteria.
            Try adjusting your filters or search terms to see more results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                // Clear search params
                const url = new URL(window.location);
                url.search = '';
                window.history.replaceState({}, '', url);
                window.location.reload();
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Filter Clear
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout configurations
  const gridConfigs = {
    grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    list: 'grid-cols-1'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Products Grid */}
      <div className={`grid gap-6 ${gridConfigs[viewMode] || gridConfigs.grid}`}>
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05 // Stagger animation
              }}
              layout
            >
              <EnhancedProductCard
                product={product}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


    </motion.div>
  );
}

// Skeleton loader component for better UX
export function ProductGridSkeleton({ viewMode = 'grid', count = 8 }) {
  const gridConfig = viewMode === 'grid'
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : 'grid-cols-1';

  return (
    <div className={`grid gap-6 ${gridConfig}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {viewMode === 'grid' ? (
            <div className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex animate-pulse">
              <div className="w-64 aspect-[4/3] bg-gray-200"></div>
              <div className="flex-1 p-6 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;