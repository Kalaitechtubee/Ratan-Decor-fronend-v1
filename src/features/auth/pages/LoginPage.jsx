import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../index';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import logo from '../../../assets/images/ratan-decor.png';

import loginBg from '../../../assets/login.png';

function LoginPage() {
  const { login, isAuthenticated, user, status, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (status === 'succeeded' && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      if (isAuthenticated && user?.status?.toUpperCase() === 'APPROVED') {
        navigate('/', { replace: true });
      } else if (user?.status?.toUpperCase() === 'PENDING' || user?.status?.toUpperCase() === 'REJECTED') {
        navigate('/check-status', { state: { id: user.id }, replace: true });
      }
    } else if (status === 'failed' && error && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      let userFriendlyMessage = typeof error === 'string' ? error : 'Something went wrong. Please try again later.';

      if (typeof error === 'string') {
        if (error.includes('Password is incorrect')) {
          userFriendlyMessage = 'The password you entered is incorrect. Please try again.';
        } else if (error.includes('User not found')) {
          userFriendlyMessage = 'No account found with this email. Please register';
        } else if (error.includes('rejected')) {
          userFriendlyMessage = 'Your account has been rejected. Please contact support.';
        }
      }

      setFormError(userFriendlyMessage);
      toast.error(userFriendlyMessage);
    }
  }, [isAuthenticated, status, error, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    hasNavigatedRef.current = false;
    setFormError('');
    await login(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex"
    >
      {/* Left Section - Image with Content */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${loginBg})`
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Transform Your Home Into Your Dream Space
            </h1>
            <p className="text-lg text-white/90 max-w-lg italic">
              Discover premium modular kitchens and interior design solutions that bring your vision to life — elegant, functional, reliable.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col bg-white px-4 sm:px-6 lg:px-8">
        {/* Top Row with Logo and Skip Button */}
        <div className="w-full flex justify-between items-center py-10">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Ratan Decor Logo"
              className="h-10 transition-transform duration-300 hover:scale-105"
            />
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-1 text-sm font-light text-[#000000] hover:text-[#333333] transition-colors hover:underline"
          >
            <span>Back to Home</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
          </button>
        </div>
        {/* Centered Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-sm w-full">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Welcome Back to
                <span className="block text-black">
                  Ratan Decor!
                </span>
              </h2>

            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200"
                >
                  {formError}
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#e2202b] focus:border-[#e2202b] transition-all"
                  placeholder="info.ratandecor@gmail.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#e2202b] focus:border-[#e2202b] transition-all pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#e2202b] focus:ring-[#e2202b] border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember Me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-[#e2202b] hover:text-[#c01b24] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/forgot-password');
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full flex justify-center py-3.5 px-4 border border-transparent shadow-sm text-sm font-semibold text-white transition-all duration-300 ${status === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#e2202b] hover:bg-[#c01b24] active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-[#e2202b]'
                    }`}
                >
                  {status === 'loading' ? (
                    <div className="flex items-center">
                      <FaSpinner className="mr-1.5 animate-spin w-4 h-4" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login to Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 mb-10 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="font-medium text-[#e2202b] hover:text-[#c01b24]"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginPage;