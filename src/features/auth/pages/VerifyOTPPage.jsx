import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import VerifyOTP from '../components/VerifyOTP';

function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <VerifyOTP />
      <Footer />
    </div>
  );
}

export default VerifyOTPPage;