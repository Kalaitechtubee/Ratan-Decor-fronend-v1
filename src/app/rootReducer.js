import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import userTypeReducer from '../features/userType/userTypeSlice';
import cartReducer from '../features/cart/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  userType: userTypeReducer,
  cart: cartReducer,
});

export default rootReducer;