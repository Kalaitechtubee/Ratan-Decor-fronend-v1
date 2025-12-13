import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerApi } from '../api/authApi';
import { fetchPincodeData } from '../../../services/pincodeApi';
import { setUser } from '../authSlice';

function DetailsForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    company: '',
    address: '',
    role: 'customer',
    country: '',
    state: '',
    city: '',
    pincode: '',
    village: '',
    userTypeName: 'residential',
  });

  const [villageOptions, setVillageOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Separate errors for each field
  const [errors, setErrors] = useState({
    general: '',
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    userTypeName: '',
  });

  useEffect(() => {
    const registrationData =
      location.state?.formData ||
      JSON.parse(localStorage.getItem('registrationData') || '{}');
    setFormData((prev) => ({
      ...prev,
      name: registrationData.name || '',
      email: registrationData.email || '',
      password: registrationData.password || '',
      role: registrationData.role || 'customer',
      userTypeName: 'residential',
    }));
  }, [location.state]);

  // Live field restriction: prevents invalid characters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    switch (name) {
      case 'name':
        filteredValue = value.replace(/[^a-zA-Z\s]/g, ''); // only letters/spaces
        break;
      case 'mobile':
        filteredValue = value.replace(/\D/g, ''); // only digits
        break;
      case 'pincode':
        filteredValue = value.replace(/\D/g, ''); // only digits
        break;
      case 'email':
        filteredValue = value.replace(/\s/g, ''); // no spaces
        break;
      case 'company':
        filteredValue = value.replace(/[^a-zA-Z0-9\s&.-]/g, ''); // allow letters, digits, &, ., -
        break;
      case 'address':
        filteredValue = value.replace(/[^a-zA-Z0-9\s,./#-]/g, ''); // allow letters, digits, punctuation
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!/^[a-zA-Z\s]+$/.test(formData.name))
      newErrors.name = 'Full Name should contain only letters';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = 'Invalid email format';
    if (
      !formData.password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
      newErrors.password =
        'Password must be at least 8 characters long and include letters, numbers, and special characters';
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Mobile Number must be 10 digits';
    if (!formData.address.trim())
      newErrors.address = 'Address is required';
    if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = 'Pincode must be 6 digits';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.userTypeName)
      newErrors.userTypeName = 'User Type is required';

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handlePincodeChange = async (pincode) => {
    if (pincode.length === 6) {
      setLoading(true);
      setErrors((prev) => ({ ...prev, pincode: '', general: '' }));
      try {
        const data = await fetchPincodeData(pincode);
        if (data[0].Status === 'Success') {
          const postOffices = data[0].PostOffice;
          setVillageOptions(postOffices.map((po) => po.Name));
          setCityOptions([...new Set(postOffices.map((po) => po.Block))]);
          setFormData((prev) => ({
            ...prev,
            state: postOffices[0].State,
            country: postOffices[0].Country,
          }));
        } else {
          setErrors((prev) => ({ ...prev, pincode: 'Invalid Pincode' }));
          setVillageOptions([]);
          setCityOptions([]);
          setFormData((prev) => ({
            ...prev,
            village: '',
            city: '',
            state: '',
            country: '',
          }));
        }
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          pincode: 'Error fetching pincode data',
        }));
        setVillageOptions([]);
        setCityOptions([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const combinedAddress = [
        formData.address,
        formData.village,
        formData.city,
        formData.state,
        formData.country,
        formData.pincode,
      ]
        .filter(Boolean)
        .join(', ');

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        company: formData.company || '',
        address: combinedAddress,
        role: formData.role.toLowerCase(),
        userTypeName: formData.userTypeName,
        village: formData.village || '',
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      };

      const response = await registerApi(payload);
      if (response.success) {
        const { userId, name, email, role, status, accessToken } = response.data;
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('name', name || '');
        localStorage.setItem('email', email || '');
        localStorage.setItem('role', role || '');
        localStorage.setItem('status', status || 'Pending');
        localStorage.setItem(
          'isLoggedIn',
          status.toUpperCase() === 'APPROVED' ? 'true' : 'false'
        );
        // Persist token as a fallback when cookies are blocked on localhost
        localStorage.setItem('accessToken', accessToken || '');
        localStorage.setItem('token', accessToken || '');
        localStorage.setItem('company', formData.company || '');
        localStorage.setItem('mobile', formData.mobile || '');
        localStorage.setItem('address', combinedAddress || '');
        localStorage.setItem('userType', formData.userTypeName || '');
        localStorage.setItem('village', formData.village || '');
        localStorage.setItem('city', formData.city || '');
        localStorage.setItem('state', formData.state || '');
        localStorage.setItem('country', formData.country || '');
        localStorage.setItem('pincode', formData.pincode || '');

        dispatch(
          setUser({
            id: userId,
            name,
            email,
            role,
            status: status.toUpperCase(),
            token: accessToken,
            company: formData.company || '',
            mobile: formData.mobile || '',
            address: combinedAddress || '',
            userTypeName: formData.userTypeName || '',
            village: formData.village || '',
            city: formData.city || '',
            state: formData.state || '',
            country: formData.country || '',
            pincode: formData.pincode || '',
          })
        );

        localStorage.removeItem('registrationData');
        setShowSuccessPopup(true);

        setTimeout(() => {
          if (status.toUpperCase() === 'APPROVED') {
            navigate('/', { replace: true });
          } else {
            navigate('/check-status', { state: { id: userId }, replace: true });
          }
        }, 1500);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: response.message || 'Registration failed. Please try again.',
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || 'Registration failed. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = { hover: { scale: 1.02 }, tap: { scale: 0.98 } };
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl bg-white shadow-xl p-6"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600 text-sm">
          Please provide additional details to complete your registration
        </p>
      </div>

      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-none"
        >
          {errors.general}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email ID *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
              {errors.mobile && (
                <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                User Type *
              </label>
              <select
                name="userTypeName"
                value={formData.userTypeName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              >
                <option value="">Select User Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="modular-kitchen">Modular Kitchen</option>
                <option value="others">Others</option>
              </select>
              {errors.userTypeName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.userTypeName}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Address Information */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Address Information
          </h3>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              ></textarea>
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pincode */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => {
                  handleInputChange(e);
                  handlePincodeChange(e.target.value);
                }}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
              {loading && (
                <p className="text-xs text-gray-500 mt-1">Loading...</p>
              )}
              {errors.pincode && (
                <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
              )}
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Village
              </label>
              <select
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
                disabled={!villageOptions.length}
              >
                <option value="">Select Village</option>
                {villageOptions.map((village, index) => (
                  <option key={index} value={village}>
                    {village}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
                disabled={!cityOptions.length}
              >
                <option value="">Select City</option>
                {cityOptions.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">{errors.state}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#e2202b] transition-colors text-sm"
              />
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={loading}
            className={`w-full md:w-auto px-8 py-2.5 rounded-none font-medium text-white transition-all duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#e2202b] hover:bg-[#c41d26]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6 w-full max-w-sm bg-white rounded-none shadow-md text-center"
            >
              <div className="space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="flex justify-center items-center mx-auto w-12 h-12 bg-green-100 rounded-full"
                >
                  <FiCheck className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Registration Completed!</h2>
                  <p className="text-gray-600 text-sm">Redirecting...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DetailsForm;
