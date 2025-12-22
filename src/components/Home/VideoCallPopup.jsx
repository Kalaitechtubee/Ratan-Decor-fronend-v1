import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  FileText,
  Video,
  AlertCircle,
  Calendar,
  Clock,
  Check,
  X,
} from "lucide-react";
import appointmentApi from "../../features/VideoCall/appointmentApi";
import { useAuth } from "../../features/auth/hooks/useAuth";

const VideoCallPopup = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNo: user?.mobile || user?.phone || "",
    videoCallDate: "",
    videoCallTime: "",
    source: "Website",
    notes: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Update form data when user data becomes available or popup opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phoneNo: user.mobile || user.phone || prev.phoneNo,
      }));
    }
  }, [isOpen, user]);

  /* Removed redundant fetching logic */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const isValidPhone = (phone) =>
    /^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""));

  const nextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.email)) {
      setError("Please fill in name and email to continue.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.videoCallDate ||
      !formData.videoCallTime
    ) {
      setError("Please fill in all required fields (Name, Email, Date, Time).");
      setSubmitting(false);
      return;
    }
    if (formData.phoneNo && !isValidPhone(formData.phoneNo)) {
      setError("Please enter a valid phone number.");
      setSubmitting(false);
      return;
    }
    if (new Date(formData.videoCallDate) < new Date().setHours(0, 0, 0, 0)) {
      setError("Please select a future date.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await appointmentApi.createAppointment(
        formData,
        user
      );
      const newId = response.data?.id;
      if (!user) {
        localStorage.setItem("lastAppointmentId", newId);
        localStorage.setItem("lastAppointmentEmail", formData.email);
      }
      setSuccess(
        `Appointment created successfully! Your Appointment ID is ${newId}.`
      );
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phoneNo: user?.mobile || user?.phone || "",
        videoCallDate: "",
        videoCallTime: "",
        source: "Website",
        notes: "",
        status: "pending",
      });
      setCurrentStep(4);
      setTimeout(() => {
        onClose();
        setCurrentStep(1);
      }, 5000);
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(err.message || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 font-roboto text-xs ${step <= currentStep
              ? "bg-primary border-primary text-white"
              : "border-gray-300 text-gray-500"
              } font-medium`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-gray-300"
                }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-end z-50 p-4 backdrop-blur-sm pt-4 pr-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full h-[95vh] overflow-hidden transform transition-all duration-300 scale-100 font-roboto text-base flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent px-6 py-4 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-roboto">
                Schedule Video Consultation
              </h2>
              <p className="text-white text-opacity-90 text-xs font-roboto">
                Professional consultation at your convenience
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
              aria-label="Close Popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden p-4">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Video consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        </div>
        {/* Progress Bar */}
        {currentStep < 4 && (
          <div className="bg-gray-50 border-b px-6 pt-4">
            <StepIndicator />
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2 mb-4 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-red-800 font-medium text-xs font-roboto">
                  Please check your information
                </h4>
                <p className="text-red-700 text-xs mt-1 font-roboto">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-start space-x-2 mb-4 animate-fade-in">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-gray-800 font-medium text-xs font-roboto">
                  Appointment Scheduled!
                </h4>
                <p className="text-gray-700 text-xs mt-1 font-roboto">
                  {success}
                </p>
                <p className="text-gray-600 text-xs mt-2 font-roboto">
                  This window will close automatically...
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 font-roboto">
                  Personal Information
                </h3>
                <p className="text-gray-600 mt-1 text-xs font-roboto">
                  Let's start with your basic details
                </p>
              </div>

              {!user && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-xs text-gray-800 text-center font-roboto">
                    <span className="font-medium">Guest booking</span> •{" "}
                    <a href="/login" className="underline hover:text-primary">
                      Log in
                    </a>{" "}
                    or{" "}
                    <a
                      href="/register"
                      className="underline hover:text-primary"
                    >
                      register
                    </a>{" "}
                    to manage your appointments
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    <User className="w-4 h-4 inline mr-1 text-gray-500" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm font-roboto"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    <Mail className="w-4 h-4 inline mr-1 text-gray-500" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm font-roboto"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    <Phone className="w-4 h-4 inline mr-1 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm font-roboto"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Source Field - Display only (no dropdown) */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    Booking Source
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 text-sm font-roboto">
                    Website
                  </div>
                </div>
              </div>

              {/* Improved Professional Consultation Section */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-4 mt-4">
                <h3 className="text-base font-semibold text-primary text-center font-roboto mb-2">
                  What to Expect from Your Consultation
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs text-gray-700">
                  <div className="flex items-start space-x-2">
                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Personalized one-on-one session with our expert</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Secure and confidential video meeting</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Comprehensive discussion of your specific needs</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 font-medium text-sm font-roboto"
                >
                  Continue to Schedule
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Scheduling */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 font-roboto">
                  Schedule Your Session
                </h3>
                <p className="text-gray-600 mt-1 text-xs font-roboto">
                  Choose the date and time for your consultation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    <Calendar className="w-4 h-4 inline mr-1 text-gray-500" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="videoCallDate"
                    value={formData.videoCallDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm font-roboto"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 font-roboto">
                    <Clock className="w-4 h-4 inline mr-1 text-gray-500" />
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    name="videoCallTime"
                    value={formData.videoCallTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm font-roboto"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 font-roboto">
                  <FileText className="w-4 h-4 inline mr-1 text-gray-500" />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-sm font-roboto"
                  rows="3"
                  placeholder="Please share any specific topics you'd like to discuss, questions you have, or anything else we should know..."
                />
                <p className="text-xs text-gray-500 mt-1 font-roboto">
                  Optional: Help us prepare for our conversation
                </p>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm font-roboto"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 font-medium text-sm font-roboto"
                >
                  Review & Confirm
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 font-roboto">
                  Review Your Appointment
                </h3>
                <p className="text-gray-600 mt-1 text-xs font-roboto">
                  Please confirm your details before booking
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Name
                    </p>
                    <p className="text-gray-900 font-semibold text-sm font-roboto">
                      {formData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Email
                    </p>
                    <p className="text-gray-900 font-semibold text-sm font-roboto">
                      {formData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Phone
                    </p>
                    <p className="text-gray-900 font-semibold text-sm font-roboto">
                      {formData.phoneNo || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Source
                    </p>
                    <p className="text-gray-900 font-semibold text-sm font-roboto">
                      Website
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Date
                    </p>
                    <p className="text-gray-900 font-semibold text-sm font-roboto">
                      {formData.videoCallDate
                        ? new Date(formData.videoCallDate).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Time
                    </p>
                    <p className="text-gray-900 font-semibold text-sm font-roboto">
                      {formData.videoCallTime
                        ? new Date(
                          `2000-01-01T${formData.videoCallTime}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : ""}
                    </p>
                  </div>
                </div>
                {formData.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 font-roboto">
                      Additional Notes
                    </p>
                    <p className="text-gray-900 mt-1 text-sm font-roboto">
                      {formData.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm font-roboto"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm font-roboto"
                >
                  {submitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3 h-3" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-roboto">
                Appointment Confirmed!
              </h3>
              <p className="text-gray-600 mb-4 text-sm font-roboto">
                Your video consultation has been scheduled successfully.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-xs text-gray-600 mb-2 font-roboto">
                  We've sent a confirmation email with:
                </p>
                <ul className="text-xs text-gray-600 space-y-1 text-left font-roboto">
                  <li>• Meeting details and link</li>
                  <li>• Calendar invitation</li>
                  <li>• Preparation guidelines</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VideoCallPopup;