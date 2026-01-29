import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimesCircle, FaSpinner, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { FiBox } from 'react-icons/fi';
import { MdCategory } from 'react-icons/md';
import { ProductSearchService, CategoryService } from '../services/apiServices';

const SearchBar = ({ currentUserType, isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load recent searches (oldest first)
  useEffect(() => {
    const recent = ProductSearchService.getRecentSearches().slice(-5); // oldest → newest
    setRecentSearches(recent);
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (searchTerm.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => handleSearch(searchTerm.trim()), 300);
    } else {
      setSearchResults([]);
      setCategoryResults([]);
      setSearchError(null);
      setIsSearching(false);
    }

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm, currentUserType]);

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      setSearchError(null);

      const [prodResults, catResults] = await Promise.all([
        ProductSearchService.searchProducts(query, currentUserType, 5),
        CategoryService.searchCategories(query).catch(() => [])
      ]);

      setSearchResults(prodResults);
      setCategoryResults(catResults || []);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError("Failed to search. Please try again.");
      setSearchResults([]);
      setCategoryResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Update recent searches (oldest → newest)
  const refreshRecentSearches = () => {
    const updated = ProductSearchService.getRecentSearches().slice(-5);
    setRecentSearches(updated);
  };

  const handleSearchSubmit = (query = searchTerm) => {
    if (!query.trim()) return;

    ProductSearchService.saveRecentSearch(query.trim());
    refreshRecentSearches();

    navigate(`/products?search=${encodeURIComponent(query.trim())}`);

    setSearchTerm('');
    setIsSearchOpen(false);
    if (isMobile && onClose) onClose();
  };

  const handleSearchResultClick = (result) => {
    if (result.type === 'product') navigate(`/products/${result.id}`);
    else navigate(`/products?category=${result.id}`);

    ProductSearchService.saveRecentSearch(result.name);
    refreshRecentSearches();

    setSearchTerm('');
    setIsSearchOpen(false);
    if (isMobile && onClose) onClose();
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
    handleSearchSubmit(search);
  };

  const clearSearchInput = () => {
    setSearchTerm('');
    setSearchResults([]);
    setCategoryResults([]);
    setSearchError(null);
    searchInputRef.current?.focus();
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className={`relative ${isMobile ? "w-full" : "w-full max-w-3xl mx-auto"}`}>
      
      {/* INPUT */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products or categories..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-[#ff4747]/60 rounded-full 
                     focus:border-[#ff4747] focus:ring-2 focus:ring-[#ff4747] outline-none transition-all font-roboto"
          onFocus={() => setIsSearchOpen(true)}
          onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
        />

        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ff4747]" />

        {searchTerm && (
          <button
            onClick={clearSearchInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff4747]"
          >
            <FaTimesCircle />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 
                       shadow-lg max-h-80 overflow-y-auto z-50 no-scrollbar"
          >

            {/* LOADING */}
            {isSearching ? (
              <div className="flex items-center justify-center py-3">
                <FaSpinner className="animate-spin text-[#ff4747] mr-2" />
                <span className="text-sm text-gray-600">Searching...</span>
              </div>
            ) : searchError ? (
              <div className="py-3 text-center">
                <FaExclamationTriangle className="text-[#ff4747] mx-auto mb-1" />
                <p className="text-sm text-gray-600">{searchError}</p>
              </div>
            ) : (
              <>
                {/* PRODUCT RESULTS */}
                {(searchResults.length > 0 || categoryResults.length > 0) && (
                  <div className="p-2">
                    {searchResults.map((result, i) => (
                      <motion.button
                        key={`prod-${result.id}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleSearchResultClick(result)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-[#ff4747]/10 rounded-lg text-sm"
                      >
                        <FiBox className="text-[#ff4747]" />
                        {result.name}
                      </motion.button>
                    ))}

                    {categoryResults.map((result, i) => (
                      <motion.button
                        key={`cat-${result.id}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: (searchResults.length + i) * 0.04 }}
                        onClick={() => handleSearchResultClick(result)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-[#ff4747]/10 rounded-lg text-sm"
                      >
                        <MdCategory className="text-[#ff4747]" />
                        {result.name}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* RECENT SEARCHES — OLDEST FIRST */}
                {recentSearches.length > 0 && searchTerm.length < 2 && (
                  <div className="border-t border-gray-200 p-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Recent Searches
                    </h4>

                    {recentSearches.map((search, i) => (
                      <motion.button
                        key={`recent-${i}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-left 
                                   hover:bg-[#ff4747]/10 rounded-lg text-sm"
                      >
                        <FaClock className="text-[#ff4747]" />
                        {search}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HIDE SCROLLBAR */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SearchBar;
