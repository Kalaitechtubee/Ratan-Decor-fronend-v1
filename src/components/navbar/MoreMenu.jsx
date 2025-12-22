import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEllipsisH, FaBuilding, FaPhone, FaVideo, FaUser, FaChevronDown,
  FaQuestionCircle, FaCookie, FaExclamationTriangle, FaShieldAlt,
  FaUndo, FaFileContract, FaHome
} from 'react-icons/fa';
import { MdClose, MdDashboard } from 'react-icons/md';

export default function MoreMenu({
  isAuthenticated,
  isActiveRoute,
  handleChangeUserType,
  isMoreMenuOpen,
  setIsMoreMenuOpen,
  moreMenuRef
}) {
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

  const moreMenuVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  // More Menu Items - All static pages included
  const moreMenuItems = [
    { path: '/', icon: FaHome, label: 'Home', description: 'Back to homepage' },
    { path: '/about', icon: FaBuilding, label: 'Company', description: 'Learn about our story' },
    { path: '/contact', icon: FaPhone, label: 'Contact Us', description: 'Get in touch with us' },
    { path: '/video-call', icon: FaVideo, label: 'Video Call', description: 'Schedule an appointment' },
    { path: '/FAQ', icon: FaQuestionCircle, label: 'FAQ', description: 'Frequently asked questions' },
    { path: '/CookiesPolicy', icon: FaCookie, label: 'Cookies Policy', description: 'Our cookie usage policy' },
    { path: '/Disclaimer', icon: FaExclamationTriangle, label: 'Disclaimer', description: 'Legal disclaimer' },
    { path: '/Privacy', icon: FaShieldAlt, label: 'Privacy Policy', description: 'Your privacy matters' },
    { path: '/Returns-and-refunds-policy', icon: FaUndo, label: 'Returns & Refunds', description: 'Return and refund policy' },
    { path: '/Terms', icon: FaFileContract, label: 'Terms & Conditions', description: 'Terms of service' }
  ];

  return (
    <AnimatePresence>
      {isMoreMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMoreMenuOpen(false)}
            role="button"
            aria-label="Close more menu"
          />

          {/* Slide-Up Menu */}
          <motion.div
            variants={moreMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 md:hidden max-h-[80vh] overflow-hidden"
            ref={moreMenuRef}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <FaEllipsisH className="text-[#ff4747] text-base" />
                <div>
                  <h2 className="text-base font-bold text-gray-800 font-roboto">More Options</h2>
                  <p className="text-xs text-gray-600">Quick access to all pages</p>
                </div>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 touch-target"
                aria-label="Close more menu"
              >
                <MdClose className="text-base text-[#ff4747]" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(80vh-80px)]">
              {moreMenuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 p-3 rounded-xl text-sm font-normal transition-all duration-300 font-roboto touch-target group ${isActive
                          ? 'bg-[#ff4747]/10 text-[#ff4747] border border-[#ff4747]/20'
                          : 'bg-gray-50 text-gray-800 hover:bg-[#ff4747]/10 hover:text-[#ff4747] border border-transparent'
                        }`}
                      onClick={() => setIsMoreMenuOpen(false)}
                      aria-label={`Go to ${item.label.toLowerCase()}`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${isActive
                          ? 'bg-[#ff4747] text-white shadow-lg'
                          : 'bg-white text-[#ff4747] group-hover:bg-[#ff4747] group-hover:text-white shadow-sm'
                        }`}>
                        <Icon className="text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-normal truncate text-sm">{item.label}</p>
                        <p className="text-xs text-gray-600 truncate">{item.description}</p>
                      </div>
                      <FaChevronDown className="text-xs text-[#ff4747]/40 transform -rotate-90 group-hover:text-[#ff4747] transition-colors duration-300 flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}

              {/* Additional Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: moreMenuItems.length * 0.05 + 0.1 }}
                className="pt-4 mt-4 border-t border-gray-200"
              >
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-roboto">
                    Ratan Decor &copy; {new Date().getFullYear()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Premium Interior Solutions
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}