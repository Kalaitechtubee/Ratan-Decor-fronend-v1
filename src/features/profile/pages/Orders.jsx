import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingBag, FaBoxOpen, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../../../services/axios'; // Assume this is your Axios instance

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
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
          console.log('Orders fetched successfully', mappedOrders.length);
          if (isMountedRef.current && !signal.aborted) {
            setOrders(mappedOrders);
            setTotalPages(response.data.pagination.totalPages || 1);
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        if (signal.aborted) {
          console.log('Request aborted');
          return;
        }
        console.error('Fetch orders error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load orders';
        if (err.response?.status === 403 && isMountedRef.current) {
          setOrders([]);
          console.warn('Access denied for orders - this is expected for some user roles');
        } else if (isMountedRef.current) {
          toast.error(errorMessage);
        }
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
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
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'processing':
        return <FaBoxOpen className="text-blue-500" />;
      case 'pending':
        return <FaInfoCircle className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-neutral-500" />;
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
      className="space-y-6 p-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-card border border-neutral-100">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
          <FaShoppingBag className="text-primary" />
          Your Orders ({orders.length})
        </h3>
        {orders.length === 0 ? (
          <div className="bg-neutral-50 p-8 rounded-lg text-center">
            <FaShoppingBag className="text-4xl text-neutral-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-neutral-700">No orders yet</h4>
            <p className="text-neutral-500 mt-2">Your order history will appear here</p>
            <button
              className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg transition-all duration-200 font-medium hover:bg-primary/90"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.3 } } }}
                  className="bg-white p-6 rounded-lg border border-neutral-100 shadow-card hover:shadow-card-hover transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FaBoxOpen className="text-primary" />
                        <h4 className="text-base font-semibold text-neutral-900">Order #{order.id}</h4>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-neutral-400" />
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                        <FaMoneyBillWave className="text-neutral-400" />
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-neutral-400" />
                        {order.deliveryAddress.address || 'N/A'}, {order.deliveryAddress.city || ''}, {order.deliveryAddress.state || ''}, {order.deliveryAddress.country || ''} - {order.deliveryAddress.pincode || ''}
                      </p>
                      <div className="mt-2 space-y-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status || 'N/A'}</span>
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mt-1">
                          <FaMoneyBillWave className="text-gray-500 mr-1" />
                          {order.paymentStatus || 'N/A'}
                        </span>
                      </div>
                      {order.orderItems.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-neutral-900">Items:</h5>
                          <ul className="text-sm text-neutral-600 list-disc list-inside">
                            {order.orderItems.map((item, idx) => (
                              <li key={idx}>{item.product.name} (Qty: {item.quantity}, ₹{item.price})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {order.notes !== 'N/A' && (
                        <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                          <FaInfoCircle className="text-neutral-400" />
                          Notes: {order.notes}
                        </p>
                      )}
                      {order.expectedDeliveryDate && (
                        <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                          <FaCalendarAlt className="text-neutral-400" />
                          Expected Delivery: {formatDate(order.expectedDeliveryDate)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-neutral-800 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-neutral-800'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 text-neutral-800 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;