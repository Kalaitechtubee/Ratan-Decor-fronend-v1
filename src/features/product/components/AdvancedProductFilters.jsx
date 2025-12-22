// components/AdvancedProductFilters.jsx (corrected and integrated)
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  RefreshCw,
  Search
} from 'lucide-react';

// Function to recursively collect all categories and subcategories
function getAllCategories(categories) {
  if (!Array.isArray(categories)) {
    return [];
  }
  const allCategories = [];
  categories.forEach(category => {
    if (!category || typeof category !== 'object') return;
    allCategories.push({
      id: category.id ?? '',
      name: category.name ?? 'Unnamed Category',
      productCount: category.productCount ?? 0
    });
    if (Array.isArray(category.subCategories) && category.subCategories.length > 0) {
      allCategories.push(...getAllCategories(category.subCategories));
    }
  });
  return allCategories;
}

export default function AdvancedProductFilters({
  categories = [],
  filters = {},
  onFilterChange,
  onClearFilters,
  appliedFiltersCount = 0,
  productCount = 0,
  isLoading = false
}) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  // Changed to array for multi-select
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(filters.categoryIds) ? filters.categoryIds.map(String) : []
  );
  const [collapsedSections, setCollapsedSections] = useState(new Set()); // Categories section open by default
  const [minDesignNumber, setMinDesignNumber] = useState(filters.minDesignNumber || '');
  const [maxDesignNumber, setMaxDesignNumber] = useState(filters.maxDesignNumber || '');
  const [designSearch, setDesignSearch] = useState(filters.designNumber || ''); // Added exact/partial search
  const [minPrice, setMinPrice] = useState(parseFloat(filters.minPrice) || 0);
  const [maxPrice, setMaxPrice] = useState(parseFloat(filters.maxPrice) || 50000);
  const [isDragging, setIsDragging] = useState(null);
  // Refs for price slider
  const sliderRef = useRef(null);
  const designNumberTimeoutRef = useRef(null);
  const priceTimeoutRef = useRef(null);
  // Refs to track latest price values for event listeners
  const minPriceRef = useRef(minPrice);
  const maxPriceRef = useRef(maxPrice);
  const MAX_PRICE = 50000;
  const MIN_PRICE = 0;
  // Sync external filter changes
  useEffect(() => {
    // Sync categoryIds from filters
    const filterCategoryIds = Array.isArray(filters.categoryIds)
      ? filters.categoryIds.map(String)
      : [];
    const currentSelected = selectedCategories.join(',');
    const filterSelected = filterCategoryIds.join(',');
    if (filterSelected !== currentSelected) {
      setSelectedCategories(filterCategoryIds);
    }

    // Helper to safely convert to string
    const toStr = (val) => (val === null || val === undefined) ? '' : String(val);

    const filterMinDesign = toStr(filters.minDesignNumber);
    if (filterMinDesign !== minDesignNumber) {
      setMinDesignNumber(filterMinDesign);
    }

    const filterMaxDesign = toStr(filters.maxDesignNumber);
    if (filterMaxDesign !== maxDesignNumber) {
      setMaxDesignNumber(filterMaxDesign);
    }

    const filterDesign = toStr(filters.designNumber);
    if (filterDesign !== designSearch) {
      setDesignSearch(filterDesign);
    }

    const filterMinPrice = parseFloat(filters.minPrice);
    if (!isNaN(filterMinPrice) && filterMinPrice !== minPrice && !isDragging) {
      setMinPrice(filterMinPrice);
    }

    const filterMaxPrice = parseFloat(filters.maxPrice);
    if (!isNaN(filterMaxPrice) && filterMaxPrice !== maxPrice && !isDragging) {
      setMaxPrice(filterMaxPrice);
    } else if (isNaN(filterMaxPrice) && !isDragging) {
      // Reset to max if filter is cleared/invalid
      setMaxPrice(50000);
    }
  }, [filters]);

  // Sync refs with state
  useEffect(() => {
    minPriceRef.current = minPrice;
    maxPriceRef.current = maxPrice;
  }, [minPrice, maxPrice]);
  // Debounced design number changes (now includes exact search)
  useEffect(() => {
    if (designNumberTimeoutRef.current) {
      clearTimeout(designNumberTimeoutRef.current);
    }
    designNumberTimeoutRef.current = setTimeout(() => {
      const currentSearch = designSearch.trim();
      const currentMin = minDesignNumber.trim();
      const currentMax = maxDesignNumber.trim();
      const filterSearch = (filters.designNumber || '').trim();
      const filterMin = (filters.minDesignNumber || '').trim();
      const filterMax = (filters.maxDesignNumber || '').trim();
      if (currentSearch !== filterSearch) {
        onFilterChange('designNumber', currentSearch || '');
      }
      if (currentMin !== filterMin || currentMax !== filterMax) {
        if (currentMin) onFilterChange('minDesignNumber', currentMin);
        if (currentMax) onFilterChange('maxDesignNumber', currentMax);
        if (!currentMin && filterMin) onFilterChange('minDesignNumber', '');
        if (!currentMax && filterMax) onFilterChange('maxDesignNumber', '');
      }
    }, 500);
    return () => {
      if (designNumberTimeoutRef.current) {
        clearTimeout(designNumberTimeoutRef.current);
      }
    };
  }, [designSearch, minDesignNumber, maxDesignNumber]);
  // Auto-expand categories with selected subcategories
  useEffect(() => {
    if (selectedCategories.length > 0 && categories.length > 0) {
      const findCategoryPath = (cats, targetId, path = []) => {
        for (const cat of cats) {
          if (cat.id.toString() === targetId.toString()) {
            return [...path, cat.id];
          }
          if (cat.subCategories?.length > 0) {
            const found = findCategoryPath(cat.subCategories, targetId, [...path, cat.id]);
            if (found) return found;
          }
        }
        return null;
      };

      // Expand paths for all selected categories
      const allPaths = new Set();
      selectedCategories.forEach(categoryId => {
        const path = findCategoryPath(categories, categoryId);
        if (path) {
          path.forEach(id => allPaths.add(id));
        }
      });
      setExpandedCategories(allPaths);
    }
  }, [selectedCategories, categories]);
  // Price slider helper functions
  const priceToPercent = (price) => {
    return ((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  };
  const pixelToPrice = (pixel, rect) => {
    const percentage = Math.max(0, Math.min(1, pixel / rect.width));
    return Math.round(MIN_PRICE + (percentage * (MAX_PRICE - MIN_PRICE)));
  };
  // Handle mouse events for dragging price slider
  const handleMouseDown = (type, e) => {
    e.preventDefault();
    setIsDragging(type);

    const handleMouseMove = (e) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const newPrice = pixelToPrice(e.clientX - rect.left, rect);

      if (type === 'min') {
        const constrainedPrice = Math.min(newPrice, maxPrice - 100);
        const finalPrice = Math.max(MIN_PRICE, constrainedPrice);
        setMinPrice(finalPrice);
      } else {
        const constrainedPrice = Math.max(newPrice, minPrice + 100);
        const finalPrice = Math.min(MAX_PRICE, constrainedPrice);
        setMaxPrice(finalPrice);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);

      // Debounce the filter change
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
      priceTimeoutRef.current = setTimeout(() => {
        onFilterChange({
          minPrice: minPriceRef.current.toString(),
          maxPrice: maxPriceRef.current.toString()
        });
      }, 300);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  // Handle touch events for mobile
  const handleTouchStart = (type, e) => {
    e.preventDefault();
    setIsDragging(type);

    const handleTouchMove = (e) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const newPrice = pixelToPrice(touch.clientX - rect.left, rect);

      if (type === 'min') {
        const constrainedPrice = Math.min(newPrice, maxPrice - 100);
        setMinPrice(Math.max(MIN_PRICE, constrainedPrice));
      } else {
        const constrainedPrice = Math.max(newPrice, minPrice + 100);
        setMaxPrice(Math.min(MAX_PRICE, constrainedPrice));
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(null);

      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
      priceTimeoutRef.current = setTimeout(() => {
        onFilterChange({
          minPrice: minPriceRef.current.toString(),
          maxPrice: maxPriceRef.current.toString()
        });
      }, 300);

      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };
  // Handle clicking on the track
  const handleTrackClick = (e) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickPrice = pixelToPrice(e.clientX - rect.left, rect);

    const distToMin = Math.abs(clickPrice - minPrice);
    const distToMax = Math.abs(clickPrice - maxPrice);

    if (distToMin < distToMax) {
      const newMinPrice = Math.min(clickPrice, maxPrice - 100);
      setMinPrice(newMinPrice);
      onFilterChange('minPrice', newMinPrice.toString());
    } else {
      const newMaxPrice = Math.max(clickPrice, minPrice + 100);
      setMaxPrice(newMaxPrice);
      onFilterChange('maxPrice', newMaxPrice.toString());
    }
  };
  // Handle keyboard navigation
  const handleKeyDown = (type, e) => {
    const step = e.shiftKey ? 1000 : 100;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (type === 'min') {
          const newMinPrice = Math.max(MIN_PRICE, minPrice - step);
          setMinPrice(newMinPrice);
          onFilterChange('minPrice', newMinPrice.toString());
        } else {
          const newMaxPrice = Math.max(minPrice + 100, maxPrice - step);
          setMaxPrice(newMaxPrice);
          onFilterChange('maxPrice', newMaxPrice.toString());
        }
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (type === 'min') {
          const newMinPrice = Math.min(maxPrice - 100, minPrice + step);
          setMinPrice(newMinPrice);
          onFilterChange('minPrice', newMinPrice.toString());
        } else {
          const newMaxPrice = Math.min(MAX_PRICE, maxPrice + step);
          setMaxPrice(newMaxPrice);
          onFilterChange('maxPrice', newMaxPrice.toString());
        }
        break;
    }
  };
  // Handle category selection (multi-select toggle)
  const handleCategorySelect = (categoryId) => {
    const categoryIdStr = categoryId.toString();
    const isSelected = selectedCategories.includes(categoryIdStr);

    let newSelectedCategories;
    if (isSelected) {
      // Remove if already selected
      newSelectedCategories = selectedCategories.filter(id => id !== categoryIdStr);
    } else {
      // Add if not selected
      newSelectedCategories = [...selectedCategories, categoryIdStr];
    }

    setSelectedCategories(newSelectedCategories);
    // Call onFilterChange with 'categoryId' which triggers toggle behavior in slice
    onFilterChange('categoryId', categoryIdStr);
  };

  // Check if a category is selected
  const isCategorySelected = (categoryId) => {
    return selectedCategories.includes(categoryId.toString());
  };
  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  const toggleSection = (sectionName) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionName)) {
      newCollapsed.delete(sectionName);
    } else {
      newCollapsed.add(sectionName);
    }
    setCollapsedSections(newCollapsed);
  };
  // Handle price preset buttons
  const handlePricePreset = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    onFilterChange({
      minPrice: min.toString(),
      maxPrice: max.toString()
    });
  };
  // Handle manual price input
  const handleMinPriceInput = (e) => {
    const value = Math.max(MIN_PRICE, Math.min(maxPrice - 100, parseInt(e.target.value) || 0));
    setMinPrice(value);
    onFilterChange('minPrice', value.toString());
  };
  const handleMaxPriceInput = (e) => {
    const value = Math.min(MAX_PRICE, Math.max(minPrice + 100, parseInt(e.target.value) || 0));
    setMaxPrice(value);
    onFilterChange('maxPrice', value.toString());
  };
  // Reset price range
  const resetPriceRange = () => {
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    onFilterChange({
      minPrice: '',
      maxPrice: ''
    });
  };
  // Handle design search input
  const handleDesignSearchInput = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setDesignSearch(value);
    // Clear range if exact search is used (optional logic; adjust as needed)
    if (value && (minDesignNumber || maxDesignNumber)) {
      setMinDesignNumber('');
      setMaxDesignNumber('');
      onFilterChange('minDesignNumber', '');
      onFilterChange('maxDesignNumber', '');
    }
  };
  // Clear design filters
  const clearDesignFilters = () => {
    setDesignSearch('');
    setMinDesignNumber('');
    setMaxDesignNumber('');
    onFilterChange('designNumber', '');
    onFilterChange('minDesignNumber', '');
    onFilterChange('maxDesignNumber', '');
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategories([]);
    onFilterChange('categoryIds', []);
  };

  // Recursive category tree rendering with checkboxes
  const renderCategoryTree = (cats, level = 0) => {
    return cats.map(category => {
      const isSelected = isCategorySelected(category.id);

      return (
        <div key={category.id} className="mb-1">
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${isSelected
              ? 'bg-accent/10 border border-accent/20'
              : 'hover:bg-gray-50 border border-transparent'
              }`}
            style={{ paddingLeft: `${0.75 + level * 1.5}rem` }}
          >
            <div
              className="flex items-center flex-1 min-w-0 gap-2 cursor-pointer"
              onClick={() => handleCategorySelect(category.id)}
            >
              {/* Checkbox */}
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                ? 'bg-accent border-accent'
                : 'border-gray-300 hover:border-accent'
                }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium truncate ${isSelected ? 'text-accent' : 'text-gray-700'
                }`}>
                {category.name}
              </span>
              {/* Show product count if available */}
              {category.productCount !== undefined && category.productCount > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {category.productCount}
                </span>
              )}
            </div>
            {category.subCategories?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoryExpansion(category.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
              >
                <span className="text-xs text-gray-400">{category.subCategories.length}</span>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </div>
          <AnimatePresence>
            {expandedCategories.has(category.id) && category.subCategories?.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {renderCategoryTree(category.subCategories, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  // Render All Categories option at the top
  const renderAllCategoriesOption = () => (
    <div
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${selectedCategories.length === 0
        ? 'bg-accent/10 text-accent border border-accent/20'
        : 'hover:bg-gray-50 border border-transparent'
        }`}
      onClick={clearCategoryFilter}
    >
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4" />
        <span className={`text-sm font-medium ${selectedCategories.length === 0 ? 'text-accent' : 'text-gray-700'}`}>
          All Categories
        </span>
      </div>
      {selectedCategories.length > 0 && (
        <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
          {selectedCategories.length} selected - Clear
        </span>
      )}
    </div>
  );
  const renderSection = (title, Icon, content, sectionName) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(sectionName)}
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-gray-600" />}
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsedSections.has(sectionName) ? 'rotate-180' : ''
          }`} />
      </button>
      <AnimatePresence>
        {!collapsedSections.has(sectionName) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        </div>
        {appliedFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-accent hover:text-accent-dark transition-colors flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>
      {/* Category Section */}
      {renderSection(
        'Categories',
        Layers,
        <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {renderAllCategoriesOption()}
          {Array.isArray(categories) && categories.length > 0 ? (
            renderCategoryTree(categories)
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No categories available
            </div>
          )}
        </div>,
        'categories'
      )}
      {/* Price Range Section */}
      {renderSection(
        'Price (₹)',
        null,
        <div className="space-y-4">
          {/* Interactive Dual Range Slider */}
          <div className="px-2">
            <div className="relative h-8 mb-4" ref={sliderRef}>
              <div
                className="absolute top-1/2 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2 cursor-pointer"
                onClick={handleTrackClick}
              />
              <div
                className="absolute top-1/2 h-2 bg-accent rounded-full -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${priceToPercent(minPrice)}%`,
                  width: `${priceToPercent(maxPrice) - priceToPercent(minPrice)}%`
                }}
              />
              <div
                className={`absolute top-1/2 w-6 h-6 bg-accent border-4 border-white rounded-full shadow-lg cursor-grab transform -translate-y-1/2 -translate-x-3 transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 z-20 ${isDragging === 'min' ? 'scale-110 cursor-grabbing' : ''
                  }`}
                style={{ left: `${priceToPercent(minPrice)}%` }}
                tabIndex={0}
                role="slider"
                aria-label="Minimum price"
                aria-valuemin={MIN_PRICE}
                aria-valuemax={maxPrice - 100}
                aria-valuenow={minPrice}
                onMouseDown={(e) => handleMouseDown('min', e)}
                onTouchStart={(e) => handleTouchStart('min', e)}
                onKeyDown={(e) => handleKeyDown('min', e)}
              />
              <div
                className={`absolute top-1/2 w-6 h-6 bg-accent border-4 border-white rounded-full shadow-lg cursor-grab transform -translate-y-1/2 -translate-x-3 transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 z-10 ${isDragging === 'max' ? 'scale-110 cursor-grabbing' : ''
                  }`}
                style={{ left: `${priceToPercent(maxPrice)}%` }}
                tabIndex={0}
                role="slider"
                aria-label="Maximum price"
                aria-valuemin={minPrice + 100}
                aria-valuemax={MAX_PRICE}
                aria-valuenow={maxPrice}
                onMouseDown={(e) => handleMouseDown('max', e)}
                onTouchStart={(e) => handleTouchStart('max', e)}
                onKeyDown={(e) => handleKeyDown('max', e)}
              />
            </div>

            {/* Price Display */}
            <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
              <span className="px-2 py-1 bg-accent/10 text-accent rounded">
                ₹{minPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-gray-400">to</span>
              <span className="px-2 py-1 bg-accent/10 text-accent rounded">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>₹{MIN_PRICE.toLocaleString('en-IN')}</span>
              <span>₹{MAX_PRICE.toLocaleString('en-IN')}</span>
            </div>
          </div>
          {/* Manual Input */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceInput}
                  className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                  min={MIN_PRICE}
                  max={maxPrice - 100}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceInput}
                  className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                  min={minPrice + 100}
                  max={MAX_PRICE}
                />
              </div>
            </div>
          </div>
          {/* Quick Price Buttons */}

          {/* Clear Filter */}
          {(minPrice > MIN_PRICE || maxPrice < MAX_PRICE) && (
            <button
              onClick={resetPriceRange}
              className="w-full py-2 text-sm border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
            >
              Reset Price Range
            </button>
          )}
        </div>,
        'priceRange'
      )}
      {/* Design Number Filter Section */}
      {renderSection(
        'Design Number',
        Search,
        <div className="space-y-4">
          {/* Exact/Partial Search Input */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search Design Number
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={designSearch}
                onChange={handleDesignSearchInput}
                placeholder="e.g., 12345 or partial"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          {/* Range Filters */}
          <div className="grid grid-cols-2 gap-3">
            {/* Minimum Design Number Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Min Design Number
              </label>
              <div className="relative">
                <select
                  value={minDesignNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMinDesignNumber(value);
                    if (value && maxDesignNumber && parseInt(value) >= parseInt(maxDesignNumber)) {
                      setMaxDesignNumber('');
                    }
                  }}
                  className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent appearance-none"
                >
                  <option value="">No Minimum</option>
                  {[
                    { label: '1', value: '1' },
                    { label: '1000', value: '1000' },
                    { label: '5000', value: '5000' },
                    { label: '10000', value: '10000' },
                    { label: '20000', value: '20000' },
                    { label: '50000', value: '50000' }
                  ].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Maximum Design Number Dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Design Number
              </label>
              <div className="relative">
                <select
                  value={maxDesignNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMaxDesignNumber(value);
                    if (value && minDesignNumber && parseInt(value) <= parseInt(minDesignNumber)) {
                      setMinDesignNumber('');
                    }
                  }}
                  className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent appearance-none"
                >
                  <option value="">No Maximum</option>
                  {[
                    { label: '1000', value: '1000' },
                    { label: '5000', value: '5000' },
                    { label: '10000', value: '10000' },
                    { label: '20000', value: '20000' },
                    { label: '50000', value: '50000' },
                    { label: '999999', value: '999999' }
                  ].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {(designSearch || minDesignNumber || maxDesignNumber) && (
            <button
              onClick={clearDesignFilters}
              className="w-full py-2 text-sm border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
            >
              Clear Design Filter
            </button>
          )}
          {(designSearch || minDesignNumber || maxDesignNumber) && (
            <div className="text-xs text-accent bg-accent/10 p-2 rounded">
              {designSearch ? `Searching: ${designSearch}` : ''}
              {designSearch && (minDesignNumber || maxDesignNumber) ? ' | ' : ''}
              {minDesignNumber === maxDesignNumber && minDesignNumber
                ? `Exact: ${minDesignNumber}`
                : `Range: ${minDesignNumber || 'Any'} - ${maxDesignNumber || 'Any'}`}
            </div>
          )}
        </div>,
        'designNumberFilter'
      )}
      {/* Product Count Display */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          <>
            {productCount} products found
            {selectedCategories.length > 0 && (
              <div className="mt-2 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
              </div>
            )}
            {(designSearch || minDesignNumber || maxDesignNumber) && (
              <div className="mt-2 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                Design filter active
              </div>
            )}
            {(minPrice > MIN_PRICE || maxPrice < MAX_PRICE) && (
              <div className="mt-2 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                Price filter: ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
              </div>
            )}
          </>
        )}
      </div>
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}