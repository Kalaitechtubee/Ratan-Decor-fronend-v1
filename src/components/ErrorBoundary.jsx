import { Component } from 'react';
import { 
  FaHome, 
  FaRedo, 
  FaHeadset, 
  FaShoppingBag, 
  FaExclamationTriangle,
  FaWhatsapp,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';

class ErrorBoundary extends Component {
  state = { 
    hasError: false, 
    error: null,
    errorInfo: null,
    showDetails: false
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ecommerce App Error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Send to analytics service
    this.reportErrorToAnalytics(error, errorInfo);
  }

  reportErrorToAnalytics = (error, errorInfo) => {
    // Integrate with your analytics service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleContinueShopping = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/products';
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  renderQuickActions() {
    const quickActions = [
      {
        label: 'Living Room',
        url: '/products?category=living-room',
        color: 'bg-blue-50 text-blue-700'
      },
      {
        label: 'Bedroom',
        url: '/products?category=bedroom',
        color: 'bg-green-50 text-green-700'
      },
      {
        label: 'Dining',
        url: '/products?category=dining',
        color: 'bg-orange-50 text-orange-700'
      },
      {
        label: 'Office',
        url: '/products?category=office',
        color: 'bg-purple-50 text-purple-700'
      }
    ];

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 font-roboto text-center">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.url}
              className={`${action.color} py-2 px-3 rounded-lg text-sm font-medium text-center transition-all duration-300 hover:shadow-md font-roboto`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8 font-roboto">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Header with Branding */}
            <div className="bg-gradient-to-r from-[#ff4747] to-[#ff6b6b] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-lg">
                    <FaShoppingBag className="h-8 w-8 text-[#ff4747]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white font-roboto">FurniStore</h1>
                    <p className="text-red-100 text-sm font-roboto">Quality Furniture Online</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium font-roboto">Error</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Main Content */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FaExclamationTriangle className="h-12 w-12 text-[#ff4747]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3 font-roboto">
                  We're Fixing Something
                </h2>
                <p className="text-gray-600 mb-6 font-roboto leading-relaxed">
                  Sorry for the interruption! Our team has been alerted and is working to resolve the issue. 
                  In the meantime, you can try the options below.
                </p>
              </div>

              {/* Quick Actions */}
              {this.renderQuickActions()}

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-3 bg-[#ff4747] hover:bg-[#e53e3e] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-roboto"
                >
                  <FaRedo className="h-5 w-5" />
                  Reload Page
                </button>

                <button
                  onClick={this.handleContinueShopping}
                  className="flex items-center justify-center gap-3 bg-white border-2 border-[#ff4747] text-[#ff4747] hover:bg-[#ff4747] hover:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-roboto"
                >
                  <FaShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </button>
              </div>

              {/* Support Options */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-roboto text-center">
                  Need Help? We're Here For You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaHeadset className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1 font-roboto">24/7 Support</p>
                    <a href="tel:+919381059678" className="text-[#ff4747] text-sm font-roboto">
                      +91 93810 59678
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaWhatsapp className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1 font-roboto">Chat with Us</p>
                    <a href="https://wa.me/919381059678" className="text-[#ff4747] text-sm font-roboto">
                      WhatsApp Support
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaShieldAlt className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1 font-roboto">Safe & Secure</p>
                    <p className="text-gray-500 text-xs font-roboto">Your data is protected</p>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              {process.env.NODE_ENV === 'development' && (
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={this.toggleDetails}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-roboto mx-auto"
                  >
                    <span>Technical Details</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {this.state.showDetails && this.state.errorInfo && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                      <pre className="text-xs text-gray-700 overflow-auto max-h-40 font-roboto">
                        {this.state.error && this.state.error.toString()}
                        {'\n'}
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-roboto">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                  <span>© {new Date().getFullYear()} Ratan Decor</span>
                  <span className="hidden md:block">•</span>
                  <span>All rights reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="h-3 w-3" />
                  <span>Page loaded at: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;