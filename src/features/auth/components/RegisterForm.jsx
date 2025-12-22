import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, EyeOff, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateForm = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      setError('Password must be at least 8 characters long and include letters, numbers, and special characters');
      return false;
    }
    if (!formData.name) {
      setError('Full Name is required');
      return false;
    }
    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
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
              Full Name *
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#e2202b] focus:border-1 transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
              Email Address *
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#e2202b] focus:border-1 transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#e2202b] focus:border-1 transition-colors"
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
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block mb-2 text-sm font-semibold text-gray-700">
              Role *
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#e2202b] focus:border-1 transition-colors"
                required
              >
                <option value="customer">End Consumer</option>
                <option value="Architect">Architect / Interior Designer</option>
                <option value="Dealer">Dealer / Distributor</option>
                <option value="customer">Others</option>

                
              </select> 
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
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