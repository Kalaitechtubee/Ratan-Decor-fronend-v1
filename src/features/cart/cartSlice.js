import { createSlice } from '@reduxjs/toolkit';
import api from '../../services/axios';

const initialState = {
  items: [],
  wishlist: [],
  loading: false,
  error: null,
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      const index = state.wishlist.indexOf(productId);
      if (index !== -1) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(productId);
      }
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { 
  setCartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  toggleWishlist, 
  setWishlist,
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;