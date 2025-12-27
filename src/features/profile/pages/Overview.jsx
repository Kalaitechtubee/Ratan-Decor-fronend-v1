import React, { useEffect, useState } from 'react';
import {
  FaShoppingBag,
  FaHistory,
  FaCheckCircle,
  FaUser,
  FaUserTag,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import axios from '../../../services/axios';
import toast from 'react-hot-toast';
import { openPopup } from '../../userType/userTypeSlice';

const Overview = ({ profile, handleTabChange, setIsEditing }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    statusBreakdown: {},
  });

  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/orders');

        if (res.data?.success && res.data.orderSummary) {
          setSummary({
            totalOrders: res.data.orderSummary.totalOrders || 0,
            statusBreakdown: res.data.orderSummary.statusBreakdown || {},
          });
        }
      } catch (error) {
        toast.error('Failed to load order data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderSummary();
  }, []);

  const pendingCount = summary.statusBreakdown?.Pending?.count || 0;
  const shippedCount = summary.statusBreakdown?.Shipped?.count || 0;

  const accountStatus = profile?.status || 'Active';

  const statCards = [
    {
      title: 'Pending Orders',
      value: isLoading ? '-' : pendingCount,
      subtitle: 'Awaiting action',
      icon: FaHistory,
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderHover: 'hover:border-amber-500',
    },
    {
      title: 'Total Orders',
      value: isLoading ? '-' : summary.totalOrders,
      icon: FaShoppingBag,
      bgLight: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      title: 'Account Status',
      value: accountStatus,
      icon: FaCheckCircle,
      bgLight: 'bg-green-100',
      textColor: 'text-green-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`group bg-white p-5 rounded-lg border border-neutral-100
              shadow-card transition-all duration-300
              hover:bg-neutral-50 hover:shadow-card-hover
              ${card.borderHover || 'hover:border-primary'}
            `}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  {card.title}
                </p>

                <p className="text-2xl font-semibold text-neutral-900 mt-1">
                  {card.value}
                </p>

                {card.subtitle && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>

              <div
                className={`p-3 rounded-lg ${card.bgLight} ${card.textColor}
                transition-transform duration-300 group-hover:scale-110`}
              >
                <card.icon className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-lg shadow-card border border-neutral-100">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => handleTabChange('orders')}
            className="p-4 border border-neutral-100 rounded-lg
            hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <FaShoppingBag className="text-2xl text-primary mx-auto mb-2" />
            <span className="text-sm font-medium text-neutral-700">
              View Orders
            </span>
          </button>

          <button
            onClick={() => {
              setIsEditing(true);
              handleTabChange('personal');
            }}
            className="p-4 border border-neutral-100 rounded-lg
            hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <FaUser className="text-2xl text-primary mx-auto mb-2" />
            <span className="text-sm font-medium text-neutral-700">
              Edit Profile
            </span>
          </button>

          <button
            onClick={() => dispatch(openPopup())}
            className="p-4 border border-neutral-100 rounded-lg
            hover:border-primary hover:bg-primary/5 transition text-center
            col-span-2 lg:col-span-1"
          >
            <FaUserTag className="text-2xl text-primary mx-auto mb-2" />
            <span className="text-sm font-medium text-neutral-700">
              Change User Type
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
