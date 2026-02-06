import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaArrowRight } from 'react-icons/fa';

const VideoContentSection = ({ onOpenVideoCallPopup }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 bg-#ffffff flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
      {/* Left Side Content */}
      <div className="w-full lg:w-1/2 animate-fade-in-left">
        <div className="relative">
          {/* Decorative element - Mobile adjustment */}
          <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-12 sm:w-16 h-12 sm:h-16 bg-primary opacity-10 rounded-full blur-xl"></div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight relative">
            Discover Our
            <span className="block text-primary relative mt-1">
              Experience Centre

              {/* Mobile-specific underline adjustment */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-16 sm:w-24 h-1 bg-primary rounded-full"></div>
            </span>
          </h2>
        </div>

        {/* Mobile text size and spacing adjustments */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-md">
          Step inside our store and explore a wide range of plywood, mica, veneers, doors, louvers, and decorative panels — all under one roof.
          Designed to help homeowners, architects, interior designers, and dealers choose the right materials with confidence.
        </p>

        {/* Updated button layout - Shop on Call and View Products */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onOpenVideoCallPopup}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-title font-semibold rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <FaVideo className="text-white" />
              Shop on Call
            </span>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary text-primary font-title font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto group"
          >
            <span className="flex items-center justify-center gap-2">
              View Products
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      {/* Right Side Video */}
      <div className="w-full lg:w-1/2">
        {/* Mobile height adjustment */}
        <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary to-red-600 transform hover:scale-105 transition-all duration-500">
          <video
            className="w-full h-full object-cover"
            controls={isPlaying}
            poster="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&h=400&fit=crop&crop=center"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <div
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer group"
              onClick={handlePlayVideo}
            >
              <div className="relative">
                {/* Mobile play button size adjustment */}
                <div className="absolute inset-0 w-16 sm:w-20 h-16 sm:h-20 border-2 border-white rounded-full animate-ping opacity-30"></div>
                <div className="absolute inset-2 w-12 sm:w-16 h-12 sm:h-16 border-2 border-white rounded-full animate-ping opacity-50 animation-delay-150"></div>

                {/* Play button - Mobile size */}
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Mobile text positioning and size adjustments */}
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                <h3 className="text-white font-title font-bold text-lg sm:text-xl mb-1 sm:mb-2 text-center sm:text-left">
                  Behind the Scenes
                </h3>
                <p className="text-white text-xs sm:text-sm font-poppins opacity-90 text-center sm:text-left">
                  Watch our master craftspeople bring visions to life
                </p>
              </div>
            </div>
          )}

          {/* Decorative corner elements - Mobile size adjustment */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-6 sm:top-8 right-6 sm:right-8 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full opacity-40"></div>
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full opacity-60"></div>
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full opacity-40"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoContentSection;