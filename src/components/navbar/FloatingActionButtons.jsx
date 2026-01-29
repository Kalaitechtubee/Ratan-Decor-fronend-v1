import { motion } from 'framer-motion';
import { FaVideo, FaWhatsapp } from 'react-icons/fa';

export default function FloatingActionButtons({ onOpenVideoCallPopup }) {
  return (
    <div className="fixed bottom-24 right-4 z-[40] flex flex-col gap-4 md:hidden">
      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/918360636885"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg text-white">
          <FaWhatsapp size={24} />
        </div>
        <span className="text-[10px] font-bold text-gray-700 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
          WhatsApp
        </span>
      </motion.a>

      {/* Video Call Button */}
      <motion.button
        onClick={onOpenVideoCallPopup}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-12 h-12 bg-[#ff4747] rounded-full flex items-center justify-center shadow-lg text-white">
          <FaVideo size={22} />
        </div>
        <span className="text-[10px] font-bold text-gray-700 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
          Shop on call
        </span>
      </motion.button>
    </div>
  );
}
