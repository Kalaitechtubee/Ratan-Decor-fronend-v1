import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DetailsForm from '../components/DetailsForm';
import logo from '../../../assets/images/ratan-decor.png';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section - Image with Content */}
      <div className="hidden lg:flex lg:w-1/4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-start p-5 text-white">
          <div className="space-y-4">
          <h1 className="text-2xl font-bold leading-tight">
            Create the Home You've Always Imagined
          </h1>
            <p className="text-md text-white/90 max-w-lg italic">
              Complete your profile and let us design interiors and kitchens that perfectly match your style.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Details Form */}
      <div className="w-full lg:w-3/4 flex flex-col bg-white px-4 sm:px-6 lg:px-8">
        {/* Top Row with Logo and Back to Home Button */}
        <div className="w-full flex justify-between items-center py-10">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Ratan Decor Logo"
              className="h-7 transition-transform duration-300 hover:scale-105"
            />
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-1 text-sm font-light text-[#000000] hover:text-[#333333] transition-colors hover:underline"
          >
            <span>Back to Home</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1} />
          </button>
        </div>
        {/* Centered Form */}
        <div className="flex-1 flex items-center justify-center">
          <DetailsForm />
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;