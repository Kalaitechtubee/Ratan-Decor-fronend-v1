import { motion } from 'framer-motion';
import { FaSync } from 'react-icons/fa';
import { ChefHat, Building2, Home } from 'lucide-react';

// Custom Down Arrow SVG Component
const DownArrowIcon = () => (
  <svg
    width="14"
    height="10"
    viewBox="0 0 10 6"
    fill="#ff4747"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0 L5 6 L10 0 Z" />
  </svg>
);

export default function FloatingActionButtons({ currentUserType, setIsUserTypePopupOpen }) {
  // UserType is now integrated into the navbar, so this component returns null
  return null;
}
