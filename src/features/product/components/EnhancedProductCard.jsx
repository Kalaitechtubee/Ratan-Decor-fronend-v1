import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Video, Phone, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/context/CartContext';
import { useAuth } from '../../auth';
import { slugify } from '../../../utils/utils';
import toast from 'react-hot-toast';
import VideoCallPopup from '../../../components/Home/VideoCallPopup';

function EnhancedProductCard({ product, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, addToCart: addToCartContext, cartLoading } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const isInCart = cart.some(
    (item) =>
      (item.id === product.id ||
        item.productId === product.id ||
        item.product?.id === product.id ||
        item.Product?.id === product.id) &&
      JSON.stringify(item.specifications || {}) ===
        JSON.stringify(product.specifications || {})
  );

  const price = product.price;
  const imageUrls = product.imageUrls || [];

  // ⭐ Updated logic — Redirect to Register page
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please create an account before adding items to cart", {
        duration: 2500,
      });

      setTimeout(() => {
        navigate("/register");
      }, 1000);

      return;
    }

    try {
      const success = await addToCartContext(product);
      if (!success) {
        toast.error('Failed to add to cart. Please try again.', { duration: 3000 });
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.', { duration: 3000 });
    }
  };

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full group cursor-pointer w-full rounded-lg overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden rounded-md">
          <div className="w-auto h-64">
            <img
              src={imageUrls[0] || '/placeholder-image.jpg'}
              alt={`Image of ${product.name}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* OVERLAY */}
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
                href="tel:+919876543210"
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
                href={`https://wa.me/919884000000?text=Hi,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(
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
                            flex items-center space-x-2 px-4 py-2 rounded-full font-medium ${
                              isInCart || cartLoading
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
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col flex-grow pt-3 pb-2 text-center">
          <Link
            to={`/products/${product.id}/${slugify(product.name)}`}
            className="mb-2 font-semibold text-gray-900 transition-colors 
                       line-clamp-2 hover:text-[#ff4747] text-base"
          >
            {product.name}
          </Link>

          <p className="flex-grow mb-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col items-center mt-auto">
            <span className="text-lg font-bold text-gray-900">
              ₹{price.toLocaleString()}
            </span>

            {/* MOBILE ADD BUTTON */}
            <button
              aria-label="Add to Cart (Mobile)"
              className={`md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-lg 
                          text-sm font-medium transition-colors mt-2 ${
                            isInCart || cartLoading
                              ? 'bg-gray-400 cursor-not-allowed text-white'
                              : 'bg-[#ff4747] hover:bg-[#e63e3e] text-white'
                          }`}
              onClick={isInCart || cartLoading ? null : handleAddToCart}
              disabled={isInCart || cartLoading}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cartLoading ? 'Adding...' : isInCart ? 'Added' : 'Add'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* VIDEO POPUP */}
      <VideoCallPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
  );
}

export default EnhancedProductCard;
