// src/components/DesktopNavbar.jsx
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronDown, FaSignInAlt, FaUser, FaSignOutAlt, FaVideo, FaShoppingCart
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import logo from '../../assets/images/ratan-decor.png';
import SearchBar from '../SearchBar';
import CategoryDropdown from '../CategoryDropdown';

export default function DesktopNavbar({
  user,
  isAuthenticated,
  currentUserType,
  isActiveRoute,
  handleLogout,
  handleChangeUserType,
  navigate,
  isProfileOpen,
  setIsProfileOpen,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  setIsUserTypePopupOpen,
  profileRef,
  categoryRef,
  handleCategoryClick,
  onOpenVideoCallPopup, // New prop to open the popup
}) {
  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  // Close category dropdown
  const handleCloseCategoryDropdown = () => {
    setIsCategoryDropdownOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 py-2 font-roboto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and User Type */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Ratan Decor Logo"
                  className="h-7 transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <div className="flex items-center">
                <button
                  onClick={() => setIsUserTypePopupOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded-xl font-medium text-gray-700 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40 font-roboto group underline-animation touch-target"
                  aria-label="Change project type"
                >
                  <MdDashboard className="text-[#ff4747] text-xl transition-transform duration-200 group-hover:rotate-6" />
                  <span className="text-base">
                    {currentUserType || (
                      <span className="text-gray-400 italic">Select Type</span>
                    )}
                  </span>
                  <svg
                    className="w-4 h-4 text-[#ff4747] group-hover:text-[#ff4747]/80 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between flex-1">
              {/* Desktop Search Bar */}
              <div className="flex-1 max-w-xl ml-2 mr-2">
                <SearchBar currentUserType={currentUserType} />
              </div>

              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isActiveRoute('/')
                    ? 'text-[#ff4747]'
                    : 'text-gray-700 hover:text-[#ff4747]'
                    }`}
                  aria-label="Go to home page"
                >
                  Home
                </Link>
                <div ref={categoryRef} className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isCategoryDropdownOpen
                      ? 'text-[#ff4747]'
                      : 'text-gray-700 hover:text-[#ff4747]'
                      }`}
                    aria-label="Toggle product categories dropdown"
                  >
                    <span>Products</span>
                    <FaChevronDown
                      className={`text-[#ff4747] text-sm transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                <Link
                  to="/about"
                  className={`px-3 py-2 text-base font-medium rounded-lg
    underline-animation font-roboto transition-colors duration-200
    ${isActiveRoute('/about')
                      ? 'text-[#ff4747]'                // active: text only
                      : 'text-gray-700 hover:text-[#ff4747]' // hover: text only
                    }
  `}
                  aria-label="Go to about page"
                >
                  Company
                </Link>


                <button
                  onClick={onOpenVideoCallPopup}
                  className={`flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isActiveRoute('/video-call')
                    ? 'text-[#ff4747] bg-[#ff4747]/10'
                    : 'text-gray-700 hover:text-[#ff4747]'
                    }`}
                  aria-label="Open video call scheduler popup"
                >
                  <FaVideo className="text-[#ff4747] text-lg" />
                  Shop on call
                </button>
                <Link
                  to="/cart"
                  aria-label="Go to cart"
                  className={`flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg
    underline-animation font-roboto transition-colors duration-200
    ${isActiveRoute('/cart')
                      ? 'text-[#ff4747]'        // active: red text
                      : 'text-gray-700 hover:text-[#ff4747]' // hover: text only
                    }
  `}
                >
                  <FaShoppingCart className="text-[#ff4747] text-lg" />
                  <h1 className="mr-2">Cart</h1>
                </Link>




              </div>

              {/* Desktop Profile Section */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff4747] text-white hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto"
                    aria-expanded={isProfileOpen}
                    aria-label="Toggle profile dropdown"
                  >
                    <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white text-[#ff4747]">
                      <FaUser className="text-sm" />
                    </div>
                    <span className="hidden lg:block text-sm font-semibold font-roboto truncate max-w-24">{user?.name || 'User'}</span>
                    <FaChevronDown
                      className={`text-white text-sm transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''
                        }`}
                    />

                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-xl z-50"
                      >
                        <div className="py-2">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800 truncate font-roboto">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-600 truncate font-roboto">{user?.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              navigate('/profile');
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#ff4747]/10 hover:text-[#ff4747] transition-all duration-300 font-roboto"
                          >
                            <FaUser className="inline mr-3 text-base" />
                            My Profile
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-300 font-roboto"
                          >
                            <FaSignOutAlt className="inline mr-3 text-base" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#ff4747] rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto"
                  aria-label="Sign in"
                >
                  <FaSignInAlt className="text-sm" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Category Dropdown */}
      <CategoryDropdown
        isOpen={isCategoryDropdownOpen}
        onClose={handleCloseCategoryDropdown}
        isMobileSidebar={false}
        onCategoryClick={handleCategoryClick}
        activeCategory={null}
      />
    </>
  );
}