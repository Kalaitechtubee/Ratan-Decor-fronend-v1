import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, EyeOff, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLE_OPTIONS = [
  { value: 'Architect', label: 'Architect / Interior Designer' },
  { value: 'Dealer', label: 'Dealer / Distributor' },
  { value: 'customer', label: 'End Consumer' },
  { value: 'customer', label: 'Others' }
];

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Architect',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateName = (name) => {
    if (!name || !name.trim()) return 'Full Name is required';
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return 'Name must be at least 2 characters long';
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) return 'Name can only contain letters and spaces';
    return null;
  };

  const validateEmail = (email) => {
    if (!email || !email.trim()) return 'Email address is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    // Validate role
    if (!formData.role) {
      errors.role = 'Please select a role';
    }

    // Validate terms
    if (!termsAccepted) {
      errors.terms = 'Please accept the terms and conditions';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Show first error message
      const firstError = Object.values(errors)[0];
      setError(firstError);
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    
    // Clear field-specific error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      localStorage.setItem('registrationData', JSON.stringify(formData));
      navigate('/details', { state: { formData } });
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
    if (fieldErrors.terms) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.terms;
        return newErrors;
      });
    }
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 w-full max-w-md"
    >
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600">Join us to start your design journey</p>
      </div>

      {error && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-6 border shadow-xl bg-white">
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border transition-colors focus:outline-none focus:border-1 ${
                  fieldErrors.name 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#e2202b]'
                }`}
                placeholder="Enter your full name"
                required
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
            {!fieldErrors.name && formData.name && (
              <p className="mt-1 text-xs text-gray-500">Letters and spaces only, minimum 2 characters</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border transition-colors focus:outline-none focus:border-1 ${
                  fieldErrors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#e2202b]'
                }`}
                placeholder="your.email@example.com"
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border transition-colors focus:outline-none focus:border-1 ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#e2202b]'
                }`}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            )}
            {!fieldErrors.password && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600 font-medium">Password must contain:</p>
                <ul className="inline-flex flex-wrap gap-x-2 gap-y-0 text-xs text-gray-500 ml-1 leading-tight">

  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
    At least 8 characters,
  </li>
  <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}>
    One lowercase letter,
  </li>
  <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}>
    One uppercase letter,
  </li>
  <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}>
    One number,
  </li>
  <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : ''}>
    One special character (@$!%*?&).
  </li>
</ul>

              </div>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block mb-2 text-sm font-semibold text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border transition-colors focus:outline-none focus:border-1 ${
                  fieldErrors.role 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-[#e2202b]'
                }`}
                required
              >
                <option value="Architect">Architect / Interior Designer</option>
                <option value="Dealer">Dealer / Distributor</option>
                <option value="customer">End Consumer</option>
                <option value="customer">Others</option>
              </select>
            </div>
            {fieldErrors.role && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.role}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  className="h-4 w-4 text-[#e2202b] focus:ring-[#e2202b] border-gray-200"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="/Terms" className="font-medium text-[#e2202b] hover:text-[#c01b24] underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/Privacy" className="font-medium text-[#e2202b] hover:text-[#c01b24] underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {fieldErrors.terms && (
              <p className="mt-1 text-xs text-red-600 ml-7">{fieldErrors.terms}</p>
            )}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !termsAccepted}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold text-white shadow-lg transition-all duration-200 ${
            loading || !termsAccepted ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e2202b] hover:bg-[#c01b24]'
          }`}
        >
          {loading ? 'Processing...' : 'Create Account'}
        </motion.button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-semibold text-[#e2202b] hover:text-[#c01b24]"
            >
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </motion.div>
  );  
}

export default RegisterForm;