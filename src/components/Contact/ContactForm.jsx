import React, { useState } from 'react';
import API from '../../api';
import {
  PaperClipIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file size (5MB max)
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('File size should not exceed 5MB');
      return;
    }
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Only images, PDFs, and documents are allowed');
      return;
    }
    
    // Limit to 3 files
    if (files.length + selectedFiles.length > 3) {
      setError('Maximum 3 files allowed');
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill all required fields');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      
      // Append files
      files.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const response = await API.post('/contact/submit', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setFiles([]);
        
        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.response?.data?.message || 'Failed to submit contact form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Connect With <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary  text-white">Our Team</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Have questions or ready to begin your fitness journey? Our expert team is here to guide you every step of the way
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800/50 h-full overflow-hidden">
              {/* Animated background */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-secondary/10 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-6 sm:mb-8">
                  Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Details</span>
                </h3>
                
                <div className="space-y-6 sm:space-y-8">
                  {/* Address */}
                  <div className="group flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MapPinIcon className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Visit Our Center</h4>
                      <p className="text-gray-300 text-sm sm:text-base">Bengaluru, Karnataka 560029</p>
                      {/* <p className="text-gray-400 text-sm">Gym City, GC 10001</p> */}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <PhoneIcon className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Call Us</h4>
                      <p className="text-gray-300 text-sm sm:text-base">+91 9390147883</p>
                      <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <EnvelopeIcon className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Email Support</h4>
                      <p className="text-gray-300 text-sm sm:text-base">fitlyfhelp@gmail.com</p>
                      <p className="text-gray-400 text-sm">24/7 Support</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="group flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ClockIcon className="h-6 w-6 text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">Operating Hours</h4>
                      <p className="text-gray-300 text-sm sm:text-base">Monday - Friday: 6AM - 10PM</p>
                      <p className="text-gray-400 text-sm">Saturday - Sunday: 7AM - 8PM</p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="mt-8 pt-8 border-t border-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-lg flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Guaranteed Response Time</p>
                      <p className="text-gray-400 text-sm mt-1">Within 24 hours during business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800/50">
              <div className="relative">
                <h3 className="text-2xl font-bold text-white mb-6 sm:mb-8">
                  Send Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Message</span>
                </h3>
                
                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-700/50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-green-400 font-bold text-lg">Message sent successfully!</p>
                        <p className="text-green-300 text-sm sm:text-base mt-1">
                          Thank you for contacting FITLYF. Our team will respond within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-red-900/30 to-rose-900/30 backdrop-blur-sm border border-red-700/50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ExclamationCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-red-400 font-bold text-lg">Attention Required</p>
                        <p className="text-red-300 text-sm sm:text-base mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-500">*</span> Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-500 group-hover:text-brand-primary transition-colors duration-300" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300 hover:border-gray-600"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-500">*</span> Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-500 group-hover:text-brand-primary transition-colors duration-300" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300 hover:border-gray-600"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-500 group-hover:text-brand-primary transition-colors duration-300" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300 hover:border-gray-600"
                          placeholder="+91 1234567890"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <span className="text-red-500">*</span> Inquiry Type
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300 hover:border-gray-600"
                        required
                      >
                        <option value="">Select inquiry type</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Membership">Membership Information</option>
                        <option value="Personal Training">Personal Training</option>
                        <option value="Group Classes">Group Classes</option>
                        <option value="Corporate Membership">Corporate Membership</option>
                        <option value="Feedback">Feedback & Suggestions</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="text-red-500">*</span> Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="block w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300 hover:border-gray-600 resize-none"
                      placeholder="Please describe your inquiry in detail. The more information you provide, the better we can assist you."
                      required
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-400">
                        Minimum 10 characters required
                      </p>
                      <p className={`text-sm font-medium ${
                        formData.message.length < 10 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {formData.message.length} / 10 characters
                      </p>
                    </div>
                  </div>

                  {/* File Upload */}
                  {/* <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Attachments <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700/50 rounded-xl cursor-pointer bg-gray-900/30 hover:bg-gray-800/50 transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <PaperClipIcon className="h-5 w-5 text-gray-400 group-hover:text-brand-primary transition-colors duration-300" />
                          </div>
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Images, PDFs, DOC up to 5MB • Maximum 3 files
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
                        />
                      </label>
                    </div>

                     
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 bg-gray-900/30 border border-gray-700/50 rounded-lg hover:bg-gray-800/30 transition-colors duration-300"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded flex items-center justify-center">
                                <PaperClipIcon className="h-4 w-4 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm text-white truncate max-w-xs">{file.name}</p>
                                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-red-400 transition-colors duration-300" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div> */}

                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Sending Your Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Privacy Note */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                      By submitting this form, you agree to our{' '}
                      <a href="/privacy" className="text-brand-primary hover:text-brand-secondary font-medium transition-colors duration-300">
                        Privacy Policy
                      </a>
                      . We respect your privacy and never share your information.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-primary/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Common <span className="text-brand-primary">Questions</span>
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      q: "How soon will I get a response?",
                      a: "We typically respond within 24 hours during business days. For urgent matters, you can call our support line."
                    },
                    {
                      q: "What information should I include?",
                      a: "Please provide your name, contact details, and a clear description of your inquiry to help us serve you better."
                    },
                    {
                      q: "Can I visit in person?",
                      a: "Yes! Our facility is open 6AM-10PM on weekdays and 7AM-8PM on weekends. We offer free tours for prospective members."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="p-3 hover:bg-gray-800/30 rounded-xl transition-colors duration-300">
                      <p className="text-gray-300 font-medium mb-1">{faq.q}</p>
                      <p className="text-gray-400 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;