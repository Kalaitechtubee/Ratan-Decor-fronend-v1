import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../services/axios';
import { logout } from '../../../features/auth/authSlice';
import { logoutApi } from '../../../features/auth/api/authApi';
import { closePopup } from '../../../features/userType/userTypeSlice';
import { UserTypeAPI } from '../../../features/userType/components/UserTypeApi';
import { useCart } from '../../cart';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import UserTypePopup from '../../../features/userType/components/UserTypePopup';
import { motion, AnimatePresence } from 'framer-motion';
import Overview from './Overview';
import PersonalInfo from './PersonalInfo';
import Orders from './Orders';
import { FaUser, FaIdCard, FaShoppingBag, FaCheckCircle, FaBoxOpen, FaInfoCircle, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Enhanced Tab Navigation Component with Mobile Responsive
const TabNavigation = ({ tabs, activeTab, handleTabChange }) => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden mb-4 sm:mb-6 border border-neutral-100">
    <nav className="flex border-b border-neutral-200 overflow-x-auto tab-scroll no-scrollbar">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ 
            backgroundColor: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(220, 38, 38, 0.08)',
            scale: 1.02
          }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 relative group flex-1 sm:flex-initial ${
            activeTab === tab.id 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-red-600'
          }`}
          onClick={() => handleTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          <tab.icon className={`text-sm sm:text-base transition-colors flex-shrink-0 ${activeTab === tab.id ? 'text-primary' : 'group-hover:text-red-600'}`} />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
          {activeTab !== tab.id && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-full"
            />
          )}
        </motion.button>
      ))}
    </nav>
  </div>
);

// Enhanced Profile Header Component
const ProfileHeader = ({ profile, getRoleColor, getStatusIcon, getStatusColor, onLogoutClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow-card overflow-hidden mb-4 sm:mb-6 border border-neutral-100"
  >
    <div className="bg-gradient-to-r from-primary to-primary/80 h-20 sm:h-32" />
    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 -mt-8 sm:-mt-12">
        <div className="flex items-end gap-3 sm:gap-4 w-full sm:w-auto">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center flex-shrink-0"
          >
            <FaUser className="text-2xl sm:text-4xl text-primary" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-semibold text-neutral-900 truncate">{profile?.name || 'User'}</h1>
            <p className="text-xs sm:text-sm text-neutral-600 truncate">{profile?.email || 'N/A'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRoleColor(profile?.role)}`}
          >
            <FaIdCard className="mr-1 flex-shrink-0" size={12} />
            <span className="truncate">{profile?.role || 'N/A'}</span>
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(profile?.status)}`}
          >
            {getStatusIcon(profile?.status)}
            <span className="ml-1 capitalize">{profile?.status || 'N/A'}</span>
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogoutClick}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-200 shadow-sm font-medium text-xs sm:text-sm flex-shrink-0"
            aria-label="Logout"
          >
            <FaSignOutAlt className="text-sm flex-shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Enhanced Logout Modal Component
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 sm:p-6 shadow-card z-50 max-w-sm w-full mx-4"
          >
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaTimes className="text-lg sm:text-xl text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">Confirm Logout</h3>
              <p className="text-xs sm:text-sm text-neutral-600">Are you sure you want to logout?</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-all duration-200 font-medium text-xs sm:text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-xs sm:text-sm"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProfilePage = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userTypes, setUserTypes] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const profileFetchedRef = useRef(false);
  const { clearCart } = useCart();
  
  const isPopupOpen = useSelector((state) => state.userType.isPopupOpen);

  useEffect(() => {
    const loadUserTypes = async () => {
      try {
        console.log('[ProfilePage] Loading user types...');
        const response = await UserTypeAPI.getAllUserTypes();
        
        if (response.data && Array.isArray(response.data)) {
          setUserTypes(response.data);
          console.log('[ProfilePage] User types loaded:', {
            count: response.data.length,
            cached: response.cached || false
          });
        }
      } catch (err) {
        console.error('[ProfilePage] Failed to load user types:', err);
        toast.error('Failed to load user types');
      }
    };

    loadUserTypes();
  }, []);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
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
      }
    };

    fetchOrdersCount();
  }, []);

  useEffect(() => {
    if (!profileFetchedRef.current) {
      profileFetchedRef.current = true;
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get('/profile');
          const user = response.data.user;
          
          console.log('[ProfilePage] Profile loaded:', {
            userId: user.id,
            userTypeId: user.userTypeId,
            email: user.email
          });
          
          setProfile(user);
          setFormData(user);
          setError(null);

          if (user.userTypeId && userTypes.length > 0) {
            const userType = userTypes.find((type) => type.id === user.userTypeId);
            if (userType) {
              const normalizedName = userType.name.toLowerCase();
              localStorage.setItem('userType', normalizedName);
              localStorage.setItem('userTypeId', user.userTypeId.toString());
              console.log('[ProfilePage] Synced user type to localStorage:', userType.name);
            }
          }
        } catch (err) {
          console.error('[ProfilePage] Fetch profile error:', err);
          const errorMessage = err.response?.data?.message || 'Failed to load profile data';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [userTypes]);

  useEffect(() => {
    const handleUserTypeChange = async (e) => {
      console.log('[ProfilePage] User type changed event received:', e.detail);
      
      try {
        const response = await axios.get('/profile');
        const updatedUser = response.data.user;
        
        setProfile(updatedUser);
        setFormData(updatedUser);
        
        console.log('[ProfilePage] Profile refreshed after user type change');
      } catch (error) {
        console.error('[ProfilePage] Failed to refresh profile:', error);
      }
    };

    window.addEventListener('userTypeChanged', handleUserTypeChange);

    return () => {
      window.removeEventListener('userTypeChanged', handleUserTypeChange);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'orders' || tab === 'personal' || tab === 'overview') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (value) => {
    const userTypeId = parseInt(value) || value;
    setFormData((prev) => ({ ...prev, userTypeId }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put('/profile', formData);
      
      const updatedUser = response.data.user || response.data;
      
      setProfile(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);

      if (updatedUser.userTypeId && userTypes.length > 0) {
        const userType = userTypes.find((type) => type.id === updatedUser.userTypeId);
        if (userType) {
          const normalizedName = userType.name.toLowerCase();
          localStorage.setItem('userType', normalizedName);
          localStorage.setItem('userTypeId', updatedUser.userTypeId.toString());
          console.log('[ProfilePage] User type updated to:', userType.name);
          
          window.dispatchEvent(new CustomEvent('userTypeChanged', {
            detail: { 
              userType: userType.name,
              userTypeId: updatedUser.userTypeId 
            }
          }));
        }
      }

      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('[ProfilePage] Update profile error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };

  const handleClosePopup = () => {
    dispatch(closePopup());
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
      case 'processing':
        return <FaBoxOpen className="text-blue-500" />;
      case 'pending':
        return <FaInfoCircle className="text-yellow-500" />;
      case 'cancelled':
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-neutral-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-indigo-100 text-indigo-800';
      case 'sales':
        return 'bg-teal-100 text-teal-800';
      case 'support':
        return 'bg-cyan-100 text-cyan-800';
      case 'dealer':
        return 'bg-orange-100 text-orange-800';
      case 'architect':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'personal', label: 'Personal Info', icon: FaIdCard },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
      try {
        await clearCart();
      } catch (cartErr) {
        console.warn('ProfilePage: Failed to clear cart on logout', cartErr);
      }
      localStorage.removeItem('guestCart');
      dispatch(logout());
      setIsLogoutModalOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      try {
        await clearCart();
      } catch (cartErr) {
        console.warn('ProfilePage: Failed to clear cart after logout error', cartErr);
      }
      localStorage.removeItem('guestCart');
      dispatch(logout());
      setIsLogoutModalOpen(false);
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-center font-medium text-sm sm:text-base px-4"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-roboto flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  staggerChildren: 0.1,
                },
              },
            }}
            className="space-y-4 sm:space-y-6"
          >
            <ProfileHeader
              profile={profile}
              getRoleColor={getRoleColor}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onLogoutClick={() => setIsLogoutModalOpen(true)}
            />

            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <Overview
                      profile={profile}
                      userTypes={userTypes}
                      getStatusIcon={getStatusIcon}
                      navigate={navigate}
                      setIsEditing={setIsEditing}
                      handleTabChange={handleTabChange}
                      totalOrders={totalOrders}
                    />
                  )}
                  {activeTab === 'personal' && (
                    <PersonalInfo
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleUserTypeChange={handleUserTypeChange}
                      handleUpdateProfile={handleUpdateProfile}
                      handleCancel={handleCancel}
                      isLoading={isLoading}
                      userTypes={userTypes}
                    />
                  )}
                  {activeTab === 'orders' && <Orders navigate={navigate} />}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {isPopupOpen && (
        <UserTypePopup 
          onClose={handleClosePopup}
          redirectToRegister={false}
        />
      )}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <Footer />
    </div>
  );
};

export default ProfilePage;