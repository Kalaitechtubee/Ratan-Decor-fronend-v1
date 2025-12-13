import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ForgotPassword from '../components/ForgotPassword';

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ForgotPassword />
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;