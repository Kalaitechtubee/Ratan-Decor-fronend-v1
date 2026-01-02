import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeSlider from "../components/HomeSlider";

import { fetchProducts } from "../features/product/productSlice";
import { openPopup } from "../features/userType/userTypeSlice";
import UserTypePopup from "../features/userType/components/UserTypePopup";
import toast from "react-hot-toast";
import CounterComponent from "../components/Home/CounterComponent";
import PopularCategories from "../components/Home/PopularCategories";
import FeaturesSection from "../components/Home/FeaturesSection";
import VideoContentSection from "../components/Home/VideoContentSection";
import VideoCallPopup from "../components/Home/VideoCallPopup";
import Contact from "../Pages/Contact";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, status, error } = useSelector((state) => state.products);
  const { userType, userRole, isAuthenticated } = useSelector((state) => state.auth);
  const { isPopupOpen } = useSelector((state) => state.userType);
  const [showUserTypePopup, setShowUserTypePopup] = useState(false);
  const hasFetchedRef = useRef(false);
  const popupTriggeredRef = useRef(false);
  const [isVideoCallPopupOpen, setIsVideoCallPopupOpen] = useState(false);

  // Trigger popup based on authentication status
  useEffect(() => {
    // Prevent multiple triggers
    if (popupTriggeredRef.current) return;
    
    const userTypeConfirmed = localStorage.getItem("userTypeConfirmed") === "true";
    const storedUserType = localStorage.getItem("userType");

    console.log("Popup trigger check:", {
      isAuthenticated,
      userTypeConfirmed,
      storedUserType,
      isPopupOpen
    });

    // Show popup for ALL users (auth and non-auth) if they haven't confirmed a type
    if (!userTypeConfirmed) {
      console.log("UserType not confirmed, opening popup");
      dispatch(openPopup());
      popupTriggeredRef.current = true;
    } else {
      console.log("UserType confirmed, no popup needed");
    }
  }, [dispatch, isAuthenticated, isPopupOpen]);

  // Sync showUserTypePopup with Redux state
  useEffect(() => {
    setShowUserTypePopup(isPopupOpen);
  }, [isPopupOpen]);

  // Fetch products only if user type is confirmed
  useEffect(() => {
    const userTypeConfirmed = localStorage.getItem("userTypeConfirmed") === "true";
    const storedUserType = localStorage.getItem("userType") || "general";
    const storedUserRole = userRole || "customer";

    if (userTypeConfirmed && !hasFetchedRef.current) {
      console.log("Home - Fetching products:", {
        userType: storedUserType,
        userRole: storedUserRole,
      });
      dispatch(
        fetchProducts({
          page: 1,
          limit: 8,
          userType: storedUserType,
          userRole: storedUserRole,
        })
      );
      hasFetchedRef.current = true;
    }
  }, [dispatch, userType, userRole, isAuthenticated]);

  // Error handling with toast
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 4000 });
    }
  }, [error]);

  // Handle popup close
  const handleCloseUserTypePopup = () => {
    console.log("Closing user type popup");
    setShowUserTypePopup(false);
    localStorage.setItem("userTypeConfirmed", "true");
    hasFetchedRef.current = false;
    
    const storedUserType = localStorage.getItem("userType") || "general";
    const storedUserRole = userRole || "customer";
    
    // Fetch products after popup close
    dispatch(
      fetchProducts({
        page: 1,
        limit: 8,
        userType: storedUserType,
        userRole: storedUserRole,
      })
    );
  };

  // Loading state
  if (status === "loading" && !products.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-poppins">
            Loading content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {showUserTypePopup && (
          <UserTypePopup onClose={handleCloseUserTypePopup} />
        )}
        <div
          className={`transition-opacity duration-300 ${
            showUserTypePopup ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <Navbar />
          <HomeSlider />

          <main className="w-full px-4 sm:px-6 lg:px-8 py-0 md:py-0">
            {/* Popular Categories Section */}
            <section>
              <PopularCategories />
            </section>

            {/* Features Section */}
            <section>
              <FeaturesSection />
            </section>

            {/* Counter Section */}
            <section>
              <CounterComponent />
            </section>

            {/* Video Content Section */}
            <section>
              <VideoContentSection onOpenVideoCallPopup={() => setIsVideoCallPopupOpen(true)} />
            </section>
             <section>
              <Contact isHome />
            </section>
          </main>
        </div>
      </div>
      <AnimatePresence>
        {isVideoCallPopupOpen && (
          <VideoCallPopup
            isOpen={isVideoCallPopupOpen}
            onClose={() => setIsVideoCallPopupOpen(false)}
          />
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default Home;