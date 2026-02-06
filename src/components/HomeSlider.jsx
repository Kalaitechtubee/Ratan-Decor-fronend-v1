// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
// import { apiGet } from '../utils/apiUtils';

// // Default slides fallback - commented out to use only API images
// // const defaultSlides = [
// //   {
// //     image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
// //     title: 'Luxury Interior Design',
// //     subtitle: 'Premium Wood Finishes',
// //     desc: 'Transform your space with our exquisite collection of natural wood veneers and premium finishes.',
// //     cta: 'Explore Collection'
// //   },
// //   {
// //     image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
// //     title: 'Modern Architecture',
// //     subtitle: 'Contemporary Spaces',
// //     desc: 'Discover the perfect blend of functionality and aesthetics with our modern architectural solutions.',
// //     cta: 'View Projects'
// //   },
// //   {
// //     image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80',
// //     title: 'Elegant Living Spaces',
// //     subtitle: 'Timeless Sophistication',
// //     desc: 'Create stunning living environments that reflect your personal style and sophisticated taste.',
// //     cta: 'Get Started'
// //   },
// //   {
// //     image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
// //     title: 'Bespoke Furniture',
// //     subtitle: 'Handcrafted Excellence',
// //     desc: 'Experience the finest craftsmanship with our custom-made furniture pieces designed just for you.',
// //     cta: 'Custom Order'
// //   }
// // ];

// const EnhancedResponsiveSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoplay, setIsAutoplay] = useState(true);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);
//   const [isClient, setIsClient] = useState(false);
//   const [slides, setSlides] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const currentSlideRef = useRef(0);

//   // Detect client-side rendering and fetch slides
//   useEffect(() => {
//     setIsClient(true);
//     fetchSlides();
//   }, []);

//   // Preload images
//   const preloadImages = (imageUrls) => {
//     return Promise.all(
//       imageUrls.map(url => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.onload = () => resolve(url);
//           img.onerror = () => reject(url);
//           img.src = url;
//         });
//       })
//     );
//   };

//   // Fetch slides from API
//   const fetchSlides = async () => {
//     try {
//       setIsLoading(true);
//       const response = await apiGet('/sliders?activeOnly=true');

//       if (response.success && response.sliders && response.sliders.length > 0) {
//         // Transform API response to match component format
//         const transformedSlides = response.sliders.map(slider => ({
//           image: slider.images && slider.images.length > 0
//             ? slider.images[0].url
//             : slider.image || '',
//           title: slider.title || '',
//           subtitle: slider.subtitle || '',
//           desc: slider.desc || '',
//           cta: slider.cta || 'Learn More'
//         }));

//         // Preload all images before setting slides
//         const imageUrls = transformedSlides.map(slide => slide.image).filter(url => url);
//         try {
//           await preloadImages(imageUrls);
//           setSlides(transformedSlides);
//         } catch (preloadError) {
//           console.warn('Some images failed to preload, but continuing with slides:', preloadError);
//           setSlides(transformedSlides);
//         }
//       } else {
//         // No slides available from API
//         setSlides([]);
//       }
//     } catch (error) {
//       console.error('Error fetching slides:', error);
//       // No slides available on error
//       setSlides([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const nextSlide = useCallback(() => {
//     if (isAnimating || slides.length === 0) return;
//     setIsAnimating(true);
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//     setTimeout(() => setIsAnimating(false), 500);
//   }, [isAnimating, slides.length]);

//   const prevSlide = useCallback(() => {
//     if (isAnimating || slides.length === 0) return;
//     setIsAnimating(true);
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     setTimeout(() => setIsAnimating(false), 500);
//   }, [isAnimating, slides.length]);

//   // Auto-play effect
//   useEffect(() => {
//     if (!isAutoplay || !isClient || slides.length <= 1) return;

//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isAutoplay, isClient, slides.length, nextSlide]);

//   const goToSlide = (index) => {
//     if (isAnimating || index === currentSlide) return;
//     setIsAnimating(true);
//     setCurrentSlide(index);
//     setTimeout(() => setIsAnimating(false), 500);
//   };

//   // Touch handlers for mobile swipe - Improved sensitivity
//   const handleTouchStart = (e) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const handleTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;

//     const distance = touchStart - touchEnd;
//     const minSwipeDistance = 30; // Reduced from 50 for better mobile responsiveness
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) nextSlide();
//     if (isRightSwipe) prevSlide();
//   };

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'ArrowLeft') prevSlide();
//       if (e.key === 'ArrowRight') nextSlide();
//       if (e.key === ' ') {
//         e.preventDefault();
//         setIsAutoplay(!isAutoplay);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [nextSlide, prevSlide, isAutoplay]);

//   if (!isClient || isLoading) {
//     return (
//       <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
//         <div className="animate-pulse text-white">Loading...</div>
//       </div>
//     );
//   }

//   // Don't render if no slides
//   if (!slides || slides.length === 0) {
//     return null;
//   }

//   return (
//     <div
//       className="relative w-full h-screen min-h-[500px] max-h-screen overflow-hidden bg-black select-none
//                  sm:min-h-[600px] md:min-h-[700px] lg:min-h-screen"
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       {/* Background Images - Responsive */}
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//             index === currentSlide ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <div
//             className="w-full h-full bg-cover sm:bg-cover md:bg-cover lg:bg-cover
//                        bg-center bg-no-repeat transform scale-105"
//             style={{
//               backgroundImage: `url(${slide.image})`,
//               filter: 'brightness(0.6)',
//               transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
//               transition: 'transform 1000ms ease-out',
//               backgroundPosition: 'center center',
//               backgroundSize: 'cover'
//             }}
//           />
//         </div>
//       ))}

//       {/* Responsive Gradient Overlay - Optimized for all desktop sizes */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20
//                       sm:from-black/70 sm:via-black/30 sm:to-transparent
//                       md:from-black/65 md:via-black/25 md:to-transparent
//                       lg:from-black/60 lg:via-black/20 lg:to-transparent
//                       xl:from-black/55 xl:via-black/15 xl:to-transparent
//                       2xl:from-black/50 2xl:via-black/10 2xl:to-transparent" />

//       {/* Navigation Arrows - Fully Responsive with Progressive Scaling - Hidden on mobile to prevent overlap */}
//       <button
//         onClick={prevSlide}
//         className="hidden sm:flex absolute left-2 md:left-4 lg:left-6 xl:left-8 2xl:left-12 3xl:left-16
//                    top-1/2 -translate-y-1/2 z-30 group touch-manipulation
//                    w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14
//                    items-center justify-center"
//         disabled={isAnimating}
//         aria-label="Previous slide"
//       >
//         <div className="w-full h-full p-1.5 md:p-2 lg:p-2.5 xl:p-3 2xl:p-3.5
//                        bg-white/10 backdrop-blur-sm rounded-full border border-white/20
//                        hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300
//                        group-disabled:opacity-50 group-disabled:cursor-not-allowed
//                        flex items-center justify-center">
//           <ChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" />
//         </div>
//       </button>

//       <button
//         onClick={nextSlide}
//         className="hidden sm:flex absolute right-2 md:right-4 lg:right-6 xl:right-8 2xl:right-12 3xl:right-16
//                    top-1/2 -translate-y-1/2 z-30 group touch-manipulation
//                    w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14
//                    items-center justify-center"
//         disabled={isAnimating}
//         aria-label="Next slide"
//       >
//         <div className="w-full h-full p-1.5 md:p-2 lg:p-2.5 xl:p-3 2xl:p-3.5
//                        bg-white/10 backdrop-blur-sm rounded-full border border-white/20
//                        hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300
//                        group-disabled:opacity-50 group-disabled:cursor-not-allowed
//                        flex items-center justify-center">
//           <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" />
//         </div>
//       </button>

//       {/* Content - Fully Responsive with Proper Desktop Alignment - Adjusted padding to prevent button overlap */}
//       <div className="absolute inset-0 flex items-center justify-start z-20
//                       sm:justify-start md:justify-start lg:justify-start">
//         <div className="w-full px-4 sm:px-14 md:px-16 lg:px-16 xl:px-20 2xl:px-24 3xl:px-28
//                         py-6 sm:py-8 md:py-10 lg:py-12 xl:py-0
//                         pb-20 sm:pb-24 md:pb-28 lg:pb-0">
//           <div className="w-full max-w-7xl mx-auto">
//             <div className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl
//                             mx-auto sm:mx-0 md:mx-0 lg:mx-0">
//               {slides.map((slide, index) => (
//                 <div
//                   key={index}
//                   className={`transition-all duration-700 ease-out ${
//                     index === currentSlide
//                       ? 'opacity-100 translate-x-0'
//                       : 'opacity-0 translate-x-8'
//                   }`}
//                   style={{ display: index === currentSlide ? 'block' : 'none' }}
//                 >
//                   <div className="space-y-1 sm:space-y-1.5 md:space-y-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
//                     <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3
//                                    bg-white/10 backdrop-blur-sm rounded-full text-white/90
//                                    text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg
//                                    font-medium tracking-wide whitespace-nowrap">
//                       {slide.subtitle}
//                     </span>
//                   </div>

//                   <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl
//                                font-bold text-white mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6
//                                leading-[1.1] sm:leading-[1.1] md:leading-[1.1] lg:leading-[1.1] xl:leading-none
//                                break-words hyphens-auto">
//                     {slide.title.split(' ').map((word, i) => (
//                       <span
//                         key={i}
//                         className="inline-block"
//                         style={{
//                           animationDelay: `${i * 0.1}s`,
//                           animation: index === currentSlide
//                             ? 'slideInUp 0.8s ease-out forwards'
//                             : 'none'
//                         }}
//                       >
//                         {word}&nbsp;
//                       </span>
//                     ))}
//                   </h1>

//                   <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl
//                                text-white/90 mb-2.5 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7
//                                max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl
//                                leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed
//                                line-clamp-3 sm:line-clamp-none">
//                     {slide.desc}
//                   </p>

//                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center
//                                 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5
//                                 sm:space-y-0">
//                     <button className="group relative px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3
//                                      xl:px-8 xl:py-3.5 2xl:px-10 2xl:py-4
//                                      bg-white text-black font-semibold rounded-full overflow-hidden
//                                      transition-all duration-300 hover:scale-105 active:scale-95
//                                      hover:shadow-2xl touch-manipulation
//                                      text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg
//                                      w-full sm:w-auto text-center
//                                      min-h-[32px] sm:min-h-[36px] md:min-h-[40px] lg:min-h-[44px] xl:min-h-[48px] 2xl:min-h-[52px]
//                                      flex items-center justify-center">
//                       <span className="relative z-10 whitespace-nowrap">{slide.cta}</span>
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600
//                                     scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
//                     </button>

//                     <button className="flex items-center justify-center sm:justify-start
//                                      gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 text-white/90 hover:text-white
//                                      transition-colors duration-300 touch-manipulation
//                                      w-full sm:w-auto
//                                      min-h-[32px] sm:min-h-[36px] md:min-h-[40px] lg:min-h-[44px]">
//                       <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-medium whitespace-nowrap">Watch Demo</span>
//                       <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12
//                                     rounded-full border border-white/30 flex items-center justify-center
//                                     hover:bg-white/10 active:bg-white/20 transition-colors
//                                     flex-shrink-0">
//                         <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 ml-0.5" />
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar - Fully Responsive with Progressive Scaling - Adjusted for mobile bottom nav */}
//       <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-20 xl:bottom-24 2xl:bottom-28 3xl:bottom-32
//                       left-2 right-2 sm:left-3 sm:right-3 md:left-4 md:right-4 lg:left-6 lg:right-6
//                       xl:left-8 xl:right-8 2xl:left-12 2xl:right-12 3xl:left-16 3xl:right-16 z-30">
//         <div className="w-full max-w-7xl mx-auto">
//           <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5 2xl:mb-4">
//             <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-3.5">
//               <span className="text-white/70 text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-medium whitespace-nowrap">
//                 {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
//               </span>
//               <div className="w-px h-2 sm:h-2.5 md:h-3 lg:h-3.5 xl:h-4 2xl:h-4.5 bg-white/30" />
//               <button
//                 onClick={() => setIsAutoplay(!isAutoplay)}
//                 className="flex items-center gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2 xl:gap-2.5 text-white/70 hover:text-white
//                          transition-colors touch-manipulation active:scale-95
//                          min-h-[24px] sm:min-h-[28px] md:min-h-[32px] lg:min-h-[36px]"
//                 aria-label={isAutoplay ? 'Pause autoplay' : 'Play autoplay'}
//               >
//                 {isAutoplay ? (
//                   <Pause className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 flex-shrink-0" />
//                 ) : (
//                   <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 flex-shrink-0" />
//                 )}
//                 <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg hidden sm:inline whitespace-nowrap">
//                   {isAutoplay ? 'Pause' : 'Play'}
//                 </span>
//               </button>
//             </div>
//           </div>

//           <div className="w-full h-0.5 sm:h-0.5 md:h-0.5 lg:h-1 xl:h-1.5 2xl:h-2 bg-white/20 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-300 ease-out"
//               style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Pagination Dots - Fully Responsive with Progressive Scaling - Adjusted for mobile bottom nav */}
//       <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-3 xl:bottom-4 2xl:bottom-6 3xl:bottom-8
//                       left-1/2 -translate-x-1/2 z-30">
//         <div className="flex gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-3.5">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className="group relative touch-manipulation
//                          w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9
//                          flex items-center justify-center p-0.5 sm:p-0.5"
//               disabled={isAnimating}
//               aria-label={`Go to slide ${index + 1}`}
//             >
//               <div className={`w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 2xl:w-3.5 2xl:h-3.5
//                              rounded-full transition-all duration-300
//                              ${index === currentSlide
//                                ? 'bg-white scale-125'
//                                : 'bg-white/40 hover:bg-white/60 hover:scale-110 active:scale-95'
//                              }`} />
//               {index === currentSlide && (
//                 <div className="absolute inset-0 rounded-full border border-white animate-ping" />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Side Navigation Info - Hidden on mobile and tablet, fully responsive for desktop */}
//       <div className="absolute right-2 md:right-3 lg:right-4 xl:right-6 2xl:right-8 3xl:right-12
//                       top-1/2 -translate-y-1/2 z-30 hidden xl:block">
//         <div className="space-y-1.5 xl:space-y-2 2xl:space-y-2.5 3xl:space-y-3">
//           {slides.map((slide, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`block w-0.5 xl:w-0.5 2xl:w-1 transition-all duration-300 touch-manipulation ${
//                 index === currentSlide
//                   ? 'h-6 xl:h-7 2xl:h-8 3xl:h-10 bg-white'
//                   : 'h-3 xl:h-3.5 2xl:h-4 3xl:h-5 bg-white/30 hover:bg-white/50'
//               }`}
//               disabled={isAnimating}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Swipe Indicator - Mobile only */}
//       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 sm:hidden">
//         <div className="flex items-center space-x-1 text-white/60 text-xs">
//           <span>Swipe</span>
//           <div className="flex space-x-1">
//             <ChevronLeft className="w-3 h-3" />
//             <ChevronRight className="w-3 h-3" />
//           </div>
//         </div>
//       </div>

//       {/* CSS Animations and Enhanced Responsive Styles */}
//       <style>{`
//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: 0.01ms !important;
//           }
//         }

//         /* Mobile Landscape Orientation */
//         @media (max-height: 500px) and (orientation: landscape) {
//           .absolute.inset-0.flex.items-center {
//             align-items: flex-start;
//             padding-top: 1rem;
//           }

//           .absolute.inset-0.flex.items-center > div {
//             padding-top: 0.5rem;
//             padding-bottom: 0.5rem;
//           }
//         }

//         /* Small Mobile Devices */
//         @media (max-width: 374px) {
//           .absolute.inset-0.flex.items-center > div {
//             padding-left: 1rem;
//             padding-right: 1rem;
//           }
//         }

//         /* Tablet Portrait */
//         @media (min-width: 768px) and (max-width: 1023px) and (orientation: portrait) {
//           .absolute.inset-0.flex.items-center {
//             align-items: center;
//           }
//         }

//         /* Tablet Landscape */
//         @media (min-width: 768px) and (max-width: 1023px) and (orientation: landscape) {
//           .absolute.inset-0.flex.items-center {
//             align-items: center;
//           }
//         }

//         /* Desktop Screen Size Optimizations */
//         @media (min-width: 640px) {
//           .slider-content {
//             max-width: 100%;
//           }
//         }

//         @media (min-width: 768px) {
//           .slider-content {
//             max-width: 42rem;
//           }
//         }

//         @media (min-width: 1024px) {
//           .slider-content {
//             max-width: 48rem;
//           }
//         }

//         @media (min-width: 1280px) {
//           .slider-content {
//             max-width: 56rem;
//           }
//         }

//         @media (min-width: 1536px) {
//           .slider-content {
//             max-width: 64rem;
//           }
//         }

//         @media (min-width: 1920px) {
//           .slider-content {
//             max-width: 72rem;
//           }
//         }

//         /* Ensure proper alignment on ultra-wide screens */
//         @media (min-width: 2560px) {
//           .slider-content {
//             max-width: 80rem;
//           }
//         }

//         /* Better touch target sizes for mobile */
//         @media (max-width: 767px) {
//           button, a {
//             min-height: 44px;
//             min-width: 44px;
//           }
//         }

//         /* Improve text readability on small screens */
//         @media (max-width: 639px) {
//           h1 {
//             word-break: break-word;
//             hyphens: auto;
//           }
//         }

//         /* Prevent text overflow on very small screens */
//         @media (max-width: 374px) {
//           .inline-block {
//             font-size: 0.625rem;
//             padding: 0.375rem 0.75rem;
//           }
//         }

//         /* Hide navigation arrows on mobile to prevent text overlap */
//         @media (max-width: 639px) {
//           .hidden.sm\\:flex {
//             display: none !important;
//           }
//         }

//         /* Progressive scaling for navigation arrows */
//         @media (min-width: 640px) and (max-width: 767px) {
//           .absolute.left-2 button,
//           .absolute.right-2 button {
//             width: 2.25rem;
//             height: 2.25rem;
//           }
//         }

//         @media (min-width: 640px) and (max-width: 767px) {
//           .absolute.left-1 button,
//           .absolute.right-1 button {
//             width: 2.25rem;
//             height: 2.25rem;
//           }
//         }

//         @media (min-width: 768px) and (max-width: 1023px) {
//           .absolute.left-1 button,
//           .absolute.right-1 button {
//             width: 2.5rem;
//             height: 2.5rem;
//           }
//         }

//         @media (min-width: 1024px) and (max-width: 1279px) {
//           .absolute.left-1 button,
//           .absolute.right-1 button {
//             width: 3rem;
//             height: 3rem;
//           }
//         }

//         @media (min-width: 1280px) and (max-width: 1535px) {
//           .absolute.left-1 button,
//           .absolute.right-1 button {
//             width: 3.5rem;
//             height: 3.5rem;
//           }
//         }

//         @media (min-width: 1536px) and (max-width: 1919px) {
//           .absolute.left-1 button,
//           .absolute.right-1 button {
//             width: 4rem;
//             height: 4rem;
//           }
//         }

//         /* Smooth scaling transitions for slider elements */
//         button, .absolute button div, span, h1, p {
//           transition-property: width, height, padding, margin, font-size, gap, transform;
//           transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
//           transition-duration: 200ms;
//         }

//         /* Tablet specific adjustments - Ensure content doesn't overlap with navigation arrows */
//         @media (min-width: 640px) and (max-width: 1023px) {
//           /* Ensure content has enough left padding to avoid arrow overlap */
//           .absolute.inset-0.flex.items-center > div {
//             padding-left: 3.5rem !important;
//             padding-right: 3.5rem !important;
//           }

//           /* Ensure buttons are properly sized and positioned */
//           .absolute.left-2,
//           .absolute.right-2 {
//             z-index: 30;
//           }
//         }

//         /* Mobile specific adjustments - Prevent all overlaps */
//         @media (max-width: 639px) {
//           /* Ensure content is centered and has proper padding */
//           .absolute.inset-0.flex.items-center > div {
//             padding-left: 1rem !important;
//             padding-right: 1rem !important;
//             padding-bottom: 5rem !important; /* Space for bottom nav */
//           }

//           /* Ensure text doesn't overflow */
//           h1 {
//             font-size: 1.125rem !important;
//             line-height: 1.2 !important;
//             margin-bottom: 0.75rem !important;
//           }

//           p {
//             font-size: 0.625rem !important;
//             line-height: 1.4 !important;
//             margin-bottom: 1rem !important;
//           }

//           /* Ensure buttons are properly sized */
//           button {
//             min-height: 36px !important;
//             font-size: 0.625rem !important;
//           }
//         }

//         /* Small mobile devices - Extra precautions */
//         @media (max-width: 374px) {
//           .absolute.inset-0.flex.items-center > div {
//             padding-left: 0.75rem !important;
//             padding-right: 0.75rem !important;
//           }

//           h1 {
//             font-size: 1rem !important;
//           }

//           p {
//             font-size: 0.5625rem !important;
//           }
//         }

//         /* Landscape mobile - Adjust spacing */
//         @media (max-width: 767px) and (orientation: landscape) {
//           .absolute.inset-0.flex.items-center > div {
//             padding-top: 1rem !important;
//             padding-bottom: 4rem !important;
//           }

//           h1 {
//             font-size: 1rem !important;
//             margin-bottom: 0.5rem !important;
//           }

//           p {
//             font-size: 0.625rem !important;
//             margin-bottom: 0.75rem !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EnhancedResponsiveSlider;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../utils/apiUtils";

const EnhancedResponsiveSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentSlideRef = useRef(0);

  // Detect client-side rendering and fetch slides
  useEffect(() => {
    setIsClient(true);
    fetchSlides();
  }, []);

  // Preload images
  const preloadImages = (imageUrls) => {
    return Promise.all(
      imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(url);
          img.src = url;
        });
      })
    );
  };

  // Fetch slides from API
  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const response = await apiGet("/sliders?activeOnly=true");

      if (response.success && response.sliders && response.sliders.length > 0) {
        // Transform API response to match component format
        const transformedSlides = response.sliders.map((slider) => ({
          image:
            slider.images && slider.images.length > 0
              ? slider.images[0].url
              : slider.image || "",
          title: slider.title || "",
          subtitle: slider.subtitle || "",
          desc: slider.desc || "",
          cta: slider.cta || "Learn More",
          ctaUrl: slider.ctaUrl || "/products",
        }));

        // Preload all images before setting slides
        const imageUrls = transformedSlides
          .map((slide) => slide.image)
          .filter((url) => url);
        try {
          await preloadImages(imageUrls);
          setSlides(transformedSlides);
        } catch (preloadError) {
          console.warn(
            "Some images failed to preload, but continuing with slides:",
            preloadError
          );
          setSlides(transformedSlides);
        }
      } else {
        // No slides available from API
        setSlides([]);
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
      // No slides available on error
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoplay || !isClient || slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, isClient, slides.length, nextSlide]);

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Touch handlers for mobile swipe - Improved sensitivity
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 30; // Reduced from 50 for better mobile responsiveness
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoplay(!isAutoplay);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isAutoplay]);

  const handleCtaClick = (ctaUrl) => {
    if (!ctaUrl) return;
    if (ctaUrl.startsWith("http://") || ctaUrl.startsWith("https://")) {
      // For external URLs, navigate in the same tab (replace current page)
      window.location.href = ctaUrl;
    } else {
      // For internal routes, use React Router navigate
      navigate(ctaUrl);
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if no slides
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div
      className="home-hero-slider relative w-full overflow-hidden bg-black select-none
                 h-[75vh] sm:h-[75vh] md:h-[85vh] lg:h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images - Responsive */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
              filter: "brightness(0.6)",
              transform: index === currentSlide ? "scale(1)" : "scale(1.05)",
              transition: "transform 1000ms ease-out",
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          />
        </div>
      ))}

      {/* Responsive Gradient Overlay - Mobile: top-to-bottom, Desktop: left-to-right */}
      <div
        className="absolute inset-0 
                      bg-gradient-to-t from-black/95 via-black/70 to-transparent
                      sm:from-black/70 sm:via-black/30 sm:to-transparent
                      md:from-black/65 md:via-black/25 md:to-transparent
                      lg:from-black/60 lg:via-black/20 lg:to-transparent
                      xl:from-black/55 xl:via-black/15 xl:to-transparent
                      2xl:from-black/50 2xl:via-black/10 2xl:to-transparent"
      />

      {/* Content Container - Mobile: bottom-aligned, Desktop: center-left-aligned */}
      <div className="absolute inset-0 flex items-end lg:items-center justify-start z-20">
        <div
          className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24
                        pb-20 sm:pb-24 md:pb-32 lg:pb-0 
                        pt-0 sm:pt-0 md:pt-0 lg:pt-0"
        >
          <div className="w-full max-w-7xl mx-auto">
            <div
              className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
                            2xl:max-w-3xl mx-0"
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-out ${
                    index === currentSlide
                      ? "opacity-100 translate-y-0 lg:translate-y-0 lg:translate-x-0"
                      : "opacity-0 translate-y-4 lg:translate-y-0 lg:translate-x-8"
                  }`}
                  style={{ display: index === currentSlide ? "block" : "none" }}
                >
                  <div className="space-y-1 sm:space-y-1.5 md:space-y-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
                    <span
                      className="inline-block px-2 py-[0.4rem] sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3
                                   bg-white/10 backdrop-blur-sm rounded-full text-white/90 
                                   text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg
                                   font-medium tracking-wide whitespace-nowrap"
                    >
                      {slide.subtitle}
                    </span>
                  </div>

                  <h1
                    className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl
                               font-bold text-white mb-2 sm:mb-2.5 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6 
                               leading-[1.4] sm:leading-[1.1] md:leading-[1.1] lg:leading-[1.1] xl:leading-none
                               break-words hyphens-auto"
                  >
                    {slide.title}
                  </h1>

                  <p
                    className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl 
                               text-white/90 mb-2.5 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 
                               max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl
                               leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed
                               line-clamp-3 sm:line-clamp-none"
                  >
                    {slide.desc}
                  </p>

                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center 
                                gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5
                                sm:space-y-0"
                  >
                    <button
                      onClick={() => handleCtaClick(slide.ctaUrl)}
                      className="group relative px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3
                                     xl:py-3.5 2xl:py-4
                                     bg-white text-black font-semibold rounded-full overflow-hidden
                                     transition-all duration-300 hover:scale-105 active:scale-95
                                     hover:shadow-2xl touch-manipulation
                                     text-xs sm:text-sm md:text-base lg:text-base xl:text-lg
                                     w-auto sm:w-auto text-center
                                     min-h-[32px] sm:min-h-[36px] md:min-h-[40px] lg:min-h-[44px] xl:min-h-[48px] 2xl:min-h-[52px]
                                     flex items-center justify-center"
                    >
                      <span className="relative z-10 whitespace-nowrap">
                        {slide.cta}
                      </span>
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-[#ff4747] to-[#dc2626]
                                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Perfect for Mobile & Desktop */}
      <div
        className="absolute 
                bottom-10              
                sm:bottom-12 
                md:bottom-14 
                lg:bottom-20          
                xl:bottom-24 
                2xl:bottom-28 
                left-4 right-4 
                sm:left-6 sm:right-6 
                md:left-8 md:right-8 
                lg:left-12 lg:right-12 
                xl:left-16 xl:right-16 
                2xl:left-20 2xl:right-20 
                z-30 
                pointer-events-none"
      >
        <div className="max-w-7xl mx-auto pointer-events-auto">
          {/* Slide Counter */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/80 text-sm sm:text-base lg:text-lg font-medium tracking-wider">
              {String(currentSlide + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Progress Line */}
          <div className="w-full h-0.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-md"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* CSS Animations and Enhanced Responsive Styles */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Mobile Landscape Orientation */
        @media (max-height: 500px) and (orientation: landscape) {
          .absolute.inset-0.flex {
            align-items: flex-start;
            padding-top: 1rem;
          }
          
          .absolute.inset-0.flex > div {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 374px) {
          .absolute.inset-0.flex > div {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
        }

        /* Mobile specific adjustments - Prevent all overlaps */
        @media (max-width: 639px) {
          /* Ensure content is centered and has proper padding */
          .absolute.inset-0.flex > div {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-bottom: 5rem !important; /* Space for bottom nav */
          }
          
          /* Ensure text doesn't overflow - Increased sizes for mobile */
          .home-hero-slider h1 {
            font-size: 1.75rem !important;
            line-height: 1.2 !important;
            margin-bottom: 0.75rem !important;
          }
          
          .home-hero-slider p {
            font-size: 1rem !important;
            line-height: 1.5 !important;
            margin-bottom: 1.5rem !important;
          }
          
          /* Ensure buttons are properly sized */
          .home-hero-slider button {
            min-height: 44px !important;
            font-size: 0.875rem !important;
            margin-bottom: 0.5rem !important;
          }
        }

        /* Landscape mobile - Adjust spacing */
        @media (max-width: 767px) and (orientation: landscape) {
          .absolute.inset-0.flex > div {
            padding-top: 1rem !important;
            padding-bottom: 4rem !important;
          }
          
          .home-hero-slider h1 {
            font-size: 1.125rem !important;
            line-height: 1.4 !important;
            margin-bottom: 0.5rem !important;
          }
          
          .home-hero-slider p {
            font-size: 0.875rem !important;
            margin-bottom: 0.75rem !important;
          }
        }

        /* Tablet Portrait */
        @media (min-width: 768px) and (max-width: 1023px) and (orientation: portrait) {
          .absolute.inset-0.flex {
            align-items: flex-end;
          }
        }

        /* Tablet Landscape */
        @media (min-width: 768px) and (max-width: 1023px) and (orientation: landscape) {
          .absolute.inset-0.flex {
            align-items: center;
          }
        }

        /* Desktop Screen Size Optimizations */
        @media (min-width: 640px) {
          .slider-content {
            max-width: 100%;
          }
        }

        @media (min-width: 768px) {
          .slider-content {
            max-width: 42rem;
          }
        }

        @media (min-width: 1024px) {
          .slider-content {
            max-width: 48rem;
          }
          
          /* Desktop - content at left center */
          .absolute.inset-0.flex {
            align-items: center !important;
          }
        }

        @media (min-width: 1280px) {
          .slider-content {
            max-width: 56rem;
          }
        }

        @media (min-width: 1536px) {
          .slider-content {
            max-width: 64rem;
          }
        }

        @media (min-width: 1920px) {
          .slider-content {
            max-width: 72rem;
          }
          
          h1 {
            font-size: 4rem !important;
          }
          
          p {
            font-size: 1.75rem !important;
          }
        }

        /* Ensure proper alignment on ultra-wide screens */
        @media (min-width: 2560px) {
          .slider-content {
            max-width: 80rem;
          }
        }

        /* Better touch target sizes for mobile */
        @media (max-width: 767px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Improve text readability on small screens */
        @media (max-width: 639px) {
          h1 {
            word-break: break-word;
            hyphens: auto;
          }
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
};

export default EnhancedResponsiveSlider;
