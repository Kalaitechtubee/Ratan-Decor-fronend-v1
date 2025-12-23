import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactService } from "../services/apiServices";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent non-digit input for phone number
    if (name === "phoneNumber" && value !== "" && !/^\d*$/.test(value)) return;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Please enter your name.";
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Please enter your phone number.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    if (!formData.location.trim()) {
      tempErrors.location = "Please enter your location.";
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Please write a message.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await ContactService.submitContactForm(formData);
      setSubmitMessage(
        "Thank you for your message! We will get back to you soon."
      );
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        location: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setSubmitMessage(
        error.message || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-14 min-h-screen font-sans">
        <div className="rounded-lg shadow-sm p-6 sm:p-8 ">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
           Request a Quote / 

            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
              Product Enquiry
            </h2>
            <div className="w-12 h-1 bg-red-600"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Form Section */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone and Location Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Your phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                        errors.phoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Your location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                        errors.location
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Write a message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-none ${
                      errors.message
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                    }`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-8 py-3 rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed focus:ring-gray-400"
                        : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                    }`}
                  >
                    {loading ? "Sending..." : "Send a Message"}
                  </button>
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div
                    className={`mt-4 p-3 rounded-lg text-sm ${
                      submitMessage.includes("Thank you")
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
               Let’s Discuss Your Requirement
                </h2>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
Tell us your requirements and our team will get back to you with product details, pricing, and expert guidance for your project.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-gray-600 mt-1" />
                  <p className="text-gray-900 font-medium text-base sm:text-lg">
                    08046076687
                  </p>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-gray-600 mt-1" />
                  <p className="text-gray-900 font-medium text-base sm:text-lg">
                    info@example.com
                  </p>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <p className="text-gray-900 font-medium text-base sm:text-lg leading-relaxed">
                    Ratan Decor No. 136, Sydenhams Lane, Opposite Nehru Indoor
                    Stadium, Gate No. 1, Sydenhams Road, Periamet, Chennai -
                    600003, Tamil Nadu, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
