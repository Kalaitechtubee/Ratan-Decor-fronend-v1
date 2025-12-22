import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Cost Effective Services",
      description: "Delivering exceptional value through strategic solutions that maximize your return on investment while maintaining the highest quality standards.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "100% Your Satisfaction",
      description: "Our commitment to excellence ensures complete client satisfaction through personalized service and attention to every detail of your project.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Premium Quality Design",
      description: "Access a curated selection of world-class designs and materials that transform ordinary spaces into extraordinary experiences.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=400&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Sustainable Solutions",
      description: "Eco-friendly approaches and materials that respect the environment while delivering stunning aesthetic results for your home.",
      image: "https://static.vecteezy.com/system/resources/previews/022/819/323/large_2x/interior-background-of-living-room-with-stucco-wall-vase-with-twig-on-decorative-accent-coffee-table-empty-mock-up-wall-and-wooden-flooring-pendant-light-modern-home-decor-ai-generated-free-photo.jpeg"
    }
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-4 max-w-7xl mx-auto">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
        }}
        style={{
          "--swiper-pagination-color": "#ff4747",
          "--swiper-pagination-bullet-inactive-color": "#ff4747",
          "--swiper-pagination-bullet-inactive-opacity": "0.3",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-horizontal-gap": "6px"
        }}
        className="pb-16"
      >
        {features.map((feature, index) => (
          <SwiperSlide key={feature.id} className="h-auto">
            <div
              className="group relative transform transition-all duration-500 hover:-translate-y-2 h-full"
            >
              {/* Main Card with Gradient Background */}
              <div className="relative bg-gradient-to-br from-[#ff4747] via-[#ff4747] to-[#e63946] rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden min-h-[280px] sm:min-h-[320px] flex flex-col justify-center shadow-2xl shadow-[#ff4747]/20 h-full">

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

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-white rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="absolute inset-2 border-2 border-white rounded-full group-hover:scale-90 transition-transform duration-500 delay-75"></div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="relative z-20 ml-20 sm:ml-24 lg:ml-28">
                  <div className="mb-4 sm:mb-6">
                    <div className="w-12 sm:w-16 h-1 bg-white rounded-full mb-4 sm:mb-6 group-hover:w-16 sm:group-hover:w-20 transition-all duration-300"></div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight group-hover:text-white/95 transition-colors duration-300 ml-12 sm:ml-16">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors duration-300 ml-16 sm:ml-20">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
              </div>

              {/* Enhanced Circular Image Container */}
              <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 z-30">
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  {/* Animated Ring */}
                  <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-r from-white/30 to-white/10 blur-sm group-hover:from-white/50 group-hover:to-white/20 transition-all duration-500"></div>

                  {/* Main Image Container */}
                  <div className="relative w-32 h-32 sm:w-40 lg:w-44 sm:h-40 lg:h-44 rounded-full border-4 border-white bg-white shadow-2xl shadow-black/20 overflow-hidden group-hover:shadow-white/20 transition-shadow duration-500">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                  <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturesSection;