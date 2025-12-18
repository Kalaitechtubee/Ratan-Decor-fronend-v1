import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductImageUrl } from '../../../utils/imageUtils';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const CartList = () => {
  const {
    cart,
    cartLoading,
    cartError,
    fetchCart,
    removeFromCart,
    updateCartItem,
    getCartSummary,
    isAuthenticated
  } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const fetchRef = useRef(false);

  useEffect(() => {
    if (!fetchRef.current) {
      fetchRef.current = true;
      if (isAuthenticated) {
        fetchCart();
      } else {
        setLoading(false);
      }
    }
    setLoading(false);
  }, [fetchCart, isAuthenticated]);

  const handleQuantityChange = async (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setRemovingItems(prev => new Set(prev).add(cartItemId));
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    if (cart && cart.length > 0) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        navigate('/checkout');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  const formatGST = (gstRate) => {
    const numGST = parseFloat(gstRate) || 0;
    return numGST > 0 ? `${numGST}%` : 'Tax Included';
  };

  const getProductImage = (product) => {
    if (!product) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2NUM2Mi43NjE0IDY1IDY1IDY3LjIzODYgNjUgNzBDNjUgNzIuNzYxNCA2Mi43NjE0IDc1IDYwIDc1QzU3LjIzODYgNzUgNTUgNzIuNzYxNCA1NSA3MEM1NSA2Ny4yMzg2IDU3LjIzODYgNjUgNjAgNjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik02MCA4NUM2Mi43NjE0IDg1IDY1IDg3LjIzODYgNjUgOTBDNjUgOTIuNzYxNCA2Mi43NjE0IDk1IDYwIDk1QzU3LjIzODYgOTUgNTUgOTIuNzYxNCA1NSA5MEM1NSA4Ny4yMzg2IDU3LjIzODYgODUgNjAgODVaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
    }
   
    const imageUrl = getProductImageUrl(product);
    return imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2NUM2Mi43NjE0IDY1IDY1IDY3LjIzODYgNjUgNzBDNjUgNzIuNzYxNCA2Mi43NjE0IDc1IDYwIDc1QzU3LjIzODYgNzUgNTUgNzIuNzYxNCA1NSA3MEM1NSA2Ny4yMzg2IDU3LjIzODYgNjUgNjAgNjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik02MCA4NUM2Mi43NjE0IDg1IDY1IDg3LjIzODYgNjUgOTBDNjUgOTIuNzYxNCA2Mi43NjE0IDk1IDYwIDk1QzU3LjIzODYgOTUgNTUgOTIuNzYxNCA1NSA5MEM1NSA4Ny4yMzg2IDU3LjIzODYgODUgNjAgODVaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
  };

  const cartSummary = getCartSummary();

  const LoadingState = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Cart</h3>
            <p className="text-red-600 mb-4 text-sm">{cartError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  const EmptyCartState = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 pt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-sm border">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start shopping to discover our amazing products!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if ((loading && isAuthenticated) || cartLoading) return <LoadingState />;
  if (cartError) return <ErrorState />;
  if (!cart || cart.length === 0) return <EmptyCartState />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     
      <div className="px-4 pt-12 lg:pt-24 pb-32 lg:pb-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back Button & Header */}
        <div className="mb-6 lg:mb-12">
          {/* Mobile: floating icon-only back button */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="lg:hidden fixed top-16 left-4 z-50 bg-white border border-gray-200 p-2 rounded-full shadow-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          {/* Desktop: inline back button with space below */}
          <div className="hidden lg:block mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm lg:text-base">Continue Shopping</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">{cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>
           
            <div className="flex items-center bg-green-50 border border-green-200 rounded-xl px-3 py-2 lg:px-4 lg:py-2 w-fit">
              <TruckIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium text-xs lg:text-sm">Free shipping on all orders!</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3 lg:space-y-4">
            {cart.map((item) => {
              const product = item.product || {};
              const productPrice = item.itemCalculations?.unitPrice || product.price || 0;
              const gstRate = product.gst || 0;
              const gstAmount = item.itemCalculations?.gstAmount || ((productPrice * item.quantity * gstRate) / 100);
              const productGST = formatGST(gstRate);
              const productName = product.name || 'Unnamed Product';
              const productDescription = product.description || 'No description available';
              const productImage = getProductImage(product);
              const isRemoving = removingItems.has(item.id);
              const isUpdating = updatingItems.has(item.id);

              return (
                <div key={item.id} className={`bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md'}`}>
                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2NUM2Mi43NjE0IDY1IDY1IDY3LjIzODYgNjUgNzBDNjUgNzIuNzYxNCA2Mi43NjE0IDc1IDYwIDc1QzU3LjIzODYgNzUgNTUgNzIuNzYxNCA1NSA3MEM1NSA2Ny4yMzg2IDU3LjIzODYgNjUgNjAgNjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik02MCA4NUM2Mi43NjE0IDg1IDY1IDg3LjIzODYgNjUgOTBDNjUgOTIuNzYxNCA2Mi43NjE0IDk1IDYwIDk1QzU3LjIzODYgOTUgNTUgOTIuNzYxNCA1NSA5MEM1NSA4Ny4yMzg2IDU3LjIzODYgODUgNjAgODVaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-green-100 text-green-800 text-xs font-semibold px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-full">
                          In Stock
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between items-start mb-2 lg:mb-3">
                          <div className="flex-1 pr-2 lg:pr-4 min-w-0">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 line-clamp-2 break-words">
                              {productName}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 lg:mb-3 break-words">
                              {productDescription}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center whitespace-nowrap">
                                <ShieldCheckIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                {productGST} GST
                              </span>
                              {gstAmount > 0 && (
                                <span className="whitespace-nowrap">Tax: {formatPrice(gstAmount)}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 lg:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <div className="w-4 h-4 lg:w-5 lg:h-5 animate-spin border-2 border-gray-300 border-t-red-500 rounded-full"></div>
                            ) : (
                              <TrashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                            )}
                          </button>
                        </div>

                        {/* Quantity Controls and Price */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1 || isUpdating || isRemoving}
                                className="p-1.5 lg:p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <MinusIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                              <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-50 border-x border-gray-300 min-w-[40px] lg:min-w-[60px] text-center font-semibold text-sm lg:text-base">
                                {isUpdating ? (
                                  <div className="w-3 h-3 lg:w-4 lg:h-4 animate-spin border-2 border-gray-300 border-t-primary rounded-full mx-auto"></div>
                                ) : (
                                  item.quantity
                                )}
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={isUpdating || isRemoving}
                                className="p-1.5 lg:p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <PlusIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-primary whitespace-nowrap">
                              {formatPrice(item.itemCalculations?.totalAmount || (productPrice * item.quantity))}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-0.5 whitespace-nowrap">
                              {formatPrice(productPrice)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
               
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartSummary.itemCount} items)</span>
                    <span className="font-semibold">{formatPrice(cartSummary.subtotal)}</span>
                  </div>
                 
                  <div className="flex justify-between text-gray-600">
                    <span>Tax & GST</span>
                    <span className="font-semibold">{formatPrice(cartSummary.gstAmount)}</span>
                  </div>
                 
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center">
                      <TruckIcon className="w-4 h-4 mr-1" />
                      <span>Shipping</span>
                    </div>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                 
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(cartSummary.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center text-green-800">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-semibold text-sm">You're saving ₹200 on shipping!</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cartLoading || cart.length === 0}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {cartLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                <div className="pt-4 space-y-3 text-center">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                 
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CreditCardIcon className="w-4 h-4 mr-1" />
                      <span>All cards accepted</span>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="w-4 h-4 mr-1" />
                      <span>Free returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Checkout Bar */}
        <div className="fixed inset-x-0 bottom-0 lg:hidden bg-white border-t border-gray-200 shadow-2xl z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Order Total</p>
                <p className="text-xl font-bold text-primary">{formatPrice(cartSummary.totalAmount)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMobileSummary(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={cartLoading}
                  className="bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {cartLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Checkout
                    </div>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-green-700 font-medium mt-2">
              <TruckIcon className="w-3 h-3 inline mr-1" />
              Free shipping included
            </p>
          </div>
        </div>

        {/* Mobile Order Summary Modal */}
        {showMobileSummary && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSummary(false)} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <button
                    onClick={() => setShowMobileSummary(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
               
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartSummary.itemCount} items)</span>
                    <span className="font-semibold">{formatPrice(cartSummary.subtotal)}</span>
                  </div>
                 
                  <div className="flex justify-between text-gray-600">
                    <span>Tax & GST</span>
                    <span className="font-semibold">{formatPrice(cartSummary.gstAmount)}</span>
                  </div>
                 
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center">
                      <TruckIcon className="w-4 h-4 mr-1" />
                      <span>Shipping</span>
                    </div>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                 
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(cartSummary.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center text-green-800">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-semibold text-sm">You're saving ₹200 on shipping!</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cartLoading || cart.length === 0}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                <div className="pt-4 space-y-3 text-center">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                 
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CreditCardIcon className="w-4 h-4 mr-1" />
                      <span>All cards accepted</span>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="w-4 h-4 mr-1" />
                      <span>Free returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
     
      <Footer />
    </div>
  );
};

export default CartList;