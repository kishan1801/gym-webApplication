import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import { IndianRupee } from 'lucide-react';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const MembershipDetailsModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access membership details, redirecting...');
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
        setMembership(response.data.membership);
      } else {
        setError(response.data.error || 'Failed to load membership details');
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

  const handleClose = () => {
    navigate('/admin/memberships');
  };

  const handleDeleteMembership = async () => {
    if (!membership) return;
    
    if (window.confirm(`Are you sure you want to ${membership.isActive ? 'deactivate' : 'activate'} this membership?`)) {
      try {
        setIsUpdating(true);
        if (membership.isActive) {
          await API.delete(`/memberships/${id}`);
        } else {
          await API.patch(`/memberships/${id}/activate`);
        }
        alert(`Membership ${membership.isActive ? 'deactivated' : 'activated'} successfully!`);
        navigate('/admin/memberships');
      } catch (err) {
        console.error('Error updating membership:', err);
        alert(`Failed to ${membership.isActive ? 'deactivate' : 'activate'} membership`);
      } finally {
        setIsUpdating(false);
      }
    }
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

  const calculateDailyRate = (price, duration) => {
    if (!price || !duration) return '0.00';
    const priceNum = parseFloat(price);
    const durationNum = parseInt(duration);
    if (!durationNum || durationNum === 0) return priceNum.toFixed(2);
    return (priceNum / durationNum).toFixed(2);
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
        <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto text-center">
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
      <div className="max-w-6xl mx-auto">
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
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${membership.isActive ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                {membership.isActive ? (
                  <CheckBadgeIcon className="h-6 w-6 text-emerald-400" />
                ) : (
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{membership.name}</h1>
                <p className="text-gray-400">Membership Details (Prices in ₹ INR)</p>
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
          </div>
          <button
            onClick={handleClose}
            className="mt-4 md:mt-0 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCardIcon className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Description</h2>
              </div>
              <p className="text-gray-300">
                {membership.description || 'No description provided'}
              </p>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <TrophyIcon className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Features & Benefits</h2>
              </div>
              {membership.features?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {membership.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-blue-900/20 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-900/30 rounded-lg text-center">
                  <p className="text-gray-500 italic">No features listed</p>
                </div>
              )}
            </div>

            {/* Access Options */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <BuildingLibraryIcon className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Access & Amenities</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${membership.gymAccess ? 'bg-emerald-900/20 border border-emerald-700/30' : 'bg-gray-900/30 border border-gray-700'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <FireIcon className={`h-5 w-5 ${membership.gymAccess ? 'text-emerald-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${membership.gymAccess ? 'text-emerald-300' : 'text-gray-500'}`}>
                      Gym Access
                    </span>
                  </div>
                  {membership.gymAccess ? (
                    <span className="text-emerald-400 text-sm flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Included
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Not included
                    </span>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${membership.poolAccess ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-gray-900/30 border border-gray-700'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <BeakerIcon className={`h-5 w-5 ${membership.poolAccess ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${membership.poolAccess ? 'text-blue-300' : 'text-gray-500'}`}>
                      Pool Access
                    </span>
                  </div>
                  {membership.poolAccess ? (
                    <span className="text-blue-400 text-sm flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Included
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Not included
                    </span>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${membership.spaAccess ? 'bg-purple-900/20 border border-purple-700/30' : 'bg-gray-900/30 border border-gray-700'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <SparklesIcon className={`h-5 w-5 ${membership.spaAccess ? 'text-purple-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${membership.spaAccess ? 'text-purple-300' : 'text-gray-500'}`}>
                      Spa Access
                    </span>
                  </div>
                  {membership.spaAccess ? (
                    <span className="text-purple-400 text-sm flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Included
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Not included
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">Price</h3>
                  <p className="text-blue-200 opacity-80">One-time payment</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <IndianRupee className="h-6 w-6 mr-1" />
                    <div className="text-3xl font-bold">{formatCurrency(membership.price)}</div>
                  </div>
                  <div className="text-blue-200 opacity-80">
                    / {formatDuration(membership.duration, membership.durationType)}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-blue-500/50">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 opacity-80">Daily Rate:</span>
                  <span className="flex items-center font-semibold">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {calculateDailyRate(membership.price, membership.duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Classes & Training */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <UsersIcon className="h-5 w-5 text-orange-400" />
                <h2 className="text-lg font-semibold text-white">Classes & Training</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-400 mb-1">Max Classes</div>
                  <div className="text-xl font-bold text-white">
                    {membership.maxClassesPerWeek || '∞'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">per week</div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-400 mb-1">PT Sessions</div>
                  <div className="text-xl font-bold text-white">
                    {membership.personalTrainingSessions}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">per month</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Timeline</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Created</div>
                  <div className="text-sm text-white">
                    {new Date(membership.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-emerald-400 mt-1">
                    {getTimeAgo(membership.createdAt)}
                  </div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Last Updated</div>
                  <div className="text-sm text-white">
                    {new Date(membership.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-blue-400 mt-1">
                    {getTimeAgo(membership.updatedAt)}
                  </div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Status</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    membership.isActive 
                      ? 'bg-emerald-900/30 text-emerald-400' 
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {membership.isActive ? (
                      <>
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={`/admin/membership/edit/${membership._id}`}
                className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Membership
              </Link>
              <button
                onClick={handleDeleteMembership}
                disabled={isUpdating}
                className={`w-full flex items-center justify-center py-3 border rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  membership.isActive
                    ? 'border-red-700 text-red-400 hover:bg-red-900/20'
                    : 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/20'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Processing...
                  </>
                ) : membership.isActive ? (
                  <>
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Deactivate Membership
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Activate Membership
                  </>
                )}
              </button>
              <Link
                to="/admin/memberships"
                className="w-full flex items-center justify-center py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Memberships
              </Link>
            </div>

            {/* Quick Info */}
            <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/50">
              <div className="text-center mb-3 pb-3 border-b border-gray-700/50">
                <div className="text-sm text-gray-400 mb-1">Membership ID</div>
                <div className="font-mono text-xs text-gray-300 break-all">
                  {membership._id}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(membership._id);
                    alert('Membership ID copied to clipboard!');
                  }}
                  className="mt-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                >
                  Copy ID
                </button>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Currency</div>
                <div className="font-medium text-emerald-400 flex items-center justify-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  Indian Rupee (INR)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>User ID: {currentUser?._id}</p>
          <p>Membership ID: {membership._id}</p>
          <p>Is Active: {membership.isActive ? 'Yes' : 'No'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default MembershipDetailsModal;