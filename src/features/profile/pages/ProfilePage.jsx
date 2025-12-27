import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { FaUser, FaIdCard, FaShoppingBag, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SidebarLink = ({ tab, activeTab, handleTabChange }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => handleTabChange(tab.id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
      activeTab === tab.id
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-neutral-600 hover:bg-primary/10 hover:text-primary'
    }`}
  >
    <tab.icon className={`text-lg transition-colors duration-300 ${
      activeTab === tab.id 
        ? 'text-white' 
        : 'text-neutral-400 group-hover:text-primary'
    }`} />
    <span>{tab.label}</span>
    {activeTab === tab.id && (
      <motion.div
        layoutId="activeTabIcon"
        className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
      />
    )}
  </motion.button>
);

const LogoutModal = ({ isOpen, onClose, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSignOutAlt className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Ready to Leave?</h3>
            <p className="text-sm text-neutral-500">Are you sure you want to log out of your account? You will need to sign in again to access your profile.</p>
          </div>
          <div className="flex border-t border-neutral-100">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-l border-neutral-100"
            >
              Logout Now
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ProfilePage = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
        const response = await UserTypeAPI.getAllUserTypes();
        if (response.data && Array.isArray(response.data)) {
          setUserTypes(response.data);
        }
      } catch (err) {
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
                       response.data.orders?.length || 0;
          setTotalOrders(total);
        }
      } catch (err) {
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
          setProfile(user);
          setFormData(user);
          setError(null);
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Failed to load profile data';
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (['orders', 'personal', 'overview'].includes(tab)) {
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
    e?.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put('/profile', formData);
      const updatedUser = response.data.user || response.data;
      setProfile(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'personal', label: 'Personal Info', icon: FaIdCard },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
      await clearCart();
      localStorage.removeItem('guestCart');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      dispatch(logout());
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/50">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full h-10 w-10 border-t-2 border-primary"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-roboto selection:bg-primary/10">
      <Navbar />
      
      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-neutral-900">Menu</h2>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-neutral-100">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center border-2 border-white shadow-md">
                      <FaUser className="text-3xl text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">{profile?.name}</h3>
                  <p className="text-xs text-neutral-500 font-medium truncate w-full">{profile?.email}</p>
                  <span className="mt-3 px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {profile?.role || 'Customer'}
                  </span>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        handleTabChange(tab.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                        activeTab === tab.id
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-neutral-600 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      <tab.icon className={`text-lg transition-colors duration-300 ${
                        activeTab === tab.id 
                          ? 'text-white' 
                          : 'text-neutral-400 group-hover:text-primary'
                      }`} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <hr className="my-6 border-neutral-100" />

                {/* Logout Button in Mobile Sidebar */}
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center border-2 border-white shadow-md">
                      <FaUser className="text-3xl text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900">{profile?.name}</h2>
                  <p className="text-xs text-neutral-500 font-medium truncate w-full">{profile?.email}</p>
                  <span className="mt-3 px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {profile?.role || 'Customer'}
                  </span>
                </div>

                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <SidebarLink 
                      key={tab.id} 
                      tab={tab} 
                      activeTab={activeTab} 
                      handleTabChange={handleTabChange} 
                    />
                  ))}
                </div>

                <hr className="my-6 border-neutral-100" />

                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-primary to-[#ff6b6b] rounded-2xl p-6 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <h4 className="text-sm font-semibold mb-1">Need Help?</h4>
                  <p className="text-xs text-white/85 mb-4 leading-relaxed">
                    We're here to help you with any questions or support you need.
                  </p>
                  <Link to="/contact">
                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-semibold hover:shadow-lg transition-transform hover:-translate-y-0.5">
                      Contact Support
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4 mb-6">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-neutral-100 shadow-sm text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-all"
              >
                <FaBars className="text-base" />
                <span>Menu</span>
              </button>
              <div className="flex-1 text-right">
                <h2 className="text-lg font-bold text-neutral-900 capitalize">{activeTab === 'overview' ? 'Overview' : activeTab === 'personal' ? 'Personal Info' : 'Orders'}</h2>
              </div>
            </div>

            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 min-h-[600px] flex flex-col overflow-hidden"
            >
              <div className="border-b border-neutral-50 px-6 sm:px-8 py-5 flex items-center justify-between bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/80">
                <div>
                  <h1 className="text-xl font-bold text-neutral-900 capitalize">
                    {activeTab === 'overview' ? 'Overview' : activeTab === 'personal' ? 'Personal Info' : 'Orders'}
                  </h1>
                  <p className="text-xs text-neutral-500 font-medium">
                    {activeTab === 'overview' && 'Overview of your account activities and stats.'}
                    {activeTab === 'personal' && 'Manage your personal profile and account settings.'}
                    {activeTab === 'orders' && 'Track and manage your order history.'}
                  </p>
                </div>
                {activeTab === 'personal' && !isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg font-bold text-sm hover:bg-neutral-200 transition-colors"
                  >
                    Edit Profile
                  </motion.button>
                )}
              </div>

              <div className="p-6 sm:p-8 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {activeTab === 'overview' && (
                      <Overview
                        profile={profile}
                        userTypes={userTypes}
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
                        handleCancel={() => {
                          setFormData(profile);
                          setIsEditing(false);
                        }}
                        isLoading={isLoading}
                        userTypes={userTypes}
                      />
                    )}
                    {activeTab === 'orders' && <Orders navigate={navigate} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {isPopupOpen && (
        <UserTypePopup 
          onClose={() => dispatch(closePopup())}
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