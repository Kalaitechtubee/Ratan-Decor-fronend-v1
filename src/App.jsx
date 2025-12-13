import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import AppRoutes from './routes/AppRoutes';
import { getSeoByPageName } from './features/seo/api/seoApi';
import { useAuth } from './features/auth/hooks/useAuth';
import { CartProvider } from './features/cart';
import { useDispatch } from 'react-redux';
import { setUser } from './features/auth/authSlice';
import api from './services/axios';

function App() {
  const dispatch = useDispatch();
  const [seoData, setSeoData] = useState({
    title: 'Ratan Decor - Premium Interior Solutions',
    description:
      'Explore Ratan Decor’s premium interior products for Residential, Commercial, and Modular Kitchen spaces in Chennai.',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const location = useLocation();
  const lastPathnameRef = useRef(null);
  const timeoutRef = useRef(null);
  const { isAuthenticated, user } = useAuth();

  // Normalize path to lowercase for consistency
  const normalizedPath = location.pathname.toLowerCase();

  const getPageName = (path) => {
    const map = {
      '/': 'home',
      '/about': 'about',
      '/contact': 'contact',
      '/faq': 'faq',
      '/cookiespolicy': 'cookiespolicy',
      '/cookies-policy': 'cookiespolicy', // Handle possible hyphen variation
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
      '/orders': 'orders', // SEO for order listing page
    };

    // Direct match
    if (map[path]) return map[path];

    // Dynamic product details (/products/:id)
    if (path.startsWith('/products/') && path.split('/').length >= 3) {
      return 'productdetails';
    }

    // Dynamic order details (/orders/:id)
    if (path.startsWith('/orders/') && path.split('/').length >= 3) {
      return 'orderdetails';
    }

    // Fallback: derive from path
    const derived =
      path.replace(/\//g, '').replace(/-/g, '').toLowerCase() || 'home';
    return derived;
  };

  //  Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const response = await api.get('/auth/profile');
          dispatch(
            setUser({
              ...response.data.user,
              token,
            })
          );
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('authState');
        }
      }
      setIsInitialLoad(false);
    };

    restoreSession();
  }, [dispatch, user]);

  const fetchSeoData = useCallback(
    async (path) => {
      // Expanded list of public paths (normalized to lowercase)
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

      // Include dynamic product details routes
      const isProductDetails = path.startsWith('/products/') && path.split('/').length >= 3;

      // For non-public paths when unauthenticated, use default login SEO
      if (!isAuthenticated && !publicPaths.includes(path) && !isProductDetails) {
        setSeoData({
          title: 'Ratan Decor - Login',
          description:
            'Login to access Ratan Decor’s premium interior solutions.',
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
              `Explore Ratan Decor’s ${pageName.replace(
                '-',
                ' '
              )} page for premium decor solutions in Chennai.`,
          });
        } else {
          setSeoData({
            title: `Ratan Decor - ${pageName.charAt(0).toUpperCase() +
              pageName.slice(1).replace('-', ' ')}`,
            description: `Explore Ratan Decor’s ${pageName.replace(
              '-',
              ' '
            )} page for premium decor solutions in Chennai.`,
          });
        }
      } catch (error) {
        console.error(`Error fetching SEO data for ${pageName}:`, error);
        setSeoData({
          title: `Ratan Decor - ${pageName.charAt(0).toUpperCase() +
            pageName.slice(1).replace('-', ' ')}`,
          description: `Explore Ratan Decor’s ${pageName.replace(
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
          </CartProvider>
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;