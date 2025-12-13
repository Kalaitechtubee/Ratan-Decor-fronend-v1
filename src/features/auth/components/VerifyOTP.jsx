import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP } from '../authSlice';

function VerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const result = await dispatch(verifyOTP({ email, otp })).unwrap();
      setMessage('OTP verified successfully.');
      setTimeout(() => navigate('/reset-password', { state: { resetToken: result.resetToken, email } }), 1500);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
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
            <FaCheckCircle className="h-8 w-8 text-[#ff4747]" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Verify OTP</h2>
          <p className="text-gray-600">Enter the verification code sent to {email}</p>
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
            <label htmlFor="verificationCode" className="block mb-2 text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="block w-full px-3 py-3 border rounded-lg border-gray-300 text-center text-2xl font-mono tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
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
            {loading ? 'Verifying...' : 'Verify Code'}
          </motion.button>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="w-full py-2 px-4 text-sm text-[#ff4747]"
            onClick={() => dispatch(forgotPassword({ email }))}
            disabled={loading}
          >
            Didn't receive code? Resend
          </button>
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

export default VerifyOTP;