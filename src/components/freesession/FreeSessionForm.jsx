import React, { useState } from 'react';
import axios from 'axios';

const FreeSessionForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    fitnessGoals: '',
    preferredDate: '',
    preferredTime: '',
    experienceLevel: 'beginner',
    medicalConditions: '',
    heardAboutUs: '',
    termsAccepted: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'preferredDate', 'preferredTime'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      if (!formData.termsAccepted) {
        throw new Error('Please accept the terms and conditions');
      }

      // Phone validation (Indian format)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        throw new Error('Please enter a valid Indian phone number (10 digits starting with 6-9)');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''),
        submittedAt: new Date().toISOString(),
        status: 'pending',
        type: 'free_session'
      };

      console.log('Submitting free session request:', submissionData);

      // Submit to backend
      const response = await axios.post('https://fitlyfy.onrender.com/api/free-sessions', submissionData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('🎉 Your free session request has been submitted successfully! We will contact you shortly to confirm your session.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          age: '',
          gender: '',
          fitnessGoals: '',
          preferredDate: '',
          preferredTime: '',
          experienceLevel: 'beginner',
          medicalConditions: '',
          heardAboutUs: '',
          termsAccepted: false
        });

        // Call success callback
        if (onSuccess) onSuccess(response.data.data);

        // Auto close after 3 seconds
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Failed to submit request');
      }

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get max date (2 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🎯 Book Your Free Session</h2>
              <p className="text-gray-400 text-sm mt-1">Experience FITLYF with a complimentary workout session</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl p-2"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
              <div className="flex items-center">
                <span className="text-xl mr-3">⚠️</span>
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg">
              <div className="flex items-center">
                <span className="text-xl mr-3">✅</span>
                <div>
                  <p className="font-bold">Success!</p>
                  <p>{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="9876543210"
                  disabled={loading}
                  maxLength="10"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="80"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="25"
                  disabled={loading}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-300 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-gray-300 mb-2">Fitness Experience</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  disabled={loading}
                >
                  <option value="beginner">Beginner (New to fitness)</option>
                  <option value="intermediate">Intermediate (Some experience)</option>
                  <option value="advanced">Advanced (Regular exerciser)</option>
                  <option value="athlete">Athlete (Competitive training)</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  min={getTomorrowDate()}
                  max={getMaxDate()}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  disabled={loading}
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  disabled={loading}
                >
                  <option value="">Select Time Slot</option>
                  <option value="06:00-07:00">6:00 AM - 7:00 AM</option>
                  <option value="07:00-08:00">7:00 AM - 8:00 AM</option>
                  <option value="08:00-09:00">8:00 AM - 9:00 AM</option>
                  <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
                  <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                  <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
                  <option value="17:00-18:00">5:00 PM - 6:00 PM</option>
                  <option value="18:00-19:00">6:00 PM - 7:00 PM</option>
                  <option value="19:00-20:00">7:00 PM - 8:00 PM</option>
                  <option value="20:00-21:00">8:00 PM - 9:00 PM</option>
                </select>
              </div>

              {/* Fitness Goals */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Fitness Goals</label>
                <textarea
                  name="fitnessGoals"
                  value={formData.fitnessGoals}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="e.g., Weight loss, muscle gain, endurance training, general fitness..."
                  disabled={loading}
                />
              </div>

              {/* Medical Conditions */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Medical Conditions / Injuries (if any)</label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder="Please mention any medical conditions, injuries, or restrictions..."
                  disabled={loading}
                />
                <p className="text-gray-500 text-xs mt-1">
                  This information helps our trainers provide safe and effective guidance.
                </p>
              </div>

              {/* How did you hear about us? */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">How did you hear about us?</label>
                <select
                  name="heardAboutUs"
                  value={formData.heardAboutUs}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  disabled={loading}
                >
                  <option value="">Select an option</option>
                  <option value="google">Google Search</option>
                  <option value="social_media">Social Media (Instagram/Facebook)</option>
                  <option value="friend">Friend/Family Referral</option>
                  <option value="flyer">Flyer/Advertisement</option>
                  <option value="walk-in">Walk-in/Drove by</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Terms & Conditions */}
              <div className="md:col-span-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-brand-primary bg-gray-700 rounded focus:ring-2 focus:ring-brand-primary"
                    disabled={loading}
                  />
                  <span className="text-gray-300 text-sm">
                    I agree to the terms and conditions. I understand that this free session is for new clients only and subject to availability. I agree to receive communications from FITLYF regarding my session booking.
                    <span className="text-red-500"> *</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  'Book Free Session'
                )}
              </button>
            </div>
          </form>

          {/* What to Expect */}
          <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
            <h4 className="text-white font-semibold mb-3">📋 What to Expect:</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center">
                <span className="text-brand-primary mr-2">✓</span>
                <span>60-minute personalized workout session</span>
              </li>
              <li className="flex items-center">
                <span className="text-brand-primary mr-2">✓</span>
                <span>Fitness assessment by certified trainer</span>
              </li>
              <li className="flex items-center">
                <span className="text-brand-primary mr-2">✓</span>
                <span>Tour of our facilities</span>
              </li>
              <li className="flex items-center">
                <span className="text-brand-primary mr-2">✓</span>
                <span>Personalized fitness plan consultation</span>
              </li>
              <li className="flex items-center">
                <span className="text-brand-primary mr-2">✓</span>
                <span>No obligation to join</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>📞 Questions? Call us at +91-99999-99999</p>
            <p>📧 Or email: free-session@fitlyf.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSessionForm;