import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginApi,
  registerApi,
  getUserTypes,
  updateProfileApi,
  forgotPasswordApi,
  verifyOTPApi,
  resetPasswordApi,
  checkStatusApi,
  resendApprovalApi,
} from './api/authApi';
import { saveAuthState, loadAuthState, clearAuthState } from '../../utils/authPersist';
import { openPopup } from '../userType/userTypeSlice';

// Utility to extract error message
const getErrorMessage = (error, defaultMessage) =>
  error.response?.data?.message || error.message || defaultMessage;

// Utility to check if user is approved
const isUserApproved = (status) => status?.toUpperCase() === 'APPROVED';

// Login thunk with status check
export const login = createAsyncThunk('auth/login', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const loginResponse = await loginApi(credentials);
    // Tokens are now in secure httpOnly cookies - no need to store them
    const { user } = loginResponse;

    // Store user details in localStorage (tokens are in secure httpOnly cookies)
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('userType', user.userTypeName || '');
    localStorage.setItem('isLoggedIn', isUserApproved(user.status) ? 'true' : 'false');
    localStorage.setItem('name', user.name || '');
    localStorage.setItem('email', user.email || '');
    localStorage.setItem('role', user.role || '');
    localStorage.setItem('company', user.company || '');
    localStorage.setItem('mobile', user.mobile || '');
    localStorage.setItem('userTypeId', user.userTypeId?.toString() || '');
    localStorage.setItem('address', user.address || '');
    localStorage.setItem('village', user.village || '');
    localStorage.setItem('city', user.city || '');
    localStorage.setItem('state', user.state || '');
    localStorage.setItem('country', user.country || '');
    localStorage.setItem('pincode', user.pincode || '');

    // Check status using ID
    const statusResponse = await checkStatusApi(user.id);
    const isApproved = isUserApproved(statusResponse.status);

    // Update isLoggedIn based on status
    localStorage.setItem('isLoggedIn', isApproved ? 'true' : 'false');

    if (!isApproved) {
      localStorage.setItem('statusId', user.id.toString());
    } else {
      localStorage.removeItem('statusId');
    }

    // Open popup
    dispatch(openPopup());
    localStorage.removeItem('userTypeConfirmed');

    return {
      ...loginResponse,
      status: statusResponse.status,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Login failed'));
  }
});

// Fetch user types thunk
export const fetchUserTypes = createAsyncThunk('auth/fetchUserTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserTypes();
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch user types'));
  }
});

// Check status thunk using ID
export const checkStatus = createAsyncThunk('auth/checkStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await checkStatusApi(id);
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to check status'));
  }
});

// Other thunks
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    return await registerApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Registration failed'));
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    return await updateProfileApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update profile'));
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    return await forgotPasswordApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to send reset link'));
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try {
    return await verifyOTPApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to verify OTP'));
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    return await resetPasswordApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to reset password'));
  }
});

export const resendApproval = createAsyncThunk('auth/resendApproval', async (data, { rejectWithValue }) => {
  try {
    return await resendApprovalApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to resend approval'));
  }
});

// Load persisted state
const persistedState = loadAuthState();

// Authentication is now cookie-based - no token validation needed
// User is authenticated if they have user data in localStorage
const hasUserData = !!localStorage.getItem('userId');

const initialState = {
  user: persistedState?.user || null,
  userType: persistedState?.userType || localStorage.getItem('userType') || null,
  userRole: persistedState?.userRole || null,
  userTypes: persistedState?.userTypes || [],
  isAuthenticated: persistedState?.isAuthenticated || hasUserData,
  // Token removed - now stored in secure httpOnly cookie
  status: 'idle',
  error: null,
  resetToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = isUserApproved(action.payload.status);
      // Tokens are now in secure httpOnly cookies - no localStorage storage needed
      state.userType = action.payload.userTypeName || state.userType;
      state.userRole = action.payload.role || state.userRole;
      // Store user details in localStorage
      localStorage.setItem('isLoggedIn', state.isAuthenticated ? 'true' : 'false');
      localStorage.setItem('userType', action.payload.userTypeName || '');
      localStorage.setItem('userId', action.payload.id?.toString() || '');
      localStorage.setItem('name', action.payload.name || '');
      localStorage.setItem('email', action.payload.email || '');
      localStorage.setItem('role', action.payload.role || '');
      localStorage.setItem('company', action.payload.company || '');
      localStorage.setItem('mobile', action.payload.mobile || '');
      localStorage.setItem('userTypeId', action.payload.userTypeId?.toString() || '');
      localStorage.setItem('address', action.payload.address || '');
      localStorage.setItem('village', action.payload.village || '');
      localStorage.setItem('city', action.payload.city || '');
      localStorage.setItem('state', action.payload.state || '');
      localStorage.setItem('country', action.payload.country || '');
      localStorage.setItem('pincode', action.payload.pincode || '');
      saveAuthState(state);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Token removed - cookies are cleared by backend on logout
      state.userType = null;
      state.userRole = null;
      state.userTypes = [];
      state.resetToken = null;
      // No need to remove accessToken - it's in secure cookie, cleared by backend
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.setItem('userId', '');
      localStorage.setItem('name', '');
      localStorage.setItem('email', '');
      localStorage.setItem('role', '');
      localStorage.setItem('company', '');
      localStorage.setItem('mobile', '');
      localStorage.setItem('userTypeId', '');
      localStorage.setItem('address', '');
      localStorage.setItem('village', '');
      localStorage.setItem('city', '');
      localStorage.setItem('state', '');
      localStorage.setItem('country', '');
      localStorage.setItem('pincode', '');
      localStorage.removeItem('guestCart');
      clearAuthState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userTypes = action.payload;
      })
      .addCase(fetchUserTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = isUserApproved(action.payload.status);
        // Tokens are now in secure httpOnly cookies - no localStorage storage needed
        state.userType = action.payload.user.userTypeName;
        state.userRole = action.payload.user.role;
        // Store user details in localStorage
        localStorage.setItem('isLoggedIn', state.isAuthenticated ? 'true' : 'false');
        localStorage.setItem('userType', action.payload.user.userTypeName || '');
        localStorage.setItem('userId', action.payload.user.id.toString());
        localStorage.setItem('name', action.payload.user.name || '');
        localStorage.setItem('email', action.payload.user.email || '');
        localStorage.setItem('role', action.payload.user.role || '');
        localStorage.setItem('company', action.payload.user.company || '');
        localStorage.setItem('mobile', action.payload.user.mobile || '');
        localStorage.setItem('userTypeId', action.payload.user.userTypeId?.toString() || '');
        localStorage.setItem('address', action.payload.user.address || '');
        localStorage.setItem('village', action.payload.user.village || '');
        localStorage.setItem('city', action.payload.user.city || '');
        localStorage.setItem('state', action.payload.user.state || '');
        localStorage.setItem('country', action.payload.user.country || '');
        localStorage.setItem('pincode', action.payload.user.pincode || '');
        saveAuthState(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.userType = action.payload.userTypeName;
        state.userRole = action.payload.role;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.resetToken = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(checkStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, status: action.payload.status.toUpperCase() };
        state.isAuthenticated = isUserApproved(action.payload.status);
        localStorage.setItem('isLoggedIn', state.isAuthenticated ? 'true' : 'false');
        if (state.isAuthenticated) {
          localStorage.removeItem('statusId');
        }
      })
      .addCase(checkStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resendApproval.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resendApproval.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;