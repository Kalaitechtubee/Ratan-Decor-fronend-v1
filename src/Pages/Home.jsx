import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeSlider from "../components/HomeSlider";

import { fetchProducts } from "../features/product/productSlice";
import { openPopup } from "../features/userType/userTypeSlice";
import UserTypePopup from "../features/userType/components/UserTypePopup";

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
  const { userType, userRole, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const { isPopupOpen } = useSelector((state) => state.userType);

  const [showUserTypePopup, setShowUserTypePopup] = useState(false);
  const [isVideoCallPopupOpen, setIsVideoCallPopupOpen] = useState(false);

  const hasFetchedRef = useRef(false);
  const popupTriggeredRef = useRef(false);

  /* ---------------- USER TYPE POPUP LOGIC ---------------- */

  useEffect(() => {
    if (popupTriggeredRef.current) return;

    const userTypeConfirmed =
      localStorage.getItem("userTypeConfirmed") === "true";

    if (!userTypeConfirmed) {
      dispatch(openPopup());
      popupTriggeredRef.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    setShowUserTypePopup(isPopupOpen);
  }, [isPopupOpen]);

  /* ---------------- FETCH PRODUCTS ---------------- */

  useEffect(() => {
    const userTypeConfirmed =
      localStorage.getItem("userTypeConfirmed") === "true";

    const storedUserType = localStorage.getItem("userType") || "general";
    const storedUserRole = userRole || "customer";

    if (userTypeConfirmed && !hasFetchedRef.current) {
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

  /* ---------------- ERROR HANDLING ---------------- */

  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 4000 });
    }
  }, [error]);

  /* ---------------- POPUP CLOSE ---------------- */

  const handleCloseUserTypePopup = () => {
    setShowUserTypePopup(false);
    localStorage.setItem("userTypeConfirmed", "true");
    hasFetchedRef.current = false;

    const storedUserType = localStorage.getItem("userType") || "general";
    const storedUserRole = userRole || "customer";

    dispatch(
      fetchProducts({
        page: 1,
        limit: 8,
        userType: storedUserType,
        userRole: storedUserRole,
      })
    );
  };

  /* ---------------- LOADING STATE ---------------- */

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

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {showUserTypePopup && (
          <UserTypePopup onClose={handleCloseUserTypePopup} />
        )}

        <div
          className={`transition-opacity duration-300 ${
            showUserTypePopup
              ? "opacity-30 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <Navbar />
          <HomeSlider />

          {/* ✅ MOBILE RESPONSIVE PADDING FIX HERE */}
          <main className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-8 md:py-4 lg:py-0 pb-24 md:pb-0">
            {/* Popular Categories */}
            <section className="py-8 sm:py-10">
              <PopularCategories />
            </section>

            {/* Features */}
            <section className="py-8 sm:py-10">
              <FeaturesSection />
            </section>

            {/* Counter */}
            <section className="py-8 sm:py-10">
              <CounterComponent />
            </section>

            {/* Video Content */}
            <section className="py-8 sm:py-10">
              <VideoContentSection
                onOpenVideoCallPopup={() => setIsVideoCallPopupOpen(true)}
              />
            </section>

            {/* Contact */}
            <section className="py-8 sm:py-10">
              <Contact isHome />
            </section>
          </main>
        </div>
      </div>

      {/* Video Call Popup */}
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
