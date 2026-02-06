import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../authSlice';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { status, error, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: state?.email || '',
    password: '',
  });
  const [message, setMessage] = useState(state?.message || '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading' || error) {
      return; // Prevent further submissions if already loading or there's an error
    }
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result.user.status === 'Pending') {
        setMessage('Your account is pending approval. Please wait for admin approval.');
        toast.info('Account pending approval.');
      } else if (result.user.status === 'Rejected') {
        setMessage('Your account has been rejected. Please contact support.');
        toast.error('Account rejected.');
      } else {
        toast.success('Login successful!');
        navigate('/profile');
      }
    } catch (err) {
      const errStr = typeof err === 'string' ? err : err.message || '';
      const errorMsg = errStr.includes('pending approval')
        ? 'Your account is pending approval.'
        : errStr.includes('rejected')
        ? 'Your account has been rejected.'
        : errStr || 'Login failed. Please try again.';
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 w-full max-w-md"
      >
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-primary rounded-2xl shadow-lg">
            <FaLock className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2 text-4xl font-bold text-gray-900">Sign In</h2>
          <p className="text-lg text-gray-600">Access your Ratan Decor account</p>
        </div>

        {message && (
          <div
            className={`px-4 py-3 text-sm rounded-lg border ${
              message.includes('successfully')
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-red-700 bg-red-50 border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6 rounded-3xl border shadow-xl bg-white">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
                  <FaEnvelope className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 rounded-xl border-gray-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
                  <FaLock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-12 py-4 border-2 rounded-xl border-gray-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot Password?
            </a>
          </div>

          <motion.button
            type="submit"
            disabled={status === 'loading'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white ${
              status === 'loading' ? 'bg-gray-400' : 'bg-primary'
            } shadow-lg`}
          >
            {status === 'loading' ? 'Signing In...' : 'Sign In'}
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-primary">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginForm;