import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
  StarIcon as HeroStarIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    certified: 0,
    averageRating: 0,
    averageExperience: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access trainer management, redirecting...');
      navigate('/unauthorized');
    } else if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // If it's a relative path, prepend the backend URL
    if (imagePath.startsWith('/uploads/')) {
      return `https://fitlyfy.onrender.com${imagePath}`;
    }
    // For any other case, assume it's a full path from backend
    return `https://fitlyfy.onrender.com${imagePath}`;
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchTrainers();
      setCheckingAuth(false);
    }
  }, [currentUser]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/trainers');
      console.log('📥 Trainers API Response:', response.data);
      if (response.data.success) {
        const trainersData = response.data.trainers || [];
        setTrainers(trainersData);
        calculateStats(trainersData);
      } else {
        setError(response.data.error || 'Failed to fetch trainers');
      }
    } catch (err) {
      console.error('Error fetching trainers:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load trainers';
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

  const calculateStats = (trainersData) => {
    const total = trainersData.length;
    const active = trainersData.filter(t => t.isActive).length;
    const certified = trainersData.filter(t => t.certifications && t.certifications.length > 0).length;
    
    const totalRating = trainersData.reduce((sum, t) => sum + (t.ratings?.average || 0), 0);
    const averageRating = total > 0 ? (totalRating / total).toFixed(1) : 0;
    
    const totalExperience = trainersData.reduce((sum, t) => sum + (t.experience || 0), 0);
    const averageExperience = total > 0 ? (totalExperience / total).toFixed(1) : 0;

    setStats({
      total,
      active,
      certified,
      averageRating,
      averageExperience
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await API.delete(`/trainers/${id}`);
        fetchTrainers();
      } catch (err) {
        console.error('Error deleting trainer:', err);
        alert('Failed to delete trainer');
      }
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterSpecialization || trainer.specialization === filterSpecialization;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrainers = filteredTrainers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const specializations = [...new Set(trainers.map(t => t.specialization))];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterSpecialization('');
    setCurrentPage(1);
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
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Trainer Management</h1>
                <p className="text-gray-400">Manage all fitness trainers in the system</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-sm rounded-full">
                    Admin: {currentUser.username}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 bg-red-900/30 text-red-300 text-sm rounded-full hover:bg-red-800/50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Link
                to="/admin/trainers/add"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Trainer
              </Link>
              <button
                onClick={fetchTrainers}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors text-sm"
                aria-label="Refresh trainers"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-900/30 rounded-lg mr-3">
                  <UserGroupIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Trainers</p>
                  <p className="text-xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-900/30 rounded-lg mr-3">
                  <CheckBadgeIcon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-xl font-bold text-white">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-purple-900/30 rounded-lg mr-3">
                  <AcademicCapIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Certified</p>
                  <p className="text-xl font-bold text-white">{stats.certified}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-900/30 rounded-lg mr-3">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg Rating</p>
                  <p className="text-xl font-bold text-white">{stats.averageRating}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-orange-900/30 rounded-lg mr-3">
                  <ClockIcon className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg Experience</p>
                  <p className="text-xl font-bold text-white">{stats.averageExperience} yrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border ${
            'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={`flex items-center text-red-400`}>
              <span className="mr-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
              </span> 
              {error}
            </p>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-3 rounded-xl transition-colors text-sm ${
                  showFilters ? 'bg-emerald-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              <button
                onClick={fetchTrainers}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              {(searchTerm || filterSpecialization) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-xl transition-colors text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Specialization
                  </label>
                  <select
                    value={filterSpecialization}
                    onChange={(e) => setFilterSpecialization(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {Math.min(currentTrainers.length, itemsPerPage)} of {filteredTrainers.length} trainers
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl">
            <div className="flex items-center">
              <span className="text-white font-bold text-lg mr-2">{filteredTrainers.length}</span>
              <span className="text-gray-500 text-sm">of {trainers.length}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <span className="ml-4 text-gray-400 text-sm sm:text-base">Loading trainers...</span>
          </div>
        )}

        {/* Trainers Grid */}
        {!loading && !error && (
          <>
            {filteredTrainers.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 p-8">
                <div className="text-4xl sm:text-6xl mb-4 text-gray-600">🏋️‍♂️</div>
                <p className="text-gray-400 text-lg sm:text-xl mb-2 text-center">No trainers found</p>
                <p className="text-gray-500 text-center max-w-md text-sm sm:text-base">
                  {searchTerm || filterSpecialization
                    ? 'Try changing your filters or search term'
                    : 'No trainers found in the system.'}
                </p>
                {(searchTerm || filterSpecialization) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTrainers.map(trainer => (
                    <div 
                      key={trainer._id} 
                      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                    >
                      {/* Trainer Image and Status */}
                      <div className="relative">
                        <div className="h-48 w-full bg-gray-700 overflow-hidden">
                          {getImageUrl(trainer.profileImage) ? (
                            <img 
                              src={getImageUrl(trainer.profileImage)} 
                              alt={trainer.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('❌ Image failed to load:', trainer.profileImage);
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
                            <div className="w-full h-full flex items-center justify-center bg-emerald-900/30">
                              <UserIcon className="h-12 w-12 text-emerald-400" />
                            </div>
                          )}
                        </div>
                        <div className="absolute top-4 right-4">
                          {trainer.isActive ? (
                            <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-xs rounded-full">
                              <CheckBadgeIcon className="h-3 w-3 inline mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-900/30 text-red-300 text-xs rounded-full">
                              <ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Trainer Info */}
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-300">
                                {trainer.ratings?.average?.toFixed(1) || '0.0'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-emerald-400 font-medium">{trainer.specialization}</p>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <BriefcaseIcon className="h-3 w-3 mr-1" />
                            <span>{trainer.experience} years experience</span>
                          </div>
                        </div>

                        {/* Trainer Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-300 truncate">{trainer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-300">{trainer.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-300">₹{trainer.hourlyRate}/hour</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-300">{trainer.availability}</span>
                          </div>
                        </div>

                        {/* Certifications */}
                        {trainer.certifications && trainer.certifications.length > 0 && (
                          <div className="mb-6">
                            <p className="text-sm font-medium text-gray-300 mb-2">Certifications:</p>
                            <div className="flex flex-wrap gap-2">
                              {trainer.certifications.slice(0, 3).map((cert, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded-full text-xs"
                                >
                                  {cert}
                                </span>
                              ))}
                              {trainer.certifications.length > 3 && (
                                <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                                  +{trainer.certifications.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-4 border-t border-gray-700">
                          <Link
                            to={`/admin/trainers/${trainer._id}`}
                            className="px-3 py-2 bg-gray-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Link>
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/trainers/edit/${trainer._id}`}
                              className="px-3 py-2 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(trainer._id)}
                              className="px-3 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-gray-800/50 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-gray-400 text-xs sm:text-sm">
                        Page {currentPage} of {totalPages} • Showing {currentTrainers.length} of {filteredTrainers.length} trainers
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs sm:text-sm"
                        >
                          <ChevronUpDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 rotate-90" />
                          <span className="hidden sm:inline">Previous</span>
                        </button>
                        
                        {(() => {
                          const pageButtons = [];
                          const maxVisiblePages = 3;
                          
                          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                          
                          // Adjust start page if we're near the end
                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }
                          
                          for (let page = startPage; page <= endPage; page++) {
                            pageButtons.push(
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition text-xs sm:text-sm ${
                                  currentPage === page
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                          
                          return pageButtons;
                        })()}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronUpDownIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 -rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Star icon component
const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default TrainerList;