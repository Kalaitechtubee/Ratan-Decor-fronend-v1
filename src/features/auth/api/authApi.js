import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies (access token and refresh token are in httpOnly cookies)
});

// Interceptor for handling errors
// Token refresh is now handled automatically by backend via cookies
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Tokens are managed via secure httpOnly cookies - no frontend token handling needed
    // Backend middleware automatically refreshes tokens when needed
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const loginApi = async (data) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const checkStatusApi = async (email) => {
  try {
    const response = await apiClient.get(`/auth/status/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to check status' };
  }
};

export const registerApi = async (data) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const getUserTypes = async () => {
  try {
    const response = await apiClient.get('/auth/user-types');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user types' };
  }
};

export const updateProfileApi = async (data) => {
  try {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

export const forgotPasswordApi = async (data) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reset link' };
  }
};

export const verifyOTPApi = async (data) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify OTP' };
  }
};

export const resetPasswordApi = async (data) => {
  try {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

export const resendApprovalApi = async (data) => {
  try {
    const response = await apiClient.post('/auth/resend-approval', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend approval' };
  }
};

export const logoutApi = async () => {
  try {
    // Call user logout endpoint to clear auth cookies on backend
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    // Even if API call fails, we should still clear local state
    throw error.response?.data || { message: 'Logout request failed' };
  }
};

export default apiClient;