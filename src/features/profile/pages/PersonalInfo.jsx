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

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    handleInputChange(e);

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
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  }`}
                />
              </div>
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
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Mobile Number</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  }`}
                />
              </div>
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
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700"
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
                  onChange={handleInputChange}
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
                  className={`w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 tracking-wider ${
                    !isEditing ? 'bg-neutral-50 cursor-not-allowed text-neutral-600' : ''
                  }`}
                />
                {isPincodeLoading && <p className="text-xs text-primary mt-1">Fetching details...</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Village / Area</label>
                <select
                  name="village"
                  value={formData.village || ''}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="House no., street, landmark..."
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 resize-none ${
                    !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                  }`}
                />
              </div>
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
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-neutral-900 text-center ${
                      !isEditing ? 'bg-neutral-50 text-neutral-600 cursor-not-allowed' : ''
                    }`}
                  />
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
            onClick={handleUpdateProfile}
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