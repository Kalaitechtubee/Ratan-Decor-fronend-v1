// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaChevronRight, FaSpinner, FaExclamationTriangle, FaCouch, FaChair, FaBed, FaTable, FaStore, FaThLarge, FaDoorOpen, FaLightbulb } from 'react-icons/fa';
// import { MdCategory, MdKitchen, MdTableRestaurant, MdOutdoorGrill } from 'react-icons/md';
// import { motion } from 'framer-motion';
// import useProducts from '../features/product/hooks/useProducts';

// const CategoryDropdown = ({
//   isOpen,
//   onClose,
//   isMobileSidebar = false,
//   onCategoryClick,
//   activeCategory
// }) => {
//   const navigate = useNavigate();
//   const { categories, loadCategories, isLoading, error } = useProducts();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const categoryDropdownRef = useRef(null);
//   const fetchRef = useRef(false);

//   useEffect(() => {
//     if (isOpen && !fetchRef.current) {
//       fetchRef.current = true;
//       loadCategories();
//     } else if (!isOpen) {
//       fetchRef.current = false;
//     }
//   }, [isOpen, loadCategories]);

//   const handleInternalCategoryClick = (event, category) => {
//     if (event) {
//       event.stopPropagation();
//       event.preventDefault();
//     }
    
//     console.log('CategoryDropdown: Category clicked:', category);

//     if (onClose) {
//       onClose();
//     }

//     if (onCategoryClick) {
//       onCategoryClick(category);
//     }

//     if (category && category.id) {
//       const url = `/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`;
//       console.log('CategoryDropdown: Navigating to:', url);
//       navigate(url);
//     } else if (category && category.name) {
//       const url = `/products?search=${encodeURIComponent(category.name)}`;
//       console.log('CategoryDropdown: Fallback navigation to:', url);
//       navigate(url);
//     } else {
//       console.log('CategoryDropdown: Navigating to all products');
//       navigate('/products');
//     }

//     setSelectedCategory(null);
//   };

//   const handleSubcategoryClick = (event, parentCategory, subcategory) => {
//     if (event) {
//       event.stopPropagation();
//       event.preventDefault();
//     }
    
//     console.log('CategoryDropdown: Subcategory clicked:', subcategory);

//     if (onClose) {
//       onClose();
//     }

//     if (onCategoryClick) {
//       onCategoryClick(subcategory);
//     }

//     if (subcategory && subcategory.id) {
//       const url = `/products?categoryId=${subcategory.id}&categoryName=${encodeURIComponent(subcategory.name)}`;
//       console.log('CategoryDropdown: Navigating to subcategory:', url);
//       navigate(url);
//     } else if (subcategory && subcategory.name) {
//       const url = `/products?search=${encodeURIComponent(subcategory.name)}`;
//       console.log('CategoryDropdown: Fallback subcategory navigation to:', url);
//       navigate(url);
//     }

//     setSelectedCategory(null);
//   };

//   const handleAllCategoriesClick = (event) => {
//     if (event) {
//       event.stopPropagation();
//       event.preventDefault();
//     }
    
//     console.log('CategoryDropdown: All Categories clicked');

//     if (onClose) {
//       onClose();
//     }

//     console.log('CategoryDropdown: Navigating to /products');
//     navigate('/products');

//     setSelectedCategory(null);
//   };

//   const handleMobileCategoryClick = (category) => {
//     console.log('CategoryDropdown: Mobile category clicked:', category);
//     if (selectedCategory?.id === category.id) {
//       handleInternalCategoryClick({ stopPropagation: () => {}, preventDefault: () => {} }, category);
//     } else {
//       setSelectedCategory(category);
//     }
//   };

//   const getCategoryIcon = (name) => {
//     const iconMap = {
//       'Living Room': <FaCouch className="text-[#ff4747]" />,
//       'Bedroom': <FaBed className="text-[#ff4747]" />,
//       'Dining Room': <MdTableRestaurant className="text-[#ff4747]" />,
//       'Kitchen': <MdKitchen className="text-[#ff4747]" />,
//       'Office': <FaTable className="text-[#ff4747]" />,
//       'Outdoor': <MdOutdoorGrill className="text-[#ff4747]" />,
//       'Lighting': <FaLightbulb className="text-[#ff4747]" />,
//       'Storage': <FaDoorOpen className="text-[#ff4747]" />,
//       'Sofa': <FaCouch className="text-[#ff4747]" />,
//       'Chair': <FaChair className="text-[#ff4747]" />,
//       'Bed': <FaBed className="text-[#ff4747]" />,
//       'Table': <FaTable className="text-[#ff4747]" />,
//       'Furniture': <FaStore className="text-[#ff4747]" />,
//       'All': <FaThLarge className="text-[#ff4747]" />,
//       default: <MdCategory className="text-[#ff4747]" />
//     };
//     return iconMap[name] || iconMap.default;
//   };

//   const sidebarVariants = {
//     hidden: { opacity: 0, height: 0 },
//     visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
//     exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Desktop Dropdown */}
//       {!isMobileSidebar && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-30 z-40"
//             onClick={() => {
//               console.log('CategoryDropdown: Overlay clicked, closing dropdown');
//               onClose();
//             }}
//           />
//           <div
//             ref={categoryDropdownRef}
//             className="fixed left-0 right-0 top-20 bg-white border-t border-gray-200 shadow-lg z-50 font-roboto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div 
//               className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative"
//               style={{
//                 backgroundImage: 'url(https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg)',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat'
//               }}
//             >
//               {/* Dark overlay with gradient for better text readability */}
//               <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
              
//               {/* Content wrapper with relative positioning */}
//               <div className="relative z-10">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
//                   <div className="col-span-1 sm:col-span-2 md:col-span-8">
//                     {isLoading ? (
//                       <div className="flex items-center justify-center py-6">
//                         <FaSpinner className="text-xl text-[#ff4747] animate-spin mr-2" />
//                         <span className="text-base text-gray-600 font-roboto">Loading categories...</span>
//                       </div>
//                     ) : error ? (
//                       <div className="py-6 text-center">
//                         <FaExclamationTriangle className="text-xl text-[#ff4747] mx-auto mb-2" />
//                         <p className="text-base text-gray-600 font-roboto mb-4">{error}</p>
//                         <button
//                           onClick={loadCategories}
//                           className="px-6 py-2 bg-[#ff4747] text-white rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto text-base"
//                         >
//                           Retry
//                         </button>
//                       </div>
//                     ) : !selectedCategory ? (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                         {categories.slice(0, 8).map((category) => (
//                           <div
//                             key={category.id}
//                             className="group"
//                           >
//                             <div className="flex items-center gap-2 mb-2 pb-2 relative">
//                               <div className="text-lg group-hover:scale-110 transition-transform duration-300">{getCategoryIcon(category.name)}</div>
//                               <button
//                                 onClick={(e) => {
//                                   console.log('Desktop category button clicked:', category);
//                                   handleInternalCategoryClick(e, category);
//                                 }}
//                                 className="font-semibold text-base text-white cursor-pointer hover:text-[#ff4747] transition-colors duration-300 font-roboto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full w-full text-left drop-shadow-lg"
//                                 style={{ pointerEvents: 'auto' }}
//                               >
//                                 {category.name}
//                               </button>
//                             </div>
//                             <ul className="space-y-2">
//                               {category.subCategories?.slice(0, 6).map((subcategory, index) => (
//                                 <li key={subcategory.id || index}>
//                                   <button
//                                     onClick={(e) => handleSubcategoryClick(e, category, subcategory)}
//                                     className="text-sm text-white/90 hover:text-[#ff4747] px-2 py-1 rounded transition-all duration-300 w-full text-left font-roboto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full drop-shadow-md"
//                                   >
//                                     <span>{subcategory.name}</span>
//                                   </button>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <button
//                           onClick={() => setSelectedCategory(null)}
//                           className="flex items-center gap-3 p-3 rounded-lg w-full text-left bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-roboto shadow-sm"
//                         >
//                           <FaChevronRight className="text-[#ff4747] text-sm transform rotate-180" />
//                           <span className="text-base text-white font-roboto drop-shadow-lg">Back to Categories</span>
//                         </button>

//                         <button
//                           onClick={handleAllCategoriesClick}
//                           className="flex items-center gap-3 p-3 rounded-lg w-full text-left bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-roboto shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full"
//                         >
//                           <div className="text-lg">{getCategoryIcon('All')}</div>
//                           <span className="text-base text-white font-roboto drop-shadow-lg">All Categories</span>
//                         </button>

//                         <div className="space-y-4">
//                           <button
//                             onClick={(e) => handleInternalCategoryClick(e, selectedCategory)}
//                             className="flex items-center gap-3 p-3 rounded-lg w-full text-left text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-roboto shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full drop-shadow-lg"
//                           >
//                             <div className="text-lg">{getCategoryIcon(selectedCategory.name)}</div>
//                             <span className="text-base font-roboto">{selectedCategory.name}</span>
//                           </button>
//                           {selectedCategory.subCategories?.length > 0 && (
//                             <ul className="space-y-2 pl-4">
//                               {selectedCategory.subCategories.map((subcategory, index) => (
//                                 <motion.li
//                                   key={subcategory.id || index}
//                                   initial={{ opacity: 0, x: -10 }}
//                                   animate={{ opacity: 1, x: 0 }}
//                                   transition={{ delay: index * 0.1 }}
//                                 >
//                                   <button
//                                     onClick={(e) => handleSubcategoryClick(e, selectedCategory, subcategory)}
//                                     className="flex items-center justify-between text-sm text-white/90 hover:text-[#ff4747] px-2 py-1 rounded transition-all duration-300 w-full text-left font-roboto shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full drop-shadow-md"
//                                   >
//                                     <span>{subcategory.name}</span>
//                                     <FaChevronRight className="text-xs text-[#ff4747]" />
//                                   </button>
//                                 </motion.li>
//                               ))}
//                             </ul>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Mobile Sidebar Content */}
//       {isMobileSidebar && (
//         <div
//           className="sidebar-content p-4 h-full overflow-y-auto no-scrollbar font-roboto relative"
//           style={{ 
//             scrollbarWidth: 'none', 
//             msOverflowStyle: 'none',
//             backgroundImage: 'url(https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat'
//           }}
//         >
//           {/* Dark overlay for mobile sidebar with gradient */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
          
//           {/* Content wrapper */}
//           <div className="relative z-10">
//             <style>{`
//               .no-scrollbar::-webkit-scrollbar {
//                 display: none;
//               }
//               .no-scrollbar {
//                 -webkit-overflow-scrolling: touch;
//               }
//               .touch-target {
//                 min-height: 48px;
//                 min-width: 48px;
//               }
//               .sidebar-content {
//                 max-height: calc(100vh - 80px);
//                 overflow-y: hidden;
//                 -webkit-overflow-scrolling: touch;
//                 touch-action: none;
//                 scrollbar-width: none;
//                 -ms-overflow-style: none;
//               }
//               .sidebar-content::-webkit-scrollbar {
//                 display: none;
//               }
//               @media (max-width: 767px) {
//                 .sidebar-content {
//                   overflow-y: hidden;
//                 }
//               }
//             `}</style>
//             {isLoading ? (
//               <div className="flex items-center justify-center py-6">
//                 <FaSpinner className="text-xl text-[#ff4747] animate-spin mr-2" />
//                 <span className="text-base text-gray-600 font-roboto">Loading categories...</span>
//               </div>
//             ) : error ? (
//               <div className="py-6 text-center">
//                 <FaExclamationTriangle className="text-xl text-[#ff4747] mx-auto mb-2" />
//                 <p className="text-base text-gray-600 font-roboto mb-4">{error}</p>
//                 <button
//                   onClick={loadCategories}
//                   className="px-6 py-2 bg-[#ff4747] text-white rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto text-base touch-target"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="mb-4"
//                 >
//                 </motion.div>

//                 {!selectedCategory ? (
//                   <div className="space-y-2">
//                     {categories.map((category, index) => (
//                       <motion.div
//                         key={category.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                       >
//                         <button
//                           onClick={() => handleMobileCategoryClick(category)}
//                           className={`flex items-center justify-between p-3 rounded-lg w-full text-left transition-all duration-300 font-roboto touch-target shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full ${
//                             activeCategory === category.name ? 'text-[#ff4747] bg-white/10 backdrop-blur-sm' : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className="text-lg">{getCategoryIcon(category.name)}</div>
//                             <span className="text-base text-white font-roboto drop-shadow-lg">{category.name}</span>
//                           </div>
//                           <FaChevronRight className="text-[#ff4747] text-sm" />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <button
//                         onClick={() => setSelectedCategory(null)}
//                         className="flex items-center gap-3 p-3 rounded-lg w-full text-left bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-roboto touch-target shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full"
//                       >
//                         <FaChevronRight className="text-[#ff4747] text-sm transform rotate-180" />
//                         <span className="text-base text-white font-roboto drop-shadow-lg">Back to Categories</span>
//                       </button>
//                     </motion.div>

//                     <motion.div
//                       variants={sidebarVariants}
//                       initial="hidden"
//                       animate="visible"
//                       exit="exit"
//                     >
//                       <button
//                         onClick={(e) => handleInternalCategoryClick(e, selectedCategory)}
//                         className="flex items-center gap-3 p-3 rounded-lg w-full text-left text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-roboto touch-target shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full drop-shadow-lg"
//                       >
//                         <div className="text-lg">{getCategoryIcon(selectedCategory.name)}</div>
//                         <span className="text-base font-roboto">{selectedCategory.name}</span>
//                       </button>
//                       {selectedCategory.subCategories?.length > 0 && (
//                         <ul className="mt-2 space-y-2 pl-4">
//                           {selectedCategory.subCategories.map((subcategory, index) => (
//                             <motion.li
//                               key={subcategory.id || index}
//                               initial={{ opacity: 0, x: -10 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: index * 0.1 }}
//                             >
//                               <button
//                                 onClick={(e) => handleSubcategoryClick(e, selectedCategory, subcategory)}
//                                 className="flex items-center justify-between p-2 rounded-lg w-full text-left text-sm text-white/90 hover:text-[#ff4747] transition-all duration-300 font-roboto touch-target shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full drop-shadow-md"
//                               >
//                                 <span>{subcategory.name}</span>
//                                 <FaChevronRight className="text-xs text-[#ff4747]" />
//                               </button>
//                             </motion.li>
//                           ))}
//                         </ul>
//                       )}
//                     </motion.div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChevronRight, FaSpinner, FaExclamationTriangle, FaCouch, FaChair, 
  FaBed, FaTable, FaStore, FaThLarge, FaDoorOpen, FaLightbulb 
} from 'react-icons/fa';
import { MdCategory, MdKitchen, MdTableRestaurant, MdOutdoorGrill } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../features/product/hooks/useProducts';

const CategoryDropdown = ({
  isOpen,
  onClose,
  isMobileSidebar = false,
  onCategoryClick,
  activeCategory
}) => {
  const navigate = useNavigate();
  const { categories, loadCategories, isLoading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoryDropdownRef = useRef(null);
  const fetchRef = useRef(false);

  // Mouse event handlers for hover functionality
  const handleMouseEnter = () => {
    // Keep dropdown open when mouse enters
  };

  const handleMouseLeave = (e) => {
    // Check if mouse is leaving to a non-child element
    if (!categoryDropdownRef.current?.contains(e.relatedTarget)) {
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    if (isOpen && !fetchRef.current) {
      fetchRef.current = true;
      loadCategories();
    } else if (!isOpen) {
      fetchRef.current = false;
    }
  }, [isOpen, loadCategories]);

  const handleInternalCategoryClick = (event, category) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (onClose) onClose();
    if (onCategoryClick) onCategoryClick(category);

    if (category && category.id) {
      navigate(`/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`);
    } else if (category && category.name) {
      navigate(`/products?search=${encodeURIComponent(category.name)}`);
    } else {
      navigate('/products');
    }
    setSelectedCategory(null);
  };

  const handleSubcategoryClick = (event, parentCategory, subcategory) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (onClose) onClose();
    if (onCategoryClick) onCategoryClick(subcategory);

    if (subcategory && subcategory.id) {
      navigate(`/products?categoryId=${subcategory.id}&categoryName=${encodeURIComponent(subcategory.name)}`);
    } else if (subcategory && subcategory.name) {
      navigate(`/products?search=${encodeURIComponent(subcategory.name)}`);
    }
    setSelectedCategory(null);
  };

  const handleAllCategoriesClick = (event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (onClose) onClose();
    navigate('/products');
    setSelectedCategory(null);
  };

  const handleMobileCategoryClick = (category) => {
    if (selectedCategory?.id === category.id) {
      handleInternalCategoryClick({ stopPropagation: () => {}, preventDefault: () => {} }, category);
    } else {
      setSelectedCategory(category);
    }
  };

  const getCategoryIcon = (name) => {
    const iconMap = {
      'Living Room': <FaCouch className="text-[#ff4747]" />,
      'Bedroom': <FaBed className="text-[#ff4747]" />,
      'Dining Room': <MdTableRestaurant className="text-[#ff4747]" />,
      'Kitchen': <MdKitchen className="text-[#ff4747]" />,
      'Office': <FaTable className="text-[#ff4747]" />,
      'Outdoor': <MdOutdoorGrill className="text-[#ff4747]" />,
      'Lighting': <FaLightbulb className="text-[#ff4747]" />,
      'Storage': <FaDoorOpen className="text-[#ff4747]" />,
      'Sofa': <FaCouch className="text-[#ff4747]" />,
      'Chair': <FaChair className="text-[#ff4747]" />,
      'Bed': <FaBed className="text-[#ff4747]" />,
      'Table': <FaTable className="text-[#ff4747]" />,
      'Furniture': <FaStore className="text-[#ff4747]" />,
      'All': <FaThLarge className="text-[#ff4747]" />,
      default: <MdCategory className="text-[#ff4747]" />
    };
    return iconMap[name] || iconMap.default;
  };

  // 🔹 Updated variants for desktop dropdown animation
  const categoryDropdownVariants = {
    hidden: { 
      opacity: 0, 
      x: "-100%",
      transition: { duration: 0.3, ease: "easeIn" }
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: "-100%", 
      transition: { duration: 0.3, ease: "easeIn" }
    },
  };

  // 🔹 Mobile sidebar animation (slide from left)
  const sidebarVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.2 } }
  };

  if (!isOpen && !isMobileSidebar) return null;

  return (
    <>
      {/* Desktop Dropdown */}
      {!isMobileSidebar && (
        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-0 z-40"
                onClick={onClose}
              />
              <motion.div
                ref={categoryDropdownRef}
                variants={categoryDropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed left-0 right-0 top-20 bg-white border-t border-gray-200 shadow-lg z-50 font-roboto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                    <div className="col-span-1 sm:col-span-2 md:col-span-8">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <FaSpinner className="text-xl text-[#ff4747] animate-spin mr-2" />
                          <span className="text-base text-gray-600 font-roboto">Loading categories...</span>
                        </div>
                      ) : error ? (
                        <div className="py-6 text-center">
                          <FaExclamationTriangle className="text-xl text-[#ff4747] mx-auto mb-2" />
                          <p className="text-base text-gray-600 font-roboto mb-4">{error}</p>
                          <button
                            onClick={loadCategories}
                            className="px-6 py-2 bg-[#ff4747] text-white rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto text-base"
                          >
                            Retry
                          </button>
                        </div>
                      ) : !selectedCategory ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {categories.slice(0, 8).map((category) => (
                            <div key={category.id} className="group">
                              <div className="flex items-center gap-2 mb-2 pb-2 relative">
                                <div className="text-lg group-hover:scale-110 transition-transform duration-300">
                                  {getCategoryIcon(category.name)}
                                </div>
                                <button
                                  onClick={(e) => handleInternalCategoryClick(e, category)}
                                  className="font-semibold text-base text-gray-800 cursor-pointer hover:text-[#ff4747] transition-colors duration-300 font-roboto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full w-full text-left"
                                >
                                  {category.name}
                                </button>
                              </div>
                              <ul className="space-y-2">
                                {category.subCategories?.slice(0, 6).map((subcategory, index) => (
                                  <li key={subcategory.id || index}>
                                    <button
                                      onClick={(e) => handleSubcategoryClick(e, category, subcategory)}
                                      className="text-sm text-gray-600 hover:text-[#ff4747] px-2 py-1 rounded transition-all duration-300 w-full text-left font-roboto relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full"
                                    >
                                      <span>{subcategory.name}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-100 transition-all duration-300 font-roboto shadow-sm"
                          >
                            <FaChevronRight className="text-[#ff4747] text-sm transform rotate-180" />
                            <span className="text-base text-gray-800 font-roboto">Back to Categories</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Sidebar */}
      {isMobileSidebar && (
        <motion.div
          className="sidebar-content p-4 bg-gray-50 h-full overflow-y-auto no-scrollbar font-roboto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <FaSpinner className="text-xl text-[#ff4747] animate-spin mr-2" />
              <span className="text-base text-gray-600 font-roboto">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <FaExclamationTriangle className="text-xl text-[#ff4747] mx-auto mb-2" />
              <p className="text-base text-gray-600 font-roboto mb-4">{error}</p>
              <button
                onClick={loadCategories}
                className="px-6 py-2 bg-[#ff4747] text-white rounded-full hover:bg-[#ff4747]/80 transition-all duration-300 font-roboto text-base touch-target"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleMobileCategoryClick(category)}
                    className={`flex items-center justify-between p-3 rounded-lg w-full text-left transition-all duration-300 font-roboto touch-target shadow-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4747] after:transition-all after:duration-300 hover:after:w-full ${
                      activeCategory === category.name ? 'text-[#ff4747]' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getCategoryIcon(category.name)}</div>
                      <span className="text-base text-gray-800 font-roboto">{category.name}</span>
                    </div>
                    <FaChevronRight className="text-[#ff4747] text-sm" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default CategoryDropdown;