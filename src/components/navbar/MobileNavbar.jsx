import { Link } from 'react-router-dom';
import { FaTimes, FaSync, FaVideo, FaWhatsapp } from 'react-icons/fa';
import { ChefHat, Building2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../SearchBar';
import logo from '../../assets/images/ratan-decor.png';

// Custom Down Arrow SVG Component
const DownArrowIcon = () => (
  <svg
    width="12"
    height="10"
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 py-1 md:hidden font-roboto">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-16 w-full gap-2">
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
                    className="h-6 transition-transform duration-300 hover:scale-105"
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

          {/* User Type Selector - In Navbar */}
          {!isMobileSearchOpen && (
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setIsUserTypePopupOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1.5 pb-2 font-medium text-gray-800 transition-all duration-200 active:scale-95 focus:outline-none font-roboto group relative"
                aria-label="Change project type"
              >
                {(() => {
                  const iconClass =
                    "text-[#ff4747] flex-shrink-0 transition-transform duration-200 group-hover:rotate-6";
                  const name = (currentUserType || "").toLowerCase();
                  if (name.includes("modular") || name.includes("kitchen")) {
                    return <ChefHat className={iconClass} size={16} />;
                  } else if (name.includes("commercial")) {
                    return <Building2 className={iconClass} size={16} />;
                  } else if (name.includes("residential")) {
                    return <Home className={iconClass} size={16} />;
                  }
                  return <FaSync className={iconClass} size={14} />;
                })()}
                <span className="text-[14.5px] font-bold truncate max-w-[75px] leading-tight">
                  {currentUserType || "Type"}
                </span>
                {/* Custom Underline */}
                <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[87%] h-[1px] bg-[#ff4747]"></span>
              </button>
            </div>
          )}


          {/* Action Buttons - WhatsApp and Video Call */}
          {!isMobileSearchOpen && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/919381059678"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center"
              >
                <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.3)] text-white border-2 border-white">
                  <FaWhatsapp size={20} />
                </div>
              </motion.a>

              {/* Video Call Button with Label */}
              <motion.button
                onClick={onOpenVideoCallPopup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center relative"
              >
                {/* Subtle Pulse Animation */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-red-400 rounded-full -z-10 top-0"
                />
                
                <div className="w-9 h-9 bg-[#ff4747] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,71,71,0.3)] text-white border-2 border-white">
                  <FaVideo size={18} />
                </div>
                
                {/* Shop on call text */}
                <div className="absolute -bottom-4 whitespace-nowrap">
                  <span className="text-[9px] font-bold text-gray-800 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm border border-gray-200/50">
                    Shop on call
                  </span>
                </div>
              </motion.button>
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