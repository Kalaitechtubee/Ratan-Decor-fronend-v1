import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../authSlice';

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setMessage('OTP sent to your email. Please check your inbox.');
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 1500);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 w-full max-w-md"
      >
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
            <FaShieldAlt className="h-8 w-8 text-[#ff4747]" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-gray-600">Enter your email to receive a verification code</p>
        </div>

        {error && (
          <div className="px-4 py-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {message && (
          <div className="px-4 py-3 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <FaEnvelope className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border rounded-lg border-gray-300"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#ff4747] to-[#ff6b6b]'
            } shadow-md`}
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </motion.button>
        </form>

        <div className="text-center">
          <a
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-[#ff4747]"
          >
            <FaArrowLeft />
            Back to Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;