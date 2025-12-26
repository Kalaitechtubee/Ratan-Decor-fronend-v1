import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';
import { FiHome, FiCoffee, FiGrid, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from '../../../services/axios';
import toast from 'react-hot-toast';

const PersonalInfo = ({ 
  isEditing, 
  setIsEditing, 
  formData, 
  handleInputChange, 
  handleUserTypeChange, 
  handleUpdateProfile, 
  handleCancel, 
  isLoading, 
  userTypes = [] 
}) => {
  const [selectedUserTypeName, setSelectedUserTypeName] = useState('');

  const getIconForUserType = (userTypeName) => {
    if (!userTypeName) return FiGrid;
    const lowerName = userTypeName.toLowerCase();
    if (lowerName.includes('residential')) return FiHome;
    if (lowerName.includes('commercial')) return FiBriefcase;
    if (lowerName.includes('kitchen') || lowerName.includes('modular')) return FiCoffee;
    return FiGrid;
  };

  const userTypeOptions = userTypes.map((type) => ({
    value: String(type.id),
    label: type.name,
    icon: getIconForUserType(type.name),
    description: type.description || 'Customer type',
  }));

  useEffect(() => {
    if (formData.userTypeId && userTypes.length > 0) {
      const userType = userTypes.find((type) => type.id === formData.userTypeId);
      setSelectedUserTypeName(userType?.name || '');
    }
  }, [formData.userTypeId, userTypes]);

  const handleUserTypeSelectChange = (e) => {
    const value = e.target.value;
    handleUserTypeChange(value);
    
    const selected = userTypes.find((type) => type.id === parseInt(value));
    if (selected) {
      setSelectedUserTypeName(selected.name);
    }
  };

  const inputFields = [
    { name: 'name', label: 'Full Name', icon: FaUser, type: 'text', required: true },
    { name: 'email', label: 'Email Address', icon: FaEnvelope, type: 'email', disabled: true },
    { name: 'mobile', label: 'Mobile Number', icon: FaPhone, type: 'tel' },
    { name: 'company', label: 'Company', icon: FaBuilding, type: 'text' },
  ];

  const locationFields = [
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'country', label: 'Country' },
    { name: 'pincode', label: 'PIN Code' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
          <p className="text-xs text-neutral-500 mt-1">Update your profile details</p>
        </motion.div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            <FaEdit size={18} />
            <span className="hidden sm:inline">Edit Profile</span>
          </motion.button>
        ) : null}
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {inputFields.map((field) => (
            <motion.div key={field.name} whileHover={{ y: isEditing ? -2 : 0 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                <field.icon className="text-neutral-600" size={16} />
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || field.disabled}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className={`w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium text-neutral-900 ${
                    isEditing && !field.disabled
                      ? 'bg-white cursor-text'
                      : 'bg-neutral-50 cursor-not-allowed text-neutral-600'
                  }`}
                />
              </div>
            </motion.div>
          ))}

          <motion.div whileHover={{ y: isEditing ? -2 : 0 }}>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
              <FiGrid className="text-neutral-600" size={16} />
              Project Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="userTypeId"
                value={formData.userTypeId || ''}
                onChange={handleUserTypeSelectChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium appearance-none text-neutral-900 ${
                  isEditing
                    ? 'bg-white cursor-pointer'
                    : 'bg-neutral-50 cursor-not-allowed text-neutral-600'
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-neutral-500 mt-2 font-medium"
              >
                Selected: <span className="text-primary font-semibold">{selectedUserTypeName}</span>
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        <motion.div whileHover={{ y: isEditing ? -2 : 0 }}>
          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-neutral-600" size={16} />
            Address
          </label>
          <div className="relative">
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              placeholder="Enter your full address"
              className={`w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium text-neutral-900 resize-none ${
                isEditing
                  ? 'bg-white cursor-text'
                  : 'bg-neutral-50 cursor-not-allowed text-neutral-600'
              }`}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {locationFields.map((field) => (
            <motion.div key={field.name} whileHover={{ y: isEditing ? -2 : 0 }}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder={field.label}
                className={`w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium text-neutral-900 ${
                  isEditing
                    ? 'bg-white cursor-text'
                    : 'bg-neutral-50 cursor-not-allowed text-neutral-600'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 pt-6 border-t border-neutral-200"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors duration-200 font-semibold"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PersonalInfo;