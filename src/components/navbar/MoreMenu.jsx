import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEllipsisH,
  FaBuilding,
  FaPhone,
  FaVideo,
  FaFileContract,
  FaHome,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import VideoCallPopup from "../Home/VideoCallPopup";

export default function MoreMenu({
  isMoreMenuOpen,
  setIsMoreMenuOpen,
  moreMenuRef,
}) {
  const [showVideoCallPopup, setShowVideoCallPopup] = useState(false);

  /* ---------------- MENU ITEMS ---------------- */
  const moreMenuItems = [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/about", icon: FaBuilding, label: "Company" },
    { path: "/contact", icon: FaPhone, label: "Contact Us" },
    { path: "/enquiry-form", icon: FaFileContract, label: "Product Enquiry" },
    {
      icon: FaVideo,
      label: "Video Call",
      isAction: true,
      action: () => setShowVideoCallPopup(true),
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isMoreMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setIsMoreMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              ref={moreMenuRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-3">
                  <FaEllipsisH className="text-[#ff4747] text-lg" />
                  <h2 className="text-base font-semibold text-gray-900">
                    More
                  </h2>
                </div>
                <button
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
                >
                  <MdClose className="text-xl text-gray-500" />
                </button>
              </div>

              {/* Menu List */}
              <div className="px-4 py-3 space-y-1">
                {moreMenuItems.map((item, index) => {
                  const Icon = item.icon;

                  const content = (
                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition">
                      <Icon className="text-[#ff4747] text-lg" />
                      <span className="text-sm font-medium text-gray-800">
                        {item.label}
                      </span>
                    </div>
                  );

                  return item.isAction ? (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left"
                    >
                      {content}
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="py-4 text-center border-t">
                <p className="text-[11px] text-gray-400 tracking-wide">
                  © {new Date().getFullYear()} Ratan Decor
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Video Call Popup */}
      {showVideoCallPopup && (
        <VideoCallPopup
          isOpen={showVideoCallPopup}
          onClose={() => setShowVideoCallPopup(false)}
        />
      )}
    </>
  );
}
