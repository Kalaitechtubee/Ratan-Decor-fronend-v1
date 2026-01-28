import React from 'react';
import FeatureImg1 from "../../assets/images/FeaturesSection1.png";
import FeatureImg2 from "../../assets/images/FeaturesSection2.png";

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Expert Guidance for the Right Material Selection",
      description: "Our team helps homeowners and professionals choose the right plywood, mica, veneers, and panels based on design, budget, and application needs.",
      image: FeatureImg1,
    },
    {
      id: 2,
      title: "Reliable Supply for Projects & Bulk Orders",
      description: "We ensure consistent availability, timely delivery, and dependable support for individual purchases, large projects, and dealer requirements.",
      image: FeatureImg2,
    }
  ];

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="group relative transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
          >
            {/* Main Card with Gradient Background */}
            <div className="relative bg-gradient-to-br from-[#ff4747] via-[#ff4747] to-[#e63946] rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden min-h-[320px] sm:min-h-[340px] lg:min-h-[320px] flex flex-col justify-end lg:justify-center pt-32 sm:pt-40 lg:pt-10 shadow-2xl shadow-[#ff4747]/20">

              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full -translate-y-32 sm:-translate-y-48 translate-x-32 sm:translate-x-48 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-white rounded-full translate-y-24 sm:translate-y-32 -translate-x-24 sm:-translate-x-32 group-hover:scale-110 transition-transform duration-700 delay-100"></div>
              </div>

              {/* Modern Geometric Decorations */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-16 sm:w-20 h-16 sm:h-20 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 border-2 border-white rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
                  <div className="absolute inset-2 border-2 border-white rounded-xl -rotate-12 group-hover:-rotate-45 transition-transform duration-700 delay-100"></div>
                </div>
              </div>

              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300 hidden lg:block">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-white rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="absolute inset-2 border-2 border-white rounded-full group-hover:scale-90 transition-transform duration-500 delay-75"></div>
                </div>
              </div>

              {/* Content Container */}
              <div className="relative z-20 ml-0 lg:ml-28 text-left pr-2 lg:pr-0">
                <div className="mb-4 sm:mb-6">
                  <div className="w-12 sm:w-16 h-1 bg-white rounded-full mb-3 sm:mb-4 group-hover:w-16 sm:group-hover:w-20 transition-all duration-300 lg:mx-0"></div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 leading-tight group-hover:text-white/95 transition-colors duration-300 px-2 lg:px-0 lg:ml-16">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-white/90 leading-relaxed text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors duration-300 px-2 lg:px-0 lg:ml-20">
                  {feature.description}
                </p>
              </div>

              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            </div>

            {/* Enhanced Circular Image Container - Mobile Positioned Perfectly */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-6 sm:top-8 lg:left-8 lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 z-30">
              <div className="relative group-hover:scale-105 transition-transform duration-500">
                {/* Animated Ring */}
                <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-r from-white/30 to-white/10 blur-sm group-hover:from-white/50 group-hover:to-white/20 transition-all duration-500"></div>

                {/* Main Image Container */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-44 lg:h-44 rounded-full border-4 border-white bg-white shadow-2xl shadow-black/20 overflow-hidden group-hover:shadow-white/20 transition-shadow duration-500 flex-shrink-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-contain p-3 sm:p-4 lg:p-8 transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-4 sm:w-6 h-4 sm:h-6 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500 delay-200"></div>
                <div className="absolute -bottom-2 -left-2 w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 group-hover:-translate-x-1 transition-all duration-500 delay-300"></div>
              </div>
            </div>

            {/* Feature Number Badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-40">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;