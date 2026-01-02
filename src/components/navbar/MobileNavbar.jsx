import { Link } from 'react-router-dom';
import { FaTimes, FaSync, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../SearchBar';
import logo from '../../assets/images/ratan-decor.png';

// Custom Down Arrow SVG Component
const DownArrowIcon = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 10 6"
    fill="#ff4747"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0 L5 6 L10 0 Z" />
  </svg>
);

export default function MobileNavbar({
  currentUserType,
  setIsUserTypePopupOpen,
  isMobileSearchOpen,
  setIsMobileSearchOpen,
  onOpenCart,
  isCartOpen,
  cartCount = 0
}) {
  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 py-2 md:hidden font-roboto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <AnimatePresence mode="wait">
            {!isMobileSearchOpen ? (
              <motion.div
                key="logo"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center mr-4"
              >
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    alt="Ratan Decor Logo"
                    className="h-7 transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full mr-2"
              >
                <SearchBar
                  currentUserType={currentUserType}
                  isMobile={true}
                  onClose={closeMobileSearch}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Controls */}
          <div className={`flex items-center ${isMobileSearchOpen ? 'space-x-1' : 'space-x-2'}`}>
            {/* Close Search */}
            <AnimatePresence>
              {isMobileSearchOpen && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={closeMobileSearch}
                  className="flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 touch-target flex-shrink-0 font-roboto"
                  aria-label="Close search"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="text-[#ff4747] text-lg" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Cart Icon - Only in Top Navbar */}
            {!isMobileSearchOpen && (
              <button
                onClick={onOpenCart}
                className="flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 touch-target flex-shrink-0 font-roboto relative"
                aria-label="Open cart"
              >
                <div className="relative">
                  <FaShoppingCart className={`text-2xl transition-colors duration-200 ${isCartOpen ? 'text-[#ff4747]' : 'text-gray-700'}`} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ff4747] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full border-2 border-white flex items-center justify-center shadow-md transform scale-105">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* User Type Button */}
            {!isMobileSearchOpen && (
              <motion.button
                onClick={() => setIsUserTypePopupOpen(true)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 touch-target flex-shrink-0 font-roboto"
                aria-label="Change project type"
                whileTap={{ scale: 0.95 }}
              >
                <FaSync className="text-[#ff4747] text-base" />
                <span className="text-base font-medium relative group">
                  {currentUserType}
                  <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-[#ff4747] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </span>
                <DownArrowIcon className="ml-1" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}