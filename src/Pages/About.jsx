import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { CatalogService } from "../services/apiServices";
import { useState, useEffect } from "react";
import { 
  ClipboardCheck, 
  Lightbulb, 
  MessagesSquare, 
  CheckCircle2 
} from "lucide-react";
import aboutrathan from "../assets/about-ratan.jpg";
import ratancta from "../assets/ratan-cta.jpg";

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

const workProcess = [
  {
    step: "01",
    title: "Understand Your Requirement",
    text: "We identify your project type—Residential, Commercial, or Modular Kitchen—and understand your material needs.",
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    features: [
      "Project type selection",
      "Material requirement analysis",
      "Budget & timeline discussion",
    ],
  },
  {
    step: "02",
    title: "Recommend the Right Materials",
    text: "Our team suggests suitable plywood, mica, veneers, doors, or panels based on durability, usage, and budget.",
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    features: [
      "Quality assessment",
      "Durability analysis",
      "Budget-friendly options",
    ],
  },
  {
    step: "03",
    title: "Easy Enquiry & Consultation",
    text: "Connect with us via call, WhatsApp, email, or book a video call to discuss products in detail.",
    icon: <MessagesSquare className="w-8 h-8 text-primary" />,
    features: [
      "Direct call support",
      "WhatsApp assistance",
      "Video call appointments",
    ],
  },
  {
    step: "04",
    title: "Smooth Order & Support",
    text: "We assist throughout enquiry tracking, pricing clarity, and post-enquiry support for a seamless experience.",
    icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
    features: ["Enquiry tracking", "Pricing clarity", "Post-enquiry support"],
  },
];

const About = () => {
  const [catalogUrl, setCatalogUrl] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      const catalog = await CatalogService.getCatalog();
      if (catalog && catalog.url) {
        setCatalogUrl(catalog.url);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="bg-white min-h-screen font-roboto">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-24 sm:pt-28 lg:pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={slideInFromLeft}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              About Ratan Decor
            </motion.div>

            {/* Refined Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
              variants={itemVariants}
            >
              Your Reliable Partner in <br />
              <span className="text-primary italic font-serif">Decorative Solutions</span>
            </motion.h1>

            <motion.div
              className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl space-y-4"
              variants={itemVariants}
            >
              <p>
                Established in 2007, <span className="text-gray-900 font-semibold italic">Ratan Decor</span> is a trusted Wholesaler, Distributor, and Service Provider of premium interior and decorative materials. We are known for our consistent quality and reliable solutions tailored to diverse interior needs.
              </p>
              <p>
                Driven by a dedicated and experienced team, we focus on meeting customer requirements with precision and care. Our commitment to excellence has earned us strong industry recognition and long-term trust from our clients.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/contact"
                  className="block bg-primary text-white px-10 py-4
               rounded-2xl font-bold hover:bg-primary/95
               transition-all text-center shadow-xl shadow-primary/20"
                  aria-label="Contact Ratan Decor"
                >
                  Reach Us
                </Link>
              </motion.div>

              <motion.button
                type="button"
                className={`border-2 border-gray-600 text-black/100 px-10
             py-4 rounded-2xl font-bold hover:border-primary
             hover:text-primary transition-all w-full sm:w-auto
             ${!catalogUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (catalogUrl) {
                    window.open(catalogUrl, "_blank");
                  } else {
                    alert("Our catalog will be available soon. Please contact us for details.");
                  }
                }}
              >
                View Catalog
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="relative mt-3 sm:mt-16 lg:mt-0"
            variants={slideInFromRight}
          >
            <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl group">
              <motion.img
                src="/Vinay.png"
                alt="Mr. Vinay Sethia"
                className="w-full h-64 sm:h-[580px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Elegant Founder Badge */}
            <motion.div
              className="absolute -bottom-4 right-0 sm:-right-6 bg-white p-5 sm:p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-b-4 border-primary min-w-[220px]"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="space-y-1">
                <div className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
                  Mr. Vinay Sethia
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-3 bg-primary"></div>
                  <div className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-widest">
                    Founder
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Ratan Decor */}
      <motion.section
        className="container mx-auto px-4 py-10 sm:py-12 lg:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-6"
            variants={itemVariants}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-2">
              Why Choose Ratan Decor
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our innovative approach and premium
              quality products
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16">
            <motion.div className="lg:w-1/2" variants={slideInFromLeft}>
              <div className="relative">
                <motion.img
                  src={aboutrathan}
                  alt="Ratan Decor Showroom"
                  className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200"
                  whileHover={{ scale: 1.03 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 space-y-6 sm:space-y-8"
              variants={slideInFromRight}
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Personalized Experience
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Choose your project type—Residential, Commercial, or Modular
                  Kitchen—and view tailored product selections designed
                  specifically for your needs.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Multiple Contact Options
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Connect with us through direct call, WhatsApp, or email forms.
                  Book video call appointments to view products from the comfort
                  of your space.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  AR Visualization (Coming Soon)
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Our upcoming Augmented Reality feature will let you virtually
                  place and visualize products in your actual space before
                  purchase.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Role-Based Pricing
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Special pricing tiers for architects and dealers, with
                  verified accounts receiving exclusive discounts on our entire
                  product range.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* We Serve Section */}
      {/* <motion.section
        className="container mx-auto px-4 py-8 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            variants={itemVariants}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              We Serve
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored solutions for every type of project and customer
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 max-w-7xl">
              {[
                {
                  icon: "🏡",
                  title: "Residential Projects",
                  description:
                    "Premium materials for homes and apartments with personalized design solutions",
                },
                {
                  icon: "🏢",
                  title: "Commercial Spaces",
                  description:
                    "Durable and aesthetic solutions for offices, retail, and hospitality",
                },
                {
                  icon: "🍽️",
                  title: "Modular Kitchens",
                  description:
                    "Waterproof plywood and premium finishes for functional kitchen designs",
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section> */}

      {/* HOW WE WORK - ENHANCED PROFESSIONAL DESIGN */}
      <motion.section
        className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-8 sm:mb-6"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-2">
              How We Work
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A simple and transparent process designed to make material
              selection easy and reliable. We guide you through every step from
              understanding your needs to providing seamless support.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {workProcess.map((step, index) => (
              <motion.div
                key={index}
                className="relative group"
                variants={itemVariants}
              >
                {/* Connection Line */}
                {index < workProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-transparent"></div>
                )}

                {/* Card */}
                <div className="bg-white rounded-2xl pt-5 pb-6 px-6 sm:pt-6 sm:pb-8 sm:px-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-primary/30">
                  {/* Step Number Circle */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                        <span className="text-gray-900 font-bold text-lg sm:text-xl">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed">
                    {step.text}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 sm:space-y-3 pt-5 sm:pt-6 border-t border-gray-100">
                    {step.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <span className="text-primary font-bold mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="container mx-auto mb-8 py-6 md:py-14 lg:py-8 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scaleUp}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10">
            {/* Background Image with Red Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={ratancta}
                alt="Modern Interior" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Complex overlay: dark gradient + red tint */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-primary/20"></div>
            </div>

            <div className="relative z-10 p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-start gap-10 lg:gap-24">
              <div className="text-center lg:text-left max-w-2xl">
                <div className="w-12 h-1 bg-primary mb-6 mx-auto lg:mx-0 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                  Ready to transform <br className="hidden sm:block" />
                  your <span className="text-primary italic">next project?</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                  Partner with the leaders in premium interior solutions. 
                  Our experts are ready to guide you towards excellence and bring your vision to life.
                </p>
              </div>

              <div className="flex flex-row flex-wrap justify-center gap-4 shrink-0 w-full lg:w-auto">
                  <Link
                    to="/contact"
                    className="bg-primary text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 text-center flex items-center justify-center min-w-[140px]"
                  >
                    Get a quote
                  </Link>
                  <Link
                    to="/products"
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all hover:bg-white/20 hover:-translate-y-1 active:translate-y-0 text-center flex items-center justify-center min-w-[140px]"
                  >
                    Explore products
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;



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

// // Sample stats data (to be defined)
// const stats = [
//   { number: '15+', label: 'Years of Experience' },
//   { number: '500+', label: 'Projects Completed' },
//   { number: '100%', label: 'Customer Satisfaction' },
//   { number: '50+', label: 'Expert Team Members' },
// ];

// const About = () => {
//   return (
//     <div className="bg-white min-h-screen font-roboto">
//       <Navbar />

//       {/* Hero Section */}
//       <motion.section
//         className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-16"
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80')] bg-cover bg-center opacity-10"></div>
//         <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
//           {/* Content */}
//           <motion.div className="space-y-6 sm:space-y-8" variants={slideInFromRight}>
//             <motion.div
//               className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
//               variants={itemVariants}
//               whileHover={{ scale: 1.05 }}
//             >
//               <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
//               About Ratan Decor
//             </motion.div>
            
//             <motion.h1
//               className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
//               variants={itemVariants}
//             >
//               Crafting
//               <span className="text-primary block">Premium Interiors</span>
//             </motion.h1>
            
//             <motion.p
//               className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg"
//               variants={itemVariants}
//             >
//               With over 15 years of excellence, we specialize in high-quality plywood, mica sheets, 
//               and teak frames that transform spaces into stunning environments.
//             </motion.p>
            
//             <motion.div
//               className="flex flex-col sm:flex-row gap-3 sm:gap-4"
//               variants={itemVariants}
//             >
//               <motion.button
//                 className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label="Explore Our Work"
//               >
//                 Explore Our Work
//               </motion.button>
//               <motion.button
//                 className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:border-primary hover:text-primary transition-all w-full sm:w-auto text-sm sm:text-base"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label="Download Catalog"
//               >
//                 Download Catalog
//               </motion.button>
//             </motion.div>
            
//             {/* Stats - Mobile grid adjustment */}
//             <motion.div
//               className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-200"
//               variants={containerVariants}
//             >
//               {stats.map((stat, index) => (
//                 <motion.div key={index} className="text-center" variants={itemVariants}>
//                   <div className="text-xl sm:text-2xl font-bold text-primary">{stat.number}</div>
//                   <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>
          
//           {/* Visual */}
//           <motion.div className="relative mt-8 sm:mt-0" variants={slideInFromLeft}>
//             <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
//               <motion.img
//                 src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
//                 alt="Modern Interior Design"
//                 className="w-full h-64 sm:h-[500px] object-cover"
//                 whileHover={{ scale: 1.03 }}
//                 transition={{ duration: 0.3 }}
//                 loading="lazy"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
//             </div>
            
//             {/* Floating Card - Mobile positioning adjustment */}
//             <motion.div
//               className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.6, duration: 0.5 }}
//               whileHover={{ scale: 1.05 }}
//             >
//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <div className="w-8 sm:w-12 h-8 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
//                   <span className="text-primary text-xl sm:text-2xl">⭐</span>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-gray-900 text-sm sm:text-base">Premium Quality</div>
//                   <div className="text-xs sm:text-sm text-gray-600">Certified Materials</div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Why We Are Different Section */}
//       <motion.section
//         className="container mx-auto px-4 py-8 sm:py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-100px' }}
//         variants={containerVariants}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Why We Are Different</h2>
//             <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
//               Discover what sets Ratan Decor apart in delivering exceptional interior solutions
//             </p>
//           </motion.div>

//           <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16">
//             <motion.div className="lg:w-1/2" variants={slideInFromLeft}>
//               <div className="relative">
//                 <motion.img
//                   src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                   alt="Ratan Decor Showroom"
//                   className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200"
//                   whileHover={{ scale: 1.03 }}
//                   loading="lazy"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
//               </div>
//             </motion.div>

//             <motion.div className="lg:w-1/2 space-y-6 sm:space-y-8" variants={slideInFromRight}>
//               <motion.div variants={itemVariants}>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Tailored User Experience</h3>
//                 <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
//                   Our dynamic user selection system ensures you see only the most relevant products for your needs, whether you're a homeowner, architect, or dealer.
//                 </p>
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Multiple Enquiry Options</h3>
//                 <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
//                   We offer three convenient enquiry methods per product—direct call, WhatsApp, and email forms—making it easy to get the information you need.
//                 </p>
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">AR Technology Integration</h3>
//                 <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
//                   Our upcoming Augmented Reality feature will let you visualize our plywood, mica, and veneer products in your space, revolutionizing your design process.
//                 </p>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Features Grid Section */}
//       <motion.section
//         className="container mx-auto px-4 py-8 sm:py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-100px' }}
//         variants={containerVariants}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Specializations</h2>
//             <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
//               Tailored solutions for every type of interior design project
//             </p>
//           </motion.div>

//           <div className="flex justify-center">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 max-w-7xl">
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
//                   className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-primary group"
//                   variants={itemVariants}
//                   whileHover={{ y: -8, scale: 1.02 }}
//                 >
//                   <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
//                     {feature.icon}
//                   </div>
//                   <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{feature.title}</h3>
//                   <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Support Team Section */}
//       <motion.section
//         className="container mx-auto px-4 py-8 sm:py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: '-100px' }}
//         variants={containerVariants}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Support Team</h2>
//             <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
//               Dedicated professionals ready to assist you with your interior design needs
//             </p>
//           </motion.div>

//           <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16" variants={containerVariants}>
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
//                 className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
//                 variants={itemVariants}
//                 whileHover={{ y: -8 }}
//               >
//                 <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
//                   <motion.img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg group-hover:border-primary transition-colors duration-300"
//                     whileHover={{ scale: 1.05 }}
//                     loading="lazy"
//                   />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{member.name}</h3>
//                 <p className="text-primary font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{member.role}</p>
//                 <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{member.description}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* CTA Section */}
//       <motion.section
//         className="container mx-auto px-4 py-8 sm:py-12"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         variants={scaleUp}
//       >
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             className="bg-gradient-to-tr from-primary to-[#e56666] rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl"
//             whileHover={{ y: -8 }}
//           >
//             <motion.h2
//               className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center"
//               variants={itemVariants}
//             >
//               Ready to Transform Your Space?
//             </motion.h2>
//             <motion.p
//               className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto text-center text-red-100"
//               variants={itemVariants}
//             >
//               Explore our premium plywood, mica, and teak products or contact us to bring your vision to life.
//             </motion.p>
//             <motion.div
//               className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
//               variants={containerVariants}
//             >
//               <motion.a
//                 href="/products"
//                 className="inline-block bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300 transform hover:scale-105 text-center"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 aria-label="Explore Ratan Decor Products"
//               >
//                 Explore Products
//               </motion.a>
//               <motion.a
//                 href="/contact"
//                 className="inline-block border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-white hover:text-primary focus:ring-2 focus:ring-white focus:outline-none transition-all duration-300 text-center"
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