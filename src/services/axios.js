import Axios from 'axios';
import { toast } from 'react-hot-toast';


const baseURL = import.meta.env.VITE_API_URL;


const axios = Axios.create({
  baseURL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Include cookies (access token and refresh token are in httpOnly cookies)
});

// Authentication is now cookie-based - no Authorization header needed
axios.interceptors.request.use(
  (config) => {
    // Ensure cookies are always sent with requests
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    // Tokens are managed via secure httpOnly cookies - no frontend handling needed
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized - tokens are refreshed automatically by backend via cookies
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || 'Unauthorized';
      // If it's a login endpoint, don't show toast
      if (!error.config?.url?.includes('/auth/login')) {
        toast.error('Session expired. Please log in again.');
      }
      // Redirect to login if needed
      if (error.config?.url?.includes('/checkout')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden (Access denied) - Don't retry, just return the error
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || 'Access denied';
      console.warn('Access denied error:', errorMessage);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axios;