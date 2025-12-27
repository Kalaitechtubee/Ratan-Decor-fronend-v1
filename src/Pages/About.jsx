
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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
    icon: "📋",
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
    icon: "🎨",
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
    icon: "💬",
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
    icon: "✅",
    features: ["Enquiry tracking", "Pricing clarity", "Post-enquiry support"],
  },
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
          <motion.div
            className="space-y-6 sm:space-y-8"
            variants={slideInFromRight}
          >
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
              Premium Materials
              <span className="text-primary block">For Modern Interiors</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              Ratan Decor is a trusted supplier of premium plywood, mica,
              veneers, doors, louvers, and decorative panels. We serve
              residential, commercial, and modular kitchen projects with
              reliable materials, expert guidance, and consistent quality.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block w-full sm:w-auto"
              >
                <Link
                  to="/products"
                  className="block bg-primary text-white px-6 sm:px-8 py-3 sm:py-4
               rounded-xl font-semibold hover:bg-primary/90
               transition-all text-center text-sm sm:text-base"
                  aria-label="Explore Ratan Decor Products"
                >
                  Explore Our Work
                </Link>
              </motion.div>

              <motion.button
                type="button"
                className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8
             py-3 sm:py-4 rounded-xl font-semibold hover:border-primary
             hover:text-primary transition-all w-full sm:w-auto
             text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  alert(
                    "Our catalog will be available soon. Please contact us for details."
                  )
                }
              >
                Download Catalog
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="relative mt-8 sm:mt-0"
            variants={slideInFromLeft}
          >
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

            {/* Floating Card */}
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
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    Premium Quality
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Certified Materials
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Ratan Decor */}
      <motion.section
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
                  src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80"
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
      <motion.section
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
      </motion.section>

      {/* HOW WE WORK - ENHANCED PROFESSIONAL DESIGN */}
      <motion.section
        className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
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
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-primary/30">
                  {/* Step Number Circle */}
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg sm:text-xl">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl">{step.icon}</div>
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

          <motion.div
            className="mt-12 sm:mt-16 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600 mb-6 sm:mb-8">
              Ready to get started with Ratan Decor?
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/contact"
                className="bg-primary text-white px-8 sm:px-10 py-3 sm:py-4
                 rounded-xl font-semibold hover:bg-primary/90
                 transition-all inline-block"
                aria-label="Contact Ratan Decor"
              >
                Contact Us Today
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Support Team Section */}
      <motion.section
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
              Our Support Team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals ready to assist you with your interior
              design needs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16"
            variants={containerVariants}
          >
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                name: "Rajesh Kumar",
                role: "Sales Manager",
                description:
                  "Expert in residential solutions with 10+ years experience",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                name: "Priya Sharma",
                role: "Architect Relations",
                description:
                  "Specializes in commercial projects and architect collaborations",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                name: "Amit Patel",
                role: "Technical Support",
                description:
                  "Handles product specifications and technical enquiries",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                name: "Neha Gupta",
                role: "Customer Success",
                description:
                  "Ensures seamless project execution and client satisfaction",
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
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {member.description}
                </p>
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
              Ready to Start Your Project?
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto text-center text-red-100"
              variants={itemVariants}
            >
              Contact us today to explore our complete range of premium plywood,
              mica, veneers, and decorative solutions. Our team is ready to
              assist you with personalized recommendations.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
              variants={containerVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/products"
                  className="inline-block bg-white text-primary px-4 sm:px-6 py-2 sm:py-3
                 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base
                 hover:bg-gray-100 focus:ring-2 focus:ring-white focus:outline-none
                 transition-all duration-300 text-center"
                  aria-label="Explore Ratan Decor Products"
                >
                  Explore Products
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="inline-block border-2 border-white text-white px-4 sm:px-6
                 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm
                 sm:text-base hover:bg-white hover:text-primary focus:ring-2
                 focus:ring-white focus:outline-none transition-all duration-300
                 text-center"
                  aria-label="Get in Touch with Ratan Decor"
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
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