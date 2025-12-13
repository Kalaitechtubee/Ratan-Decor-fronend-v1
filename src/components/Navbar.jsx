import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { logout } from '../features/auth/authSlice';
import { logoutApi } from '../features/auth/api/authApi';
import { toast } from 'react-hot-toast';
import { useCart } from '../features/cart';
import UserTypePopup from '../features/userType/components/UserTypePopup';
import VideoCallPopup from './Home/VideoCallPopup';

import DesktopNavbar from './navbar/DesktopNavbar';
import MobileNavbar from './navbar/MobileNavbar';
import MobileBottomNav from './navbar/MobileBottomNav';
import ProductSidebar from './navbar/ProductSidebar';
import MoreMenu from './navbar/MoreMenu';
import CategoryDropdown from './CategoryDropdown';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userType } = useSelector((state) => state.userType);
  const { clearCart } = useCart();
  
  // Refs for click outside detection
  const profileRef = useRef(null);
  const categoryRef = useRef(null);
  const moreMenuRef = useRef(null);
 
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserTypePopupOpen, setIsUserTypePopupOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProductSidebarOpen, setIsProductSidebarOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isVideoCallPopupOpen, setIsVideoCallPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
 
  // User Type State
  const [currentUserType, setCurrentUserType] = useState(() => {
    const stored = localStorage.getItem('userType');
    if (userType) return userType;
    if (stored) {
      return stored.charAt(0).toUpperCase() + stored.slice(1).toLowerCase();
    }
    return 'General';
  });

  // User type synchronization
  useEffect(() => {
    if (userType && userType !== currentUserType) {
      setCurrentUserType(userType);
      console.log('Navbar: Updated currentUserType from Redux to:', userType);
    }
  }, [userType]);

  // Click outside handler - FIXED: Only for profile, not category
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // REMOVED category click outside handler - let CategoryDropdown handle its own
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductSidebarOpen(false);
    setIsMoreMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsCategoryDropdownOpen(false); // Also close category dropdown on route change
  }, [location.pathname]);

  // Storage and event handlers
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userType' && e.newValue) {
        const normalizedType = e.newValue.charAt(0).toUpperCase() + e.newValue.slice(1).toLowerCase();
        setCurrentUserType(normalizedType);
        console.log('Navbar: Storage event detected, updated to:', normalizedType);
      }
    };
    const handleUserTypeChange = (e) => {
      if (e.detail && e.detail.userType) {
        setCurrentUserType(e.detail.userType);
        console.log('Navbar: Custom event detected, updated to:', e.detail.userType);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userTypeChanged', handleUserTypeChange);
    document.addEventListener('userTypeChanged', handleUserTypeChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userTypeChanged', handleUserTypeChange);
      document.removeEventListener('userTypeChanged', handleUserTypeChange);
    };
  }, []);

  const handleUserTypePopupClose = () => {
    setIsUserTypePopupOpen(false);
    const storedType = localStorage.getItem('userType') || 'general';
    const newUserType = storedType.charAt(0).toUpperCase() + storedType.slice(1).toLowerCase();
    setCurrentUserType(newUserType);
    window.dispatchEvent(new CustomEvent('userTypeChanged', { detail: { userType: newUserType } }));
    document.dispatchEvent(new CustomEvent('userTypeChanged', { detail: { userType: newUserType } }));
    console.log('Navbar: handleUserTypePopupClose dispatched events with:', newUserType);
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies on backend
      await logoutApi();
      // Clear cart both server-side and locally to avoid cross-account leakage
      try {
        await clearCart();
      } catch (cartErr) {
        console.warn('Navbar: Failed to clear cart on logout', cartErr);
      }
      localStorage.removeItem('guestCart');
      // Clear local state
      dispatch(logout());
      setIsProfileOpen(false);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      try {
        await clearCart();
      } catch (cartErr) {
        console.warn('Navbar: Failed to clear cart after logout error', cartErr);
      }
      localStorage.removeItem('guestCart');
      // Even if API fails, clear local state and redirect
      dispatch(logout());
      setIsProfileOpen(false);
      navigate('/login');
      toast.error('Logged out (some cleanup may have failed)');
    }
  };

  const handleChangeUserType = () => {
    localStorage.setItem('userTypeConfirmed', 'false');
    setIsUserTypePopupOpen(true);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // FIXED: Category click handler that properly navigates and closes dropdown
  const handleCategoryClick = (category) => {
    console.log('Navbar: Category clicked:', category);
    setActiveCategory(category);
    
    // Close dropdown immediately
    setIsCategoryDropdownOpen(false);
    
    // Navigate based on category data
    if (category && category.id) {
      const url = `/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`;
      console.log('Navbar: Navigating to:', url);
      navigate(url);
    } else if (category && category.name) {
      const url = `/products?search=${encodeURIComponent(category.name)}`;
      console.log('Navbar: Fallback navigation to:', url);
      navigate(url);
    } else {
      console.log('Navbar: Navigating to all products');
      navigate('/products');
    }
    
    // Close mobile sidebar if open
    if (window.innerWidth < 768) {
      setIsProductSidebarOpen(false);
    }
  };

  const handleProductClick = (product) => {
    if (window.innerWidth < 768) {
      setIsProductSidebarOpen(false);
    }
    navigate(`/product/${product.id}`);
  };

  // Check if current route matches
  const isActiveRoute = (path) => location.pathname === path;

  // Shared props for child components
  const sharedProps = {
    user,
    isAuthenticated,
    currentUserType,
    location,
    navigate,
    isActiveRoute,
    handleLogout,
    handleChangeUserType,
    handleCategoryClick,
    handleProductClick,
    activeCategory,
    onOpenVideoCallPopup: () => setIsVideoCallPopupOpen(true)
  };

  const stateProps = {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isProfileOpen,
    setIsProfileOpen,
    isCategoryDropdownOpen,
    setIsCategoryDropdownOpen,
    isProductSidebarOpen,
    setIsProductSidebarOpen,
    isMoreMenuOpen,
    setIsMoreMenuOpen,
    isMobileSearchOpen,
    setIsMobileSearchOpen,
    isUserTypePopupOpen,
    setIsUserTypePopupOpen,
    isVideoCallPopupOpen,
    setIsVideoCallPopupOpen
  };

  const refProps = {
    profileRef,
    categoryRef,
    moreMenuRef
  };

  return (
    <>
      {/* Global Styles */}
      <style>
        {`
          .underline-animation {
            position: relative;
            text-decoration: none;
          }
          .underline-animation::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 2px;
            background-color: #ff4747;
            transition: width 0.3s ease, left 0.3s ease;
          }
          .underline-animation:hover::after {
            width: 100%;
            left: 0;
          }
         
          /* Enhanced mobile responsiveness */
          @media (max-width: 767px) {
            body {
              padding-bottom: 80px;
            }
            .mobile-search-bar {
              animation: slideDown 0.3s ease-out;
            }
            .category-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 12px;
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Enhanced bottom nav styles */
          .bottom-nav {
            padding-bottom: env(safe-area-inset-bottom);
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
          }
          
          .bottom-nav button, .bottom-nav a {
            min-height: 48px;
            min-width: 48px;
            touch-action: manipulation;
          }
          
          .rounded-t-2xl {
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }

          /* Enhanced sidebar styles */
          .sidebar-content {
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          /* Category card hover effects */
          .category-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .category-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 71, 71, 0.15);
          }
          .category-card:active {
            transform: translateY(0);
          }

          /* Improved touch targets */
          @media (max-width: 767px) {
            .touch-target {
              min-height: 44px;
              min-width: 44px;
            }
          }

          /* Enhanced loading states */
          .loading-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
     
      {/* Desktop Navigation */}
      <DesktopNavbar 
        {...sharedProps}
        {...stateProps}
        {...refProps}
      />

      {/* Mobile Navigation */}
      <MobileNavbar 
        {...sharedProps}
        {...stateProps}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        {...sharedProps}
        {...stateProps}
      />

      {/* Product Sidebar for Mobile */}
      <ProductSidebar 
        {...sharedProps}
        {...stateProps}
      />

      {/* More Menu for Mobile */}
      <MoreMenu 
        {...sharedProps}
        {...stateProps}
      />

      {/* Desktop Category Dropdown - FIXED: Removed conflicting mouse handlers */}
      <CategoryDropdown
        isOpen={isCategoryDropdownOpen}
        onClose={() => setIsCategoryDropdownOpen(false)}
        onCategoryClick={handleCategoryClick}
        onProductClick={handleProductClick}
        activeCategory={activeCategory}
        isMobileSidebar={false}
      />

      {/* User Type Popup */}
      <AnimatePresence>
        {isUserTypePopupOpen && (
          <UserTypePopup onClose={handleUserTypePopupClose} />
        )}
      </AnimatePresence>

      {/* Video Call Popup */}
      <AnimatePresence>
        {isVideoCallPopupOpen && (
          <VideoCallPopup
            isOpen={isVideoCallPopupOpen}
            onClose={() => setIsVideoCallPopupOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
