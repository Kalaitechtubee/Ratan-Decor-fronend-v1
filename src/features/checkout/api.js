import { handleResponse, makeAuthenticatedRequest } from '../../utils/apiRequestHandler.js';

const BASE_URL = import.meta.env.VITE_API_URL;

// Profile API Calls
const ProfileAPI = {
  // Get logged-in user's profile
  getProfile: async () => {
    try {
      return await makeAuthenticatedRequest('/profile', { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  },

  // Update logged-in user's profile
  updateProfile: async (profileData) => {
    try {
      return await makeAuthenticatedRequest('/profile', {
        method: 'PUT',
        body: profileData
      });
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  // Get logged-in user's order history
  getProfileOrderHistory: async (queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `/profile/orders?${queryString}` : `/profile/orders`;
      return await makeAuthenticatedRequest(url, { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch profile order history: ${error.message}`);
    }
  },

  // Get order history for a specific user by ID
  getProfileOrderHistoryById: async (id, queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `/profile/orders/id/${id}?${queryString}` : `/profile/orders/id/${id}`;
      return await makeAuthenticatedRequest(url, { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch profile order history for user ${id}: ${error.message}`);
    }
  },
};

// Shipping Address API Calls
const ShippingAddressAPI = {
  // Get all shipping addresses
  getShippingAddresses: async () => {
    try {
      return await makeAuthenticatedRequest('/shipping-address', { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch shipping addresses: ${error.message}`);
    }
  },

  // Get shipping address by ID
  getShippingAddressById: async (id) => {
    try {
      return await makeAuthenticatedRequest(`/shipping-address/${id}`, { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch shipping address ${id}: ${error.message}`);
    }
  },

  // Create new shipping address
  createShippingAddress: async (addressData) => {
    try {
      return await makeAuthenticatedRequest('/shipping-address', {
        method: 'POST',
        body: addressData
      });
    } catch (error) {
      throw new Error(`Failed to create shipping address: ${error.message}`);
    }
  },

  // Update shipping address
  updateShippingAddress: async (id, addressData) => {
    try {
      return await makeAuthenticatedRequest(`/shipping-address/${id}`, {
        method: 'PUT',
        body: addressData
      });
    } catch (error) {
      throw new Error(`Failed to update shipping address ${id}: ${error.message}`);
    }
  },

  // Delete shipping address
  deleteShippingAddress: async (id) => {
    try {
      return await makeAuthenticatedRequest(`/shipping-address/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw new Error(`Failed to delete shipping address ${id}: ${error.message}`);
    }
  },

  // Set default shipping address
  setDefaultShippingAddress: async (id) => {
    try {
      return await makeAuthenticatedRequest(`/shipping-address/${id}/default`, { method: 'PATCH' });
    } catch (error) {
      throw new Error(`Failed to set default shipping address ${id}: ${error.message}`);
    }
  },
};

// Cart API Calls
const CartAPI = {
  // Get cart items
  getCart: async () => {
    try {
      return await makeAuthenticatedRequest('/cart', { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch cart: ${error.message}`);
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, options = {}) => {
    try {
      return await makeAuthenticatedRequest('/cart', {
        method: 'POST',
        body: {
          productId,
          quantity,
          ...options,
        }
      });
    } catch (error) {
      throw new Error(`Failed to add to cart: ${error.message}`);
    }
  },

  // Update cart item
  updateCartItem: async (cartItemId, quantity) => {
    try {
      return await makeAuthenticatedRequest(`/cart/${cartItemId}`, {
        method: 'PUT',
        body: { quantity }
      });
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error.message}`);
    }
  },

  // Remove from cart
  removeFromCart: async (cartItemId) => {
    try {
      return await makeAuthenticatedRequest(`/cart/${cartItemId}`, { method: 'DELETE' });
    } catch (error) {
      throw new Error(`Failed to remove from cart: ${error.message}`);
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      return await makeAuthenticatedRequest('/cart/count', { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to get cart count: ${error.message}`);
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      return await makeAuthenticatedRequest('/cart', { method: 'DELETE' });
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  },
};

// Order API Calls
const OrderAPI = {
  // Get available addresses for order
  getAvailableAddresses: async () => {
    try {
      return await makeAuthenticatedRequest('/orders/addresses', { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch available addresses: ${error.message}`);
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      return await makeAuthenticatedRequest('/orders', {
        method: 'POST',
        body: orderData
      });
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },

  // Get all orders
  getOrders: async (queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `/orders?${queryString}` : `/orders`;
      return await makeAuthenticatedRequest(url, { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      return await makeAuthenticatedRequest(`/orders/${id}`, { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch order ${id}: ${error.message}`);
    }
  },

  // Update order
  updateOrder: async (id, updateData) => {
    try {
      return await makeAuthenticatedRequest(`/orders/${id}`, {
        method: 'PUT',
        body: updateData
      });
    } catch (error) {
      throw new Error(`Failed to update order ${id}: ${error.message}`);
    }
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    try {
      return await makeAuthenticatedRequest(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: { reason }
      });
    } catch (error) {
      throw new Error(`Failed to cancel order ${id}: ${error.message}`);
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      return await makeAuthenticatedRequest(`/orders/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw new Error(`Failed to delete order ${id}: ${error.message}`);
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      return await makeAuthenticatedRequest('/orders/stats', { method: 'GET' });
    } catch (error) {
      throw new Error(`Failed to fetch order stats: ${error.message}`);
    }
  },

  // Debug token
  debugToken: async () => {
    try {
      return await makeAuthenticatedRequest('/orders/debug-token', { method: 'POST' });
    } catch (error) {
      throw new Error(`Failed to debug token: ${error.message}`);
    }
  },
};

// Payment API Calls
const PaymentAPI = {
  // Save UTR for UPI payment
  saveUTR: async (utrData) => {
    try {
      return await makeAuthenticatedRequest('/payments/save-utr', {
        method: 'POST',
        body: utrData
      });
    } catch (error) {
      throw new Error(`Failed to save UTR: ${error.message}`);
    }
  },
};

export { ProfileAPI, ShippingAddressAPI, CartAPI, OrderAPI, PaymentAPI };
