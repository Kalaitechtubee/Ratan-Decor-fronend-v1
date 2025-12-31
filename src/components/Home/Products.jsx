// Products.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Video } from 'lucide-react';
import { fetchProduct } from '../../features/product/productSlice';
import { useCart } from '../../features/cart/context/CartContext';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { slugify } from '../../utils/utils';
import { getProductImageUrl } from '../../utils/imageUtils';

const Products = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cart, cartLoading } = useCart();

  const isInCart = cart.some((item) => item.productId === product.id || item.product?.id === product.id);

  const getPrice = () => {
    if (!product) return 0;
    const userRoleLower = user?.role?.toLowerCase();
    const isApproved = user?.status?.toLowerCase() === 'approved';

    // 1. If approved Architect/Dealer, use their trade pricing
    if (isApproved) {
      if (userRoleLower === 'architect') return product.architectPrice || product.price;
      if (userRoleLower === 'dealer') return product.dealerPrice || product.price;
    }

    // 2. Otherwise, check for project-based pricing (Commercial/Developer)
    const type = (user?.userType || user?.userTypeName || localStorage.getItem('userType') || 'General').toLowerCase();
    if (type === 'commercial' || type === 'developer') {
      return product.generalPrice || product.price;
    }

    // 3. Default to public price
    return product.price;
  };

  const handleViewDetails = () => {
    const currentPrice = getPrice();
    dispatch(fetchProduct({ id: product.id, userRole: null, userType: null }));
    navigate(`/products/${product.id}/${slugify(product.name)}`);
  };

  const handleAddToCart = () => {
    if (!isInCart && !cartLoading) {
      const currentPrice = getPrice();
      addToCart({ ...product, price: currentPrice }, 1);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(Number(price))) {
      return 'Price not available';
    }
    return `₹${Number(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleImageError = (e) => {
    if (e.target.src.includes('placehold.co')) {
      e.target.src = '/src/assets/images/slider1.jpg';
    } else if (e.target.src.includes('slider1.jpg')) {
      e.target.src =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3Q8L3RleHQ+PC9zdmc+';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[369px] group cursor-pointer w-full rounded-lg overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-md">
        <div className="w-full h-48 sm:h-56 md:h-64">
          <img
            src={getProductImageUrl(product) || 'https://placehold.co/600x400?text=Product'}
            alt={`Image of ${product.name}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        {/* Overlay Buttons */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20 flex flex-col">
          <Link
            to="/video-call"
            aria-label="Start Video Call"
            className="absolute top-2 right-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-2 px-3 py-1.5 rounded-full font-medium bg-white/90 hover:bg-white text-gray-900 shadow-lg text-sm"
            title="Start Video Call"
          >
            <Video className="w-4 h-4" />
            <span>Shop on Call</span>
          </Link>

          <div className="flex-grow flex items-center justify-center">
            <button
              aria-label="Add to Cart"
              className={`transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-full font-medium ${isInCart || product.stock <= 0
                ? 'bg-gray-500/90 cursor-not-allowed text-white'
                : 'bg-[#ff4747]/90 hover:bg-[#ff4747] text-white shadow-lg'
                }`}
              onClick={isInCart || product.stock <= 0 ? null : handleAddToCart}
              disabled={isInCart || cartLoading || product.stock <= 0}
              title={isInCart ? 'Already in Cart' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cartLoading ? 'Adding...' : isInCart ? 'Added' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col pt-3 pb-2 text-center min-h-0">
        <button
          onClick={handleViewDetails}
          aria-label={`View details of ${product.name}`}
          className="mb-2 font-semibold text-gray-900 transition-colors line-clamp-2 hover:text-[#ff4747] text-base"
        >
          {product.name || 'Unnamed Product'}
        </button>

        <p className="flex-grow mb-2 text-sm text-gray-600 line-clamp-2 leading-relaxed overflow-hidden">
          {product.description || 'No description available'}
        </p>

        <div className="flex flex-col items-center mt-auto">
          <span className="text-lg font-bold text-gray-900">{formatPrice(getPrice())}</span>

          <button
            aria-label="Add to Cart (Mobile)"
            className={`md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors mt-2 ${isInCart || product.stock <= 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-[#ff4747] hover:bg-[#e63e3e] text-white'
              }`}
            onClick={isInCart || product.stock <= 0 ? null : handleAddToCart}
            disabled={isInCart || cartLoading || product.stock <= 0}
            title={isInCart ? 'Already in Cart' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{cartLoading ? 'Adding...' : isInCart ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Products;
