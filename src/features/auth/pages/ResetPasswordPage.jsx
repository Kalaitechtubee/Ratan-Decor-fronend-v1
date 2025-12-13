import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ResetPassword from '../components/ResetPassword';

function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ResetPassword />
      <Footer />
    </div>
  );
}

export default ResetPasswordPage;