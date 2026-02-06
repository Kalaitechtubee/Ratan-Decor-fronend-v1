import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";

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
              onClick={() => {
                onConfirm();
                onClose();
              }}
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

export default LogoutConfirmModal;
