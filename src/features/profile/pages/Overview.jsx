import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaUser, FaUserTag, FaCheckCircle } from 'react-icons/fa';
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

  const reduxUserType = useSelector((state) => state.userType?.userType);

  const getUserTypeName = (userTypeId) => {
    if (!userTypeId || !userTypes?.length) return 'Unknown';
    const userType = userTypes.find((type) => type.id === userTypeId);
    return userType?.name || 'Unknown';
  };

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/orders');
        if (response.data.success) {
          setTotalOrders(
            response.data.orderSummary?.totalOrders ||
            response.data.pagination?.total ||
            response.data.orders?.length ||
            0
          );
        }
      } catch (err) {
        toast.error('Failed to load orders count');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdersCount();
  }, []);

  useEffect(() => {
    if (profile?.userTypeId && userTypes.length > 0) {
      setCurrentUserTypeName(getUserTypeName(profile.userTypeId));
    } else if (reduxUserType && reduxUserType !== 'General') {
      setCurrentUserTypeName(reduxUserType);
    } else {
      const stored = localStorage.getItem('userType');
      setCurrentUserTypeName(
        stored ? stored.charAt(0).toUpperCase() + stored.slice(1) : 'Not Set'
      );
    }
  }, [profile?.userTypeId, userTypes, reduxUserType]);

  const handleUserTypeClick = () => {
    dispatch(openPopup());
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: isLoading ? '-' : totalOrders,
      icon: FaShoppingBag,
      bgLight: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      title: 'Account Status',
      value: profile?.status || 'Active',
      icon: FaCheckCircle,
      bgLight: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'User Type',
      value: currentUserTypeName,
      icon: FaUserTag,
      bgLight: 'bg-primary/10',
      textColor: 'text-primary',
      clickable: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* ================= STAT CARDS =================*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={card.clickable ? handleUserTypeClick : undefined}
            className={`group bg-white p-4 sm:p-6 rounded-lg border border-neutral-100 shadow-card
              transition-all duration-300
              hover:border-primary hover:bg-primary/5 hover:shadow-card-hover
              ${card.clickable ? 'cursor-pointer' : ''}
            `}
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-neutral-500 group-hover:text-primary transition-colors truncate">
                  {card.title}
                </p>

                <motion.p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-xl sm:text-2xl font-semibold text-neutral-900 mt-1 truncate"
                >
                  {card.value}
                </motion.p>

                {card.clickable && (
                  <p className="text-xs text-neutral-400 mt-2 font-medium group-hover:text-primary transition-colors">
                    Click to change
                  </p>
                )}
              </div>

              <div
                className={`p-2 sm:p-3 rounded-lg ${card.bgLight} ${card.textColor}
                  transition-transform duration-300 group-hover:scale-110 flex-shrink-0
                `}
              >
                <card.icon className="text-lg sm:text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= QUICK ACTIONS =================*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-card border border-neutral-100"
      >
        <motion.h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
          Quick Actions
        </motion.h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange('orders')}
            className="p-3 sm:p-4 border border-neutral-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center group"
          >
            <div className="flex flex-col items-center">
              <FaShoppingBag className="text-xl sm:text-2xl text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium text-neutral-700 line-clamp-2">View Orders</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEditing(true);
              handleTabChange('personal');
            }}
            className="p-3 sm:p-4 border border-neutral-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center group"
          >
            <div className="flex flex-col items-center">
              <FaUser className="text-xl sm:text-2xl text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium text-neutral-700 line-clamp-2">Edit Profile</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUserTypeClick}
            className="p-3 sm:p-4 border border-neutral-100 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center group col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col items-center">
              <FaUserTag className="text-xl sm:text-2xl text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium text-neutral-700 line-clamp-2">Change Type</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Overview;