import { motion, AnimatePresence } from 'framer-motion';
import { MdGridView, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import CategoryDropdown from '../CategoryDropdown';

export default function ProductSidebar({
  isProductSidebarOpen,
  setIsProductSidebarOpen,
  handleCategoryClick,
  handleProductClick,
  activeCategory
}) {
  const navigate = useNavigate();

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  // Handle category click with navigation
  const handleMobileCategoryClick = (category) => {
    console.log('Mobile category clicked:', category);
    
    // Call parent handler if provided
    if (handleCategoryClick) {
      handleCategoryClick(category);
    }
    
    // Close sidebar
    setIsProductSidebarOpen(false);
    
    // Navigate to products page with category filter
    setTimeout(() => {
      if (category && category.id) {
        const url = `/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`;
        console.log('Mobile navigating to:', url);
        navigate(url);
      } else if (category && category.name) {
        const url = `/products?search=${encodeURIComponent(category.name)}`;
        console.log('Mobile fallback navigation to:', url);
        navigate(url);
      } else {
        console.log('Mobile navigating to all products');
        navigate('/products');
      }
    }, 100);
  };

  // Handle sidebar close
  const handleCloseSidebar = () => {
    setIsProductSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      {isProductSidebarOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={handleCloseSidebar}
          />
          
          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#ff4747] to-[#ff4747]/80 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <MdGridView className="text-2xl" />
                <div>
                  <h2 className="text-base font-bold font-roboto">Products</h2>
                  <p className="text-xs text-white/80">Browse our categories</p>
                </div>
              </div>
              <button
                onClick={handleCloseSidebar}
                className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 touch-target"
                aria-label="Close products menu"
              >
                <MdClose className="text-base" />
              </button>
            </div>
            
            {/* Sidebar Content */}
            <div className="sidebar-content bg-gray-50 h-full overflow-y-auto">
              <CategoryDropdown
                isOpen={true}
                onClose={handleCloseSidebar}
                isMobileSidebar={true}
                onCategoryClick={handleMobileCategoryClick}
                activeCategory={activeCategory}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
// shg