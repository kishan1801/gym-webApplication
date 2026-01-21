import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  CameraIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EditTrainerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [certifications, setCertifications] = useState(['']);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Yoga',
    experience: '',
    bio: '',
    hourlyRate: '',
    availability: 'Full-time',
    isActive: true,
    socialLinks: {
      instagram: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
  });

  const specializations = [
    'Yoga', 'Cardio', 'Strength Training', 'CrossFit', 
    'Pilates', 'Zumba', 'MMA', 'Swimming', 'Dance', 'Nutrition'
  ];

  const availabilityOptions = [
    'Full-time', 'Part-time', 'Weekends', 'Evenings', 'Flexible'
  ];

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to edit trainer, redirecting...');
      navigate('/unauthorized');
    } else if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch trainer data
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && id) {
      fetchTrainerData();
      setCheckingAuth(false);
    }
  }, [id, currentUser]);

  const fetchTrainerData = async () => {
    try {
      setFetching(true);
      setError('');
      const response = await API.get(`/trainers/${id}`);
      if (response.data.success) {
        const trainer = response.data.trainer;
        
        setFormData({
          name: trainer.name || '',
          email: trainer.email || '',
          phone: trainer.phone || '',
          specialization: trainer.specialization || 'Yoga',
          experience: trainer.experience?.toString() || '',
          bio: trainer.bio || '',
          hourlyRate: trainer.hourlyRate?.toString() || '',
          availability: trainer.availability || 'Full-time',
          isActive: trainer.isActive !== undefined ? trainer.isActive : true,
          socialLinks: {
            instagram: trainer.socialLinks?.instagram || '',
            twitter: trainer.socialLinks?.twitter || '',
            linkedin: trainer.socialLinks?.linkedin || '',
            website: trainer.socialLinks?.website || ''
          }
        });

        // Set certifications
        if (trainer.certifications && trainer.certifications.length > 0) {
          setCertifications(trainer.certifications);
        } else {
          setCertifications(['']);
        }

        // Set preview image
        if (trainer.profileImage) {
          setPreviewImage(trainer.profileImage.startsWith('http') 
            ? trainer.profileImage 
            : `https://fitlyfy.onrender.com${trainer.profileImage}`);
        }
      } else {
        setError(response.data.error || 'Trainer not found');
      }
    } catch (err) {
      console.error('Error fetching trainer:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load trainer data';
      setError(errorMsg);
      
      // If unauthorized, maybe token expired
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and GIF images are allowed');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCertification = () => {
    setCertifications([...certifications, '']);
  };

  const handleCertificationChange = (index, value) => {
    const newCerts = [...certifications];
    newCerts[index] = value;
    setCertifications(newCerts);
  };

  const handleRemoveCertification = (index) => {
    const newCerts = certifications.filter((_, i) => i !== index);
    setCertifications(newCerts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'bio', 'experience', 'hourlyRate'];
      const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate numeric fields
      if (parseInt(formData.experience) < 0) {
        throw new Error('Experience cannot be negative');
      }

      if (parseFloat(formData.hourlyRate) < 0) {
        throw new Error('Hourly rate cannot be negative');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Prepare form data
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone.trim());
      data.append('specialization', formData.specialization);
      data.append('experience', formData.experience);
      data.append('bio', formData.bio.trim());
      data.append('hourlyRate', formData.hourlyRate);
      data.append('availability', formData.availability);
      data.append('isActive', formData.isActive);
      
      // Add certifications
      const validCerts = certifications.filter(cert => cert.trim() !== '');
      if (validCerts.length > 0) {
        validCerts.forEach(cert => {
          data.append('certifications[]', cert.trim());
        });
      }
      
      // Add social links
      const socialLinks = {};
      Object.keys(formData.socialLinks).forEach(key => {
        if (formData.socialLinks[key]?.trim()) {
          socialLinks[key] = formData.socialLinks[key].trim();
        }
      });
      if (Object.keys(socialLinks).length > 0) {
        data.append('socialLinks', JSON.stringify(socialLinks));
      }
      
      // Add profile image if exists
      if (selectedFile) {
        data.append('profileImage', selectedFile);
      }

      // Submit to backend
      const response = await API.put(`/trainers/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Trainer updated successfully!');
        
        // Show success notification
        showNotification('Trainer updated successfully!', 'success');
        
        // Redirect to trainer detail after 2 seconds
        setTimeout(() => {
          navigate(`/admin/trainers/${id}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating trainer:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update trainer');
      showNotification(err.response?.data?.message || err.message || 'Failed to update trainer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
    
    setTimeout(() => {
      notificationDiv.classList.add('animate-fade-out');
      setTimeout(() => notificationDiv.remove(), 300);
    }, 3000);
  };

  // If user is not admin, show unauthorized message
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">You need administrator privileges to access this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        {/* Admin Access Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 bg-gradient-to-r from-emerald-900/30 to-green-900/20 border border-emerald-700/50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-emerald-400 mr-3" />
              <div>
                <h3 className="font-bold text-white">Admin Access Granted</h3>
                <p className="text-sm text-gray-400">You have full administrative privileges</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm font-medium rounded-full">
                Admin: {currentUser.username}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-900/30 text-red-300 text-sm font-medium rounded-full hover:bg-red-800/50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-400">Loading trainer data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Admin Access Banner */}
        <div className="mb-6 bg-gradient-to-r from-emerald-900/30 to-green-900/20 border border-emerald-700/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-emerald-400 mr-3" />
            <div>
              <h3 className="font-bold text-white">Admin Access Granted</h3>
              <p className="text-sm text-gray-400">You have full administrative privileges</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm font-medium rounded-full">
              Admin: {currentUser.username}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-900/30 text-red-300 text-sm font-medium rounded-full hover:bg-red-800/50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to={`/admin/trainers/${id}`}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Trainer</h1>
              <p className="text-gray-400">Update trainer information</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.isActive 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' 
                : 'bg-red-900/30 text-red-400 border border-red-700/50'
            }`}>
              {formData.isActive ? 'Active Trainer' : 'Inactive Trainer'}
            </span>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-sm font-medium text-red-300">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-700/50 rounded-xl p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
              <p className="text-sm font-medium text-green-300">{success}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Profile Image
                </label>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden bg-gray-900/50">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-emerald-900/30">
                                <svg class="h-12 w-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <CameraIcon className="h-12 w-12 text-gray-500" />
                      )}
                    </div>
                    <label 
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <CameraIcon className="h-5 w-5" />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-400 mb-2">
                      Upload a new profile picture (JPEG, PNG, GIF)
                    </p>
                    <p className="text-xs text-gray-500">
                      Leave empty to keep current image
                    </p>
                    <p className="text-xs text-gray-500">
                      Max file size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="trainer@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="[0-9+\-\s\(\)]{10,}"
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="isActive" className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    id="isActive"
                    name="isActive"
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                    value={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                  >
                    <option value="true" className="bg-gray-800">Active</option>
                    <option value="false" className="bg-gray-800">Inactive</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="h-4 w-4 text-gray-500">▼</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-400" />
              Professional Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-2">
                  Specialization *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    id="specialization"
                    name="specialization"
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec} className="bg-gray-800">{spec}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="h-4 w-4 text-gray-500">▼</div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                  Experience (Years) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BriefcaseIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    max="50"
                    required
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="5"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-300 mb-2">
                  Hourly Rate ($) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="50.00"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-2">
                  Availability *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    id="availability"
                    name="availability"
                    className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                    value={formData.availability}
                    onChange={handleInputChange}
                  >
                    {availabilityOptions.map(option => (
                      <option key={option} value={option} className="bg-gray-800">{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="h-4 w-4 text-gray-500">▼</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                Certifications
              </label>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., ACE Certified, NASM Certified, etc."
                          value={cert}
                          onChange={(e) => handleCertificationChange(index, e.target.value)}
                        />
                      </div>
                    </div>
                    {certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-medium hover:bg-emerald-900/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Another Certification
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                Biography *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  required
                  maxLength="500"
                  className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about the trainer's background, philosophy, and approach..."
                  value={formData.bio}
                  onChange={handleInputChange}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {formData.bio.length}/500
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-gray-400" />
              Social Links (Optional)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['instagram', 'twitter', 'linkedin', 'website'].map((platform) => (
                <div key={platform}>
                  <label htmlFor={`socialLinks.${platform}`} className="block text-sm font-medium text-gray-300 mb-2">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id={`socialLinks.${platform}`}
                      name={`socialLinks.${platform}`}
                      type="url"
                      className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      placeholder={`https://${platform}.com/username`}
                      value={formData.socialLinks[platform]}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debug Info - Remove in production */}
          <div className="p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
            <p>Debug Info:</p>
            <p>Current User Role: {currentUser?.role}</p>
            <p>User ID: {currentUser?._id}</p>
            <p>Trainer ID: {id}</p>
            <p>Form Status: {formData.isActive ? 'Active' : 'Inactive'}</p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-800">
            <Link
              to={`/admin/trainers/${id}`}
              className="px-6 py-3 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-colors duration-200 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Trainer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrainerForm;