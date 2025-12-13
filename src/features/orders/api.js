// services/orderAPI.js
import api from '../../services/axios';
const OrderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Get all orders for current user (or all orders for admin/manager)
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get single order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      
      // Enhanced error handling
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view this order');
      } else if (error.response?.status === 404) {
        throw new Error('Order not found');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in to view this order');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  },

  // Update order (admin/manager only)
  updateOrder: async (id, updateData) => {
    try {
      const response = await api.put(`/orders/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to update order');
    }
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  },

  // Get order statistics (admin/manager only)
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
    }
  },

  // Get available addresses for order creation
  getAvailableAddresses: async () => {
    try {
      const response = await api.get('/orders/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
    }
  },

  // Debug token (development only)
  debugToken: async () => {
    try {
      const response = await api.post('/orders/debug-token');
      return response.data;
    } catch (error) {
      console.error('Token debug error:', error);
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }
};

export default OrderAPI;