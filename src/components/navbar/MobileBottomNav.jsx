import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBars, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { useState, useEffect } from 'react';

export default function MobileBottomNav({
  location,
  isActiveRoute,
  setIsProductSidebarOpen,
  navigate,
  user,
  isAuthenticated,
  handleLogout,
  isMoreMenuOpen,
  setIsMoreMenuOpen,
  currentUserType,
  isMobileSearchOpen,
  setIsMobileSearchOpen
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const bottomNavItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    {
      path: '/products',
      icon: MdGridView,
      label: 'Products',
      isProductMenu: true
    },
    {
      path: '#search',
      icon: FaSearch,
      label: 'Search',
      isSearch: true
    },
    {
      path: isAuthenticated ? '/profile' : '/register',
      icon: FaUser,
      label: 'Account',
      isProfile: true
    },
    {
      path: '#more',
      icon: FaBars,
      label: 'More',
      isMoreMenu: true
    }
  ];

  return (
    <motion.nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg md:hidden font-roboto"
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : '100%',
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }}
    >
      <div className="flex items-center justify-center py-1 px-2 max-w-screen-lg mx-auto">
        {bottomNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          const buttonClasses = `flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 relative touch-target w-20 h-16 font-roboto ${
            isActive ||
            (item.isProductMenu && location.pathname.startsWith('/products')) ||
            (item.isMoreMenu && isMoreMenuOpen) ||
            (item.isSearch && isMobileSearchOpen)
              ? 'text-[#ff4747] scale-110 shadow-sm'
              : 'text-gray-600 hover:text-[#ff4747] active:scale-95'
          }`;

          if (item.isProductMenu) {
            return (
              <motion.button
                key="products"
                onClick={() => setIsProductSidebarOpen(true)}
                className={buttonClasses}
                aria-label="Open products menu"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon className="text-xl mb-1" />
                  <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                </div>
              </motion.button>
            );
          }

          if (item.isSearch) {
            return (
              <motion.button
                key="search"
                onClick={toggleMobileSearch}
                className={buttonClasses}
                aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <motion.div
                    animate={{
                      rotate: isMobileSearchOpen ? 45 : 0,
                      scale: isMobileSearchOpen ? 1.1 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="text-xl mb-1" />
                  </motion.div>
                  <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                </div>
              </motion.button>
            );
          }

          if (item.isProfile) {
            return (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to={item.path}
                  className={buttonClasses}
                  aria-label={isAuthenticated ? "Go to profile" : "Go to register"}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <Icon className="text-xl mb-1" />
                    <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            );
          }

          if (item.isMoreMenu) {
            return (
              <motion.div key="more" className="relative">
                <motion.button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={buttonClasses}
                  aria-label="Open more menu"
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <motion.div
                      animate={{ rotate: isMoreMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="text-xl mb-1" />
                    </motion.div>
                    <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                  </div>
                </motion.button>
                <AnimatePresence>
                  {isMoreMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-16 left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg mx-2 p-2 z-50"
                    >
                      <div className="space-y-1">
                        {isAuthenticated ? (
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMoreMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-roboto"
                          >
                            <FaSignOutAlt className="text-base" />
                            <span>Sign Out</span>
                          </button>
                        ) : (
                          <>
                            <Link
                              to="/signup"
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 font-roboto"
                              onClick={() => setIsMoreMenuOpen(false)}
                            >
                              <FaSignInAlt className="text-[#ff4747] text-base" />
                              <span>Sign Up</span>
                            </Link>
                            <Link
                              to="/login"
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 font-roboto"
                              onClick={() => setIsMoreMenuOpen(false)}
                            >
                              <FaSignInAlt className="text-[#ff4747] text-base" />
                              <span>Sign In</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to={item.path}
                className={buttonClasses}
                aria-label={`Go to ${item.label.toLowerCase()}`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon className="text-xl mb-1" />
                  <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}