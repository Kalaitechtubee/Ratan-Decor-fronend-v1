import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Box, Mail, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../../cart/context/CartContext';
import { fetchProduct } from '../productSlice';
import toast from 'react-hot-toast';
import { currencyINR } from '../../../utils/utils';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EnquiryForm from './EnquiryForm';
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
          <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full font-poppins shadow-sm">
            NEW
          </span>
          {images.length > 1 && (
            <span className="px-3 py-1 text-xs font-semibold text-white bg-gray-800 rounded-full font-poppins shadow-sm">
              {images.length} IMAGES
            </span>
          )}
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <motion.button
                onClick={onQuickOrder}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-600 text-white px-6 py-3 rounded-full font-poppins font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Quick order"
              >
                <ArrowRight className="w-5 h-5" />
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
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedImage === index
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

const Breadcrumb = ({ productName }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-poppins">
    <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
      <span className="text-gray-400">/</span>
      <Link to="/products" className="hover:text-primary transition-colors duration-200">Products</Link>
      <span className="text-gray-400">/</span>
      <span className="text-gray-900 truncate max-w-[250px] font-medium">{productName}</span>
    </nav>
  </div>
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
  const { cart, addToCart, updateCartItem } = useCart();

  const cartItem = cart.find((item) => item.product?.id === parseInt(id));
  const isInCart = !!cartItem;

  // Initialize quantity based on cart or default to 1
  const [quantity, setQuantity] = useState(() => {
    return cartItem ? cartItem.quantity : 1;
  });
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (isInCart) {
      const success = await updateCartItem(cartItem.id, quantity);
      if (success) {
        toast.success('Cart updated successfully!', { duration: 3000 });
      } else {
        toast.error('Failed to update cart. Please try again.', { duration: 3000 });
      }
    } else {
      const success = await addToCart(product, quantity);
      if (success) {
        toast.success('Added to cart successfully!', { duration: 3000 });
      } else {
        toast.error('Failed to add to cart. Please try again.', { duration: 3000 });
      }
    }
  };

  const handleQuickOrder = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (isInCart) {
      const success = await updateCartItem(cartItem.id, quantity);
      if (success) {
        toast.success('Cart updated! Proceeding to checkout...', { duration: 3000 });
        navigate('/checkout');
      } else {
        toast.error('Failed to update cart. Please try again.', { duration: 3000 });
      }
    } else {
      const success = await addToCart(product, quantity);
      if (success) {
        toast.success('Added to cart successfully! Proceeding to checkout...', { duration: 3000 });
        navigate('/checkout');
      } else {
        toast.error('Failed to add to cart. Please try again.', { duration: 3000 });
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
    switch (userType.toLowerCase()) {
      case 'architect':
        return product.architectPrice || product.price;
      case 'dealer':
        return product.dealerPrice || product.price;
      case 'commercial':
        return product.generalPrice || product.price;
      default:
        return product.price;
    }
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
  const uniqueImageUrls = [...new Set(imageUrls)].map(url => normalizeImageUrl(url)).filter(Boolean);
  const discountPercentage = product.mrpPrice
    ? Math.round(((product.mrpPrice - getPrice()) / product.mrpPrice) * 100)
    : 0;

  const rating = typeof product.averageRating === 'number'
    ? product.averageRating
    : parseFloat(product.averageRating || 0);

  return (
    <div className="min-h-screen bg-gray-50 font-roboto">
      <Navbar />
      <Breadcrumb productName={product.name} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-4 pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full font-poppins">
              Product Details
            </span>
            <div className="hidden sm:block">
              <Breadcrumb productName={product.name} />
            </div>
          </div>
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

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-title font-bold text-gray-900">{currencyINR(getPrice())} /{product.unitType || 'Per Sheet'}</span>
                  {product.mrpPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-gray-500 line-through font-poppins">{currencyINR(product.mrpPrice)}</span>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg font-poppins">
                        Save {currencyINR(product.mrpPrice - getPrice())} ({discountPercentage}% OFF)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-poppins">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  {product.colors && product.colors.length > 0 && product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-poppins"
                    >
                      {color}
                    </span>
                  ))}
                </div>
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
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <motion.button
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-600 text-white px-5 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-poppins font-medium text-sm shadow-md hover:shadow-lg"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isInCart ? 'Update Cart' : 'Add to Cart'}</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowEnquiryModal(true)}
                  className="w-full flex items-center justify-center gap-2 text-primary font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 font-poppins font-medium text-sm border-2 border-primary hover:bg-gradient-to-r hover:from-primary hover:to-red-600 hover:text-white shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
      <Footer />
    </div>
  );
}

export default ProductDetail;