import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  AtSymbolIcon,
  KeyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access user details, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && id) {
      fetchUserDetails();
    }
  }, [id, currentUser]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      // console.log(`Fetching user details for ID: ${id}`);
      
      const response = await API.get(`/users/${id}`);
      // console.log("User detail response:", response.data);
      
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setError(response.data.error || 'User not found');
      }
    } catch (err) {
      // console.error('Error fetching user:', err.response?.data || err);
      const errorMsg = err.response?.data?.error || 'Failed to fetch user details';
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
    // Don't allow deleting own account
    if (currentUser && user && currentUser._id === user._id) {
      alert('You cannot delete your own account!');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await API.delete(`/users/${id}`);
        
        if (response.data.success) {
          alert('User deleted successfully');
          navigate('/admin/users');
        } else {
          alert(response.data.error || 'Failed to delete user');
        }
      } catch (err) {
        // console.error('Error deleting user:', err);
        alert(err.response?.data?.error || 'Failed to delete user');
      } finally {
        setIsDeleting(false);
      }
    }
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
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{error || 'User not found'}</h2>
          <p className="text-gray-400 mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/admin/users"
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Users
            </Link>
            <button
              onClick={fetchUserDetails}
              className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200"
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
              to="/admin/users"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              title="Back to Users"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">User Details</h1>
              <p className="text-gray-400">View and manage user information</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Admin: {currentUser.username}
                </span>
                <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                  Viewing: {user.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link
              to={`/admin/users/edit/${id}`}
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit User
            </Link>
            {/* Don't show delete button for own account */}
            {currentUser._id !== user._id ? (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-5 py-3 bg-red-900/30 hover:bg-red-800/50 border border-red-700/50 text-red-300 font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete User
                  </>
                )}
              </button>
            ) : (
              <span className="inline-flex items-center px-4 py-3 bg-gray-800 text-gray-400 text-sm rounded-xl">
                Cannot delete yourself
              </span>
            )}
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
                    <div className={`w-full h-full flex items-center justify-center ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-900/30 to-purple-700/30' 
                        : 'bg-gradient-to-br from-emerald-900/30 to-green-900/30'
                    }`}>
                      {user.role === 'admin' ? (
                        <ShieldCheckIcon className="h-20 w-20 text-purple-400" />
                      ) : (
                        <UserIcon className="h-20 w-20 text-emerald-400" />
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-12">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-purple-100'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 text-blue-100'
                    }`}>
                      {user.role?.toUpperCase() || 'USER'}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
                <p className="text-gray-400 mb-4 flex items-center justify-center">
                  <AtSymbolIcon className="h-4 w-4 mr-1" />
                  @{user.username}
                </p>
                
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </div>
                    <div className="text-xs text-gray-400">Role</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {getTimeAgo(user.createdAt)}
                    </div>
                    <div className="text-xs text-gray-400">Joined</div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-green-100 rounded-full text-sm font-medium shadow-lg">
                    ✅ Active Account
                  </span>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <KeyIcon className="h-5 w-5 mr-2 text-gray-400" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <UserCircleIcon className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400">Username</p>
                    <p className="text-white font-mono truncate" title={`@${user.username}`}>@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-white break-all" title={user.email}>{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400">Account ID</p>
                    <p className="text-gray-300 text-sm font-mono truncate" title={user._id}>{user._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Details Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                User Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/30 rounded-xl p-4 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <ShieldCheckIcon className={`h-5 w-5 mr-3 ${
                      user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'
                    }`} />
                    <span className="text-sm text-gray-400">Account Role</span>
                  </div>
                  <p className={`text-lg font-bold ${
                    user.role === 'admin' ? 'text-purple-300' : 'text-blue-300'
                  }`}>
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  </p>
                </div>
                
                <div className="bg-gray-900/30 rounded-xl p-4 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-400">Username</span>
                  </div>
                  <p className="text-lg font-bold text-white">@{user.username}</p>
                </div>
                
                <div className="bg-gray-900/30 rounded-xl p-4 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-400">Email Address</span>
                  </div>
                  <p className="text-lg font-bold text-white break-all">{user.email}</p>
                </div>
                
                <div className="bg-gray-900/30 rounded-xl p-4 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-400">Account Created</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* User ID Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3">User ID</h4>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 font-mono text-sm break-all mr-4">{user._id}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user._id);
                        alert('User ID copied to clipboard!');
                      }}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                Account Timestamps
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/30 rounded-xl p-5 hover:bg-gray-900/50 transition-colors">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Created At
                  </h4>
                  <p className="text-white text-lg font-semibold mb-1">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : ''}
                  </p>
                  <p className="text-emerald-400 text-xs mt-2">{getTimeAgo(user.createdAt)}</p>
                </div>
                
                <div className="bg-gray-900/30 rounded-xl p-5 hover:bg-gray-900/50 transition-colors">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Last Updated
                  </h4>
                  <p className="text-white text-lg font-semibold mb-1">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : ''}
                  </p>
                  <p className="text-blue-400 text-xs mt-2">
                    {user.updatedAt ? getTimeAgo(user.updatedAt) : 'Never updated'}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Actions Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-gray-700">
                Admin Actions
              </h3>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/admin/users/edit/${id}`}
                  className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit User Information
                </Link>
                
                {currentUser._id !== user._id ? (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete User Account
                      </>
                    )}
                  </button>
                ) : (
                  <div className="px-5 py-3 bg-gray-800 text-gray-400 rounded-xl border border-gray-700">
                    <p className="text-sm">You cannot delete your own account</p>
                  </div>
                )}
                
                <Link
                  to="/admin/users"
                  className="inline-flex items-center px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to All Users
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User ID: {currentUser?._id}</p>
          <p>Viewing User ID: {user._id}</p>
          <p>Is Same User: {currentUser?._id === user._id ? 'Yes' : 'No'}</p>
          <p>User Role: {user.role}</p>
        </div> */}
      </div>
    </div>
  );
};

export default UserDetail;