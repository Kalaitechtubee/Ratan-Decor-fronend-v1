import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getProductImageUrl } from '../../../utils/imageUtils';
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
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
    addToCart,
    isAuthenticated
  } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const fetchRef = useRef(false);

  useEffect(() => {
    if (!fetchRef.current) {
      fetchRef.current = true;
      // Fetch cart for authenticated users, or load guest cart for non-authenticated users
      if (isAuthenticated) {
        fetchCart();
      } else {
        // For guest users, cart is already loaded from localStorage in CartContext
        // Just set loading to false
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

  const toggleWishlist = (itemId) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 my-20">
        <div className="text-center py-20">
          <div className="bg-white rounded-3xl p-12 max-w-md mx-auto shadow-sm border">
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
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Need help? <a href="/contact" className="text-primary hover:underline">Contact our support team</a>
              </p>
            </div>
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
      
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 my-20">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Continue Shopping</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">{cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            
            <div className="hidden md:flex items-center bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <TruckIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium text-sm">Free shipping on all orders!</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              // After normalization, always use item.product (not item.Product)
              const product = item.product || {};
              
              // Debug: Log product image data
              if (process.env.NODE_ENV === 'development') {
                console.log('Cart item product image data:', {
                  itemId: item.id,
                  productId: product.id,
                  hasImageUrl: !!product.imageUrl,
                  hasImageUrls: !!product.imageUrls,
                  imageUrls: product.imageUrls,
                  imageUrl: product.imageUrl,
                  images: product.images,
                  image: product.image
                });
              }
              const productPrice = item.itemCalculations?.unitPrice || product.price || 0;
              const gstRate = product.gst || 0;
              const gstAmount = item.itemCalculations?.gstAmount || ((productPrice * item.quantity * gstRate) / 100);
              const productGST = formatGST(gstRate);
              const productName = product.name || 'Unnamed Product';
              const productDescription = product.description || 'No description available';
              const productImage = getProductImage(product);
              const isRemoving = removingItems.has(item.id);
              const isUpdating = updatingItems.has(item.id);
              const isWishlisted = wishlistedItems.has(item.id);

              return (
                <div key={item.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md'}`}>
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2NUM2Mi43NjE0IDY1IDY1IDY3LjIzODYgNjUgNzBDNjUgNzIuNzYxNCA2Mi43NjE0IDc1IDYwIDc1QzU3LjIzODYgNzUgNTUgNzIuNzYxNCA1NSA3MEM1NSA2Ny4yMzg2IDU3LjIzODYgNjUgNjAgNjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik02MCA4NUM2Mi43NjE0IDg1IDY1IDg3LjIzODYgNjUgOTBDNjUgOTIuNzYxNCA2Mi43NjE0IDk1IDYwIDk1QzU3LjIzODYgOTUgNTUgOTIuNzYxNCA1NSA5MEM1NSA4Ny4yMzg2IDU3LjIzODYgODUgNjAgODVaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          In Stock
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {productName}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {productDescription}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <ShieldCheckIcon className="w-3 h-3 mr-1" />
                                {productGST} GST
                              </span>
                              {gstAmount > 0 && (
                                <span>Tax: {formatPrice(gstAmount)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => toggleWishlist(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              disabled={isRemoving}
                            >
                              {isWishlisted ? (
                                <HeartSolidIcon className="w-5 h-5 text-red-500" />
                              ) : (
                                <HeartIcon className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              disabled={isRemoving}
                            >
                              {isRemoving ? (
                                <div className="w-5 h-5 animate-spin border-2 border-gray-300 border-t-red-500 rounded-full"></div>
                              ) : (
                                <TrashIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1 || isUpdating || isRemoving}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <div className="px-4 py-2 bg-gray-50 border-x border-gray-300 min-w-[60px] text-center font-semibold">
                                {isUpdating ? (
                                  <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-primary rounded-full mx-auto"></div>
                                ) : (
                                  item.quantity
                                )}
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={isUpdating || isRemoving}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-primary mb-1">
                              {formatPrice(productPrice)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total: {formatPrice(item.itemCalculations?.totalAmount || (productPrice * item.quantity))}
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

          <div className="lg:col-span-1">
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

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
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



        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/products')}
            className="text-primary font-semibold hover:underline transition-all"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartList;