import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';
import { FiHome, FiCoffee, FiGrid, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from '../../../services/axios';
import toast from 'react-hot-toast';

const PersonalInfo = ({ isEditing, setIsEditing, formData, handleInputChange, handleUserTypeChange, handleUpdateProfile, handleCancel, isLoading, userTypes = [] }) => {
  const [selectedUserTypeName, setSelectedUserTypeName] = useState('');

  // Get icon for user type
  const getIconForUserType = (userTypeName) => {
    if (!userTypeName) return FiGrid;
    const lowerName = userTypeName.toLowerCase();
    if (lowerName.includes('residential')) return FiHome;
    if (lowerName.includes('commercial')) return FiBriefcase;
    if (lowerName.includes('kitchen') || lowerName.includes('modular')) return FiCoffee;
    return FiGrid;
  };

  // Build user type options from fetched data
  const userTypeOptions = userTypes.map((type) => ({
    value: String(type.id),
    label: type.name,
    icon: getIconForUserType(type.name),
    description: type.description || 'Customer type',
  }));

  // Update selected user type name whenever formData.userTypeId changes
  useEffect(() => {
    if (formData.userTypeId && userTypes.length > 0) {
      const userType = userTypes.find((type) => type.id === formData.userTypeId);
      setSelectedUserTypeName(userType?.name || '');
    }
  }, [formData.userTypeId, userTypes]);

  const handleUserTypeSelectChange = (e) => {
    const value = e.target.value;
    handleUserTypeChange(value);
    
    // Update selected name for display
    const selected = userTypes.find((type) => type.id === parseInt(value));
    if (selected) {
      setSelectedUserTypeName(selected.name);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <FaEdit size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSave size={18} />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`pl-10 w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
                }`}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="email"
                value={formData.email || ''}
                disabled
                className="pl-10 w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Mobile Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`pl-10 w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
                }`}
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Company</label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`pl-10 w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
                }`}
                placeholder="Enter your company name"
              />
            </div>
          </div>

          {/* Project Type - Dynamic */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Project Type *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                {React.createElement(getIconForUserType(selectedUserTypeName), { size: 18 })}
              </div>
              <select
                name="userTypeId"
                value={formData.userTypeId || ''}
                onChange={handleUserTypeSelectChange}
                disabled={!isEditing}
                className={`pl-10 w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
                }`}
              >
                <option value="">Select Project Type</option>
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedUserTypeName && (
              <p className="text-xs text-neutral-500 mt-1">
                Selected: <span className="font-medium text-primary">{selectedUserTypeName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-neutral-400" size={18} />
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className={`pl-10 w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none ${
                !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="Enter your full address"
            />
          </div>
        </div>

        {/* City, State, Country, PIN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">PIN Code</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                !isEditing ? 'bg-neutral-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="PIN Code"
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalInfo;