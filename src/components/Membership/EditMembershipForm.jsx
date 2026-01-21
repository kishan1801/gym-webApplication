import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import { IndianRupee } from 'lucide-react';
import {
  XMarkIcon,
  CreditCardIcon,
  TagIcon,
  CalendarIcon,
  SparklesIcon,
  UserGroupIcon,
  FireIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const EditMembershipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    durationType: 'months',
    features: '',
    maxClassesPerWeek: '',
    gymAccess: true,
    poolAccess: false,
    spaAccess: false,
    personalTrainingSessions: '0'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to edit membership, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && id) {
      fetchMembership();
    }
  }, [id, currentUser]);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get(`/memberships/${id}`);
      
      if (response.data.success) {
        const membershipData = response.data.membership;
        setMembership(membershipData);
        
        setFormData({
          name: membershipData.name || '',
          description: membershipData.description || '',
          price: membershipData.price?.toString() || '',
          duration: membershipData.duration?.toString() || '',
          durationType: membershipData.durationType || 'months',
          features: membershipData.features?.join(', ') || '',
          maxClassesPerWeek: membershipData.maxClassesPerWeek?.toString() || '',
          gymAccess: membershipData.gymAccess ?? true,
          poolAccess: membershipData.poolAccess ?? false,
          spaAccess: membershipData.spaAccess ?? false,
          personalTrainingSessions: membershipData.personalTrainingSessions?.toString() || '0'
        });
      } else {
        setError(response.data.error || 'Failed to load membership');
      }
    } catch (err) {
      console.error('Error fetching membership:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load membership details';
      setError(errorMsg);
      
      // If unauthorized, maybe token expired
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data for backend
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price), // Convert to number
        duration: parseInt(formData.duration), // Convert to number
        durationType: formData.durationType,
        features: formData.features,
        maxClassesPerWeek: formData.maxClassesPerWeek ? parseInt(formData.maxClassesPerWeek) : null,
        gymAccess: formData.gymAccess,
        poolAccess: formData.poolAccess,
        spaAccess: formData.spaAccess,
        personalTrainingSessions: parseInt(formData.personalTrainingSessions) || 0
      };

      console.log("🚀 Updating membership with data:", submissionData);
      
      const response = await API.put(`/memberships/${id}`, submissionData);
      
      if (response.data.success) {
        alert('Membership updated successfully!');
        navigate('/admin/memberships');
      } else {
        alert(response.data.error || 'Failed to update membership');
      }
    } catch (err) {
      console.error('Error updating membership:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update membership';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    if (!formData.duration || isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
      errors.duration = 'Valid duration is required';
    }
    return errors;
  };

  const handleClose = () => {
    navigate('/admin/memberships');
  };

  const formatDuration = (duration, type) => {
    if (!duration) return '0 days';
    const durNum = parseInt(duration) || 0;
    if (type === 'days') return `${durNum} day${durNum > 1 ? 's' : ''}`;
    if (type === 'weeks') return `${durNum} week${durNum > 1 ? 's' : ''}`;
    if (type === 'months') return `${durNum} month${durNum > 1 ? 's' : ''}`;
    if (type === 'years') return `${durNum} year${durNum > 1 ? 's' : ''}`;
    return `${durNum} days`;
  };

  const calculateDailyRate = () => {
    if (!formData.price || !formData.duration) return '0.00';
    const price = parseFloat(formData.price);
    const duration = parseInt(formData.duration);
    if (!duration || duration === 0) return price.toFixed(2);
    return (price / duration).toFixed(2);
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatCurrency = (price) => {
    if (!price) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading membership details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !membership) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Membership Not Found</h3>
          <p className="text-gray-400 mb-6">
            {error || 'The membership you are looking for does not exist or has been removed.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/admin/memberships')}
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Memberships
            </button>
            <button
              onClick={fetchMembership}
              className="inline-flex items-center justify-center px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/memberships"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              title="Back to Memberships"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Membership</h1>
              <p className="text-gray-400">Update membership details (Prices in ₹ INR)</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Admin: {currentUser.username}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${
                  membership.isActive
                    ? 'bg-emerald-900/30 text-emerald-400'
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {membership.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={logout}
                  className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded hover:bg-red-800/50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="mt-4 md:mt-0 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Membership Info */}
        <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${membership.isActive ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                {membership.isActive ? (
                  <CheckBadgeIcon className="h-6 w-6 text-emerald-400" />
                ) : (
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-white">{membership.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    membership.isActive
                      ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                      : 'bg-red-900/30 text-red-400 border border-red-700/50'
                  }`}>
                    {membership.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Created: {new Date(membership.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="h-4 w-4 mr-1" />
                    ID: {membership._id.substring(0, 8)}...
                  </div>
                  <div className="text-emerald-400">
                    {getTimeAgo(membership.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Membership Name */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <TagIcon className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Membership Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Membership Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="e.g., Premium Monthly Membership"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe the membership benefits and what members can expect..."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Duration */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <IndianRupee className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-white">Pricing & Duration</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.price ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-400">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="1"
                        className={`w-full px-4 py-3 bg-gray-900/50 border rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.duration ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="30"
                      />
                      <select
                        name="durationType"
                        value={formData.durationType}
                        onChange={handleChange}
                        className="px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                    {errors.duration && (
                      <p className="mt-2 text-sm text-red-400">{errors.duration}</p>
                    )}
                  </div>
                </div>
                
                {/* Price Calculation Preview */}
                <div className="mt-4 p-3 bg-gray-900/30 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Current Price</div>
                      <div className="text-lg font-bold text-blue-400">
                        {formatCurrency(membership.price)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Daily Rate</div>
                      <div className="text-lg font-bold text-white">
                        ₹{calculateDailyRate()}
                        <span className="text-sm text-gray-400 ml-1">/ day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <SparklesIcon className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Features</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Membership Features
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter features separated by commas (e.g., Gym Access, Pool, Spa, Sauna, Locker, Towel Service)"
                  />
                  <p className="mt-2 text-sm text-gray-400">Separate features with commas</p>
                  
                  {/* Features Preview */}
                  {featuresArray.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
                      <div className="flex flex-wrap gap-2">
                        {featuresArray.map((feature, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Access Options */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <BuildingLibraryIcon className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Access Options</h2>
                </div>
                
                <div className="space-y-3">
                  {[
                    { 
                      name: 'gymAccess', 
                      label: 'Gym Access', 
                      description: 'Access to all gym equipment and weights',
                      icon: BuildingOfficeIcon,
                      color: 'emerald'
                    },
                    { 
                      name: 'poolAccess', 
                      label: 'Pool Access', 
                      description: 'Access to swimming pool and aquatic facilities',
                      icon: BeakerIcon,
                      color: 'blue'
                    },
                    { 
                      name: 'spaAccess', 
                      label: 'Spa Access', 
                      description: 'Access to spa, sauna, and steam room',
                      icon: SparklesIcon,
                      color: 'purple'
                    }
                  ].map((option) => (
                    <label 
                      key={option.name} 
                      className={`flex items-start space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData[option.name] 
                          ? `bg-${option.color}-900/20 border border-${option.color}-700/50` 
                          : 'bg-gray-900/30 border border-gray-700 hover:bg-gray-800/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={option.name}
                        checked={formData[option.name]}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <option.icon className={`h-5 w-5 text-${option.color}-400`} />
                          <span className="font-medium text-white">{option.label}</span>
                          {formData[option.name] && (
                            <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Classes & Training */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <UserGroupIcon className="h-5 w-5 text-orange-400" />
                  <h2 className="text-lg font-semibold text-white">Classes & Training</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Classes Per Week
                    </label>
                    <input
                      type="number"
                      name="maxClassesPerWeek"
                      value={formData.maxClassesPerWeek}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Leave empty for unlimited"
                      min="0"
                    />
                    <p className="mt-2 text-sm text-gray-400">Leave empty for unlimited classes</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Personal Training Sessions
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FireIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="number"
                        name="personalTrainingSessions"
                        value={formData.personalTrainingSessions}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Number of sessions included per month</p>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/30">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCardIcon className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Preview</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {formData.name || 'Membership Name'}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {formData.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-blue-700/30">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">
                        {formatCurrency(formData.price)}
                      </div>
                      <div className="text-sm text-gray-400">
                        / {formatDuration(formData.duration, formData.durationType)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Daily Rate</div>
                      <div className="text-lg font-bold text-white">
                        ₹{calculateDailyRate()}
                      </div>
                    </div>
                  </div>

                  {/* Features Preview */}
                  {featuresArray.length > 0 && (
                    <div className="pt-4 border-t border-blue-700/30">
                      <div className="text-sm font-medium text-gray-300 mb-2">Includes:</div>
                      <div className="flex flex-wrap gap-1">
                        {featuresArray.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {featuresArray.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                            +{featuresArray.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Access Preview */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-blue-700/30">
                    <div className={`p-2 rounded-lg text-center ${formData.gymAccess ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                      <div className="text-xs">Gym</div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${formData.poolAccess ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                      <div className="text-xs">Pool</div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${formData.spaAccess ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-800 text-gray-500'}`}>
                      <div className="text-xs">Spa</div>
                    </div>
                  </div>

                  {/* Training Preview */}
                  <div className="pt-4 border-t border-blue-700/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Max Classes</div>
                        <div className="text-lg font-bold text-white">
                          {formData.maxClassesPerWeek || '∞'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">PT Sessions</div>
                        <div className="text-lg font-bold text-white">
                          {formData.personalTrainingSessions}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              to="/admin/memberships"
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Update Membership
                </>
              )}
            </button>
          </div>
        </form>

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>User ID: {currentUser?._id}</p>
          <p>Membership ID: {membership?._id}</p>
          <p>Is Active: {membership?.isActive ? 'Yes' : 'No'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default EditMembershipForm;