import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  Calendar,
  FileText,
  Eye,
  ShoppingBag,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OrderAPI from '../orders/api';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { normalizeImageUrl } from '../../utils/imageUtils';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductImage, setSelectedProductImage] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const hasFetched = useRef(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('OrderDetails: Fetching order for ID:', id);
        const response = await OrderAPI.getOrderById(id);
        console.log('OrderDetails: Order details response:', response);
        if (response.success && response.order) {
          const orderData = response.order;
          setOrder(orderData);
          const imageSelection = {};
          (orderData.orderItems || []).forEach((item) => {
            imageSelection[item.id] = 0;
          });
          setSelectedProductImage(imageSelection);
        } else {
          throw new Error(response.message || 'Failed to load order details');
        }
      } catch (err) {
        console.error('OrderDetails: Fetch order error:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id && !hasFetched.current) {
      hasFetched.current = true;
      fetchOrderDetails();
    } else if (id) {
      console.log('OrderDetails: Order fetch skipped (already fetched for ID:', id, ')');
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(parseFloat(price) || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className='w-5 h-5' />;
      case 'shipped':
        return <Truck className='w-5 h-5' />;
      case 'processing':
        return <Package className='w-5 h-5' />;
      case 'pending':
        return <Clock className='w-5 h-5' />;
      case 'cancelled':
        return <AlertCircle className='w-5 h-5' />;
      default:
        return <Package className='w-5 h-5' />;
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { id: 1, name: 'Order Placed', icon: ShoppingBag },
      { id: 2, name: 'Pending', icon: Clock },
      { id: 3, name: 'Processing', icon: Package },
      { id: 4, name: 'Shipped', icon: Truck },
      { id: 5, name: 'Completed', icon: CheckCircle },
    ];
    const s = status?.toLowerCase();
    const statusMap = { pending: 2, processing: 3, shipped: 4, completed: 5 };
    const currentStep = statusMap[s] || 1;

    return steps.map((step) => {
      let stepStatus = 'pending';
      if (s === 'completed') {
        stepStatus = 'completed';
      } else if (step.id < currentStep) {
        stepStatus = 'completed';
      } else if (step.id === currentStep) {
        stepStatus = 'current';
      }
      return { ...step, status: stepStatus };
    });
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };



  const handleViewProduct = (productId) => {
    console.log('OrderDetails: Navigating to product ID:', productId);
    navigate(`/products/${productId}`);
  };



  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col'>
        <Navbar />
        <div className='flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
          <div className='max-w-md mx-auto text-center'>
            <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              {error?.includes('permission')
                ? 'Access Denied'
                : error?.includes('not found')
                  ? 'Order Not Found'
                  : 'Error'}
            </h2>
            <p className='text-gray-600 mb-6'>
              {error ||
                "The order you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <div className='space-y-3'>
              <button
                onClick={() => navigate('/profile?tab=orders')}
                className='w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors sm:px-4 sm:py-2'
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/products')}
                className='w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors sm:px-4 sm:py-2'
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className='min-h-screen mt-20 bg-gray-50 flex flex-col'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8'
      >
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8'>
          <div className='flex items-center space-x-4 mb-4 sm:mb-0'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center p-2 text-gray-600 bg-white rounded-xl shadow-sm transition-colors hover:bg-gray-50 sm:p-2'
            >
              <ArrowLeft className='mr-2 w-5 h-5' />
              Back
            </button>
            <div>
              <h1 className='text-xl font-bold text-gray-900 sm:text-2xl'>
                Order Details
              </h1>
              <p className='text-gray-600 text-sm sm:text-base'>
                Order #{order.id}
              </p>
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3'>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-lg border font-medium ${getStatusColor(
                order.status
              )} text-sm sm:text-base`}
            >
              {getStatusIcon(order.status)}
              <span className='ml-2 capitalize'>{order.status}</span>
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
            {/* Order Tracking */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 sm:mb-6'>
                Order Tracking
              </h2>
              <div className='relative'>
                <div className='absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200'></div>
                <div className='space-y-4 sm:space-y-6'>
                  {trackingSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className='relative flex items-center'>
                        <div
                          className={`relative z-10 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${step.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : step.status === 'current'
                              ? 'bg-primary border-primary text-white animate-pulse'
                              : 'bg-white border-gray-300 text-gray-400'
                            }`}
                        >
                          <Icon className='w-3 h-3 sm:w-4 sm:h-4' />
                        </div>
                        <div className='ml-4'>
                          <p
                            className={`font-medium ${step.status === 'completed'
                              ? 'text-green-600'
                              : step.status === 'current'
                                ? 'text-primary'
                                : 'text-gray-400'
                              } text-sm sm:text-base`}
                          >
                            {step.name}
                          </p>
                          {step.status === 'current' && (
                            <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                              In progress - We'll notify you once this step is completed
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 sm:mb-6'>
                Order Items ({order.orderItems?.length || 0})
              </h2>
              <div className='space-y-4 sm:space-y-6'>
                {(order.orderItems || []).map((item, index) => {
                  const product = item.product || {};
                  // Get image URLs with proper fallback handling
                  let rawImageUrls = [];
                  if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
                    rawImageUrls = product.imageUrls;
                  } else if (product.imageUrl) {
                    rawImageUrls = [product.imageUrl];
                  }
                  // Normalize all image URLs and filter out any null/undefined values
                  const imageUrls = rawImageUrls
                    .map(url => normalizeImageUrl(url))
                    .filter(Boolean);
                  const selectedImageIndex = selectedProductImage[item.id] || 0;
                  const unitPrice =
                    parseFloat(item.price) || product.currentPrice || 0;
                  const totalPrice =
                    parseFloat(item.total) || unitPrice * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow'
                    >
                      {/* Product Images */}
                      <div className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden'>
                        {imageUrls.length > 0 ? (
                          <img
                            src={imageUrls[selectedImageIndex]}
                            onError={(e) => {
                              e.target.src = '/images/fallback-image.jpg'; // Local fallback image
                            }}
                            alt={product.name || 'Order Image'}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-gray-100'>
                            <Package className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
                          </div>
                        )}
                      </div>
                      {/* Product Details */}
                      <div className='flex-1'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                          <div className='flex-1'>
                            <h3 className='font-semibold text-gray-900 text-sm sm:text-base hover:text-primary transition-colors'>
                              <button
                                onClick={() => handleViewProduct(product.id)}
                                className='text-left hover:underline'
                              >
                                {product.name || 'Unknown Product'}
                              </button>
                            </h3>
                            <div className='mt-2 space-y-1'>
                              <p className='text-xs sm:text-sm text-gray-500'>
                                Qty: {item.quantity}
                              </p>
                              <p className='text-xs sm:text-sm text-gray-500'>
                                Price: {formatPrice(unitPrice)}
                              </p>
                              {item.gstRate > 0 && (
                                <p className='text-xs sm:text-[11px] text-[#ff4747] font-medium'>
                                  Tax Rate: {item.gstRate}% (Included)
                                </p>
                              )}
                              <p className='text-xs sm:text-sm text-gray-500'>
                                Unit Type: {product.unitType || 'Sheet'}
                              </p>
                            </div>
                          </div>
                          <div className='text-right mt-2 sm:mt-0'>
                            <p className='font-semibold text-base sm:text-lg text-gray-900'>
                              {formatPrice(totalPrice)}
                            </p>
                            {product.currentPrice > product.orderPrice && (
                              <p className='text-xs sm:text-sm text-gray-500 line-through'>
                                {formatPrice(
                                  product.currentPrice * item.quantity
                                )}
                              </p>
                            )}
                            <button
                              onClick={() => handleViewProduct(product.id)}
                              className='mt-2 flex items-center text-xs sm:text-sm text-primary hover:text-red-600 transition-colors'
                            >
                              <Eye className='w-3 h-3 sm:w-4 sm:h-4 mr-1' />
                              View Product
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6 sm:space-y-8'>
            {/* Order Summary */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 sm:mb-4'>
                Order Summary
              </h2>
              <div className='space-y-2 sm:space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='text-gray-900'>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.gstAmount > 0 && (
                  <div className='pt-1 space-y-2'>
                    {order.deliveryAddress?.data?.state?.toLowerCase().includes('tamil nadu') ||
                      order.deliveryAddress?.data?.state?.toLowerCase().includes('tn') ? (
                      <>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>CGST (9%)</span>
                          <span className='text-gray-700 font-medium'>{formatPrice(order.gstAmount / 2)}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>SGST (9%)</span>
                          <span className='text-gray-700 font-medium'>{formatPrice(order.gstAmount / 2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-500'>IGST (18%)</span>
                        <span className='text-gray-700 font-medium'>{formatPrice(order.gstAmount)}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className='border-t border-gray-200 pt-2 sm:pt-3'>
                  <div className='flex justify-between font-semibold text-base sm:text-lg'>
                    <span className='text-gray-900'>Total</span>
                    <span className='text-primary'>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 sm:mb-4'>
                Order Information
              </h2>
              <div className='space-y-3 sm:space-y-4'>
                <div className='flex items-start space-x-2 sm:space-x-3'>
                  <Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Order Date
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-2 sm:space-x-3'>
                  <CreditCard className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Payment Method
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      {order.paymentMethod || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-2 sm:space-x-3'>
                  <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      Payment Status
                    </p>
                    <p
                      className={`text-xs sm:text-sm ${order.paymentStatus === 'Received'
                        ? 'text-green-600'
                        : order.paymentStatus === 'Not Received'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                        }`}
                    >
                      {order.paymentStatus || 'N/A'}
                    </p>
                  </div>
                </div>
                {order.expectedDeliveryDate && (
                  <div className='flex items-start space-x-2 sm:space-x-3'>
                    <Truck className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Expected Delivery
                      </p>
                      <p className='text-xs sm:text-sm text-gray-600'>
                        {formatDate(order.expectedDeliveryDate)}
                      </p>
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className='flex items-start space-x-2 sm:space-x-3'>
                    <FileText className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Order Notes
                      </p>
                      <p className='text-xs sm:text-sm text-gray-600'>
                        {order.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 sm:mb-4'>
                Shipping Address
              </h2>
              {order.deliveryAddress?.data ? (
                <div className='flex items-start space-x-2 sm:space-x-3'>
                  <MapPin className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='font-medium text-gray-900 text-sm sm:text-base'>
                      {order.deliveryAddress.data.name}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      {order.deliveryAddress.data.phone}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                      {order.deliveryAddress.data.address || ''}<br />
                      {order.deliveryAddress.data.city},{' '}
                      {order.deliveryAddress.data.state}<br />
                      {order.deliveryAddress.data.country}{' '}
                      {order.deliveryAddress.data.pincode}
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-xs sm:text-sm text-gray-500'>
                  No shipping address available
                </p>
              )}
            </div>

            {/* Customer Support */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 sm:mb-4'>
                Need Help?
              </h2>
              <div className='space-y-2 sm:space-y-3'>
                <a
                  href='tel:+919123456789'
                  className='flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <Phone className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                  <div>
                    <p className='font-medium text-gray-900 text-sm sm:text-base'>
                      Call Support
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      +91 91234 56789
                    </p>
                  </div>
                </a>
                <a
                  href='https://wa.me/919123456789'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <MessageCircle className='w-4 h-4 sm:w-5 sm:h-5 text-green-500' />
                  <div>
                    <p className='font-medium text-gray-900 text-sm sm:text-base'>
                      WhatsApp
                    </p>
                    <p className='text-xs sm:text-sm text-gray-600'>
                      Quick support
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4'
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className='relative max-w-[90%] sm:max-w-4xl max-h-[90%] sm:max-h-full'
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={modalImage}
                  alt='Product'
                  className='max-w-full max-h-full object-contain rounded-lg'
                />
                <button
                  onClick={() => setShowImageModal(false)}
                  className='absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


      </motion.div>
      <Footer />
    </div>
  );
};

export default OrderDetails;