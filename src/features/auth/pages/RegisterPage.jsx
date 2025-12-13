import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/ratan-decor.png';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section - Image with Content */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80")',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-start p-12 text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Transform Your Home Into Your Dream Space
            </h1>
            <p className="text-lg text-white/90 max-w-lg italic">
              Join us to explore premium interior design and modular kitchen solutions for your home — elegant, functional, reliable.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="w-full lg:w-2/5 flex flex-col bg-white px-4 sm:px-6 lg:px-8">
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
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;