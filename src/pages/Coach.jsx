import React, { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  ClockIcon,
  PhotoIcon,
  DocumentTextIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  StarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Coach = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    specialization: '',
    experience: '',
    certification: '',
    availableDays: [],
    availableHours: '',
    bio: '',
    profilePhoto: null,
    resume: null,
    hourlyRate: '',
    maxClients: '',
    trainingStyle: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  const specializations = [
    'Personal Training',
    'Yoga Instructor',
    'Pilates Instructor',
    'Strength & Conditioning',
    'Nutrition Coach',
    'CrossFit Trainer',
    'Martial Arts',
    'Dance Fitness',
    'Senior Fitness',
    'Rehabilitation',
    'Sports Specific',
    'Weight Management',
    'Meditation & Mindfulness',
    'Pre/Post Natal'
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const trainingStyles = [
    'Strict & Disciplined',
    'Motivational & Supportive',
    'Educational & Technical',
    'Fun & Energetic',
    'Holistic & Wellness Focused',
    'Competition Oriented',
    'Beginner Friendly',
    'Advanced Techniques'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        availableDays: checked 
          ? [...prev.availableDays, value]
          : prev.availableDays.filter(day => day !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (name === 'profilePhoto' && file) {
      setSelectedImage(URL.createObjectURL(file));
    }
    
    if (name === 'resume' && file) {
      setSelectedFile(file);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (formData.availableDays.length === 0) newErrors.availableDays = 'Select at least one day';
    if (!formData.availableHours) newErrors.availableHours = 'Available hours are required';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';
    if (!formData.maxClients) newErrors.maxClients = 'Maximum clients is required';
    if (!formData.trainingStyle) newErrors.trainingStyle = 'Training style is required';
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 100) {
      newErrors.bio = 'Bio must be at least 100 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form data
      Object.keys(formData).forEach(key => {
        if (key === 'availableDays') {
          formData[key].forEach(day => {
            formDataToSend.append('availableDays', day);
          });
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('https://fitlyfy.onrender.com/api/coach/apply', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          specialization: '',
          experience: '',
          certification: '',
          availableDays: [],
          availableHours: '',
          bio: '',
          profilePhoto: null,
          resume: null,
          hourlyRate: '',
          maxClients: '',
          trainingStyle: ''
        });
        setSelectedImage(null);
        setSelectedFile(null);
        setErrors({});
        
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        if (data.errors) {
          const serverErrors = {};
          data.errors.forEach(err => {
            Object.keys(formData).forEach(key => {
              if (err.toLowerCase().includes(key.toLowerCase())) {
                serverErrors[key] = err;
              }
            });
          });
          setErrors(serverErrors);
        } else if (data.message) {
          alert(data.message);
        }
      }
    } catch (error) {
      // console.error('Submission error:', error);
      alert('Failed to submit application. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'professional', name: 'Professional', icon: BriefcaseIcon },
    { id: 'availability', name: 'Availability', icon: ClockIcon },
    { id: 'additional', name: 'Additional', icon: DocumentTextIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Success Message */}
      {isSuccess && (
        <div className="fixed top-24 right-4 z-50 max-w-md animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-sm border border-emerald-500/50 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-emerald-100 text-sm">
                  Thank you for applying to become a FITLYF coach. Our team will review your application 
                  and contact you within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl shadow-2xl mb-6">
            <UserIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
            Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary text-white ">FITLYF Coach</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Join our elite team of certified fitness professionals and transform lives through personalized coaching
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {[
            { label: 'Average Earnings', value: '$4,200', icon: CurrencyDollarIcon, color: 'from-green-500 to-green-600' },
            { label: 'Coach Rating', value: '4.9/5', icon: StarIcon, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Active Clients', value: '850+', icon: UserIcon, color: 'from-blue-500 to-blue-600' },
            { label: 'Success Rate', value: '96%', icon: ShieldCheckIcon, color: 'from-purple-500 to-purple-600' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className={`text-3xl transform group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div> */}

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-gray-800/50 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary text-white">Join</span> FITLYF?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Flexible Freedom', 
                desc: 'Work remotely, set your own schedule, choose your clients',
                icon: ClockIcon,
                color: 'from-blue-500/20 to-blue-600/20',
                border: 'border-blue-500/30'
              },
              { 
                title: 'Premium Earnings', 
                desc: 'Earn 70-85% commission, no hidden fees, weekly payments',
                icon: CurrencyDollarIcon,
                color: 'from-green-500/20 to-green-600/20',
                border: 'border-green-500/30'
              },
              { 
                title: 'Full Support System', 
                desc: 'Marketing, client matching, tech platform, and 24/7 support',
                icon: ShieldCheckIcon,
                color: 'from-purple-500/20 to-purple-600/20',
                border: 'border-purple-500/30'
              },
            ].map((benefit, index) => (
              <div 
                key={index} 
                className={`group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} ${benefit.border} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{benefit.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{benefit.desc}</p>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                  : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Card */}
          <div className={`bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-2xl transition-all duration-500 ${activeTab === 'personal' ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  <p className="text-gray-400 text-sm">Tell us about yourself</p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full">
                Step 1 of 4
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    First Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.firstName ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Last Name *
                  </span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.lastName ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    Email Address *
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.email ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    Phone Number *
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.phone ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200`}
                  placeholder="+91 1234567890"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    City *
                  </span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.city ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200`}
                  placeholder="bengaluru"
                />
                {errors.city && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    State / Province
                  </span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
                  placeholder="Karnataka"
                />
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className={`bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-2xl transition-all duration-500 ${activeTab === 'professional' ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Professional Information</h2>
                  <p className="text-gray-400 text-sm">Your qualifications and expertise</p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full">
                Step 2 of 4
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialization */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4" />
                    Specialization *
                  </span>
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.specialization ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 appearance-none`}
                >
                  <option value="" className="bg-gray-800">Select your specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec} className="bg-gray-800">
                      {spec}
                    </option>
                  ))}
                </select>
                {errors.specialization && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.specialization}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Years of Experience *
                  </span>
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.experience ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 appearance-none`}
                >
                  <option value="" className="bg-gray-800">Select experience</option>
                  {[1,2,3,4,5,6,7,8,9,10,'10+'].map((year) => (
                    <option key={year} value={year} className="bg-gray-800">
                      {year} {year === 1 ? 'year' : 'years'}
                    </option>
                  ))}
                </select>
                {errors.experience && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.experience}
                  </p>
                )}
              </div>

              {/* Hourly Rate */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Hourly Rate (Rupees) *
                  </span>
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="20"
                  max="200"
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.hourlyRate ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200`}
                  placeholder="40"
                />
                {errors.hourlyRate && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              {/* Max Clients */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Maximum Clients *
                  </span>
                </label>
                <select
                  name="maxClients"
                  value={formData.maxClients}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.maxClients ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 appearance-none`}
                >
                  <option value="" className="bg-gray-800">Select maximum clients</option>
                  {[5,10,15,20,25,30,'30+'].map((num) => (
                    <option key={num} value={num} className="bg-gray-800">
                      {num} clients
                    </option>
                  ))}
                </select>
                {errors.maxClients && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.maxClients}
                  </p>
                )}
              </div>

              {/* Training Style */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Training Style *
                  </span>
                </label>
                <select
                  name="trainingStyle"
                  value={formData.trainingStyle}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                    errors.trainingStyle ? 'border-red-500/50' : 'border-gray-700/50'
                  } rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 appearance-none`}
                >
                  <option value="" className="bg-gray-800">Select your training style</option>
                  {trainingStyles.map((style) => (
                    <option key={style} value={style} className="bg-gray-800">
                      {style}
                    </option>
                  ))}
                </select>
                {errors.trainingStyle && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.trainingStyle}
                  </p>
                )}
              </div>

              {/* Certification */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 group-hover:text-white transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4" />
                    Certifications
                  </span>
                </label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
                  placeholder="NASM, ACE, ISSA, etc."
                />
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className={`bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-2xl transition-all duration-500 ${activeTab === 'availability' ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Availability</h2>
                  <p className="text-gray-400 text-sm">When are you available for sessions?</p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full">
                Step 3 of 4
              </span>
            </div>
            
            {/* Available Days */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Available Days * {errors.availableDays && (
                  <span className="text-red-400 ml-2 text-sm font-normal">
                    <XCircleIcon className="h-4 w-4 inline mr-1" />
                    {errors.availableDays}
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {daysOfWeek.map((day) => (
                  <label
                    key={day}
                    className={`group relative flex items-center justify-center p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      formData.availableDays.includes(day)
                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-transparent transform scale-105 shadow-lg shadow-brand-primary/30'
                        : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="availableDays"
                      value={day}
                      checked={formData.availableDays.includes(day)}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="font-medium text-sm">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Available Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Preferred Hours *
              </label>
              <select
                name="availableHours"
                value={formData.availableHours}
                onChange={handleChange}
                className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                  errors.availableHours ? 'border-red-500/50' : 'border-gray-700/50'
                } rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 appearance-none`}
              >
                <option value="">Select preferred hours</option>
                <option value="morning" className="bg-gray-800">Morning (6 AM - 12 PM)</option>
                <option value="afternoon" className="bg-gray-800">Afternoon (12 PM - 6 PM)</option>
                <option value="evening" className="bg-gray-800">Evening (6 PM - 10 PM)</option>
                <option value="weekends" className="bg-gray-800">Weekends Only</option>
                <option value="flexible" className="bg-gray-800">Flexible Schedule</option>
              </select>
              {errors.availableHours && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  {errors.availableHours}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          <div className={`bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-2xl transition-all duration-500 ${activeTab === 'additional' ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Additional Information</h2>
                  <p className="text-gray-400 text-sm">Tell us more about your approach</p>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full">
                Step 4 of 4
              </span>
            </div>
            
            {/* Bio */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Bio / Introduction * ({formData.bio.length}/500 characters)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="6"
                maxLength="500"
                className={`w-full bg-gray-800/50 backdrop-blur-sm border ${
                  errors.bio ? 'border-red-500/50' : 'border-gray-700/50'
                } rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 resize-none`}
                placeholder="Describe your coaching philosophy, training approach, client success stories, and why you want to join FITLYF..."
              />
              {errors.bio && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  {errors.bio}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-400 text-right">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <span className="flex items-center gap-2">
                    <PhotoIcon className="w-4 h-4" />
                    Profile Photo (Optional)
                  </span>
                </label>
                <div className={`group border-2 border-dashed ${
                  selectedImage ? 'border-green-500/50' : 'border-gray-700/50'
                } rounded-2xl p-8 transition-all duration-300 hover:border-brand-primary/50 hover:bg-gray-800/30`}>
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profilePhoto"
                  />
                  <label htmlFor="profilePhoto" className="cursor-pointer block">
                    {selectedImage ? (
                      <div className="space-y-6">
                        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-brand-primary/50 group-hover:border-brand-primary transition-all duration-300">
                          <img 
                            src={selectedImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-center text-green-400 text-sm font-medium">
                          ✓ Photo selected. Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <PhotoIcon className="w-10 h-10 text-gray-500 group-hover:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-300 font-medium mb-1 group-hover:text-white">Upload Profile Photo</p>
                          <p className="text-gray-500 text-sm">JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                        <button
                          type="button"
                          className="text-brand-primary text-sm font-medium hover:text-brand-secondary transition-colors duration-200"
                        >
                          Click to browse
                        </button>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <span className="flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    Resume / CV (Optional)
                  </span>
                </label>
                <div className={`group border-2 border-dashed ${
                  selectedFile ? 'border-green-500/50' : 'border-gray-700/50'
                } rounded-2xl p-8 transition-all duration-300 hover:border-brand-primary/50 hover:bg-gray-800/30`}>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx,.pages"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume"
                  />
                  <label htmlFor="resume" className="cursor-pointer block">
                    {selectedFile ? (
                      <div className="space-y-6 text-center">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <DocumentTextIcon className="w-10 h-10 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-green-400 font-medium mb-1 text-sm truncate max-w-xs mx-auto">
                            ✓ {selectedFile.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <p className="text-gray-400 text-sm">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <DocumentTextIcon className="w-10 h-10 text-gray-500 group-hover:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-300 font-medium mb-1 group-hover:text-white">Upload Resume</p>
                          <p className="text-gray-500 text-sm">PDF, DOC, DOCX (Max 10MB)</p>
                        </div>
                        <button
                          type="button"
                          className="text-brand-primary text-sm font-medium hover:text-brand-secondary transition-colors duration-200"
                        >
                          Click to browse
                        </button>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'personal'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              disabled={activeTab === 'personal'}
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'additional'
                  ? 'hidden'
                  : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:shadow-2xl hover:shadow-brand-primary/30'
              }`}
            >
              Next →
            </button>

            {activeTab === 'additional' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-[1.02] ${
                  isSubmitting
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:shadow-2xl hover:shadow-brand-primary/40'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Submit Application
                    <ArrowRightIcon className="ml-3 h-5 w-5" />
                  </span>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Testimonial Section */}
        {/* <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Hear From <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Our Coaches</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              See what current FITLYF coaches have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Yoga Specialist",
                quote: "FITLYF gave me the freedom to build my own schedule while providing incredible client support.",
                earnings: "$4,800/mo",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b786d4d4?w=400&q=80"
              },
              {
                name: "Marcus Chen",
                role: "Strength Coach",
                quote: "The platform handles all the business side, letting me focus on what I love - training clients.",
                earnings: "$5,200/mo",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
              },
              {
                name: "Jessica Williams",
                role: "Nutrition Coach",
                quote: "Best decision I made for my career. The support system and earning potential are unmatched.",
                earnings: "$4,500/mo",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-primary/50"
                  />
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-brand-primary text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="text-green-400 font-bold">{testimonial.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Coach;