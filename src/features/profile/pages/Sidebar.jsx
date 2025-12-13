import React from 'react';
import { FaHome, FaUser, FaShoppingCart, FaInfoCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen, navigate, location, setIsLogoutModalOpen }) => {
  const menuItems = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaUser, label: 'Profile', path: '/profile' },
    { icon: FaShoppingCart, label: 'Cart', path: '/cart' },
    { icon: FaInfoCircle, label: 'About', path: '/about' },
  ];

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { 
      x: 0, 
      transition: { 
        type: 'tween', 
        duration: 0.3,
        ease: 'easeOut'
      } 
    },
    exit: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.5, 
      transition: { duration: 0.3 } 
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const sidebarContent = (
    <>
      <div className="p-5 mt-5 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Menu</h2>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-2 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          aria-label="Close sidebar"
        >
        </button>
      </div>
      <nav className="px-3 py-5 space-y-2 flex-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 cursor-pointer ${
              location.pathname === item.path ? 'bg-primary/10 text-primary' : ''
            }`}
            onClick={() => {
              navigate(item.path);
              setIsMobileSidebarOpen(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon className="text-lg" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-200">
        <div
          className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 cursor-pointer"
          onClick={() => {
            setIsMobileSidebarOpen(false);
            setIsLogoutModalOpen(true);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsLogoutModalOpen(true)}
          aria-label="Logout"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200 shadow-sm h-full">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;