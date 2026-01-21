import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  StarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access trainer details, redirecting...');
      navigate('/unauthorized');
    } else if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && id) {
      fetchTrainerDetails();
      setCheckingAuth(false);
    }
  }, [id, currentUser]);

  const fetchTrainerDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get(`/trainers/${id}`);
      if (response.data.success) {
        setTrainer(response.data.trainer);
      } else {
        setError(response.data.error || 'Trainer not found');
      }
    } catch (err) {
      console.error('Error fetching trainer:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load trainer details';
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await API.delete(`/trainers/${id}`);
        navigate('/admin/trainers');
      } catch (err) {
        console.error('Error deleting trainer:', err);
        alert('Failed to delete trainer');
      }
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) {
      return `https://fitlyfy.onrender.com${imagePath}`;
    }
    return `https://fitlyfy.onrender.com${imagePath}`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-400">Loading trainer details...</p>
        </div>
      </div>
    );
  }

  if (error || !trainer) {
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

          {/* Error Display */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-4">
              <UserIcon className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{error || 'Trainer not found'}</h2>
            <p className="text-gray-400 mb-6">The trainer you're looking for doesn't exist or has been removed.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchTrainerDetails}
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Retry Loading
              </button>
              <Link
                to="/admin/trainers"
                className="inline-flex items-center px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Trainers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
              to="/admin/trainers"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  trainer.isActive ? 'bg-emerald-900/30' : 'bg-red-900/30'
                }`}>
                  {trainer.isActive ? (
                    <CheckBadgeIcon className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Trainer Details</h1>
                  <p className="text-gray-400">View and manage trainer information</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link
              to={`/admin/trainers/edit/${id}`}
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Trainer
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-5 py-3 bg-red-900/30 hover:bg-red-800/50 border border-red-700/50 text-red-300 font-medium rounded-xl transition-colors duration-200"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700 mx-auto">
                    {getImageUrl(trainer.profileImage) ? (
                      <img
                        src={getImageUrl(trainer.profileImage)}
                        alt={trainer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-emerald-900/30">
                              <svg class="h-20 w-20 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-900/30">
                        <UserIcon className="h-20 w-20 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-12">
                    <span className="px-3 py-1 bg-emerald-900/80 text-emerald-300 text-xs font-semibold rounded-full">
                      {trainer.specialization}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{trainer.name}</h2>
                <p className="text-gray-400 mb-4">{trainer.email}</p>
                
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{trainer.experience}</div>
                    <div className="text-xs text-gray-400">Years Exp</div>
                  </div>
                  <div className="text-center">
                    {/* <div className="text-2xl font-bold text-white">${trainer.hourlyRate}</div>
                    <div className="text-xs text-gray-400">Per Hour</div> */}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-2xl font-bold text-white">
                        {trainer.ratings?.average?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                </div>

                <div className="mb-6 flex flex-col items-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium mb-2 ${
                    trainer.isActive 
                      ? 'bg-green-900/30 text-green-300' 
                      : 'bg-red-900/30 text-red-300'
                  }`}>
                    {trainer.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                    Trainer ID: {trainer._id.substring(0, 8)}...
                  </span>
                </div>

                {/* Social Links */}
                {(trainer.socialLinks?.instagram || trainer.socialLinks?.twitter || 
                  trainer.socialLinks?.linkedin || trainer.socialLinks?.website) && (
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      Social Links
                    </h3>
                    <div className="flex justify-center space-x-3">
                      {trainer.socialLinks?.instagram && (
                        <a
                          href={trainer.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
                          title="Instagram"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                          </svg>
                        </a>
                      )}
                      {trainer.socialLinks?.twitter && (
                        <a
                          href={trainer.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg transition-all duration-200"
                          title="Twitter"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>
                      )}
                      {trainer.socialLinks?.linkedin && (
                        <a
                          href={trainer.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white rounded-lg transition-all duration-200"
                          title="LinkedIn"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {trainer.socialLinks?.website && (
                        <a
                          href={trainer.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-200"
                          title="Website"
                        >
                          <GlobeAltIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{trainer.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{trainer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Availability</p>
                    <p className="text-white">{trainer.availability}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigator.clipboard.writeText(trainer._id)}
                  className="w-full flex items-center justify-center py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  Copy Trainer ID
                </button>
                <Link
                  to={`/admin/trainers/edit/${id}`}
                  className="block w-full text-center py-2 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 rounded-lg transition-colors text-sm"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full py-2 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-lg transition-colors text-sm"
                >
                  Delete Trainer
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Details Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                Professional Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Specialization</p>
                    <p className="text-white font-medium">{trainer.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Experience</p>
                    <p className="text-white font-medium">{trainer.experience} years</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Hourly Rate</p>
                    <p className="text-white font-medium">${trainer.hourlyRate}/hour</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className={`font-medium ${trainer.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {trainer.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Biography</h4>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <p className="text-gray-300 whitespace-pre-line">{trainer.bio}</p>
                </div>
              </div>

              {/* Certifications */}
              {trainer.certifications && trainer.certifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-emerald-900/30 text-emerald-300 rounded-lg text-sm font-medium flex items-center"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Created At</h4>
                  <p className="text-white">
                    {new Date(trainer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Last Updated</h4>
                  <p className="text-white">
                    {new Date(trainer.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Trainer ID</h4>
                  <p className="text-gray-400 font-mono text-sm">{trainer._id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Total Reviews</h4>
                  <p className="text-white">{trainer.ratings?.totalReviews || 0} reviews</p>
                </div>
              </div>
            </div>

            {/* Debug Info - Remove in production */}
            <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
              <p>Debug Info:</p>
              <p>Current User Role: {currentUser?.role}</p>
              <p>User ID: {currentUser?._id}</p>
              <p>Trainer ID: {trainer._id}</p>
              <p>Is Active: {trainer.isActive ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetail;