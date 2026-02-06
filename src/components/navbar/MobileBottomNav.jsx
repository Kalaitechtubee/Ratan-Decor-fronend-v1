import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBars, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaFilter, FaShoppingCart } from 'react-icons/fa';
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
  setIsMobileSearchOpen,
  onOpenCart,
  isCartOpen,
  cartCount
}) {
  // Always visible sticky bottom navigation
  const isVisible = true;


  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const bottomNavItems = [
    {
      path: '#more',
      icon: FaBars,
      label: 'More',
      isMoreMenu: true
    },
    {
      path: '#filters',
      icon: FaFilter,
      label: 'Filters',
      isFilters: true
    },
    {
      path: '#search',
      icon: FaSearch,
      label: 'Search',
      isSearch: true
    },
    {
      path: '#account',
      icon: FaUser,
      label: 'Account',
      isProfile: true
    },
    {
      path: '#cart',
      icon: FaShoppingCart,
      label: 'Cart',
      isCart: true
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
      <div className="grid grid-cols-5 w-full max-w-screen-lg mx-auto">
        {bottomNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          const buttonClasses = `flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative touch-target w-full h-16 font-roboto ${isActive ||
            (item.isMoreMenu && isMoreMenuOpen) ||
            (item.isSearch && isMobileSearchOpen) ||
            (item.isCart && isCartOpen) ||
            (item.isFilters && location.pathname.startsWith('/products'))
            ? 'text-[#ff4747] scale-105 shadow-sm'
            : 'text-gray-600 hover:text-[#ff4747] active:scale-95'
            }`;

          if (item.isMoreMenu) {
            return (
              <motion.button
                key="more"
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
                    animate={{ rotate: isMoreMenuOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="text-xl mb-1" />
                  </motion.div>
                  <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                </div>
              </motion.button>
            );
          }

          if (item.isFilters) {
            return (
              <motion.button
                key="filters"
                onClick={() => {
                  if (location.pathname.startsWith('/products')) {
                    window.dispatchEvent(new CustomEvent('toggleMobileFilters'));
                  } else {
                    navigate('/products?openFilters=true');
                  }
                }}
                className={buttonClasses}
                aria-label="Toggle filters"
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
                className="w-full"
              >
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      if (user?.status?.toLowerCase() === 'pending') {
                        navigate('/check-status');
                      } else {
                        navigate('/profile');
                      }
                    }}
                    className={buttonClasses}
                    aria-label="Go to profile"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <Icon className="text-xl mb-1" />
                      <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                    </div>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={buttonClasses}
                    aria-label="Go to login"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <Icon className="text-xl mb-1" />
                      <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          }

          if (item.isCart) {
            return (
              <motion.button
                key="cart"
                onClick={onOpenCart}
                className={buttonClasses}
                aria-label="Open cart"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center justify-center h-full relative">
                  <Icon className="text-xl mb-1" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-2 bg-[#ff4747] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full border border-white flex items-center justify-center shadow-sm">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                  <span className="text-xs font-medium font-roboto text-center leading-tight">{item.label}</span>
                </div>
              </motion.button>
            );
          }

          return null;
        })}
      </div>
    </motion.nav>
  );
}