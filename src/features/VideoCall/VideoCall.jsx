// VideoCall.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, FileText, Video, Plus, AlertCircle, Calendar, Clock, Check } from 'lucide-react';
import appointmentApi from './appointmentApi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const VideoCall = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    videoCallDate: '',
    videoCallTime: '',
    source: '',
    notes: '',
    status: 'pending',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, email: '', name: '' });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser.id) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
      }));
    }
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.name || '',
        });
      } else {
        setCurrentUser({ id: null, email: '', name: '' });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setCurrentUser({ id: null, email: '', name: '' });
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const isValidPhone = phone => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!formData.name || !formData.email || !formData.videoCallDate || !formData.videoCallTime) {
      setError('Please fill in all required fields (Name, Email, Date, Time).');
      setSubmitting(false);
      return;
    }

    if (formData.phoneNo && !isValidPhone(formData.phoneNo)) {
      setError('Please enter a valid phone number.');
      setSubmitting(false);
      return;
    }

    if (new Date(formData.videoCallDate) < new Date().setHours(0, 0, 0, 0)) {
      setError('Please select a future date.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await appointmentApi.createAppointment(formData, currentUser);
      const newId = response.data?.id;

      if (!currentUser.id) {
        localStorage.setItem('lastAppointmentId', newId);
        localStorage.setItem('lastAppointmentEmail', formData.email);
      }

      setSuccess(
        `Appointment created successfully! Your Appointment ID is ${newId}. Use it with your email to view details, or log in/register to manage your appointments.`
      );

      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNo: '',
        videoCallDate: '',
        videoCallTime: '',
        source: '',
        notes: '',
        status: 'pending',
      });
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12">
        <Navbar />
        <div className="w-full max-w-3xl px-6 mt-10">

          {/* Header */}
          <div className="bg-white shadow-sm border-b rounded-t-2xl">
            <div className="px-6 py-8">
              <div className="flex items-center space-x-3">
                <div className="bg-[#ff4747] p-3 rounded-xl">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Video Call Scheduler</h1>
                  <p className="text-gray-600 mt-1">Schedule your video consultation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff4747] to-[#ff4747cc] px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Book New Appointment
              </h2>
            </div>

            <div className="p-6 space-y-6">

              {/* Error Box */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-medium">Error</h4>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Box */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="text-green-800 font-medium">Success</h4>
                    <p className="text-green-700 text-sm mt-1">{success}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40 
                        focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40 
                        focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40 
                        focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* Date Picker – Tailwind Styled */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" /> Date
                      </label>
                      <input
                        type="date"
                        name="videoCallDate"
                        value={formData.videoCallDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40
                          focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                        required
                      />
                    </div>

                    {/* Time Picker – Tailwind Styled */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" /> Time
                      </label>
                      <input
                        type="time"
                        name="videoCallTime"
                        value={formData.videoCallTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40
                          focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source/Referral
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40
                        focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                    >
                      <option value="">Select source</option>
                      <option value="Website">Website</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" /> Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
                        focus:outline-none focus:ring-2 focus:ring-[#ff4747]/40
                        focus:border-[#ff4747] hover:border-[#ff4747]/60 transition-all"
                      rows="4"
                      placeholder="Any additional information or special requests..."
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#ff4747] to-[#ff4747cc] text-white py-3 px-6 rounded-lg 
                    hover:from-[#e63e3e] hover:to-[#e63e3ecc]
                    transition-all duration-200 transform hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    font-medium flex items-center justify-center space-x-2 mt-4"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Fade Animation */}
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `}</style>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VideoCall;
