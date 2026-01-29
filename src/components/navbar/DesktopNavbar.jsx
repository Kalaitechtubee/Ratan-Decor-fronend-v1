// src/components/DesktopNavbar.jsx
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaVideo,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { ChefHat, Building2, Home } from "lucide-react";
import logo from "../../assets/images/ratan-decor.png";
import SearchBar from "../SearchBar";
import { useState, useRef } from "react";

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
  onOpenVideoCallPopup,
  onOpenCart,
  isCartOpen,
  cartCount = 0,
  onProductsMouseEnter,
  onProductsMouseLeave,
}) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const handleCloseCategoryDropdown = () => {
    setIsCategoryDropdownOpen(false);
  };

  // Compact Logout Confirmation Modal (same size as mobile/profile popup)
  const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignOutAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Ready to Leave?
              </h3>
              <p className="text-sm text-neutral-500">
                Are you sure you want to log out of your account? You will need
                to sign in again to access your profile.
              </p>
            </div>
            <div className="flex border-t border-neutral-100">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Stay Logged In
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-l border-neutral-100"
              >
                Logout Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 py-2 font-roboto hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and User Type */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Ratan Decor Logo"
                  className="h-8 transition-transform duration-300 hover:scale-105"
                />
              </Link>

              {/* User Type Selector (e.g. Modular kitchen) */}
              <div className="flex items-center active-persistent-underline pb-1">
                <button
                  onClick={() => setIsUserTypePopupOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded-xl font-medium text-gray-700 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40 font-roboto group touch-target"
                  aria-label="Change project type"
                >
                  {(() => {
                    const iconClass = "text-[#ff4747] text-xl transition-transform duration-200 group-hover:rotate-6";
                    const name = (currentUserType || "").toLowerCase();
                    if (name.includes("modular") || name.includes("kitchen")) {
                      return <ChefHat className={iconClass} size={20} />;
                    } else if (name.includes("commercial")) {
                      return <Building2 className={iconClass} size={20} />;
                    } else if (name.includes("residential")) {
                      return <Home className={iconClass} size={20} />;
                    }
                    return <MdDashboard className={iconClass} />;
                  })()}
                  <span className="text-base">
                    {currentUserType || (
                      <span className="text-gray-400 italic">Select Type</span>
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between flex-1">
              {/* Desktop Search Bar */}
              <div className="flex-1 max-w-2xl ml-4 mr-4">
                <SearchBar currentUserType={currentUserType} />
              </div>

              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isActiveRoute("/")
                      ? "text-[#ff4747]"
                      : "text-gray-700 hover:text-[#ff4747]"
                    }`}
                  aria-label="Go to home page"
                >
                  Home
                </Link>
                <div
                  ref={categoryRef}
                  className="relative"
                  onMouseEnter={onProductsMouseEnter}
                  onMouseLeave={onProductsMouseLeave}
                >
                  <button
                    onClick={() => {
                      navigate("/products");
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isCategoryDropdownOpen
                        ? "text-[#ff4747]"
                        : "text-gray-700 hover:text-[#ff4747]"
                      }`}
                    aria-label="Product categories"
                  >
                    <span>Products</span>
                    <FaChevronDown
                      className={`text-[#ff4747] text-sm transition-transform duration-300 ${isCategoryDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                </div>
                <Link
                  to="/about"
                  className={`px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-colors duration-200 ${isActiveRoute("/about")
                      ? "text-[#ff4747]"
                      : "text-gray-700 hover:text-[#ff4747]"
                    }`}
                  aria-label="Go to about page"
                >
                  Company
                </Link>

                <button
                  onClick={onOpenVideoCallPopup}
                  className={`flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isActiveRoute("/video-call")
                      ? "text-[#ff4747] bg-[#ff4747]/10"
                      : "text-gray-700 hover:text-[#ff4747]"
                    }`}
                  aria-label="Open video call scheduler popup"
                >
                  <FaVideo className="text-[#ff4747] text-[1.7rem]" />
                  Shop on call
                </button>
                <button
                  onClick={onOpenCart}
                  aria-label="Open cart"
                  className={`flex items-center gap-3 px-4 py-2 text-base font-medium rounded-lg underline-animation font-roboto transition-all duration-200 ${isCartOpen || isActiveRoute("/cart")
                      ? "text-[#ff4747] bg-[#ff4747]/10"
                      : "text-gray-700 hover:text-[#ff4747]"
                    }`}
                >
                  <div className="relative flex items-center justify-center">
                    <FaShoppingCart className="text-[#ff4747] text-[1.7rem] transition-colors duration-200" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2.5 -right-3 bg-[#ff4747] text-white text-[11px] font-bold h-5 min-w-[22px] px-1.5 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="tracking-wide font-medium">Cart</span>
                </button>
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
                    <span className="hidden lg:block text-sm font-semibold font-roboto truncate max-w-24">
                      {user?.name || "User"}
                    </span>
                    <FaChevronDown
                      className={`text-white text-sm transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""
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
                            <p className="text-sm font-semibold text-gray-800 truncate font-roboto">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-600 truncate font-roboto">
                              {user?.email}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (user?.status?.toLowerCase() === "pending") {
                                navigate("/check-status");
                              } else {
                                navigate("/profile");
                              }
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#ff4747]/10 hover:text-[#ff4747] transition-all duration-300 font-roboto"
                          >
                            <FaUser className="inline mr-3 text-base" />
                            My Profile
                          </button>

                          <hr className="my-1" />
                          <button
                            onClick={() => {
                              setIsLogoutConfirmOpen(true);
                              setIsProfileOpen(false);
                            }}
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
                  to="/register"
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

      {/* Compact Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          handleLogout();
          setIsLogoutConfirmOpen(false);
        }}
      />
    </>
  );
}
