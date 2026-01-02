import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { getSeoByPageName } from './features/seo/api/seoApi';
import { useAuth } from './features/auth/hooks/useAuth';
import { CartProvider } from './features/cart';
import { useDispatch } from 'react-redux';
import { setUser, logout } from './features/auth/authSlice';
import api from './services/axios';

function App() {
  const dispatch = useDispatch();
  const [seoData, setSeoData] = useState({
    title: 'Ratan Decor - Premium Interior Solutions',
    description:
      'Explore Ratan Decor\'s premium interior products for Residential, Commercial, and Modular Kitchen spaces in Chennai.',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const location = useLocation();
  const lastPathnameRef = useRef(null);
  const timeoutRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Normalize path to lowercase for consistency
  const normalizedPath = location.pathname.toLowerCase();

  const getPageName = (path) => {
    const map = {
      '/': 'home',
      '/about': 'about',
      '/contact': 'contact',
      '/faq': 'faq',
      '/cookiespolicy': 'cookiespolicy',
      '/cookies-policy': 'cookiespolicy',
      '/disclaimer': 'disclaimer',
      '/privacy': 'privacy',
      '/returns-and-refunds-policy': 'returns',
      '/returns': 'returns',
      '/terms': 'terms',
      '/products': 'products',
      '/cart': 'cart',
      '/checkout': 'checkout',
      '/profile': 'profile',
      '/check-status': 'check-status',
      '/order-success': 'order-success',
      '/login': 'login',
      '/register': 'register',
      '/forgot-password': 'forgot-password',
      '/verify-otp': 'verify-otp',
      '/reset-password': 'reset-password',
      '/details': 'details',
      '/orders': 'orders',
      '/enquiry-form': 'enquiry-form',
    };

    if (map[path]) return map[path];

    // Dynamic product details
    if (path.startsWith('/products/') && path.split('/').length >= 3) {
      return 'productdetails';
    }

    // Dynamic order details
    if (path.startsWith('/orders/') && path.split('/').length >= 3) {
      return 'orderdetails';
    }

    const derived =
      path.replace(/\//g, '').replace(/-/g, '').toLowerCase() || 'home';
    return derived;
  };

  // ✅ Initialize app state and localStorage on mount
  useEffect(() => {
    const initializeApp = async () => {
      console.log('[App] Initializing application...');
      
      // Initialize localStorage flags if not present
      if (!localStorage.getItem('userTypeConfirmed')) {
        localStorage.setItem('userTypeConfirmed', 'false');
        console.log('[App] Initialized userTypeConfirmed flag');
      }

      if (!localStorage.getItem('userType')) {
        localStorage.setItem('userType', 'General');
        console.log('[App] Initialized default userType');
      }

      // Restore session if user was previously logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || !!localStorage.getItem('userId');
      if (isLoggedIn) {
        try {
          console.log('[App] Attempting to restore session...');
          const response = await api.get('/auth/profile');
          if (response.data.success && response.data.user) {
            console.log('[App] Session restored for user:', response.data.user.email);
            dispatch(setUser(response.data.user));
            // If user is authenticated, mark userType as confirmed
            if (response.data.user.userType) {
              localStorage.setItem('userType', response.data.user.userType);
              localStorage.setItem('userTypeConfirmed', 'true');
              console.log('[App] Updated userType from user profile:', response.data.user.userType);
            }
          }
        } catch (error) {
          console.error('[App] Failed to restore session:', error);
          dispatch(logout());
          localStorage.removeItem('userTypeConfirmed');
          localStorage.removeItem('userType');
        }
      } else {
        console.log('[App] No previous session found');
        // If user is not logged in, reset userTypeConfirmed to false
        localStorage.setItem('userTypeConfirmed', 'false');
      }

      setIsInitialLoad(false);
    };

    initializeApp();
  }, [dispatch]);

  const fetchSeoData = useCallback(
    async (path) => {
      const publicPaths = [
        '/',
        '/about',
        '/contact',
        '/faq',
        '/cookiespolicy',
        '/cookies-policy',
        '/disclaimer',
        '/privacy',
        '/returns-and-refunds-policy',
        '/returns',
        '/terms',
        '/products',
        '/cart',
        '/check-status',
        '/details',
        '/forgot-password',
        '/verify-otp',
        '/login',
        '/reset-password',
        '/register',
        '/order-success',
      ];

      const isProductDetails = path.startsWith('/products/') && path.split('/').length >= 3;

      if (!isAuthenticated && !publicPaths.includes(path) && !isProductDetails) {
        setSeoData({
          title: 'Ratan Decor - Login',
          description:
            'Login to access Ratan Decor\'s premium interior solutions.',
        });
        return;
      }

      const pageName = getPageName(path);
      if (lastPathnameRef.current === path) {
        return;
      }
      lastPathnameRef.current = path;

      try {
        const response = await getSeoByPageName(pageName);
        if (response.success && response.data) {
          setSeoData({
            title:
              response.data.title ||
              `Ratan Decor - ${pageName.charAt(0).toUpperCase() +
              pageName.slice(1).replace('-', ' ')}`,
            description:
              response.data.description ||
              `Explore Ratan Decor's ${pageName.replace(
                '-',
                ' '
              )} page for premium decor solutions in Chennai.`,
          });
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(`[App] Error fetching SEO data for ${pageName}:`, error);
        }

        setSeoData({
          title: `Ratan Decor - ${pageName.charAt(0).toUpperCase() +
            pageName.slice(1).replace('-', ' ')}`,
          description: `Explore Ratan Decor's ${pageName.replace(
            '-',
            ' '
          )} page for premium decor solutions in Chennai.`,
        });
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetchSeoData(normalizedPath);
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [normalizedPath, fetchSeoData]);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
        </Helmet>
        {isInitialLoad ? (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <CartProvider>
            <AppRoutes />
            <Toaster position="top-center" reverseOrder={false} />
          </CartProvider>
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;