// import React from 'react';
// import { motion } from 'framer-motion';
// import Footer from '../components/Footer';
// import Navbar from '../components/Navbar';

// // Animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.2 },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: { duration: 0.5 },
//   },
// };

// const slideInFromLeft = {
//   hidden: { x: -100, opacity: 0 },
//   visible: {
//     x: 0,
//     opacity: 1,
//     transition: { duration: 0.6 },
//   },
// };

// const slideInFromRight = {
//   hidden: { x: 100, opacity: 0 },
//   visible: {
//     x: 0,
//     opacity: 1,
//     transition: { duration: 0.6 },
//   },
// };

// const scaleUp = {
//   hidden: { scale: 0.9, opacity: 0 },
//   visible: {
//     scale: 1,
//     opacity: 1,
//     transition: { duration: 0.5 },
//   },
// };

// const About = () => {
//   return (
//     <div className="bg-white min-h-screen font-roboto">
//       <Navbar />

//       {/* Hero Section - Two Column Layout */}
//       <motion.section
//         className="min-h-[calc(100vh-6rem)] mt-20 flex items-center px-4"
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         <div className="max-w-full mx-auto w-full flex flex-col lg:flex-row items-center justify-between">
//           {/* Left Column - Visual Content */}
//           <motion.div className="w-full lg:w-1/2 relative mb-8 lg:mb-0" variants={slideInFromLeft}>
//             <div className="relative w-full h-0 pb-[56.25%] lg:pb-[75%]">
//               <motion.img
//                 src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
//                 alt="Interior Design Showcase"
//                 className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
//                 whileHover={{ scale: 1.03 }}
//                 transition={{ duration: 0.3 }}
//                 loading="lazy"
//               />
//               {/* Circular Overlay in Bottom Right */}
//               <motion.div
//                 className="absolute bottom-4 right-4 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
//                 whileHover={{ rotate: 10 }}
//               >
//                 <img
//                   src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
//                   alt="Close-up of Teak Door Frame"
//                   className="w-full h-full object-cover"
//                   loading="lazy"
//                 />
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* Right Column - Content */}
//           <motion.div
//             className="w-full lg:w-1/2 bg-white p-4 sm:p-6 lg:p-8 flex items-center"
//             variants={slideInFromRight}
//           >
//             <motion.div
//               className="max-w-xl w-full"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               {/* Company Tag */}
//               <motion.div
//                 className="inline-block bg-primary text-white px-5 py-2 rounded-lg text-sm sm:text-base font-semibold mb-6"
//                 variants={itemVariants}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 About Ratan Decor
//               </motion.div>

//               {/* Main Heading */}
//               <motion.h1
//                 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
//                 variants={itemVariants}
//               >
//                 Why Choose Our
//                 <span className="text-primary"> Interior Design</span> Services
//               </motion.h1>

//               {/* Introductory Paragraph */}
//               <motion.p
//                 className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed"
//                 variants={itemVariants}
//               >
//                 At Ratan Decor, we deliver premium interior design solutions with a focus on high-quality plywood, mica sheets, and teak frames. Our dedicated team ensures your space is transformed with elegance, functionality, and unmatched craftsmanship.
//               </motion.p>

//               {/* Feature Blocks */}
//               <motion.div
//                 className="space-y-6 mb-8"
//                 variants={containerVariants}
//               >
//                 {/* Quality Standards */}
//                 <motion.div
//                   className="flex items-center space-x-4"
//                   variants={itemVariants}
//                   whileHover={{ x: 5 }}
//                 >
//                   <motion.div
//                     className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
//                     whileHover={{ rotate: 360 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <svg
//                       className="w-5 h-5 sm:w-6 sm:h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                   </motion.div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Quality Standards Product</h3>
//                     <p className="text-gray-600 text-xs sm:text-sm">Premium plywood and teak craftsmanship</p>
//                   </div>
//                 </motion.div>

//                 {/* Cost Effective */}
//                 <motion.div
//                   className="flex items-center space-x-4"
//                   variants={itemVariants}
//                   whileHover={{ x: 5 }}
//                 >
//                   <motion.div
//                     className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0"
//                     whileHover={{ scale: 1.1 }}
//                   >
//                     <svg
//                       className="w-5 h-5 sm:w-6 sm:h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//                       />
//                     </svg>
//                   </motion.div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Cost Effective Services</h3>
//                     <p className="text-gray-600 text-xs sm:text-sm">Best value for your investment</p>
//                   </div>
//                 </motion.div>
//               </motion.div>

//               {/* Additional Content */}
//               <motion.p
//                 className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed"
//                 variants={itemVariants}
//               >
//                 Our commitment to excellence ensures that every project, from residential to commercial, is executed with precision and creativity, using high-quality materials like waterproof plywood and designer mica sheets.
//               </motion.p>

//               {/* CTA Button and Feature Tag */}
//               <motion.div
//                 className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
//                 variants={itemVariants}
//               >
//                 <motion.a
//                   href="/products"
//                   className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#e03e3e] focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300 transform hover:scale-105"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   aria-label="Explore Ratan Decor Products"
//                 >
//                   Explore Products
//                 </motion.a>

//                 <motion.div
//                   className="border-2 border-dashed border-primary bg-gray-50 px-5 py-2 rounded-lg flex items-center space-x-2"
//                   whileHover={{ scale: 1.03 }}
//                 >
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   <span className="text-xs sm:text-sm font-medium text-gray-700">Premium Interior Solutions</span>
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Why We Are Different Section */}
//       <motion.section
//         className="container mx-auto px-4 py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-100px' }}
//         variants={containerVariants}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div className="text-center mb-12" variants={itemVariants}>
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Why We Are Different</h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//               Discover what sets Ratan Decor apart in delivering exceptional interior solutions
//             </p>
//           </motion.div>

//           <div className="flex flex-col lg:flex-row items-center gap-16">
//             <motion.div className="lg:w-1/2" variants={slideInFromLeft}>
//               <div className="relative">
//                 <motion.img
//                   src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                   alt="Ratan Decor Showroom"
//                   className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl border border-gray-200"
//                   whileHover={{ scale: 1.03 }}
//                   loading="lazy"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
//               </div>
//             </motion.div>

//             <motion.div className="lg:w-1/2 space-y-8" variants={slideInFromRight}>
//               <motion.div variants={itemVariants}>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Tailored User Experience</h3>
//                 <p className="text-base text-gray-600 leading-relaxed">
//                   Our dynamic user selection system ensures you see only the most relevant products for your needs, whether you're a homeowner, architect, or dealer.
//                 </p>
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Multiple Enquiry Options</h3>
//                 <p className="text-base text-gray-600 leading-relaxed">
//                   We offer three convenient enquiry methods per product—direct call, WhatsApp, and email forms—making it easy to get the information you need.
//                 </p>
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">AR Technology Integration</h3>
//                 <p className="text-base text-gray-600 leading-relaxed">
//                   Our upcoming Augmented Reality feature will let you visualize our plywood, mica, and veneer products in your space, revolutionizing your design process.
//                 </p>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Features Grid Section */}
//       <motion.section
//         className="container mx-auto px-4 py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-100px' }}
//         variants={containerVariants}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div className="text-center mb-12" variants={itemVariants}>
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Specializations</h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//               Tailored solutions for every type of interior design project
//             </p>
//           </motion.div>

//           <div className="flex justify-center">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl">
//               {[
//                 {
//                   icon: '🏡',
//                   title: 'Residential Solutions',
//                   description: 'Beautiful and functional designs for homes and apartments with premium materials',
//                 },
//                 {
//                   icon: '🏢',
//                   title: 'Commercial Spaces',
//                   description: 'Professional interiors for businesses with durable and aesthetic solutions',
//                 },
//                 {
//                   icon: '🍽️',
//                   title: 'Modular Kitchens',
//                   description: 'Smart, functional kitchen designs with waterproof plywood and premium finishes',
//                 },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-primary group"
//                   variants={itemVariants}
//                   whileHover={{ y: -8, scale: 1.02 }}
//                 >
//                   <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
//                     {feature.icon}
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
//                   <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Support Team Section */}
//       <motion.section
//         className="container mx-auto px-4 py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-100px' }}
//         variants={containerVariants}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div className="text-center mb-12" variants={itemVariants}>
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Support Team</h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//               Dedicated professionals ready to assist you with your interior design needs
//             </p>
//           </motion.div>

//           <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16" variants={containerVariants}>
//             {[
//               {
//                 image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
//                 name: 'Rajesh Kumar',
//                 role: 'Sales Manager',
//                 description: 'Expert in residential solutions with 10+ years experience',
//               },
//               {
//                 image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
//                 name: 'Priya Sharma',
//                 role: 'Architect Relations',
//                 description: 'Specializes in commercial projects and architect collaborations',
//               },
//               {
//                 image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
//                 name: 'Amit Patel',
//                 role: 'Technical Support',
//                 description: 'Handles product specifications and technical enquiries',
//               },
//               {
//                 image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
//                 name: 'Neha Gupta',
//                 role: 'Customer Success',
//                 description: 'Ensures seamless project execution and client satisfaction',
//               },
//             ].map((member, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
//                 variants={itemVariants}
//                 whileHover={{ y: -8 }}
//               >
//                 <div className="relative w-24 h-24 mx-auto mb-6">
//                   <motion.img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg group-hover:border-primary transition-colors duration-300"
//                     whileHover={{ scale: 1.05 }}
//                     loading="lazy"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-3">{member.name}</h3>
//                 <p className="text-primary font-semibold mb-4 text-base">{member.role}</p>
//                 <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* CTA Section */}
//       <motion.section
//         className="container mx-auto px-4 py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         variants={scaleUp}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             className="bg-gradient-to-tr from-primary to-[#dd6d6d] rounded-3xl p-6 sm:p-8 text-white shadow-xl"
//             whileHover={{ y: -8 }}
//           >
//             <motion.h2
//               className="text-3xl sm:text-4xl font-bold mb-8 text-center"
//               variants={itemVariants}
//             >
//               Ready to Transform Your Space?
//             </motion.h2>
//             <motion.p
//               className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto text-center text-red-100"
//               variants={itemVariants}
//             >
//               Explore our premium plywood, mica, and teak products or contact us to bring your vision to life.
//             </motion.p>
//             <motion.div
//               className="flex flex-col sm:flex-row gap-6 justify-center"
//               variants={containerVariants}
//             >
//               <motion.a
//                 href="/products"
//                 className="inline-block bg-white text-primary px-6 py-3 rounded-xl font-semibold text-base hover:bg-gray-100 focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300 transform hover:scale-105"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label="Explore Ratan Decor Products"
//               >
//                 Explore Products
//               </motion.a>
//               <motion.a
//                 href="/contact"
//                 className="inline-block border-2 border-white text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-white hover:text-primary focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label="Get in Touch with Ratan Decor"
//               >
//                 Get in Touch
//               </motion.a>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.section>

//       <Footer />
//     </div>
//   );
// };

// export default About;



import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const slideInFromLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const slideInFromRight = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// Sample stats data (to be defined)
const stats = [
  { number: '15+', label: 'Years of Experience' },
  { number: '500+', label: 'Projects Completed' },
  { number: '100%', label: 'Customer Satisfaction' },
  { number: '50+', label: 'Expert Team Members' },
];

const About = () => {
  return (
    <div className="bg-white min-h-screen font-roboto">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          {/* Content */}
          <motion.div className="space-y-6 sm:space-y-8" variants={slideInFromRight}>
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              About Ratan Decor
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              variants={itemVariants}
            >
              Crafting
              <span className="text-primary block">Premium Interiors</span>
            </motion.h1>
            
            <motion.p
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              With over 15 years of excellence, we specialize in high-quality plywood, mica sheets, 
              and teak frames that transform spaces into stunning environments.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore Our Work"
              >
                Explore Our Work
              </motion.button>
              <motion.button
                className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:border-primary hover:text-primary transition-all w-full sm:w-auto text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Download Catalog"
              >
                Download Catalog
              </motion.button>
            </motion.div>
            
            {/* Stats - Mobile grid adjustment */}
            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div key={index} className="text-center" variants={itemVariants}>
                  <div className="text-xl sm:text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Visual */}
          <motion.div className="relative mt-8 sm:mt-0" variants={slideInFromLeft}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="Modern Interior Design"
                className="w-full h-64 sm:h-[500px] object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Card - Mobile positioning adjustment */}
            <motion.div
              className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 sm:w-12 h-8 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-primary text-xl sm:text-2xl">⭐</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Premium Quality</div>
                  <div className="text-xs sm:text-sm text-gray-600">Certified Materials</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why We Are Different Section */}
      <motion.section
        className="container mx-auto px-4 py-8 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Why We Are Different</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what sets Ratan Decor apart in delivering exceptional interior solutions
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16">
            <motion.div className="lg:w-1/2" variants={slideInFromLeft}>
              <div className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Ratan Decor Showroom"
                  className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200"
                  whileHover={{ scale: 1.03 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.div>

            <motion.div className="lg:w-1/2 space-y-6 sm:space-y-8" variants={slideInFromRight}>
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Tailored User Experience</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Our dynamic user selection system ensures you see only the most relevant products for your needs, whether you're a homeowner, architect, or dealer.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Multiple Enquiry Options</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We offer three convenient enquiry methods per product—direct call, WhatsApp, and email forms—making it easy to get the information you need.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">AR Technology Integration</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Our upcoming Augmented Reality feature will let you visualize our plywood, mica, and veneer products in your space, revolutionizing your design process.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid Section */}
      <motion.section
        className="container mx-auto px-4 py-8 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Specializations</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored solutions for every type of interior design project
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 max-w-7xl">
              {[
                {
                  icon: '🏡',
                  title: 'Residential Solutions',
                  description: 'Beautiful and functional designs for homes and apartments with premium materials',
                },
                {
                  icon: '🏢',
                  title: 'Commercial Spaces',
                  description: 'Professional interiors for businesses with durable and aesthetic solutions',
                },
                {
                  icon: '🍽️',
                  title: 'Modular Kitchens',
                  description: 'Smart, functional kitchen designs with waterproof plywood and premium finishes',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-primary group"
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Support Team Section */}
      <motion.section
        className="container mx-auto px-4 py-8 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Support Team</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals ready to assist you with your interior design needs
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16" variants={containerVariants}>
            {[
              {
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                name: 'Rajesh Kumar',
                role: 'Sales Manager',
                description: 'Expert in residential solutions with 10+ years experience',
              },
              {
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                name: 'Priya Sharma',
                role: 'Architect Relations',
                description: 'Specializes in commercial projects and architect collaborations',
              },
              {
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                name: 'Amit Patel',
                role: 'Technical Support',
                description: 'Handles product specifications and technical enquiries',
              },
              {
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                name: 'Neha Gupta',
                role: 'Customer Success',
                description: 'Ensures seamless project execution and client satisfaction',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg group-hover:border-primary transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{member.name}</h3>
                <p className="text-primary font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{member.role}</p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="container mx-auto px-4 py-8 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scaleUp}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-gradient-to-tr from-primary to-[#e56666] rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl"
            whileHover={{ y: -8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center"
              variants={itemVariants}
            >
              Ready to Transform Your Space?
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto text-center text-red-100"
              variants={itemVariants}
            >
              Explore our premium plywood, mica, and teak products or contact us to bring your vision to life.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
              variants={containerVariants}
            >
              <motion.a
                href="/products"
                className="inline-block bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300 transform hover:scale-105 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore Ratan Decor Products"
              >
                Explore Products
              </motion.a>
              <motion.a
                href="/contact"
                className="inline-block border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-white hover:text-primary focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Get in Touch with Ratan Decor"
              >
                Get in Touch
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;