import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import OrderDetails from '../features/orders/OrderDetails';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import VerifyOTPPage from '../features/auth/pages/VerifyOTPPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import DetailsPage from '../features/auth/pages/DetailsPage';
import CheckStatus from '../features/auth/pages/CheckStatus';
import ProductPage from '../features/product/pages/ProductPage';
import ProductDetail from '../features/product/pages/ProductDetail';
import { CartList } from '../features/cart';
import { ProfilePage } from '../features/profile';
import Home from '../Pages/Home';
import { Checkout } from '../features/checkout';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import FAQ from '../Pages/FAQ';
import CookiesPolicy from '../Pages/CookiesPolicy';
import Disclaimer from '../Pages/Disclaimer';
import Privacy from '../Pages/Privacy';
import ReturnsAndRefundsPolicy from '../Pages/Returns and refunds policy';
import EnquiryFormPage from '../features/OrderEnquiryForm/EnquiryFormPage';
import Terms from '../Pages/Terms';
import useScrollToTop from '../app/useScrollToTop';

function PrivateRoute({ children, requiresUserType }) {
  const { isAuthenticated, userType, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const role = (user?.role || '').toString().toLowerCase();
  const isTradeRole = role === 'architect' || role === 'dealer';

  if (isTradeRole && user?.status?.toUpperCase() !== 'APPROVED') {
    return <Navigate to="/check-status" replace />;
  }

  return children;
}

function OrderDetailsWrapper() {
  const { id } = useParams();
  const { user } = useAuth();
  const staffRoles = ['Admin', 'Manager', 'Sales', 'Support'];

  if (!user) return <Navigate to="/login" replace />;
  if (staffRoles.includes(user.role)) {
    return <OrderDetails />;
  }
  return <OrderDetails />;
}

function AppRoutes() {
  useScrollToTop();
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Public Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/details" element={<DetailsPage />} />
      <Route path="/check-status" element={<CheckStatus />} />

      {/* Public Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/cookies-policy" element={<CookiesPolicy />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/returns-and-refunds-policy" element={<ReturnsAndRefundsPolicy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Products */}
      <Route path="/products" element={<ProductPage />} />
      <Route path="/products/category/:categorySlug" element={<ProductPage />} />
      <Route path="/products/category/:categorySlug/:subSlug" element={<ProductPage />} />

      <Route path="/products/:id/:slug?" element={<ProductDetail />} />
      <Route path="/enquiry-form" element={<EnquiryFormPage />} />

      {/* Cart */}
      <Route path="/cart" element={<CartList />} />

      {/* Private Pages */}
      <Route path="/profile" element={<PrivateRoute requiresUserType><ProfilePage /></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute requiresUserType><Checkout /></PrivateRoute>} />
      <Route path="/orders/:id" element={<PrivateRoute requiresUserType><OrderDetailsWrapper /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
