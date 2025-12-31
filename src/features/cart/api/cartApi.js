const BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Authentication is now cookie-based - no Authorization header needed
  return {
    'Content-Type': 'application/json'
  };
};

// Helper function to normalize cart item structure
// Backend sometimes returns 'Product' (capital P) or 'product' (lowercase)
// This ensures consistent structure: { id, productId, quantity, product, itemCalculations }
const normalizeCartItem = (item) => {
  if (!item) return null;

  // Normalize product field - convert Product to product
  const product = item.product || item.Product || null;

  // Build normalized item structure
  const normalized = {
    id: item.id || item._id,
    productId: item.productId,
    quantity: item.quantity,
    userId: item.userId,
    product: product ? {
      ...product,
      // Ensure product has id
      id: product.id || item.productId,
      // Preserve all image-related fields from backend processing
      imageUrl: product.imageUrl || null,
      imageUrls: product.imageUrls || (product.imageUrl ? [product.imageUrl] : []),
      images: product.images || null,
      image: product.image || null
    } : null,
    itemCalculations: item.itemCalculations || null,
    specifications: item.specifications || {}
  };

  // Preserve any additional fields
  Object.keys(item).forEach(key => {
    if (!['Product', 'product'].includes(key) && !normalized.hasOwnProperty(key)) {
      normalized[key] = item[key];
    }
  });

  return normalized;
};

// Helper function to normalize array of cart items
const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeCartItem).filter(item => item !== null);
};

// Helper function to handle API responses
// Tokens are now managed via secure httpOnly cookies - no frontend token handling needed
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    // Include status code in error message for better error handling
    const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  return data;
};

// Cart API functions
export const getCart = async () => {
  try {
    console.log('CartApi: Fetching cart items (tokens in secure cookies)...');

    // Tokens are now in secure httpOnly cookies - make API call directly
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include', // Include cookies (access token and refresh token)
      cache: 'no-cache'
    });

    const data = await handleResponse(response);

    console.log('CartApi: Cart response:', data);

    // Normalize cart items before returning
    if (data.cartItems && Array.isArray(data.cartItems)) {
      data.cartItems = normalizeCartItems(data.cartItems);
    }

    return data;
  } catch (error) {
    console.error('CartApi: Get cart error:', error);

    // Handle 401 errors gracefully - fallback to guest cart
    if (error.status === 401 || error.message?.includes('401') || error.message?.includes('unauthorized') || error.message?.includes('Access denied')) {
      console.log('CartApi: 401 Unauthorized - falling back to guest cart');
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const guestCart = normalizeCartItems(JSON.parse(savedCart));
        console.log('CartApi: Falling back to guest cart:', guestCart);
        return { cartItems: guestCart };
      }
      return { cartItems: [] };
    }

    // For other errors, try to fallback to guest cart
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      console.log('CartApi: Falling back to guest cart due to error:', error.message);
      return { cartItems: normalizeCartItems(JSON.parse(savedCart)) };
    }

    throw new Error(`Failed to fetch cart: ${error.message}`);
  }
};

export const addToCart = async (productId, quantity = 1, options = {}) => {
  try {
    console.log('CartApi: Adding to cart:', { productId, quantity, options });

    if (!productId) {
      throw new Error('Product ID is required');
    }

    if (!quantity || quantity < 1) {
      throw new Error('Valid quantity is required');
    }

    const requestBody = {
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      ...options
    };

    // Tokens are now in secure httpOnly cookies - make API call directly
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include', // Include cookies (access token and refresh token)
        body: JSON.stringify(requestBody),
      });

      const data = await handleResponse(response);

      console.log('CartApi: Add to cart response:', data);

      // Normalize cartItem if present
      if (data.cartItem) {
        data.cartItem = normalizeCartItem(data.cartItem);
      }

      return data;
    } catch (error) {
      // If API call fails (e.g., user not authenticated), fall back to guest cart
      if (error.status === 401) {
        console.log('CartApi: User not authenticated, using guest cart');
        // Guest cart addition - fix to increase quantity if product exists
        const savedCart = localStorage.getItem('guestCart') ? JSON.parse(localStorage.getItem('guestCart')) : [];
        const existingIndex = savedCart.findIndex(item =>
          item.productId === productId && JSON.stringify(item.specifications || {}) === JSON.stringify(options)
        );
        let updatedCart;
        if (existingIndex !== -1) {
          updatedCart = savedCart.map((item, index) => {
            if (index === existingIndex) {
              return { ...item, quantity: item.quantity + quantity };
            }
            return item;
          });
        } else {
          const newItem = {
            id: productId,
            productId,
            quantity,
            product: { id: productId, ...options },
            specifications: options
          };
          updatedCart = [...savedCart, newItem];
        }
        updatedCart = normalizeCartItems(updatedCart.filter(item => validateCartItem(item)));
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        return { success: true, cartItems: updatedCart };
      }
      throw error;
    }
  } catch (error) {
    console.error('CartApi: Add to cart error:', error);
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
};

export const updateCartItem = async (cartItemId, quantity) => {
  try {
    console.log('CartApi: Updating cart item:', { cartItemId, quantity });

    if (!cartItemId) {
      throw new Error('Cart item ID is required');
    }

    if (!quantity || quantity < 1) {
      throw new Error('Valid quantity is required');
    }

    // Tokens are now in secure httpOnly cookies - make API call directly
    const requestBody = { quantity: parseInt(quantity) };

    try {
      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include', // Include cookies (access token and refresh token)
        body: JSON.stringify(requestBody),
      });

      const data = await handleResponse(response);

      console.log('CartApi: Update cart item response:', data);

      // Normalize cartItem if present
      if (data.cartItem) {
        data.cartItem = normalizeCartItem(data.cartItem);
      }

      return data;
    } catch (error) {
      // If API call fails (e.g., user not authenticated), fall back to guest cart
      if (error.status === 401) {
        // Guest cart update
        console.log('CartApi: User not authenticated, updating guest cart');
        const savedCart = localStorage.getItem('guestCart') ? JSON.parse(localStorage.getItem('guestCart')) : [];
        const updatedCart = normalizeCartItems(
          savedCart.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
          ).filter(item => validateCartItem(item))
        );
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        return { success: true };
      }
      throw error;
    }
  } catch (error) {
    console.error('CartApi: Update cart item error:', error);
    throw new Error(`Failed to update cart item: ${error.message}`);
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    console.log('CartApi: Removing cart item:', cartItemId);

    if (!cartItemId) {
      throw new Error('Cart item ID is required');
    }

    // Tokens are now in secure httpOnly cookies - make API call directly
    console.log('CartApi: Making DELETE request to:', `${BASE_URL}/cart/${cartItemId}`);
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include', // Include cookies (access token and refresh token)
    });

    console.log('CartApi: Response status:', response.status, response.statusText);

    const data = await handleResponse(response);

    console.log('CartApi: Remove cart item response:', data);
    return data;
  } catch (error) {
    // If API call fails (e.g., user not authenticated), fall back to guest cart
    if (error.status === 401) {
      console.log('CartApi: User not authenticated, removing from guest cart');
      const savedCart = localStorage.getItem('guestCart') ? JSON.parse(localStorage.getItem('guestCart')) : [];
      const updatedCart = normalizeCartItems(
        savedCart.filter(item => item.id !== cartItemId)
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return { success: true };
    }
    // For 404 errors - don't treat as success, throw error so UI doesn't update
    // This means the item doesn't exist or doesn't belong to the user
    if (error.status === 404) {
      console.error('CartApi: Cart item not found or does not belong to user:', {
        cartItemId,
        errorMessage: error.message,
        status: error.status
      });
      console.error('CartApi: This could mean:');
      console.error('  1. Cart item ID does not exist in database');
      console.error('  2. Cart item belongs to a different user');
      console.error('  3. User authentication issue (check cookies)');
      const notFoundError = new Error('Cart item not found or does not belong to you. Please refresh the cart.');
      notFoundError.status = 404;
      throw notFoundError;
    }
    console.error('CartApi: Remove cart item error:', error);
    // Preserve the original error with status code
    const newError = new Error(error.message || `Failed to remove item from cart`);
    newError.status = error.status;
    throw newError;
  }
};

export const getCartCount = async () => {
  try {
    console.log('CartApi: Getting cart count...');

    // Tokens are now in secure httpOnly cookies - make API call directly
    const response = await fetch(`${BASE_URL}/cart/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include', // Include cookies (access token and refresh token)
      cache: 'no-cache'
    });

    const data = await handleResponse(response);

    console.log('CartApi: Cart count response:', data);
    return data;
  } catch (error) {
    // If API call fails (e.g., user not authenticated), fall back to guest cart
    if (error.status === 401) {
      console.log('CartApi: User not authenticated, using guest cart count');
      const savedCart = localStorage.getItem('guestCart') ? JSON.parse(localStorage.getItem('guestCart')) : [];
      return { count: savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0) };
    }
    console.error('CartApi: Get cart count error:', error);
    throw new Error(`Failed to get cart count: ${error.message}`);
  }
};

export const clearCart = async () => {
  try {
    console.log('CartApi: Clearing entire cart...');

    // Tokens are now in secure httpOnly cookies - make API call directly
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include', // Include cookies (access token and refresh token)
    });

    const data = await handleResponse(response);

    console.log('CartApi: Clear cart response:', data);
    return data;
  } catch (error) {
    // If API call fails (e.g., user not authenticated), fall back to guest cart
    if (error.status === 401) {
      console.log('CartApi: User not authenticated, clearing guest cart');
      localStorage.removeItem('guestCart');
      return { success: true };
    }
    console.error('CartApi: Clear cart error:', error);
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
};

export const validateCartItem = (item) => {
  if (!item) return false;

  // After normalization, items should have consistent structure
  // Require quantity and at least one ID field
  const hasQuantity = item.quantity != null && item.quantity > 0;
  const hasId = item.id != null || item.productId != null ||
    (item.product && item.product.id != null);

  return hasQuantity && hasId;
};

export const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems)) return 0;

  return cartItems.reduce((total, item) => {
    if (!validateCartItem(item)) return total;

    // After normalization, always use item.product (not item.Product)
    const unitPrice = item.itemCalculations?.unitPrice ||
      item.product?.price ||
      0;

    return total + (parseFloat(unitPrice) * parseInt(item.quantity));
  }, 0);
};

export const calculateCartSummary = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    return {
      subtotal: 0,
      gstAmount: 0,
      totalAmount: 0,
      itemCount: 0
    };
  }

  let subtotal = 0;
  let gstAmount = 0;

  cartItems.forEach(item => {
    if (!validateCartItem(item)) return;

    // Prefer backend calculations if available
    if (item.itemCalculations) {
      subtotal += parseFloat(item.itemCalculations.subtotal || 0);
      gstAmount += parseFloat(item.itemCalculations.gstAmount || 0);
    } else {
      // Fallback to calculating from product data (after normalization, always use item.product)
      const product = item.product || {};
      const unitPrice = parseFloat(product.price || 0);
      const quantity = parseInt(item.quantity || 0);
      const itemSubtotal = unitPrice * quantity;

      subtotal += itemSubtotal;

      const gstRate = parseFloat(product.gst || 0);
      if (gstRate > 0) {
        gstAmount += (itemSubtotal * gstRate) / 100;
      }
    }
  });

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    gstAmount: parseFloat(gstAmount.toFixed(2)),
    totalAmount: parseFloat((subtotal + gstAmount).toFixed(2)),
    itemCount: cartItems.length
  };
};

export const CartAPI = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartCount,
  clearCart,
  validateCartItem,
  calculateCartTotal,
  calculateCartSummary,
  normalizeCartItem,
  normalizeCartItems
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartCount,
  clearCart,
  validateCartItem,
  calculateCartTotal,
  calculateCartSummary,
  normalizeCartItem,
  normalizeCartItems
};