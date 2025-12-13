import React from 'react';
import About from '../Pages/About';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  // Static categories data
  const staticCategories = [
    { id: 1, name: 'Furniture' },
    { id: 2, name: 'Lighting' },
    { id: 3, name: 'Decor' },
    { id: 4, name: 'Textiles' },
    { id: 5, name: 'Storage' },
    { id: 6, name: 'Outdoor' },
    { id: 7, name: 'Kitchen' },
    { id: 8, name: 'Accessories' },
  ];

  return (
    <footer className="bg-neutral-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Need Help Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold text-white">
              Need Help?
            </h3>
            <p className="text-[13px] text-gray-300">
              We're available to answer your queries and assist with your orders.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <FaPhone className="text-[22px] text-accent" />
              <div>
                <p className="text-[12px] text-gray-400">
                  Monday - Friday: 8am-9pm
                </p>
                <p className="text-[16px] font-semibold text-white">
                  +91-XXXXXXXXXX
                </p>
                <p className="text-[16px] font-semibold text-white mt-1">
                  +91-YYYYYYYYYY
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <FaEnvelope className="text-[22px] text-accent" />
              <div>
                <p className="text-[12px] text-gray-400">
                  Need help with your order?
                </p>
                <p className="text-[14px] font-semibold text-white">
                  support@ratandecor.com
                </p>
              </div>
            </div>
          </div>

          {/* Explore More */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold text-white">
              Explore More
            </h3>
            <ul className="space-y-1.5">
              {[
                { text: 'Home', route: '/' },
                { text: 'About us', route: '/about' },
                { text: 'Shop', route: '/products' },
                { text: 'Blogs', route: '/blogs' },
                { text: 'Contact us', route: '/contact' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.route}
                    className="text-[13px] text-gray-300 hover:text-accent hover:underline transition-all duration-200 cursor-pointer"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold text-white">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {staticCategories.length > 0 ? (
                staticCategories.map((item, index) => (
                  <li key={item.id || index}>
                    <Link
                      to={`/products?categoryId=${item.id}`}
                      className="text-[13px] text-gray-300 hover:text-accent hover:underline transition-all duration-200 cursor-pointer"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <p className="text-[12px] text-gray-400 text-center italic mt-2">
                    No categories available
                  </p>
                </li>
              )}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold text-white">
              Help & Support
            </h3>
            <ul className="space-y-1.5">
              {[
                { text: 'Returns and refunds policy', route: '/Returns-and-refunds-policy' },
                { text: 'Disclaimer', route: '/Disclaimer' },
                { text: 'Terms of use', route: '/Terms' },
                { text: 'Privacy policy', route: '/Privacy' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.route}
                    className="text-[13px] text-gray-300 hover:text-accent hover:underline transition-all duration-200 cursor-pointer"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with Us & Download App */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-2">
                Download Our App
              </h3>
              <div className="flex flex-col gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play"
                  className="w-[100px] sm:w-[110px] md:w-[120px] cursor-pointer hover:opacity-80 transition-opacity duration-300"
                />
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="w-[100px] sm:w-[110px] md:w-[120px] cursor-pointer hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-2">
                Follow Us
              </h3>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                {[
                  { Icon: FaFacebookF, color: '#4267B2' },
                  { Icon: FaTwitter, color: '#1DA1F2' },
                  { Icon: FaInstagram, color: '#E1306C' },
                  { Icon: FaLinkedinIn, color: '#0077B5' },
                  { Icon: FaYoutube, color: '#FF0000' },
                ].map(({ Icon, color }, index) => (
                  <Icon
                    key={index}
                    className="text-[24px] sm:text-[28px] cursor-pointer transition-all duration-300"
                    style={{ color }}
                    aria-label={`Visit our ${Icon.name} page`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[13px] text-gray-400 text-center w-full">
          Copyright 2025 © Ratan Decor
        </p>
      </div>
    </footer>
  );
};

export default Footer;