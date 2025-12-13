import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { userTypeMiddleware } from '../features/userType/userTypeSlice';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(userTypeMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;