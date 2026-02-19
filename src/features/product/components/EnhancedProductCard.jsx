import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Video, Phone, MessageCircle, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/context/CartContext';
import { useAuth } from '../../auth';
import { slugify } from '../../../utils/utils';
import toast from 'react-hot-toast';
import VideoCallPopup from '../../../components/Home/VideoCallPopup';
import { normalizeImageUrl } from '../../../utils/imageUtils';

export default function EnhancedProductCard({ product, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, addToCart: addToCartContext, cartLoading, isPendingAccount, redirectToEnquiryForm, getUserRoleDisplay } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  const isInCart = cart.some(
    (item) =>
      (item.productId === product.id ||
        item.product?.id === product.id ||
        item.Product?.id === product.id) &&
      JSON.stringify(item.specifications || {}) ===
      JSON.stringify(product.specifications || {})
  );

  const userType = user?.userType || localStorage.getItem('userType') || 'General';

  const getPrice = () => {
    if (!product) return 0;
    const userRoleLower = user?.role?.toLowerCase();
    const isApproved = user?.status?.toLowerCase() === 'approved';

    // 1. If approved Architect/Dealer, use their trade pricing
    if (isApproved) {
      if (userRoleLower === 'architect') return product.architectPrice || product.price;
      if (userRoleLower === 'dealer') return product.dealerPrice || product.price;
    }

    // 2. Otherwise, check for project-based pricing (Commercial)
    const type = (user?.userType || user?.userTypeName || localStorage.getItem('userType') || 'General').toLowerCase();
    if (type === 'commercial' || type === 'developer') {
      return product.generalPrice || product.price;
    }

    // 3. Default to public price
    return product.price;
  };

  const currentPrice = getPrice();
  const imageUrls = product.imageUrls || [];
  // Get the display image: prioritize imageUrls array, then imageUrl, then placeholder
  const rawImage = (imageUrls.length > 0 ? imageUrls[0] : product.imageUrl);
  const displayImage = normalizeImageUrl(rawImage) || '/placeholder-image.jpg';

  const handleAddToCart = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isPendingAccount()) {
      setShowPendingMessage(true);
      return;
    }

    try {
      await addToCartContext({ ...product, price: currentPrice });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group cursor-pointer w-full rounded-lg overflow-hidden transition-all duration-300 ${viewMode === 'list'
          ? 'flex flex-col md:flex-row bg-white border border-gray-100 hover:shadow-md'
          : 'flex flex-col h-full'
          }`}
      >
        {/* IMAGE */}
        <div
          className={`relative overflow-hidden rounded-md transition-all duration-300 ${viewMode === 'list' ? 'w-full md:w-72 lg:w-80 shrink-0' : 'w-auto'
            }`}
        >
          <div className={viewMode === 'list' ? 'h-64 min-h-[250px]' : 'h-64'}>
            <img
              src={displayImage}
              alt={`Image of ${product.name}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* OVERLAY - Completely hidden in list view as requested */}
          {viewMode !== 'list' && (
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20 flex flex-col">
              {/* SHOP ON CALL (VIDEO) */}
              <button
                onClick={handleOpenPopup}
                aria-label="Start Video Call"
                className="absolute top-2 right-2 transform translate-y-4 opacity-0
                         group-hover:translate-y-0 group-hover:opacity-100 transition-all
                         duration-300 flex items-center space-x-2 px-3 py-1.5 rounded-full
                         font-medium bg-white/90 hover:bg-white text-gray-900 shadow-lg text-sm"
              >
                <Video className="w-4 h-4" />
                <span>Shop on Call</span>
              </button>

              {/* CALL & WHATSAPP */}
              <div
                className="absolute bottom-3 left-3 flex flex-col items-start space-y-2
                         transform translate-x-[-20px] opacity-0
                         group-hover:opacity-100 group-hover:translate-x-0
                         transition-all duration-300"
              >
                {/* CALL */}
                <a
                  href="tel:+919381059678"
                  aria-label="Call Now"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full
                           bg-white/90 hover:bg-white shadow-lg text-gray-900
                           text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                {/* WHATSAPP */}
                <a
                  href={`https://wa.me/919381059678?text=Hi,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(
                    product.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Chat"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full
                           bg-[#25D366]/90 hover:bg-[#25D366] shadow-lg text-white
                           text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* ADD TO CART (CENTER BUTTON) */}
              <div className="flex-grow flex items-center justify-center">
                <button
                  aria-label="Add to Cart"
                  className={`transform translate-y-4 opacity-0 group-hover:translate-y-0
                            group-hover:opacity-100 transition-all duration-300
                            flex items-center space-x-2 px-4 py-2 rounded-full font-medium ${isInCart || cartLoading
                      ? 'bg-gray-500/90 cursor-not-allowed text-white'
                      : 'bg-[#ff4747]/90 hover:bg-[#ff4747] text-white shadow-lg'
                    }`}
                  onClick={isInCart || cartLoading ? null : handleAddToCart}
                  disabled={isInCart || cartLoading}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{cartLoading ? 'Adding...' : isInCart ? 'Added' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* PENDING ACCOUNT OVERLAY */}
              <AnimatePresence>
                {showPendingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPendingMessage(false);
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center text-center p-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-3 shadow-sm border border-amber-100">
                        🔒
                      </div>
                      <h4 className="text-amber-900 font-bold text-sm mb-1 uppercase tracking-wider">Account Pending</h4>
                      <span className="bg-amber-100 text-amber-700 text-[9px] uppercase px-2 py-0.5 rounded-full font-bold mb-3 tracking-widest border border-amber-200/50">Verification Required</span>

                      <p className="text-gray-600 text-xs leading-relaxed max-w-[200px] mb-4 font-medium italic">
                        "Hi {getUserRoleDisplay()}! Submit an enquiry for prices and ordering while we verify your account."
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          redirectToEnquiryForm(product);
                        }}
                        className="flex items-center justify-center gap-2 w-full bg-primary text-white py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 transition-all shadow-md hover:shadow-lg active:scale-95 px-6"
                      >
                        Submit Enquiry
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div
          className={`flex flex-col flex-grow py-4 px-5 ${viewMode === 'list' ? 'text-left justify-center' : 'pt-3 pb-2 text-center'
            }`}
        >
          <div className="flex flex-col">
            <Link
              to={`/products/${product.id}/${slugify(product.name)}`}
              className={`font-semibold text-gray-900 transition-colors line-clamp-2 hover:text-[#ff4747] ${viewMode === 'list' ? 'text-xl mb-1' : 'text-base mb-1'
                }`}
            >
              {product.name}
            </Link>
            {product.designNumber && (
              <div className={`flex ${viewMode === 'list' ? 'justify-start mb-3' : 'justify-center mb-2'}`}>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  D.No: {product.designNumber}
                </span>
              </div>
            )}
          </div>

          <div className={`flex flex-col mt-auto ${viewMode === 'list' ? 'items-start' : 'items-center'}`}>
            <div className={`flex items-baseline space-x-1 ${viewMode === 'list' ? 'mb-4' : 'justify-center'}`}>
              <span className="text-xl font-bold text-gray-900">₹{Number(currentPrice).toLocaleString()}</span>
              <span className="text-sm text-gray-500 font-medium">/ {product.unitType || 'Per Sheet'}</span>
            </div>

            {/* ACTION BUTTONS FOR LIST VIEW */}
            {viewMode === 'list' && (
              <div className="hidden md:flex items-center space-x-3">
                {/* ADD TO CART */}
                <button
                  aria-label="Add to Cart"
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm ${isInCart || cartLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-[#ff4747] hover:bg-[#ff4747]/90 text-white shadow-md'
                    }`}
                  onClick={isInCart || cartLoading ? null : handleAddToCart}
                  disabled={isInCart || cartLoading}
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>{cartLoading ? 'Adding...' : isInCart ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>

                {/* SHOP ON CALL (VIDEO) - MOVED INSIDE FOR LIST VIEW */}
                <button
                  onClick={handleOpenPopup}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors font-medium text-sm"
                >
                  <Video className="w-4 h-4 text-primary" />
                  <span>Shop on Call</span>
                </button>

                {/* CALL */}
                <a
                  href="tel:+919381059678"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors font-medium text-sm"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Call</span>
                </a>

                {/* WHATSAPP */}
                <a
                  href={`https://wa.me/919381059678?text=Hi,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(
                    product.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 transition-colors font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}

            {/* MOBILE ACTION BUTTONS FOR LIST VIEW */}
            {viewMode === 'list' && (
              <div className="md:hidden flex flex-wrap gap-2 mt-3">
                <button
                  aria-label="Add to Cart (Mobile)"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isInCart || cartLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#ff4747] hover:bg-[#e63e3e] text-white'
                    }`}
                  onClick={isInCart || cartLoading ? null : handleAddToCart}
                  disabled={isInCart || cartLoading}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{cartLoading ? 'Adding...' : isInCart ? 'Added' : 'Add'}</span>
                </button>
                <button
                  onClick={handleOpenPopup}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  <Video className="w-4 h-4" />
                  <span>Video Call</span>
                </button>
              </div>
            )}

            {/* MOBILE ADD BUTTON FOR NON-LIST VIEW */}
            {viewMode !== 'list' && (
              <button
                aria-label="Add to Cart (Mobile)"
                className={`md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-lg
                            text-sm font-medium transition-colors mt-2 ${isInCart || cartLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#ff4747] hover:bg-[#e63e3e] text-white'
                  }`}
                onClick={isInCart || cartLoading ? null : handleAddToCart}
                disabled={isInCart || cartLoading}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartLoading ? 'Adding...' : isInCart ? 'Added' : 'Add'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
      {/* VIDEO POPUP */}
      <VideoCallPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
  );
}