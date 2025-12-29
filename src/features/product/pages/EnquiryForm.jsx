import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, MapPin, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createEnquiry, getUserTypes } from '../api/EnquiryApi';
import { useAuth } from '../../auth/hooks/useAuth';

// LoadingSpinner component
const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
  return <Loader2 className={`animate-spin ${sizeClass} ${className}`} />;
};

const ROLE_OPTIONS = [
  { value: 'Customer', label: 'End Consumer' },
  { value: 'Architect', label: 'Architect / Interior Designer' },
  { value: 'Dealer', label: 'Dealer / Distributor' },
  { value: 'Customer', label: 'Others' }
];

// FormInput component
const FormInput = ({ label, name, type = 'text', value, onChange, hasError, required = false, readOnly = false, ...props }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full px-3 py-2 rounded-lg border transition-shadow ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${hasError
          ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
          : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
        }`}
      {...props}
    />
    {hasError && <p className="mt-1 text-sm text-red-600">{hasError}</p>}
  </div>
);

// LocationSelector component
const LocationSelector = ({
  pincode,
  state,
  city,
  onPincodeChange,
  onLocationChange,
  errors = {},
  required = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const fetchLocationData = useCallback(async (pincodeValue) => {
    if (!pincodeValue || pincodeValue.length !== 6 || !/^\d{6}$/.test(pincodeValue)) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincodeValue}`);
      const data = await response.json();

      if (data[0]?.Status === 'Success') {
        const postOffices = data[0].PostOffice || [];
        const uniqueLocations = new Map();
        postOffices.forEach((office) => {
          const key = `${office.State}-${office.District}`;
          if (!uniqueLocations.has(key)) {
            uniqueLocations.set(key, {
              state: office.State,
              city: office.District,
              area: office.Name,
            });
          }
        });

        const locationOptions = Array.from(uniqueLocations.values());
        setSuggestions(locationOptions);
        if (locationOptions.length === 1 && !manualOverride) {
          const location = locationOptions[0];
          onLocationChange({
            state: location.state,
            city: location.city,
          });
          setShowSuggestions(false);
        } else if (locationOptions.length > 1) {
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  }, [onLocationChange, manualOverride]);

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    onPincodeChange(value);
    if (value.length === 6) {
      fetchLocationData(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location) => {
    onLocationChange({
      state: location.state,
      city: location.city,
    });
    setShowSuggestions(false);
    setManualOverride(false);
  };

  const enableManualEntry = () => {
    setManualOverride(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          <MapPin size={16} className="inline mr-1" />
          Pincode {required && <span className="text-primary">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            value={pincode}
            onChange={handlePincodeChange}
            placeholder="Enter 6-digit pincode"
            className={`w-full px-3 py-2 pr-10 rounded-lg border transition-all ${errors.pincode
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
              : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
              }`}
            maxLength={6}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="small" className="text-primary" />
            </div>
          )}
        </div>
        {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">Select your location:</div>
            {suggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => selectLocation(location)}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b last:border-b-0 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {location.city}, {location.state}
                </div>
                <div className="text-xs text-gray-500">{location.area}</div>
              </button>
            ))}
            <button
              onClick={enableManualEntry}
              className="w-full px-3 py-2 text-left text-primary hover:bg-blue-50 border-t text-sm font-medium"
            >
              Enter location manually
            </button>
          </div>
        )}
        {pincode.length === 6 && state && city && !showSuggestions && !loading && (
          <div className="mt-1 text-xs text-green-600 flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Location auto-filled for pincode {pincode}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            State {required && <span className="text-primary">*</span>}
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) => onLocationChange({ state: e.target.value, city })}
            className={`w-full px-3 py-2 rounded-lg border transition-all ${errors.state
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
              : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
              } ${!manualOverride && pincode.length === 6 ? 'bg-blue-50' : ''}`}
            placeholder="Enter state"
            readOnly={!manualOverride && suggestions.length > 0}
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            City/District {required && <span className="text-primary">*</span>}
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => onLocationChange({ state, city: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border transition-all ${errors.city
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
              : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
              } ${!manualOverride && pincode.length === 6 ? 'bg-blue-50' : ''}`}
            placeholder="Enter city or district"
            readOnly={!manualOverride && suggestions.length > 0}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
      </div>
      {!manualOverride && state && city && (
        <button
          type="button"
          onClick={enableManualEntry}
          className="text-sm text-primary hover:text-opacity-80 transition-colors"
        >
          Edit location manually
        </button>
      )}
    </div>
  );
};

// EnquiryForm component
const EnquiryForm = ({ isOpen, onClose, product, user: propUser }) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const user = propUser || authUser;
  const isLoggedIn = isAuthenticated && !!user;
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [userTypes, setUserTypes] = useState([]);
  const [loadingUserTypes, setLoadingUserTypes] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    companyName: user?.companyName || user?.company || '',
    email: user?.email || '',
    phoneNo: user?.mobile || user?.phone || user?.phoneNo || '',
    state: user?.state || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    productDesignNumber: product?.designNumber || (product?.id ? String(product.id) : ''),
    productName: product?.name || '',
    productDescription: product?.description || '',
    notes: '',
    userType: user?.userTypeName || user?.userType || user?.userTypeId || '',
    role: user?.userRole || user?.role || 'Customer',
  });

  // Pre-fill form data when modal opens or user data changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name || '',
        companyName: user?.companyName || user?.company || '',
        email: user?.email || '',
        phoneNo: user?.mobile || user?.phone || user?.phoneNo || '',
        state: user?.state || '',
        city: user?.city || '',
        pincode: user?.pincode || '',
        userType: user?.userTypeName || user?.userType || user?.userTypeId || '',
        role: user?.userRole || user?.role || 'Customer',
        productDesignNumber: product?.designNumber || (product?.id ? String(product.id) : ''),
        productName: product?.name || '',
        productDescription: product?.description || '',
      }));
    }
  }, [isOpen, user, product]); // Added user and product dependencies

  // Sync userType once when userTypes are loaded if not already set or if it's the initial load
  useEffect(() => {
    if (isOpen && userTypes.length > 0 && (user?.userType || user?.userTypeName || user?.userTypeId)) {
      const typeToMatch = user.userType || user.userTypeName || user.userTypeId;
      const match = userTypes.find(
        (type) =>
          type.id?.toString().toLowerCase() === typeToMatch?.toString().toLowerCase() ||
          type.name?.toString().toLowerCase() === typeToMatch?.toString().toLowerCase()
      );

      if (match) {
        const matchedValue = match.id || match.name;
        // Only update if the value is different (e.g. switching from Name to ID)
        if (formData.userType !== matchedValue) {
          setFormData((prev) => ({
            ...prev,
            userType: matchedValue
          }));
        }
      }
    }
  }, [userTypes, user, isOpen]); // Removed formData.userType from dependency to avoid loops, though strict check prevents it

  useEffect(() => {
    const fetchUserTypes = async () => {
      if (!isOpen) return;

      setLoadingUserTypes(true);
      try {
        const result = await getUserTypes();
        if (result.success && result.data) {
          setUserTypes(result.data);
          // Removed auto-selection of first user type to allow 'Select User Type' default for guests
        }
      } catch (error) {
        console.error('Error fetching user types:', error);
        if (error.message && error.message.includes('Access denied')) {
          setUserTypes([
            { id: 'General', name: 'General' },
            { id: 'Dealer', name: 'Dealer' },
            { id: 'Architect', name: 'Architect' },
            { id: 'Contractor', name: 'Contractor' }
          ]);
          // Removed auto-select fallback to keep field empty for guests
        } else {
          toast.error('Failed to load user types');
          setUserTypes([
            { id: 'General', name: 'General' },
            { id: 'Dealer', name: 'Dealer' },
            { id: 'Architect', name: 'Architect' },
            { id: 'Contractor', name: 'Contractor' }
          ]);
        }
      } finally {
        setLoadingUserTypes(false);
      }
    };

    fetchUserTypes();
  }, [isOpen]); // Removed duplicate call and formData.userType dependency

  // Default userType for guests
  useEffect(() => {
    if (isOpen && !user && userTypes.length > 0 && !formData.userType) {
      const defaultType = userTypes.find(t => t.name === 'General') || userTypes[0];
      if (defaultType) {
        setFormData(prev => ({ ...prev, userType: defaultType.name || defaultType.id }));
      }
    }
  }, [isOpen, user, userTypes]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone.replace(/[^\d]/g, ''));
  const formatPhoneNumber = (phone) => phone.replace(/[^\d]/g, '');
  const validatePincode = (pincode) => (pincode ? /^\d{6}$/.test(pincode) : true);

  const validateForm = (data) => {
    const errors = {};
    const requiredFields = ['name', 'email', 'phoneNo', 'state', 'city'];

    requiredFields.forEach((field) => {
      if (!data[field]?.trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (data.email && !validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (data.phoneNo && !validatePhone(data.phoneNo)) {
      errors.phoneNo = 'Please enter a valid phone number (10-15 digits)';
    }

    if (data.pincode && !validatePincode(data.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (userTypes.length > 0 && !data.userType) {
      errors.userType = 'Please select a user type';
    }

    return errors;
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      companyName: user?.companyName || user?.company || '',
      email: user?.email || '',
      phoneNo: user?.phone || user?.phoneNo || '',
      state: user?.state || '',
      city: user?.city || '',
      pincode: user?.pincode || '',
      productDesignNumber: product?.id ? String(product.id) : '',
      productDescription: product?.description || '',
      notes: '',
      userType: user?.userTypeName || user?.userType || user?.userTypeId || '',
      role: user?.userRole || user?.role || 'Customer',
    });
    setValidationErrors({});
  };

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, [validationErrors]);

  const handleLocationChange = useCallback(({ state, city }) => {
    setFormData((prev) => ({
      ...prev,
      state: state || prev.state,
      city: city || prev.city,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      state: state ? undefined : prev.state,
      city: city ? undefined : prev.city,
    }));
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setValidationErrors({});

      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix the validation errors');
        return;
      }

      const formattedEnquiry = {
        name: formData.name.trim(),
        companyName: formData.companyName?.trim() || null,
        email: formData.email.trim().toLowerCase(),
        phoneNo: formatPhoneNumber(formData.phoneNo),
        state: formData.state.trim(),
        city: formData.city.trim(),
        productDesignNumber: formData.productDesignNumber,
        productName: formData.productName,
        productDescription: formData.productDescription,
        notes: formData.notes?.trim() || 'N/A',
        userType: formData.userType,
        role: formData.role,
        pincode: formData.pincode || null,
        source: 'Website',
        productId: product?.id || null,
      };

      await createEnquiry(formattedEnquiry);
      toast.success('Enquiry submitted successfully!');
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      toast.error(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Enquire</h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Customer Information Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">Customer Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  hasError={validationErrors.name}
                  readOnly={isLoggedIn}
                />

                <FormInput
                  label="Phone"
                  name="phoneNo"
                  type="tel"
                  required
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                  hasError={validationErrors.phoneNo}
                  readOnly={isLoggedIn}
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  hasError={validationErrors.email}
                  readOnly={isLoggedIn}
                />
                <FormInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name (optional)"
                />

                {user ? (
                  <FormInput
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="Enter your role"
                  />
                ) : (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Role <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow appearance-none"
                      >
                        <option value="">Select Role</option>
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Location Information Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">Location Information</h3>
              <LocationSelector
                pincode={formData.pincode}
                state={formData.state}
                city={formData.city}
                onPincodeChange={(pincode) => handleInputChange('pincode', pincode)}
                onLocationChange={handleLocationChange}
                errors={validationErrors}
                required
              />
            </div>

            {/* Enquiry Details Section */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">Enquiry Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    placeholder="Any specific requirements, customization needs, or additional information..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-6 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loadingUserTypes}
            className="flex items-center px-6 py-2 space-x-2 text-white rounded-lg bg-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting && <LoadingSpinner size="small" className="text-white" />}
            <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;