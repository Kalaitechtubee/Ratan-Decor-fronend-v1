import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Box, Mail, Star, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../../cart/context/CartContext';
import { fetchProduct } from '../productSlice';
import toast from 'react-hot-toast';
import { currencyINR } from '../../../utils/utils';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EnquiryForm from './EnquiryForm';
import CategorySpotlight from '../components/CategorySpotlight';
import { normalizeImageUrl } from '../../../utils/imageUtils';

// ErrorBoundary and ImageGallery components remain unchanged
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center font-roboto">
          <h3 className="text-xl font-title font-semibold text-red-800">Something Went Wrong</h3>
          <p className="text-red-600 mt-2">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-poppins font-medium shadow-sm"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ImageGallery = ({ images, productName, onQuickOrder }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-4 relative">
      <div
        className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        aria-label="Product image gallery"
      >
        <img
          src={images[selectedImage] || '/placeholder-image.jpg'}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-[400px] sm:h-[500px] object-contain"
          loading="eager"
        />
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {images.length > 1 && (
            <span className="px-3 py-1 text-xs font-semibold text-white bg-gray-800/80 backdrop-blur-sm rounded-full font-poppins shadow-sm">
              {images.length} IMAGES
            </span>
          )}
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center p-4 bg-black/5"
            >
              <motion.button
                onClick={onQuickOrder}
                className="flex items-center gap-2 bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-poppins font-bold text-sm shadow-xl border border-gray-100"
                whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                aria-label="Quick order"
              >
                <ArrowRight className="w-5 h-5 text-primary" />
                <span>Quick Order</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((url, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary ${selectedImage === index
                ? 'border-primary shadow-md'
                : 'border-gray-200 hover:border-primary'
                }`}
              aria-label={`Select image ${index + 1}`}
            >
              <img
                src={url}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

const Breadcrumb = ({ productName, category, designNumber }) => (
  <nav className="flex flex-wrap items-center gap-2 text-base text-gray-600 font-poppins" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-primary transition-colors duration-200 flex items-center gap-1.5 flex-shrink-0">
      <Home className="w-4 h-4" />
      <span>Home</span>
    </Link>

    {/* Main Category */}
    {category && category.parent && (
      <>
        <span className="text-gray-400 font-light">»</span>
        <Link
          to={`/products?categoryId=${category.parent.id}&categoryName=${encodeURIComponent(category.parent.name)}`}
          className="hover:text-primary transition-colors duration-200 flex-shrink-0"
        >
          {category.parent.name}
        </Link>
      </>
    )}

    {/* Current Category (either Subcategory or Main Category) */}
    {category && (
      <>
        <span className="text-gray-400 font-light">»</span>
        <Link
          to={`/products?${category.parent ? 'subcategoryId' : 'categoryId'}=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
          className="hover:text-primary transition-colors duration-200 flex-shrink-0"
        >
          {category.name}
        </Link>
      </>
    )}

    {/* Design Number */}
    {designNumber && designNumber !== 'N/A' && (
      <>
        <span className="text-gray-400 font-light">»</span>
        <span className="text-primary font-bold flex-shrink-0">{designNumber}</span>
      </>
    )}
  </nav>
);

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productFromList = useSelector((state) =>
    state.products.products.find((p) => p.id === parseInt(id))
  );
  const currentProduct = useSelector((state) => state.products.currentProduct);
  const product = productFromList || currentProduct;
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const { isAuthenticated, userRole, user } = useAuth();
  const { cart, addToCart, updateCartItem, isPendingAccount, getUserRoleDisplay } = useCart();

  const cartItem = cart.find((item) => item.product?.id === parseInt(id));
  const isInCart = !!cartItem;

  // Initialize quantity based on cart or default to 1
  const [quantity, setQuantity] = useState(() => {
    return cartItem ? cartItem.quantity : 1;
  });
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  const userType = user?.userType || localStorage.getItem('userType') || 'General';

  // Fetch product if not available and userType is confirmed
  useEffect(() => {
    const userTypeConfirmed = localStorage.getItem('userTypeConfirmed') === 'true';
    if (!product && userTypeConfirmed) {
      dispatch(fetchProduct({
        id,
        userRole: userRole || 'customer',
        userType: userType
      }));
    }
  }, [dispatch, id, product, userRole, userType]);

  // Sync quantity with cart when cart changes
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cart, id, cartItem]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Scroll to pending message when it appears
  useEffect(() => {
    if (showPendingMessage) {
      const timer = setTimeout(() => {
        const el = document.getElementById('pending-account-notice');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showPendingMessage]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (isPendingAccount()) {
      setShowPendingMessage(true);
      return;
    }

    const currentPrice = getPrice();
    const productWithPrice = { ...product, price: currentPrice };

    if (isInCart) {
      await updateCartItem(cartItem.id, quantity);
    } else {
      await addToCart(productWithPrice, quantity);
    }
  };

  const handleQuickOrder = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (isPendingAccount()) {
      setShowPendingMessage(true);
      return;
    }

    const currentPrice = getPrice();
    const productWithPrice = { ...product, price: currentPrice };

    if (isInCart) {
      const success = await updateCartItem(cartItem.id, quantity);
      if (success) {
        navigate('/checkout');
      }
    } else {
      const success = await addToCart(productWithPrice, quantity);
      if (success) {
        navigate('/checkout');
      }
    }
  };

  const incrementQuantity = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    if (isInCart) {
      const success = await updateCartItem(cartItem.id, newQuantity);
      if (!success) {
        setQuantity(cartItem.quantity); // Revert on failure
        toast.error('Failed to update quantity. Please try again.', { duration: 3000 });
      }
    }
  };

  const decrementQuantity = async () => {
    if (quantity <= 1) return;
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);

    if (isInCart) {
      const success = await updateCartItem(cartItem.id, newQuantity);
      if (!success) {
        setQuantity(cartItem.quantity); // Revert on failure
        toast.error('Failed to update quantity. Please try again.', { duration: 3000 });
      }
    }
  };

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-roboto">
        <div className="text-center space-y-4">
          <div className="animate-pulse rounded-full h-16 w-16 bg-gray-200 mx-auto"></div>
          <p className="text-gray-600 font-title text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed' || !product || !product.id) {
    const hasProductDetailsData = error === undefined && typeof product === 'object' && product !== null && product.pageName === 'productdetails';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-roboto">
        <div className="text-center py-12 space-y-4">
          <div className="flex justify-center items-center mx-auto mb-4 w-24 h-24 bg-gray-100 rounded-full">
            <Box className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-title font-bold text-gray-900">
            {hasProductDetailsData ? 'No Product Data Available' : 'Product Not Found'}
          </h3>
          <p className="mx-auto max-w-md text-gray-600 font-roboto">
            {error || (hasProductDetailsData
              ? 'Product details page exists, but no product data was found.'
              : "The product you're looking for doesn't exist or is unavailable.")}
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 font-medium text-white bg-primary rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg font-poppins"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const imageUrls = product.imageUrls || [];
  // Ensure we have at least one image by adding product.imageUrl if it's not already in the array
  const allImages = [...imageUrls];
  if (product.imageUrl && !allImages.includes(product.imageUrl)) {
    allImages.unshift(product.imageUrl);
  }
  
  const uniqueImageUrls = [...new Set(allImages)]
    .map(url => normalizeImageUrl(url))
    .filter(Boolean);
  const discountPercentage = product.mrpPrice
    ? Math.round(((product.mrpPrice - getPrice()) / product.mrpPrice) * 100)
    : 0;

  const rating = typeof product.averageRating === 'number'
    ? product.averageRating
    : parseFloat(product.averageRating || 0);

  return (
    <div className="min-h-screen bg-gray-50 font-roboto">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pb-16"
      >
        {/* Premium Header Section */}
        <div className="mb-2 pt-24 lg:pt-28 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 font-title uppercase tracking-tight leading-tight inline-block border-b-2 border-gray-900 pb-2">
                {product.name}
              </h1>
            </div>
            <Breadcrumb
              productName={product.name}
              category={product.category}
              designNumber={product.designNumber}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-20"
            >
              <ImageGallery
                images={uniqueImageUrls}
                productName={product.name}
                onQuickOrder={handleQuickOrder}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-title font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                <p className="text-gray-600 leading-relaxed mb-6 font-roboto text-base">{product.description || 'No description available.'}</p>
                {rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 font-poppins">({rating.toFixed(1)})</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="block text-sm font-medium text-gray-500 font-title uppercase">Brand</span>
                    <span className="text-lg font-semibold text-primary font-poppins">{product.brandName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 font-title uppercase">Design No</span>
                    <span className="text-lg font-semibold text-gray-900 font-poppins">{product.designNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 font-title uppercase">Size</span>
                    <span className="text-lg font-semibold text-gray-900 font-poppins">{product.size || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 font-title uppercase">Thickness</span>
                    <span className="text-lg font-semibold text-gray-900 font-poppins">{product.thickness || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                  {product.mrpPrice && (
                    <span className="text-lg text-gray-400 line-through font-poppins shrink-0">
                      {currencyINR(product.mrpPrice)}
                    </span>
                  )}
                  <div className="flex items-baseline whitespace-nowrap">
                    <span className="text-xl sm:text-2xl font-title font-bold text-gray-900">
                      {currencyINR(getPrice())}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-gray-500 ml-1">
                      /{product.unitType || 'Per Sheet'}
                    </span>
                  </div>
                  {product.mrpPrice && (
                    <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg font-poppins shrink-0">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
                {/* Category and Color tags removed */}
                <AnimatePresence>
                  {showPendingMessage && (
                    <motion.div
                      id="pending-account-notice"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        x: [0, -4, 4, -4, 4, 0] // Subtle shake to draw attention
                      }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        x: { duration: 0.4 }
                      }}
                      className="flex flex-col mb-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                      <button
                        onClick={() => setShowPendingMessage(false)}
                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-amber-100 text-amber-500 hover:text-amber-700 transition-all"
                        aria-label="Close notice"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">
                          🛒
                        </div>
                        <div className="flex-1 pr-6">
                          <h3 className="text-amber-900 font-bold text-base flex items-center gap-2">
                            Cart Not Available Yet
                            <span className="bg-amber-100 text-amber-700 text-[10px] uppercase px-1.5 py-0.5 rounded-md font-bold tracking-wider">Verification Required</span>
                          </h3>
                          <p className="text-amber-800 text-sm mt-1 leading-relaxed font-medium">
                            Hi {getUserRoleDisplay()}! Your account is currently pending approval.
                            You can submit an enquiry for this product instead while we verify your business details.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700 font-title">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="p-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center font-poppins">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 font-poppins font-semibold text-sm shadow-sm hover:shadow-md"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isInCart ? 'Update Cart' : 'Add to Cart'}</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 text-gray-700 bg-white border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-poppins font-semibold text-sm shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Send enquiry"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Enquiry</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <motion.button
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-poppins font-medium text-sm shadow-md"
          onClick={handleQuickOrder}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Quick order"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Quick Order</span>
        </motion.button>
      </div>
      <AnimatePresence>
        {showEnquiryModal && (
          <ErrorBoundary>
            <EnquiryForm
              isOpen={showEnquiryModal}
              onClose={() => setShowEnquiryModal(false)}
              product={product}
              user={user}
            />
          </ErrorBoundary>
        )}
      </AnimatePresence>
      <CategorySpotlight />
      <Footer />
    </div>
  );
}

export default ProductDetail;