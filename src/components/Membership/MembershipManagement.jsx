import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  TagIcon,
  FireIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const MembershipManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access membership management, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchMemberships();
    }
  }, [showActiveOnly, currentUser]);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/memberships?active=${showActiveOnly}`);
      console.log('📥 Memberships API Response:', response.data);
      if (response.data.success) {
        setMemberships(response.data.memberships || []);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch memberships');
      }
    } catch (err) {
      console.error('Error fetching memberships:', err);
      const errorMsg = err.response?.data?.error || 'Failed to fetch memberships';
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

  const handleDeleteMembership = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this membership?')) {
      try {
        await API.delete(`/memberships/${id}`);
        fetchMemberships();
      } catch (err) {
        console.error('Error deleting membership:', err);
        alert('Failed to deactivate membership');
      }
    }
  };

  const handleActivateMembership = async (id) => {
    try {
      await API.patch(`/memberships/${id}/activate`);
      fetchMemberships();
    } catch (err) {
      console.error('Error activating membership:', err);
      alert('Failed to activate membership');
    }
  };

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membership.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDuration = (duration, type) => {
    if (type === 'days') return `${duration} day${duration > 1 ? 's' : ''}`;
    if (type === 'weeks') return `${duration} week${duration > 1 ? 's' : ''}`;
    if (type === 'months') return `${duration} month${duration > 1 ? 's' : ''}`;
    if (type === 'years') return `${duration} year${duration > 1 ? 's' : ''}`;
    return `${duration} days`;
  };

  const calculateDailyRate = (price, duration) => {
    return (price / duration).toFixed(2);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
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

  if (loading && memberships.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading memberships...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              title="Back to Admin"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Membership Management</h1>
              <p className="text-gray-400">Manage all membership plans and pricing (Prices in ₹ INR)</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Admin: {currentUser.username}
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
          <Link
            to="/admin/membership/add"
            className="mt-4 md:mt-0 inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Membership
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-900/30 rounded-xl mr-4">
                <CreditCardIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Memberships</p>
                <p className="text-2xl font-bold text-white">{memberships.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-900/30 rounded-xl mr-4">
                <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Memberships</p>
                <p className="text-2xl font-bold text-white">
                  {memberships.filter(m => m.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-900/30 rounded-xl mr-4">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Average Price</p>
                <p className="text-2xl font-bold text-white">
                  {memberships.length > 0 
                    ? formatPrice(memberships.reduce((sum, m) => sum + m.price, 0) / memberships.length)
                    : '₹0.00'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                <ChartBarIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Revenue Potential</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(memberships.reduce((sum, m) => sum + m.price, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`inline-flex items-center px-4 py-3 rounded-xl transition-colors ${
                  showActiveOnly ? 'bg-emerald-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                {showActiveOnly ? 'Active Only' : 'All Memberships'}
              </button>
              <button
                onClick={fetchMemberships}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                title="Refresh"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mr-3" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Memberships Grid */}
        {filteredMemberships.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-4">
              <CreditCardIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Memberships Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first membership'}
            </p>
            <Link
              to="/admin/membership/add"
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Membership
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredMemberships.map(membership => (
                <div 
                  key={membership._id} 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  {/* Membership Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{membership.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          membership.isActive
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                            : 'bg-red-900/30 text-red-400 border border-red-700/50'
                        }`}>
                          {membership.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{formatPrice(membership.price)}</div>
                      <div className="text-sm text-gray-400">
                        / {formatDuration(membership.duration, membership.durationType)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {membership.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {membership.description}
                    </p>
                  )}

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-300 mb-2">
                      <SparklesIcon className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="font-medium">Features</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {membership.features?.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {membership.features?.length > 3 && (
                        <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                          +{membership.features.length - 3} more
                        </span>
                      )}
                      {(!membership.features || membership.features.length === 0) && (
                        <span className="text-gray-500 text-xs italic">No features listed</span>
                      )}
                    </div>
                  </div>

                  {/* Access Options */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className={`p-2 rounded-lg text-center ${membership.gymAccess ? 'bg-emerald-900/20 text-emerald-400' : 'bg-gray-700/50 text-gray-500'}`}>
                      <div className="text-xs">Gym</div>
                      <div className="text-lg font-bold">{membership.gymAccess ? '✓' : '✗'}</div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${membership.poolAccess ? 'bg-blue-900/20 text-blue-400' : 'bg-gray-700/50 text-gray-500'}`}>
                      <div className="text-xs">Pool</div>
                      <div className="text-lg font-bold">{membership.poolAccess ? '✓' : '✗'}</div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${membership.spaAccess ? 'bg-purple-900/20 text-purple-400' : 'bg-gray-700/50 text-gray-500'}`}>
                      <div className="text-xs">Spa</div>
                      <div className="text-lg font-bold">{membership.spaAccess ? '✓' : '✗'}</div>
                    </div>
                  </div>

                  {/* Classes & Training */}
                  <div className="flex justify-between items-center text-sm mb-6">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-400">Classes:</span>
                      <span className="ml-1 text-white font-medium">
                        {membership.maxClassesPerWeek || 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FireIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-400">Sessions:</span>
                      <span className="ml-1 text-white font-medium">
                        {membership.personalTrainingSessions}
                      </span>
                    </div>
                  </div>

                  {/* Daily Rate */}
                  <div className="mb-6 p-3 bg-gray-900/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Daily Rate</div>
                      <div className="text-lg font-bold text-white">
                        ₹{calculateDailyRate(membership.price, membership.duration)}
                        <span className="text-sm text-gray-400 ml-1">/ day</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <Link
                      to={`/admin/membership/view/${membership._id}`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/membership/edit/${membership._id}`}
                        className="px-4 py-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => 
                          membership.isActive
                            ? handleDeleteMembership(membership._id)
                            : handleActivateMembership(membership._id)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                          membership.isActive
                            ? 'bg-red-900/30 hover:bg-red-800/50 text-red-300'
                            : 'bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300'
                        }`}
                      >
                        {membership.isActive ? (
                          <>
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-400 mb-4">
              Showing {filteredMemberships.length} of {memberships.length} membership{memberships.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          </>
        )}

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>Total Memberships: {memberships.length}</p>
          <p>Filtered Memberships: {filteredMemberships.length}</p>
          <p>Show Active Only: {showActiveOnly ? 'Yes' : 'No'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default MembershipManagement;