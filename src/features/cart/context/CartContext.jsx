import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { CartAPI } from '../api/cartApi.js';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      // Normalize guest cart on initial load
      return CartAPI.normalizeCartItems(JSON.parse(savedCart));
    }
    return [];
  });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const updateInProgress = useRef(false);
  const prevAuthStatus = useRef(isAuthenticated);

  // When a user logs out, immediately reset cart to guest cart (should be empty after logout)
  useEffect(() => {
    if (prevAuthStatus.current && !isAuthenticated) {
      const savedCart = localStorage.getItem('guestCart');
      const guestCart = savedCart ? CartAPI.normalizeCartItems(JSON.parse(savedCart)) : [];
      updateInProgress.current = false;
      setCart(guestCart);
    }
    prevAuthStatus.current = isAuthenticated;
  }, [isAuthenticated]);

  // Fetch cart when user becomes available
  useEffect(() => {
    if (isAuthenticated && user && !cartLoading) {
      console.log('CartContext: User available, fetching cart');
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const fetchCart = useCallback(async (force = false) => {
    // Allow forced fetch even if operation is in progress
    if (!force && (cartLoading || updateInProgress.current)) {
      console.log('CartContext: Skipping fetch - operation in progress');
      return;
    }

    try {
      setCartLoading(true);
      setCartError(null);
      
      // Wait for user to be available if authenticated
      if (isAuthenticated && !user) {
        console.log('CartContext: Waiting for user to be loaded...');
        // Don't fetch yet, user is still loading
        setCartLoading(false);
        return;
      }
      
      // Debug authentication state
      console.log('CartContext: Fetch cart - Auth check:', {
        isAuthenticated,
        hasUser: !!user,
        userId: user?.id
      });
      
      let cartItems = [];
      
      if (isAuthenticated && user) {
        console.log('CartContext: Fetching cart from API for authenticated user');
        const response = await CartAPI.getCart();
        
        // API returns normalized structure: { success: true, cartItems: [...] }
        if (response?.success && Array.isArray(response.cartItems)) {
          cartItems = response.cartItems;
        } else if (Array.isArray(response.cartItems)) {
          cartItems = response.cartItems;
        }
      } else {
        console.log('CartContext: Loading guest cart from localStorage');
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          // Normalize guest cart items
          cartItems = CartAPI.normalizeCartItems(JSON.parse(savedCart));
        }
      }
      
      // Ensure all items are normalized
      cartItems = CartAPI.normalizeCartItems(cartItems);
      setCart(cartItems);
      
      if (!isAuthenticated) {
        localStorage.setItem('guestCart', JSON.stringify(cartItems));
      }
      
      console.log('CartContext: Cart fetched successfully', {
        itemCount: cartItems.length,
        items: cartItems
      });
    } catch (error) {
      console.error('CartContext: Fetch cart error:', error);
      setCartError(error.message || 'Failed to fetch cart');
      // Handle 401 errors more gracefully
      if (error.message?.includes('401') || error.message?.includes('unauthorized') || error.message?.includes('Access denied')) {
        const savedCart = localStorage.getItem('guestCart');
        const guestCart = savedCart ? CartAPI.normalizeCartItems(JSON.parse(savedCart)) : [];
        setCart(guestCart);
        console.log('CartContext: Fallback to guest cart due to unauthorized error');
        // Don't set error for 401 if we have guest cart fallback
        setCartError(null);
      }
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated, user]);

  const addToCart = async (product, quantity = 1) => {
    // Reset updateInProgress if it's been stuck for too long (safety mechanism)
    if (updateInProgress.current) {
      console.warn('CartContext: Previous operation may be stuck, resetting...');
      updateInProgress.current = false;
    }

    try {
      updateInProgress.current = true;
      setCartLoading(true);
      setCartError(null);
      
      const productId = product.id || product._id;
      if (!productId) throw new Error('Product ID is missing');
      const options = product.specifications || {};

      // For authenticated users, make API call FIRST before optimistic update
      if (isAuthenticated && user) {
        try {
          console.log('CartContext: Making POST request to add item to cart', { productId, quantity, options });
          const response = await CartAPI.addToCart(productId, quantity, options);

          if (!response.success) {
            throw new Error(response.message || 'Failed to add item to cart');
          }

          console.log(`CartContext: API call successful - ${product.name} added to cart`, { productId, quantity });

          // After successful API call, fetch the updated cart from server (already normalized)
          updateInProgress.current = false;
          await fetchCart(true);

          // Show success feedback
          toast.success(`${product.name} added to cart!`, { duration: 3000 });
          return true;
        } catch (apiError) {
          console.error('CartContext: API call failed:', apiError);
          updateInProgress.current = false;
          setCartLoading(false);
          toast.error(apiError.message || 'Failed to add to cart', { duration: 3000 });
          throw apiError;
        }
      } else {
        // For guest users, do optimistic update to localStorage
        const previousCart = [...cart];
        const existingIndex = cart.findIndex(
          (item) =>
            (item.id === productId || item.productId === productId) &&
            JSON.stringify(item.specifications || {}) === JSON.stringify(options)
        );
        let updatedCart;
        if (existingIndex !== -1) {
          updatedCart = cart.map((item, index) => {
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
            product: { ...product, id: productId },
            specifications: options,
          };
          updatedCart = [...cart, newItem];
        }
        updatedCart = CartAPI.normalizeCartItems(updatedCart.filter((item) => CartAPI.validateCartItem(item)));
        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));

        console.log(`CartContext: ${product.name} added to guest cart`, { productId, quantity });
        toast.success(`${product.name} ${existingIndex !== -1 ? 'updated in' : 'added to'} cart!`, {
          duration: 3000,
        });
        return true;
      }
    } catch (error) {
      setCartError(error.message || 'Failed to add to cart');
      console.error('CartContext: Failed to add to cart', {
        product,
        error: error.message || 'Unknown error',
      });
      toast.error(error.message || 'Failed to add to cart', { duration: 3000 });
      return false;
    } finally {
      updateInProgress.current = false;
      setCartLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (updateInProgress.current) {
      console.log('CartContext: Remove skipped - update in progress');
      return false;
    }
    // Store previous cart state outside try block so it's accessible in catch
    const previousCart = [...cart];
    try {
      updateInProgress.current = true;
      setCartError(null);

      if (isAuthenticated) {
        await CartAPI.removeFromCart(cartItemId);
      }

      // After normalization, items always have item.id and item.productId
      const updatedCart = cart.filter((item) => item.id !== cartItemId && item.productId !== cartItemId);
      // Normalize to ensure consistency
      const normalizedCart = CartAPI.normalizeCartItems(updatedCart);
      setCart(normalizedCart);

      if (!isAuthenticated) {
        localStorage.setItem('guestCart', JSON.stringify(normalizedCart));
      }

      toast.success('Item removed from cart', { duration: 3000 });
      console.log('CartContext: Item removed from cart', { cartItemId });
      return true;
    } catch (apiError) {
      // Restore previous cart state on error
      setCart(previousCart);
      if (!isAuthenticated) {
        localStorage.setItem('guestCart', JSON.stringify(previousCart));
      }
      toast.error(apiError.message || 'Failed to remove from cart', { duration: 3000 });
      throw apiError;
    } finally {
      updateInProgress.current = false;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    if (quantity < 1) {
      console.log('CartContext: Update skipped - quantity less than 1', { cartItemId, quantity });
      return false;
    }
    if (updateInProgress.current) {
      console.log('CartContext: Update skipped - update in progress');
      return false;
    }
    try {
      updateInProgress.current = true;
      setCartError(null);

      const previousCart = [...cart];

      let serverUpdatedItem;
      if (isAuthenticated) {
        console.log('CartContext: Updating cart item via API', { cartItemId, quantity });

        try {
          const response = await CartAPI.updateCartItem(cartItemId, quantity);
          console.log('CartContext: Update API response:', response);

          if (!response.success) {
            throw new Error(response.message || 'Failed to update cart item');
          }
          // Handle different response structures - server returns cartItem
          serverUpdatedItem = response.cartItem || response.data || response.item || response;
          console.log('CartContext: Server updated item:', serverUpdatedItem);
        } catch (apiError) {
          console.error('CartContext: Update API call failed, using local update', apiError);
          // Fall through to local update if API fails
          serverUpdatedItem = null;
        }
      }

      // Update cart items - use normalized structure (always item.id and item.productId)
      const updatedCart = cart.map((item) => {
        // Check if this is the item we want to update (simplified after normalization)
        const isTargetItem = item.id === cartItemId || item.productId === cartItemId;
        
        if (isTargetItem) {
          if (isAuthenticated && serverUpdatedItem) {
            // Normalize server response and use it
            const normalizedItem = CartAPI.normalizeCartItem(serverUpdatedItem);
            console.log('CartContext: Using normalized server updated item');
            return normalizedItem || serverUpdatedItem;
          } else {
            // Update locally for guest or if server response not available
            const updatedItem = { ...item, quantity };
            // Use normalized structure - always item.product (not item.Product)
            if (item.itemCalculations || item.product) {
              const unitPrice = parseFloat(
                item.itemCalculations?.unitPrice ||
                  item.product?.price ||
                  0
              );
              const gstRate = parseFloat(item.product?.gst || 0);
              const subtotal = unitPrice * quantity;
              const gstAmount = (subtotal * gstRate) / 100;
              const totalAmount = subtotal + gstAmount;

              updatedItem.itemCalculations = {
                unitPrice,
                subtotal: parseFloat(subtotal.toFixed(2)),
                gstAmount: parseFloat(gstAmount.toFixed(2)),
                totalAmount: parseFloat(totalAmount.toFixed(2)),
              };
            }
            console.log('CartContext: Updated item locally', updatedItem);
            return updatedItem;
          }
        }
        return item;
      });
      
      // Normalize and filter cart items
      const normalizedCart = CartAPI.normalizeCartItems(updatedCart);
      const filteredCart = normalizedCart.filter((item) => {
        const isValid = CartAPI.validateCartItem(item);
        if (!isValid) {
          console.warn('CartContext: Filtering out invalid cart item:', item);
        }
        return isValid;
      });
      
      console.log('CartContext: Cart after update', {
        originalCount: cart.length,
        updatedCount: updatedCart.length,
        normalizedCount: normalizedCart.length,
        filteredCount: filteredCart.length
      });

      setCart(filteredCart);

      if (!isAuthenticated) {
        localStorage.setItem('guestCart', JSON.stringify(filteredCart));
      } else if (serverUpdatedItem) {
        // If we got a server response, we already have the updated item
        // No need to fetch the entire cart - just use what we have
        console.log('CartContext: Using server response, cart updated successfully');
      } else {
        // If API call failed or no server response, try to fetch fresh cart
        try {
          updateInProgress.current = false;
          await fetchCart(true);
        } catch (fetchError) {
          console.warn('CartContext: Failed to fetch cart after update, using local update', fetchError);
          // Continue with local update if fetch fails
        }
      }

      toast.success('Cart item updated', { duration: 3000 });
      console.log('CartContext: Cart item updated', { cartItemId, quantity });
      return true;
    } catch (apiError) {
      setCart(previousCart);
      if (!isAuthenticated) {
        localStorage.setItem('guestCart', JSON.stringify(previousCart));
      }
      toast.error(apiError.message || 'Failed to update cart item', { duration: 3000 });
      throw apiError;
    } finally {
      updateInProgress.current = false;
    }
  };

  const clearCart = async () => {
    if (updateInProgress.current) {
      console.log('CartContext: Clear skipped - update in progress');
      return false;
    }
    try {
      updateInProgress.current = true;
      setCartLoading(true);
      setCartError(null);

      const previousCart = [...cart];
      setCart([]);

      try {
        if (isAuthenticated) {
          await CartAPI.clearCart();
        } else {
          localStorage.removeItem('guestCart');
        }
        toast.success('Cart cleared successfully', { duration: 3000 });
        console.log('CartContext: Cart cleared successfully');
        return true;
      } catch (apiError) {
        console.warn('CartContext: API clear failed, but local cart cleared');
        return true;
      }
    } catch (error) {
      setCartError(error.message || 'Failed to clear cart');
      console.error('CartContext: Failed to clear cart', {
        error: error.message || 'Unknown error',
      });
      toast.error(error.message || 'Failed to clear cart', { duration: 3000 });
      return false;
    } finally {
      updateInProgress.current = false;
      setCartLoading(false);
    }
  };

  const getCartTotal = useCallback(() => {
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((total, item) => {
      if (!item) return total;

      // After normalization, always use item.product (not item.Product)
      const unitPrice =
        item.itemCalculations?.unitPrice ||
        item.product?.price ||
        0;
      const qty = parseInt(item.quantity || 0);

      return total + parseFloat(unitPrice) * qty;
    }, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((count, item) => count + (parseInt(item?.quantity) || 0), 0);
  }, [cart]);

  const getCartSummary = useCallback(() => {
    if (!Array.isArray(cart))
      return {
        subtotal: 0,
        gstAmount: 0,
        totalAmount: 0,
        itemCount: 0,
      };

    let subtotal = 0;
    let gstAmount = 0;

    cart.forEach((item) => {
      // Prefer backend calculations if available (from itemCalculations)
      if (item.itemCalculations) {
        subtotal += parseFloat(item.itemCalculations.subtotal || 0);
        gstAmount += parseFloat(item.itemCalculations.gstAmount || 0);
      } else {
        // Fallback to calculating from product data (after normalization, always use item.product)
        const unitPrice = parseFloat(item.product?.price || 0);
        const qty = parseInt(item.quantity || 0);
        const itemSubtotal = unitPrice * qty;

        subtotal += itemSubtotal;

        const gstRate = parseFloat(item.product?.gst || 0);
        if (gstRate > 0) {
          gstAmount += (itemSubtotal * gstRate) / 100;
        }
      }
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      totalAmount: parseFloat((subtotal + gstAmount).toFixed(2)),
      itemCount: cart.length,
    };
  }, [cart]);

  const contextValue = {
    cart: Array.isArray(cart) ? cart : [],
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    cartLoading,
    cartError,
    fetchCart,
    getCartTotal,
    getCartCount,
    getCartSummary,
    isAuthenticated,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};