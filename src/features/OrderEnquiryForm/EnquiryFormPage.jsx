import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, MapPin, CheckCircle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createEnquiry, getUserTypes } from '../product/api/EnquiryApi';
import { useAuth } from '../auth/hooks/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
      {label} {required && <span className="text-red-500">*</span>}
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
          Pincode {required && <span className="text-red-500">*</span>}
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
            State {required && <span className="text-red-500">*</span>}
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
            City/District {required && <span className="text-red-500">*</span>}
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

// EnquiryForm component (renamed to EnquiryFormPage for page usage)
const EnquiryFormPage = ({ product: propProduct, user: propUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, isAuthenticated } = useAuth();

  // Prioritize product from prop, then from location state
  const product = propProduct || location.state?.product;
  const user = propUser || authUser;
  const isLoggedIn = isAuthenticated && !!user;
  const [isOpen, setIsOpen] = useState(true);
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

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Pre-fill form data when component mounts or user/product changes
  useEffect(() => {
    const initialUserType = user?.userTypeName || user?.userType || user?.userTypeId || '';

    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
      companyName: user?.companyName || user?.company || '',
      email: user?.email || '',
      phoneNo: user?.mobile || user?.phone || user?.phoneNo || '',
      state: user?.state || '',
      city: user?.city || '',
      pincode: user?.pincode || '',
      userType: initialUserType,
      role: user?.userRole || user?.role || 'Customer',
      productDesignNumber: product?.designNumber || (product?.id ? String(product.id) : ''),
      productName: product?.name || '',
      productDescription: product?.description || '',
    }));
  }, [user, product]);

  // Sync userType once when userTypes are loaded
  useEffect(() => {
    if (userTypes.length > 0 && (user?.userType || user?.userTypeName || user?.userTypeId)) {
      const typeToMatch = user.userType || user.userTypeName || user.userTypeId;
      const match = userTypes.find(
        (type) =>
          type.id?.toString().toLowerCase() === typeToMatch?.toString().toLowerCase() ||
          type.name?.toString().toLowerCase() === typeToMatch?.toString().toLowerCase()
      );
      if (match) {
        const matchedValue = match.id || match.name;
        if (formData.userType !== matchedValue) {
          setFormData((prev) => ({
            ...prev,
            userType: matchedValue
          }));
        }
      }
    }
  }, [userTypes, user]);

  useEffect(() => {
    const fetchUserTypes = async () => {
      setLoadingUserTypes(true);
      try {
        const result = await getUserTypes();
        if (result.success && result.data) {
          setUserTypes(result.data);
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
  }, []);

  // Default userType for guests
  useEffect(() => {
    if (!user && userTypes.length > 0 && !formData.userType) {
      const defaultType = userTypes.find(t => t.name === 'General') || userTypes[0];
      if (defaultType) {
        setFormData(prev => ({ ...prev, userType: defaultType.name || defaultType.id }));
      }
    }
  }, [user, userTypes, formData.userType]);

  // Enhanced validation functions
  const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10;
  };

  const validateName = (name) => {
    if (!name || !name.trim()) return false;
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmedName);
  };

  const validateCity = (city) => {
    if (!city || !city.trim()) return false;
    return city.trim().length >= 2;
  };

  const validateState = (state) => {
    if (!state || !state.trim()) return false;
    return state.trim().length >= 2;
  };

  const validatePincode = (pincode) => {
    if (!pincode) return true; // Optional
    return /^\d{6}$/.test(pincode);
  };

  const formatPhoneNumber = (phone) => phone.replace(/[^\d]/g, '');

  const validateForm = (data) => {
    const errors = {};

    // Name validation
    if (!data.name || !data.name.trim()) {
      errors.name = 'Name is required';
    } else if (!validateName(data.name)) {
      errors.name = 'Please enter a valid name (letters and spaces only, minimum 2 characters)';
    }

    // Email validation
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!data.phoneNo || !data.phoneNo.trim()) {
      errors.phoneNo = 'Phone number is required';
    } else if (!validatePhone(data.phoneNo)) {
      errors.phoneNo = 'Please enter a valid 10-digit phone number';
    }

    // State validation
    if (!data.state || !data.state.trim()) {
      errors.state = 'State is required';
    } else if (!validateState(data.state)) {
      errors.state = 'Please enter a valid state name (minimum 2 characters)';
    }

    // City validation
    if (!data.city || !data.city.trim()) {
      errors.city = 'City is required';
    } else if (!validateCity(data.city)) {
      errors.city = 'Please enter a valid city name (minimum 2 characters)';
    }

    // Pincode validation (optional but must be valid if provided)
    if (data.pincode && !validatePincode(data.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // Role validation for non-logged-in users
    if (!user && (!data.role || !data.role.trim())) {
      errors.role = 'Please select a role';
    }

    // Role-based automatic userType handling if missing
    if (!data.userType && data.role) {
      const role = data.role.toLowerCase();
      if (role === 'architect' || role === 'dealer') {
        const match = userTypes.find(t => t.name.toLowerCase() === role);
        if (match) {
          data.userType = match.id || match.name;
        }
      }
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
    // Special handling for phone number - only allow 10 digits
    if (name === 'phoneNo') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleLocationChange = useCallback(({ state, city }) => {
    setFormData((prev) => ({
      ...prev,
      state: state || prev.state,
      city: city || prev.city,
    }));
    
    // Clear validation errors for location fields
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (state) delete newErrors.state;
      if (city) delete newErrors.city;
      return newErrors;
    });
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setValidationErrors({});
      
      const errors = validateForm(formData);
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
      
      const response = await createEnquiry(formattedEnquiry);
      setSuccessMessage(response.message || 'Enquiry submitted successfully!');
      setShowSuccessPopup(true);
      resetForm();
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
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Submit Enquiry</h1>
            <p className="mt-2 text-lg text-gray-600">Fill in the details below to get in touch with us.</p>
          </div>

          {/* Render EnquiryForm as modal but full-width for page */}
          <div className={`bg-white rounded-xl shadow-2xl ${isOpen ? 'block' : 'hidden'}`}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Enquiry Form</h2>
              <button
                onClick={handleClose}
                disabled={submitting}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
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
                      placeholder="Enter your full name"
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
                      placeholder="Enter 10 digit phone number"
                      maxLength={10}
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
                      placeholder="your.email@example.com"
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
                        readOnly
                      />
                    ) : (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="role"
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            className={`w-full px-3 py-2 bg-white rounded-lg border transition-shadow appearance-none ${
                              validationErrors.role
                                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
                            }`}
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
                        {validationErrors.role && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                        )}
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
                        name="notes"
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
      </main>
      <Footer />

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Check size={32} strokeWidth={3} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
              <p className="text-gray-600 mb-8">
                {successMessage || "Your enquiry has been received. Our team will get back to you shortly."}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-primary/30"
                >
                  Go to Home Page
                </button>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 transition-colors"
                >
                  Stay on this page
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnquiryFormPage;