import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import berryBeansLogo from "../assets/images/BerryBeans.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const mainCategories = [
    { id: "plywood", name: "Plywood" },
    { id: "mica", name: "Mica" },
    { id: "veneer", name: "Veneer" },
    { id: "flush-doors-frames", name: "Flush Door & Frames" },
    { id: "louvers", name: "Louvers" },
    { id: "decorative-sheets", name: "Decorative Sheets" },
    { id: "others", name: "Others" },
  ];

  const socialLinks = [
    { Icon: FaFacebookF, color: "#1877F2", name: "Facebook", href: "https://www.facebook.com/ratandecor " },
    { Icon: FaInstagram, color: "#E4405F", name: "Instagram", href: "https://www.instagram.com/ratan_decor" },
    { Icon: FaYoutube, color: "#FF0000", name: "YouTube", href: "https://www.youtube.com/@RatanDecor" },
  ];

  return (
    <footer className="bg-neutral-900 text-white pt-8 pb-4">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-2 sm:pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
          {/* Need Help Section */}
          <div className="lg:pr-4 xl:pr-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-[16px] sm:text-[15px] font-semibold text-white mb-1">
                Need Help?
              </h3>
              <p className="text-[15px] sm:text-[14px] text-gray-300 leading-relaxed">
                We're available to answer your queries and assist with your
                orders.
              </p>

              {/* Phone */}
              <div className="flex items-start gap-3 mt-3 group cursor-pointer">
                <FaPhone
                  className="text-[18px] mt-3 text-white flex-shrink-0 transform rotate-90 
                             transition-all duration-300 group-hover:text-[#ff4747] group-hover:scale-110"
                />
                <div>
                  <p className="text-[14px] sm:text-[13px] text-gray-400 mb-1">
                    Monday - Friday: 8am-9pm
                  </p>
                  <p className="text-[15px] sm:text-[14px] font-medium text-white">
                    +91-XXXXXXXXXX
                  </p>
                  <p className="text-[15px] sm:text-[14px] font-medium text-white mt-0.5">
                    +91-YYYYYYYYYY
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 mt-3 group cursor-pointer">
                <FaEnvelope
                  className="text-[18px] mt-1 text-white flex-shrink-0 
                             transition-all duration-300 group-hover:text-[#ff4747] group-hover:scale-110"
                />
                <div>
                  <p className="text-[14px] sm:text-[13px] text-gray-400 mb-1">
                    Need help with your order?
                  </p>
                  <p className="text-[15px] sm:text-[14px] font-medium text-white">
                    support@ratandecor.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Explore More */}
          <div className="lg:px-2 xl:px-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-[16px] sm:text-[15px] font-semibold text-white mb-1">
                Explore More
              </h3>
              <ul className="space-y-2">
                {[
                  { text: "Home", route: "/" },
                  { text: "Company", route: "/about" },
                  { text: "Shop", route: "/products" },
                  { text: "Contact us", route: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.route}
                      className="text-[15px] sm:text-[14px] text-gray-300 hover:text-[#ff4747] hover:underline transition-all duration-200"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Categories Section */}
          <div className="lg:px-2 xl:px-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-[16px] sm:text-[15px] font-semibold text-white mb-1">
                Categories
              </h3>
              <ul className="space-y-2">
                {mainCategories.length > 0 ? (
                  mainCategories.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/products?category=${item.id}`}
                        className="text-[15px] sm:text-[14px] text-gray-300 hover:text-[#ff4747] hover:underline transition-all duration-200"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <p className="text-[13px] sm:text-[12px] text-gray-400 text-center italic">
                      No categories available
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Help & Support + Follow Us */}
          <div className="lg:pl-4 xl:pl-6">
            <div className="flex flex-col gap-6">
              {/* Help & Support Links */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[16px] sm:text-[15px] font-semibold text-white mb-1">
                  Help & Support
                </h3>
                <ul className="space-y-2">
                  {[
                    {
                      text: "Returns and refunds policy",
                      route: "/returns-and-refunds-policy",
                    },
                    { text: "Disclaimer", route: "/disclaimer" },
                    { text: "Terms of use", route: "/terms" },
                    { text: "Privacy policy", route: "/privacy" },
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.route}
                        className="text-[15px] sm:text-[14px] text-gray-300 hover:text-[#ff4747] hover:underline transition-all duration-200"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow Us Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[16px] sm:text-[15px] font-semibold text-white mb-2">
                  Follow Us
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {socialLinks.map(({ Icon, color, name, href }, index) => (
                    <a
                      key={index}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${name}`}
                      className="group"
                    >
                      <Icon
                        className="text-[26px] text-white transition-all duration-300 group-hover:scale-110"
                        style={{ color: "white" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = color)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "white")
                        }
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800 bg-#171717">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-5 pb-3 sm:pt-5">
          <div
            className="
        flex flex-wrap items-center
        gap-x-2 gap-y-1
        text-[14px] sm:text-[13px] text-gray-400
        leading-relaxed
      "
          >
            <span>
              Copyright © {currentYear} Ratan Decor. All rights reserved
            </span>

            <span className="text-gray-500 select-none">|</span>

            <span>Developed by</span>

            <a
              href="https://www.berrybeans.co/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BerryBeans website"
              className="inline-flex items-center gap-1 group"
            >
              <img
                src={berryBeansLogo}
                alt="BerryBeans"
                className="
            h-5 sm:h-6
            w-auto object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
