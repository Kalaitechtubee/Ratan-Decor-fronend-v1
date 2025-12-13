import React, { useEffect } from 'react';
import { Loader2, ArrowRight, ShoppingBag, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import useProducts from '../../features/product/hooks/useProducts';

const primaryColor = "#ff4747";

const PopularCategories = ({ onCategoryClick }) => {
  const { categories, loadCategories, isLoading, error } = useProducts();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter main categories (non-subcategories) and exclude "Others"
  const mainCategories = React.useMemo(() => {
    return categories.filter(
      cat => !cat.isSubcategory && 
             cat.name.toLowerCase() !== 'others' && 
             cat.name.toLowerCase() !== 'other'
    );
  }, [categories]);

  const getCategoryImageUrl = (category) => {
    if (!category.imageUrl) {
      return null;
    }
    
    // If imageUrl is already a complete URL, use it as-is
    if (category.imageUrl.startsWith('http://') || category.imageUrl.startsWith('https://')) {
      return category.imageUrl;
    }
    
    // Otherwise, construct the full URL
    const baseUrl = import.meta?.env?.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrlWithoutApi = baseUrl.replace('/api', '');
    return `${baseUrlWithoutApi}${category.imageUrl}`;
  };

  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      console.log('Category clicked:', category);
      window.location.href = `/products?categoryId=${category.id}`;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.1 
      } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 10 
      } 
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: primaryColor }} />
            <p className="text-gray-600 text-lg">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 text-lg">Error loading categories: {error}</p>
            <button
              onClick={loadCategories}
              className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mainCategories.length === 0) {
    return (
      <div className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No categories found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            variants={titleVariants}
          >
            Shop by <span style={{ color: primaryColor }}>Categories</span>
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            variants={titleVariants}
          >
            Discover our stunning range of premium materials for your dream space
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {mainCategories.map((category) => {
            const imageUrl = getCategoryImageUrl(category);
            
            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer relative overflow-hidden rounded-2xl"
                onClick={() => handleCategoryClick(category)}
              >
                {/* Shine Effect Layer */}
                <div className="absolute inset-0 shine-overlay z-10 pointer-events-none"></div>
                
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-44 sm:h-96">
                  <div className="relative h-full overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          console.warn(`Failed to load image for category: ${category.name}`);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}
                      style={{ display: imageUrl ? 'none' : 'flex' }}
                    >
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundColor: primaryColor }}
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                            {category.name}
                          </h3>
                        </div>
                        
                        <motion.div
                          className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Add CSS for shine effect */}
      <style>{`
        .shine-overlay {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          transform: skewX(-25deg);
          transition: left 0.75s ease-in-out;
          pointer-events: none;
        }

        .group:hover .shine-overlay {
          left: 150%;
        }

        /* Alternative shine effect with diagonal movement */
        .shine-overlay {
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          transform: skewX(-25deg);
        }

        /* Ensure the shine effect works on all screen sizes */
        @media (max-width: 640px) {
          .shine-overlay {
            transform: skewX(-15deg);
          }
        }
      `}</style>
    </section>
  );
};

export default PopularCategories;