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
import Sidebar from '../../profile/pages/Sidebar';
import ProfileHeader from '../../profile/pages/ProfileHeader';
import TabNavigation from '../../profile/pages/TabNavigation';
import Overview from '../../profile/pages/Overview';
import PersonalInfo from '../../profile/pages/PersonalInfo';
import Orders from '../../profile/pages/Orders';
import LogoutModal from '../../profile/pages/LogoutModal';
import UserTypePopup from '../../../features/userType/components/UserTypePopup';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaIdCard, FaShoppingBag, FaCheckCircle, FaBoxOpen, FaInfoCircle, FaTimes, FaBars } from 'react-icons/fa';
import Footer from '../../../components/Footer';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userTypes, setUserTypes] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const profileFetchedRef = useRef(false);
  const { clearCart } = useCart();
  
  // Get popup state from Redux
  const isPopupOpen = useSelector((state) => state.userType.isPopupOpen);
  const reduxUserType = useSelector((state) => state.userType.userType);

  // Fetch user types on mount
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

  // Fetch profile data
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

          // Sync user type with localStorage
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

  // Listen for user type changes to refresh profile
  useEffect(() => {
    const handleUserTypeChange = async (e) => {
      console.log('[ProfilePage] User type changed event received:', e.detail);
      
      // Refresh profile to get updated userTypeId
      try {
        const response = await axios.get('/profile');
        const updatedUser = response.data.user;
        
        setProfile(updatedUser);
        setFormData(updatedUser);
        
        console.log('[ProfilePage] Profile refreshed after user type change');
        
        // If on Overview tab, it will automatically update via its own listeners
      } catch (error) {
        console.error('[ProfilePage] Failed to refresh profile:', error);
      }
    };

    window.addEventListener('userTypeChanged', handleUserTypeChange);

    return () => {
      window.removeEventListener('userTypeChanged', handleUserTypeChange);
    };
  }, []);

  // Handle URL tab parameter
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
      
      // Handle both response formats
      const updatedUser = response.data.user || response.data;
      
      // Update profile state
      setProfile(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);

      // Update localStorage with new user type
      if (updatedUser.userTypeId && userTypes.length > 0) {
        const userType = userTypes.find((type) => type.id === updatedUser.userTypeId);
        if (userType) {
          const normalizedName = userType.name.toLowerCase();
          localStorage.setItem('userType', normalizedName);
          localStorage.setItem('userTypeId', updatedUser.userTypeId.toString());
          console.log('[ProfilePage] User type updated to:', userType.name);
          
          // Dispatch event to notify other components
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
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-red-600 text-center font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-roboto flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-16">
        <div className="hidden lg:block w-64 bg-white border-r border-neutral-200 shadow-sm sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            navigate={navigate}
            location={location}
            setIsLogoutModalOpen={setIsLogoutModalOpen}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="lg:hidden flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 text-neutral-600 bg-white rounded-lg shadow-sm hover:bg-neutral-100 transition-colors duration-200 border border-neutral-200"
                  aria-label="Open sidebar"
                >
                  <FaBars className="w-5 h-5" />
                </button>
                <button
                  className="flex ml-60 items-center gap-2 px-3 py-2 text-neutral-600 bg-white rounded-lg shadow-sm hover:bg-neutral-100 transition-colors duration-200 border border-neutral-200"
                  onClick={() => navigate('/')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back</span>
                </button>
              </div>
            </div>

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
              className="space-y-6"
            >
              <ProfileHeader
                profile={profile}
                getRoleColor={getRoleColor}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />

              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
              />

              <div className="bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden">
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <Overview
                        profile={profile}
                        userTypes={userTypes}
                        getStatusIcon={getStatusIcon}
                        navigate={navigate}
                        setIsEditing={setIsEditing}
                        handleTabChange={handleTabChange}
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <Sidebar
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            navigate={navigate}
            location={location}
            setIsLogoutModalOpen={setIsLogoutModalOpen}
          />
        )}
      </AnimatePresence>

      {/* User Type Popup */}
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