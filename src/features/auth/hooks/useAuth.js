import { useSelector, useDispatch } from 'react-redux';
import {
  login,
  register,
  logout,
  fetchUserTypes,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  checkStatus,
  resendApproval,
  setUser,
} from '../authSlice';
import { setUserType } from '../../userType/userTypeSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, userType, userRole, userTypes, isAuthenticated, status, error, resetToken } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    userType,
    userRole,
    userTypes,
    isAuthenticated,
    status,
    error,
    resetToken,
    login: (credentials) => dispatch(login(credentials)),
    register: (data) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    setUser: (data) => dispatch(setUser(data)),
    setUserType: (type) => dispatch(setUserType(type)),
    fetchUserTypes: () => dispatch(fetchUserTypes()),
    updateProfile: (data) => dispatch(updateProfile(data)),
    forgotPassword: (data) => dispatch(forgotPassword(data)),
    verifyOTP: (data) => dispatch(verifyOTP(data)),
    resetPassword: (data) => dispatch(resetPassword(data)),
    checkStatus: (email) => dispatch(checkStatus(email)),
    resendApproval: (data) => dispatch(resendApproval(data)),
  };
};

export default useAuth;