import { Link } from 'react-router-dom';
import { FaTimes, FaSync, FaVideo, FaWhatsapp } from 'react-icons/fa';
import { ChefHat, Building2, Home } from 'lucide-react';
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
  cartCount = 0,
  onOpenVideoCallPopup
}) {
  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 py-2 md:hidden font-roboto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo Section */}
          <AnimatePresence mode="wait">
            {!isMobileSearchOpen ? (
              <motion.div
                key="logo"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center flex-shrink-0"
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
                className="flex-1"
              >
                <SearchBar
                  currentUserType={currentUserType}
                  isMobile={true}
                  onClose={closeMobileSearch}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop-like User Type Selector - Aligned to Right */}
          {!isMobileSearchOpen && (
            <div className="flex items-center active-persistent-underline pb-0 flex-shrink-0 mr-1">
              <button
                onClick={() => setIsUserTypePopupOpen(true)}
                className="flex items-center gap-2 px-1 py-1 font-medium text-gray-700 transition-all duration-200 active:scale-95 focus:outline-none font-roboto group"
                aria-label="Change project type"
              >
                {(() => {
                  const iconClass =
                    "text-[#ff4747] text-lg flex-shrink-0 transition-transform duration-200 group-hover:rotate-6";
                  const name = (currentUserType || "").toLowerCase();
                  if (name.includes("modular") || name.includes("kitchen")) {
                    return <ChefHat className={iconClass} size={18} />;
                  } else if (name.includes("commercial")) {
                    return <Building2 className={iconClass} size={18} />;
                  } else if (name.includes("residential")) {
                    return <Home className={iconClass} size={18} />;
                  }
                  return <FaSync className={iconClass} size={15} />;
                })()}
                <span className="text-[14.5px] font-bold truncate max-w-[120px] leading-tight mb-[1px]">
                  {currentUserType || "Type"}
                </span>
                <DownArrowIcon />
              </button>
            </div>
          )}
          
          {/* Close Search Button - for search mode */}
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
        </div>
        </div>
    </nav>
  );
}