import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChevronRight, FaSpinner, FaExclamationTriangle, FaCouch, FaChair, 
  FaBed, FaTable, FaStore, FaThLarge, FaDoorOpen, FaLightbulb 
} from 'react-icons/fa';
import { MdCategory, MdKitchen, MdTableRestaurant, MdOutdoorGrill } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../features/product/hooks/useProducts';

const CategoryDropdown = ({
  isOpen,
  onClose,
  isMobileSidebar = false,
  onCategoryClick,
  activeCategory
}) => {
  const navigate = useNavigate();
  const { categories, loadCategories, isLoading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categoryDropdownRef = useRef(null);
  const fetchRef = useRef(false);

  // Utility function to convert string to uppercase
  const toUpperCase = (string) => {
    if (!string) return '';
    return string.toUpperCase();
  };

  // Mouse event handlers for hover functionality
  const handleMouseEnter = () => {
    // Keep dropdown open when mouse enters
  };

  const handleMouseLeave = (e) => {
    if (!categoryDropdownRef.current?.contains(e.relatedTarget)) {
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    if (isOpen && !fetchRef.current) {
      fetchRef.current = true;
      loadCategories();
    } else if (!isOpen) {
      fetchRef.current = false;
      setHoveredCategory(null);
      setSelectedCategory(null);
    }
  }, [isOpen, loadCategories]);

  useEffect(() => {
    if (categories && categories.length > 0 && !hoveredCategory && isOpen) {
      setHoveredCategory(categories[0]);
    }
  }, [categories, isOpen]);

  const handleInternalCategoryClick = (event, category) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (onClose) onClose();
    if (onCategoryClick) onCategoryClick(category);

    if (category && category.id) {
      navigate(`/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`);
    } else if (category && category.name) {
      navigate(`/products?search=${encodeURIComponent(category.name)}`);
    } else {
      navigate('/products');
    }
    setSelectedCategory(null);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (event, parentCategory, subcategory) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (onClose) onClose();
    if (onCategoryClick) onCategoryClick(subcategory);

    if (subcategory && subcategory.id) {
      navigate(`/products?categoryId=${subcategory.id}&categoryName=${encodeURIComponent(subcategory.name)}`);
    } else if (subcategory && subcategory.name) {
      navigate(`/products?search=${encodeURIComponent(subcategory.name)}`);
    }
    setSelectedCategory(null);
    setHoveredCategory(null);
  };

  const handleMobileCategoryClick = (category) => {
    if (selectedCategory?.id === category.id) {
      handleInternalCategoryClick({ stopPropagation: () => {}, preventDefault: () => {} }, category);
    } else {
      setSelectedCategory(category);
    }
  };

  const getCategoryIcon = (name) => {
    const normalizedName = name?.toLowerCase() || '';

    const iconMap = {
      'living room': <FaCouch className="text-[#ff4747]" />,
      'bedroom': <FaBed className="text-[#ff4747]" />,
      'dining room': <MdTableRestaurant className="text-[#ff4747]" />,
      'kitchen': <MdKitchen className="text-[#ff4747]" />,
      'office': <FaTable className="text-[#ff4747]" />,
      'outdoor': <MdOutdoorGrill className="text-[#ff4747]" />,
      'lighting': <FaLightbulb className="text-[#ff4747]" />,
      'storage': <FaDoorOpen className="text-[#ff4747]" />,
      'sofa': <FaCouch className="text-[#ff4747]" />,
      'chair': <FaChair className="text-[#ff4747]" />,
      'bed': <FaBed className="text-[#ff4747]" />,
      'table': <FaTable className="text-[#ff4747]" />,
      'furniture': <FaStore className="text-[#ff4747]" />,
      'all': <FaThLarge className="text-[#ff4747]" />,
    };

    return iconMap[normalizedName] || <MdCategory className="text-[#ff4747]" />;
  };

  const getDisplayCategory = () => {
    return hoveredCategory || (categories && categories.length > 0 ? categories[0] : null);
  };

  const getStaticImageUrl = () => {
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=90&fit=crop';
  };

  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
  };

  const categoryDropdownVariants = {
    hidden: { opacity: 0, x: "-100%", transition: { duration: 0.3, ease: "easeIn" } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.3, ease: "easeIn" } },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.2 } }
  };

  if (!isOpen && !isMobileSidebar) return null;

  return (
    <>
      {/* Desktop Dropdown */}
      {!isMobileSidebar && (
        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-0 z-40"
                onClick={onClose}
              />
              <motion.div
                ref={categoryDropdownRef}
                variants={categoryDropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed left-0 right-0 top-20 bg-white border-t border-gray-200 shadow-lg z-50 font-roboto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Categories Section - Left Side */}
                    <div className="col-span-1 md:col-span-8">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <FaSpinner className="text-xl text-[#ff4747] animate-spin mr-2" />
                          <span className="text-base text-gray-600 font-roboto">Loading categories...</span>
                        </div>
                      ) : error ? (
                        <div className="py-6 text-center">
                          <FaExclamationTriangle className="text-xl text-[#ff4747] mx-auto mb-2" />
                          <p className="text-base text-gray-600 font-roboto mb-4">{error}</p>
                          <button
                            onClick={loadCategories}
                            className="px-6 py-2 bg-[#ff4747] text-white rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto text-base"
                          >
                            Retry
                          </button>
                        </div>
                      ) : !selectedCategory ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {categories.slice(0, 8).map((category) => (
                            <div 
                              key={category.id} 
                              className="group"
                              onMouseEnter={() => handleCategoryHover(category)}
                            >
                              <div className="flex items-center gap-2 mb-2 pb-2 relative">
                                <div className="text-lg group-hover:scale-110 transition-transform duration-300">
                                  {getCategoryIcon(category.name)}
                                </div>
                                <button
                                  onClick={(e) => handleInternalCategoryClick(e, category)}
                                  className="font-semibold text-base text-[#ff4747] cursor-pointer hover:text-[#ff4747]/80 transition-colors duration-300 font-roboto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full w-full text-left"
                                >
                                  {toUpperCase(category.name)}
                                </button>
                              </div>
                              <ul className="space-y-2">
                                {category.subCategories?.slice(0, 6).map((subcategory, index) => (
                                  <li key={subcategory.id || index}>
                                    <button
                                      onClick={(e) => handleSubcategoryClick(e, category, subcategory)}
                                      className="text-sm text-gray-600 hover:text-[#ff4747] px-2 py-1 rounded transition-all duration-300 w-full text-left font-roboto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1"
                                    >
                                      <span className="text-[#ff4747] font-bold">+</span>
                                      <span>{subcategory.name}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-100 transition-all duration-300 font-roboto shadow-sm"
                          >
                            <FaChevronRight className="text-[#ff4747] text-sm transform rotate-180" />
                            <span className="text-base text-gray-800 font-roboto">Back to Categories</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Image Section - Right Side */}
                    <div className="col-span-1 md:col-span-4">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-xl h-full"
                      >
                        <div className="relative h-full min-h-[400px] overflow-hidden">
                          <img 
                            src={getStaticImageUrl()} 
                            alt="Premium Furniture Collection"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=90';
                            }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Sidebar */}
      {isMobileSidebar && (
        <motion.div
          className="sidebar-content p-4 bg-gray-50 h-full overflow-y-auto no-scrollbar font-roboto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <FaSpinner className="text-xl text-[#ff4747] animate-spin mr-2" />
              <span className="text-base text-gray-600 font-roboto">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <FaExclamationTriangle className="text-xl text-[#ff4747] mx-auto mb-2" />
              <p className="text-base text-gray-600 font-roboto mb-4">{error}</p>
              <button
                onClick={loadCategories}
                className="px-6 py-2 bg-[#ff4747] text-white rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto text-base touch-target"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleMobileCategoryClick(category)}
                    className={`flex items-center justify-between p-3 rounded-lg w-full text-left transition-all duration-300 font-roboto touch-target shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full ${
                      activeCategory === category.name ? 'text-[#ff4747]' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getCategoryIcon(category.name)}</div>
                      <span className="text-base text-gray-800 font-roboto">
                        {toUpperCase(category.name)}
                      </span>
                    </div>
                    <FaChevronRight className="text-[#ff4747] text-sm" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default CategoryDropdown;