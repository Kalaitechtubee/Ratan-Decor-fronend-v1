import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaUser, FaUserTag } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../../services/axios';
import toast from 'react-hot-toast';
import { openPopup } from '../../userType/userTypeSlice';

const Overview = ({ profile, userTypes = [], getStatusIcon, navigate, setIsEditing, handleTabChange }) => {
  const dispatch = useDispatch();
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserTypeName, setCurrentUserTypeName] = useState('Unknown');
  
  // Get user type from Redux store
  const reduxUserType = useSelector((state) => state.userType?.userType);

  // Get user type name by ID
  const getUserTypeName = (userTypeId) => {
    if (!userTypeId || !userTypes || userTypes.length === 0) {
      return 'Unknown';
    }
    const userType = userTypes.find((type) => type.id === userTypeId);
    return userType?.name || 'Unknown';
  };

  // Fetch total orders count
  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/orders');
        
        if (response.data.success) {
          const total = response.data.orderSummary?.totalOrders || 
                       response.data.pagination?.total || 
                       response.data.orders?.length || 
                       0;
          setTotalOrders(total);
        }
      } catch (err) {
        console.error('Failed to fetch orders count:', err);
        setTotalOrders(0);
        toast.error('Failed to load orders count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersCount();
  }, []);

  // Update current user type - prioritize profile data, fallback to Redux
  useEffect(() => {
    console.log('[Overview] Updating user type display', {
      profileUserTypeId: profile?.userTypeId,
      userTypesLength: userTypes.length,
      reduxUserType,
    });

    if (profile?.userTypeId && userTypes.length > 0) {
      // Primary: Get from profile's userTypeId
      const userTypeName = getUserTypeName(profile.userTypeId);
      setCurrentUserTypeName(userTypeName);
      console.log('[Overview] Using profile user type:', userTypeName);
    } else if (reduxUserType && reduxUserType !== 'General') {
      // Fallback: Use Redux store value
      setCurrentUserTypeName(reduxUserType);
      console.log('[Overview] Using Redux user type:', reduxUserType);
    } else {
      // Last resort: Check localStorage
      const storedUserType = localStorage.getItem('userType');
      if (storedUserType && storedUserType !== 'general') {
        // Capitalize first letter for display
        const displayType = storedUserType.charAt(0).toUpperCase() + storedUserType.slice(1);
        setCurrentUserTypeName(displayType);
        console.log('[Overview] Using localStorage user type:', displayType);
      } else {
        setCurrentUserTypeName('Not Set');
      }
    }
  }, [profile?.userTypeId, userTypes, reduxUserType]);

  // Listen for storage events (when user type changes)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userType' && e.newValue) {
        console.log('[Overview] Storage event detected:', e.newValue);
        const displayType = e.newValue.charAt(0).toUpperCase() + e.newValue.slice(1);
        setCurrentUserTypeName(displayType);
      }
    };

    const handleCustomEvent = (e) => {
      console.log('[Overview] Custom userType event detected:', e.detail);
      if (e.detail?.userType) {
        setCurrentUserTypeName(e.detail.userType);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userTypeChanged', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userTypeChanged', handleCustomEvent);
    };
  }, []);

  // Handle user type card click - open popup
  const handleUserTypeClick = () => {
    console.log('[Overview] User type card clicked, opening popup');
    dispatch(openPopup());
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-lg border border-neutral-100 shadow-card hover:shadow-card-hover transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Orders</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {isLoading ? (
                  <span className="inline-block w-8 h-6 bg-neutral-200 rounded animate-pulse"></span>
                ) : (
                  totalOrders
                )}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FaShoppingBag className="text-xl" />
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white p-6 rounded-lg border border-neutral-100 shadow-card hover:shadow-card-hover transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Account Status</p>
              <p className="text-xl font-semibold text-neutral-900 mt-1 capitalize">
                {profile?.status || 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              {getStatusIcon(profile?.status)}
            </div>
          </div>
        </div>

        {/* User Type Card - Clickable to change */}
        <div 
          onClick={handleUserTypeClick}
          className="bg-white p-6 rounded-lg border border-neutral-100 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer hover:border-primary/50 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-500 group-hover:text-primary transition-colors">
                User Type
              </p>
              <p className="text-xl font-semibold text-neutral-900 mt-1 capitalize transition-all duration-300">
                {currentUserTypeName}
              </p>
              <p className="text-xs text-neutral-400 mt-1 group-hover:text-primary transition-colors">
                Click to change
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <FaUserTag className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white p-6 rounded-lg border border-neutral-100 shadow-card">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            className="p-4 border border-neutral-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
            onClick={() => handleTabChange('orders')}
          >
            <div className="flex flex-col items-center">
              <FaShoppingBag className="text-2xl text-primary mb-2" />
              <span className="text-sm font-medium">View Orders</span>
            </div>
          </button>
          <button
            className="p-4 border border-neutral-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
            onClick={() => {
              setIsEditing(true);
              handleTabChange('personal');
            }}
          >
            <div className="flex flex-col items-center">
              <FaUser className="text-2xl text-primary mb-2" />
              <span className="text-sm font-medium">Edit Profile</span>
            </div>
          </button>
          <button
            className="p-4 border border-neutral-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
            onClick={handleUserTypeClick}
          >
            <div className="flex flex-col items-center">
              <FaUserTag className="text-2xl text-primary mb-2" />
              <span className="text-sm font-medium">Change User Type</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;