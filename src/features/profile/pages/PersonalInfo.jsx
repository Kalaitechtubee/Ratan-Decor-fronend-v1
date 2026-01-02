import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaSave, FaUserShield } from 'react-icons/fa';
import { FiHome, FiCoffee, FiGrid, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fetchPincodeData } from '../../../services/pincodeApi';
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
  const [villageOptions, setVillageOptions] = useState([]);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    
    // Update the input with only digits
    handleInputChange({ target: { name: 'pincode', value: pincode } });
    
    // Clear pincode error if user is typing
    if (validationErrors.pincode) {
      setValidationErrors(prev => ({ ...prev, pincode: undefined }));
    }

    if (pincode.length === 6) {
      try {
        setIsPincodeLoading(true);
        const data = await fetchPincodeData(pincode);
        if (data[0]?.Status === 'Success') {
          const postOffices = data[0].PostOffice;
          setVillageOptions(postOffices.map(po => po.Name));

          handleInputChange({ target: { name: 'state', value: postOffices[0].State } });
          handleInputChange({ target: { name: 'country', value: postOffices[0].Country } });
          handleInputChange({ target: { name: 'city', value: postOffices[0].Block || postOffices[0].District } });
        } else {
          toast.error('Invalid pincode');
          setVillageOptions([]);
        }
      } catch (err) {
        toast.error('Failed to fetch pincode details');
        setVillageOptions([]);
      } finally {
        setIsPincodeLoading(false);
      }
    } else if (pincode.length < 6) {
      setVillageOptions([]);
    }
  };

  const handleMobileChange = (e) => {
    // Only allow digits and limit to 10 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    handleInputChange({ target: { name: 'mobile', value } });
    
    // Clear mobile error if user is typing
    if (validationErrors.mobile) {
      setValidationErrors(prev => ({ ...prev, mobile: undefined }));
    }
  };

  const handleNameChange = (e) => {
    handleInputChange(e);
    
    // Clear name error if user is typing
    if (validationErrors.name) {
      setValidationErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleFieldChange = (fieldName) => (e) => {
    handleInputChange(e);
    
    // Clear error for this field if user is typing
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      errors.name = 'Name can only contain letters and spaces';
    }

    // Mobile validation
    if (!formData.mobile || !formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else {
      const cleanMobile = formData.mobile.replace(/\D/g, '');
      if (cleanMobile.length !== 10) {
        errors.mobile = 'Mobile number must be exactly 10 digits';
      }
    }

    // Pincode validation (optional but must be valid if provided)
    if (formData.pincode && formData.pincode.trim()) {
      const cleanPincode = formData.pincode.replace(/\D/g, '');
      if (cleanPincode.length !== 6) {
        errors.pincode = 'Pincode must be exactly 6 digits';
      }
    }

    // Address validation
    if (formData.address && formData.address.trim().length > 0 && formData.address.trim().length < 10) {
      errors.address = 'Address must be at least 10 characters if provided';
    }

    // City validation (optional but must be valid if provided)
    if (formData.city && formData.city.trim() && formData.city.trim().length < 2) {
      errors.city = 'City must be at least 2 characters';
    }

    // State validation (optional but must be valid if provided)
    if (formData.state && formData.state.trim() && formData.state.trim().length < 2) {
      errors.state = 'State must be at least 2 characters';
    }

    return errors;
  };

  const handleSaveClick = () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      
      // Show first error in toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      return;
    }

    // Clear errors and proceed with save
    setValidationErrors({});
    handleUpdateProfile();
  };

  return (
    <div className="space-y-8">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-3">
            Basic Information
          </h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleNameChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  } ${validationErrors.name ? 'border-red-300' : 'border-neutral-200'}`}
                />
              </div>
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">Email cannot be changed</p>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ''}
                  onChange={handleMobileChange}
                  disabled={!isEditing}
                  placeholder="Enter 10 digit mobile number"
                  maxLength={10}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  } ${validationErrors.mobile ? 'border-red-300' : 'border-neutral-200'}`}
                />
              </div>
              {validationErrors.mobile && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.mobile}</p>
              )}
              {isEditing && !validationErrors.mobile && (
                <p className="mt-1 text-xs text-neutral-500">10 digits only, no letters or symbols</p>
              )}
            </div>

            {/* Role / User Type */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">User Role</label>
              <div className="relative">
                <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="text"
                  value={formData.role || 'Customer'}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address & Professional Info */}
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-3">
            Address & Professional Info
          </h3>

          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                Company Name <span className="font-normal text-neutral-500">(Optional)</span>
              </label>
              <div className="relative">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="text"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleFieldChange('company')}
                  disabled={!isEditing}
                  placeholder="Enter company name"
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Pincode & Village */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode || ''}
                  onChange={handlePincodeChange}
                  disabled={!isEditing}
                  maxLength={6}
                  placeholder="123456"
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 tracking-wider ${
                    !isEditing ? 'bg-neutral-50 cursor-not-allowed text-neutral-600' : ''
                  } ${validationErrors.pincode ? 'border-red-300' : 'border-neutral-200'}`}
                />
                {isPincodeLoading && <p className="text-xs text-primary mt-1">Fetching details...</p>}
                {validationErrors.pincode && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Village / Area</label>
                <select
                  name="village"
                  value={formData.village || ''}
                  onChange={handleFieldChange('village')}
                  disabled={!isEditing || villageOptions.length === 0}
                  className={`w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 ${
                    !isEditing || villageOptions.length === 0 ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">{villageOptions.length > 0 ? 'Select village' : 'Enter pincode first'}</option>
                  {villageOptions.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Full Address</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-4 text-neutral-400" size={15} />
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleFieldChange('address')}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="House no., street, landmark..."
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 resize-none ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  } ${validationErrors.address ? 'border-red-300' : 'border-neutral-200'}`}
                />
              </div>
              {validationErrors.address && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.address}</p>
              )}
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-3 gap-4">
              {['city', 'state', 'country'].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5 text-center capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleFieldChange(field)}
                    disabled={!isEditing}
                    placeholder={`Enter ${field}`}
                    className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 text-center ${
                      !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                    } ${validationErrors[field] ? 'border-red-300' : 'border-neutral-200'}`}
                  />
                  {validationErrors[field] && (
                    <p className="mt-1 text-xs text-red-600 text-center">{validationErrors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end gap-4 pt-8 border-t border-neutral-200"
        >
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isLoading}
            className="px-7 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave size={16} />
            )}
            <span>Save Changes</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PersonalInfo;