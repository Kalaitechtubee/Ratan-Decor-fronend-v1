import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/Footer';
import toast from 'react-hot-toast';

const CheckStatus = () => {
  const { user, status, error, checkStatus, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user is approved and redirect to home
  useEffect(() => {
    if (user?.status?.toLowerCase() === 'approved') {
      toast.success('Your account has been approved! Welcome to Ratan Decor.', {
        duration: 4000,
        icon: '🎉',
      });
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Handle refresh button click
  const handleRefresh = async () => {
    if (user?.id && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await checkStatus(user.id);
        toast.success('Status refreshed!', { duration: 2000 });
      } catch (err) {
        console.error('Status check failed:', err);
        toast.error('Failed to refresh status. Please try again.');
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully!', { duration: 2000 });
    navigate('/login', { replace: true });
  };

  // Handle navigate to home
  const handleGoToHome = () => {
    navigate('/', { replace: false });
  };

  // Redirect to login if no user data
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const isApproved = user.status?.toLowerCase() === 'approved';
  const isPending = user.status?.toLowerCase() === 'pending' || !user.status;
  const statusColor = isApproved ? 'green' : isPending ? 'yellow' : 'red';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Welcome, {user.name || 'User'}
            </h1>
            <p className="text-gray-600">Account Status Dashboard</p>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 min-h-96">

              {/* Status Panel */}
              <div className="lg:col-span-1 bg-gray-900 p-8 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  {isApproved ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isPending ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2 text-center">
                  {isApproved ? 'Account Approved' : isPending ? 'Under Review' : 'Action Required'}
                </h2>
                <p className="text-gray-300 text-sm text-center mb-4">
                  {isApproved ? 'Your account is ready to use' : isPending ? 'We are reviewing your profile' : 'Please resolve issues'}
                </p>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${statusColor === 'green'
                    ? 'bg-green-500 text-white'
                    : statusColor === 'yellow'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                    }`}
                >
                  {user.status || 'Pending'}
                </span>
              </div>

              {/* Content Panel */}
              <div className="lg:col-span-3 p-8">

                {/* Status Message */}
                <div className="mb-8">
                  {isPending ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800 mb-1">Under Review</h3>
                          <p className="text-sm text-yellow-700">
                            Your application is being reviewed. This typically takes 24-48 hours. Please check back or contact support if you have questions.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isApproved ? (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-green-800 mb-1">Account Approved</h3>
                          <p className="text-sm text-green-700">
                            Your account is fully verified and ready to use. You can now access all features.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-red-800 mb-1">Action Required</h3>
                          <p className="text-sm text-red-700">
                            Your account needs additional verification. Please contact support for assistance.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="border border-gray-200 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900 text-sm">{user.email || 'N/A'}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                      <p className="text-gray-900 text-sm">{user.role || 'N/A'}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                      <p className="text-gray-900 text-sm">{user.company || 'N/A'}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-500 mb-1">User Type</label>
                      <p className="text-gray-900 text-sm">{user.userTypeName || 'N/A'}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Mobile</label>
                      <p className="text-gray-900 text-sm">{user.mobile || 'N/A'}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${statusColor === 'green'
                          ? 'bg-green-100 text-green-800'
                          : statusColor === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing || status === 'loading'}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${isRefreshing || status === 'loading'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                  >
                    {isRefreshing || status === 'loading' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Checking...
                      </span>
                    ) : (
                      'Refresh Status'
                    )}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => window.open('mailto:support@ratan-decor.com')}
                    className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Contact Support
                  </button>
                  <button
                    onClick={handleGoToHome}
                    className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;