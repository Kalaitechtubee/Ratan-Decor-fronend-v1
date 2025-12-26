// ========== ORDERS.JSX ==========
import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingBag, FaBoxOpen, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../../../services/axios';
import toast from 'react-hot-toast';

const Orders = ({ navigate }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/profile/orders', {
          params: { page: currentPage, limit: 10 },
          signal
        });
        if (response.data.success) {
          const mappedOrders = response.data.orders.map(order => ({
            id: order.id,
            createdAt: order.orderDate,
            totalAmount: parseFloat(order.total) || 0,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            deliveryAddress: order.deliveryAddress?.data || {},
            orderItems: order.orderItems || [],
            notes: order.notes || 'N/A',
            expectedDeliveryDate: order.expectedDeliveryDate,
          }));

          if (isMountedRef.current && !signal.aborted) {
            setOrders(mappedOrders);
            setTotalPages(response.data.pagination.totalPages || 1);
            setTotalOrders(response.data.pagination.total || mappedOrders.length);
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        if (signal.aborted) return;
        console.error('Fetch orders error:', err);

        if (err.response?.status === 403 && isMountedRef.current) {
          setOrders([]);
        } else if (isMountedRef.current) {
          const errorMessage = err.response?.data?.message || 'Failed to load orders';
          toast.error(errorMessage);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      : 'N/A';
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      shipped: 'bg-blue-100 text-blue-800',
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <FaCheckCircle className="text-green-500" />,
      processing: <FaBoxOpen className="text-blue-500" />,
      pending: <FaInfoCircle className="text-yellow-500" />,
      cancelled: <FaTimes className="text-red-500" />,
      shipped: <FaBoxOpen className="text-blue-500" />,
    };
    return icons[status?.toLowerCase()] || icons.pending;
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
      className="space-y-4 sm:space-y-6 p-3 sm:p-6"
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-card border border-neutral-100">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4 sm:mb-6 flex items-center gap-2">
          <FaShoppingBag className="text-primary text-sm sm:text-base" />
          <span className="truncate">Your Orders ({totalOrders})</span>
        </h3>
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-50 p-6 sm:p-8 rounded-lg text-center"
          >
            <FaShoppingBag className="text-3xl sm:text-4xl text-neutral-300 mx-auto mb-3 sm:mb-4" />
            <h4 className="text-base sm:text-lg font-semibold text-neutral-700">No orders yet</h4>
            <p className="text-sm sm:text-base text-neutral-500 mt-2">Your order history will appear here</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products')}
              className="mt-4 inline-block px-4 sm:px-6 py-2 bg-primary text-white rounded-lg transition-all duration-200 font-medium hover:bg-primary/90 text-sm sm:text-base"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.3 }
                    }
                  }}
                  whileHover={{ translateY: -2 }}
                  className="bg-white p-4 sm:p-6 rounded-lg border border-neutral-100 shadow-card hover:shadow-card-hover transition-all duration-200"
                >
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <FaBoxOpen className="text-primary text-sm sm:text-base flex-shrink-0" />
                      <h4 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">Order #{order.id}</h4>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <p className="text-neutral-600 flex items-center gap-2">
                        <FaCalendarAlt className="text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{formatDate(order.createdAt)}</span>
                      </p>
                      <p className="text-neutral-600 flex items-center gap-2">
                        <FaMoneyBillWave className="text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{formatPrice(order.totalAmount)}</span>
                      </p>
                      <p className="text-neutral-600 flex items-start gap-2">
                        <FaMapMarkerAlt className="text-neutral-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{order.deliveryAddress.address || 'N/A'}, {order.deliveryAddress.city || ''}, {order.deliveryAddress.state || ''}, {order.deliveryAddress.country || ''} - {order.deliveryAddress.pincode || ''}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 sm:ml-2 capitalize truncate">{order.status || 'N/A'}</span>
                      </span>
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
                        <FaMoneyBillWave className="text-gray-500 mr-1 flex-shrink-0" />
                        <span className="truncate">{order.paymentStatus || 'N/A'}</span>
                      </span>
                    </div>

                    {order.orderItems.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-neutral-100">
                        <h5 className="text-xs sm:text-sm font-medium text-neutral-900 mb-1">Items:</h5>
                        <ul className="text-xs sm:text-sm text-neutral-600 space-y-1">
                          {order.orderItems.map((item, idx) => (
                            <li key={idx} className="break-words">{item.product.name} (Qty: {item.quantity}, ₹{item.price})</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {order.notes !== 'N/A' && (
                      <p className="text-xs sm:text-sm text-neutral-600 flex items-start gap-2 pt-2">
                        <FaInfoCircle className="text-neutral-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">Notes: {order.notes}</span>
                      </p>
                    )}

                    {order.expectedDeliveryDate && (
                      <p className="text-xs sm:text-sm text-neutral-600 flex items-center gap-2 pt-2">
                        <FaCalendarAlt className="text-neutral-400 flex-shrink-0" />
                        <span className="truncate">Expected: {formatDate(order.expectedDeliveryDate)}</span>
                      </p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-xs sm:text-sm mt-3"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4 gap-1 sm:gap-2 flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 bg-gray-200 text-neutral-800 rounded-lg disabled:opacity-50 font-medium text-xs sm:text-sm"
                >
                  Previous
                </motion.button>

                {getPageNumbers().map((page, index) => (
                  <motion.button
                    key={index}
                    whileHover={page === '...' ? {} : { scale: 1.05 }}
                    whileTap={page === '...' ? {} : { scale: 0.95 }}
                    onClick={() => page !== '...' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`px-2 sm:px-3 py-1 rounded-lg font-medium text-xs sm:text-sm transition-all ${currentPage === page
                        ? 'bg-primary text-white shadow-md'
                        : page === '...'
                          ? 'bg-transparent text-neutral-400 cursor-default'
                          : 'bg-gray-100 text-neutral-800 hover:bg-gray-200 border border-neutral-200'
                      }`}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 bg-gray-200 text-neutral-800 rounded-lg disabled:opacity-50 font-medium text-xs sm:text-sm"
                >
                  Next
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;