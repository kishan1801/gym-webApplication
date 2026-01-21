import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  ArrowLeftIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form data
    if (!formData.username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        setLoading(false);
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        setLoading(false);
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      // Prepare data to send
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase()
      };

      // Only include password fields if they're filled
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // console.log('Sending profile update to /auth/profile');
      // console.log('Update data:', updateData);

      const response = await API.put('/auth/profile', updateData);
      // console.log('Update response:', response.data);
      
      if (response.data.success) {
        // Update user context with new data
        if (response.data.user) {
          updateUser(response.data.user);
        }
        
        // Update token if returned
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        setSuccess(response.data.message || 'Profile updated successfully!');
        setIsEditing(false);
        
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.data.error || 'Failed to update profile');
      }
    } catch (err) {
      // console.error('Update error details:', err);
      
      // More detailed error handling
      if (err.response) {
        // console.error('Response error:', err.response.data);
        // console.error('Response status:', err.response.status);
        
        if (err.response.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (err.response.status === 409) {
          setError(err.response.data.error || 'Username or email already exists');
        } else if (err.response.status === 400) {
          setError(err.response.data.error || 'Invalid data. Please check your inputs.');
        } else {
          setError(err.response.data?.error || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        // console.error('Request setup error:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  // Format the createdAt date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setFormData({
      username: user.username || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Go Back"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-gray-400">Manage your account information and preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-sm rounded-full">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-900/30 text-red-300 text-sm rounded-full hover:bg-red-800/50 transition-colors flex items-center"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className={`mb-6 p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30`}>
              <p className={`flex items-center text-emerald-400`}>
                <span className="mr-2">
                  <CheckCircleIcon className="h-5 w-5" />
                </span> 
                {success}
              </p>
            </div>
          )}

          {error && (
            <div className={`mb-6 p-4 rounded-xl border bg-red-500/10 border-red-500/30`}>
              <p className={`flex items-center text-red-400`}>
                <span className="mr-2">
                  <XCircleIcon className="h-5 w-5" />
                </span> 
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                    <UserCircleIcon className="h-16 w-16 text-emerald-400" />
                  </div>
                  {user.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 p-1.5 bg-purple-900/30 rounded-full border border-purple-500/30">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                      <div className="flex items-center text-gray-400 mt-1">
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-700 hover:bg-emerald-600 text-gray-300 hover:text-white rounded-xl transition-colors flex items-center text-sm"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-900/30 text-purple-300' 
                        : 'bg-blue-900/30 text-blue-300'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </span>
                    <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 rounded-full text-xs font-medium">
                      <span className="h-2 w-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                      Active Account
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form or Account Info */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CogIcon className="h-5 w-5 mr-2 text-emerald-400" />
                  Edit Profile Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <UserIcon className="h-4 w-4 inline mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      minLength="3"
                      maxLength="30"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <KeyIcon className="h-5 w-5 mr-2 text-blue-400" />
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">Leave blank to keep current password</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          minLength="6"
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="Enter current password"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          minLength="6"
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="Enter new password"
                        />
                        <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          minLength="6"
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors disabled:opacity-50 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-emerald-400" />
                  Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-sm text-gray-400 mb-1">Username</p>
                      <p className="font-medium text-white text-lg">{user.username}</p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-sm text-gray-400 mb-1">Email</p>
                      <p className="font-medium text-white text-lg">{user.email}</p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-sm text-gray-400 mb-1">Role</p>
                      <div className="flex items-center">
                        <ShieldCheckIcon className={`h-5 w-5 mr-2 ${
                          user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'
                        }`} />
                        <span className="font-medium text-white capitalize">{user.role}</span>
                        {user.role === 'admin' && (
                          <span className="ml-2 text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-400">Member Since</p>
                      </div>
                      <p className="text-white">{formatDate(user.createdAt)}</p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-400">Last Updated</p>
                      </div>
                      <p className="text-white">{formatDate(user.updatedAt)}</p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-sm text-gray-400 mb-1">User ID</p>
                      <p className="font-mono text-sm text-gray-300 break-all">
                        {user.id || user._id || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Account Status & Actions */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Account Type</span>
                    <span className={`font-semibold ${
                      user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`} style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-emerald-400 font-medium">Active</p>
                    </div>
                    <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {user.role === 'user' && (
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-colors font-medium">
                    Request Admin Access
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-emerald-600 text-gray-300 hover:text-white rounded-xl transition-colors flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-xl transition-colors flex items-center"
                >
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-xl transition-colors flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Security Stats */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/20 rounded-2xl border border-emerald-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Security Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300">Email Verified</span>
                  <span className="text-emerald-400 font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300">Password Strength</span>
                  <span className="text-emerald-400 font-medium">Strong</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300">Last Login</span>
                  <span className="text-emerald-400 text-sm">
                    {formatDate(user.lastLogin || user.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Account Age</span>
                  <span className="text-white">
                    {user.createdAt ? 
                      Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) + ' days' : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Profile Completion</span>
                  <span className="text-emerald-400">100%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Notifications</span>
                  <span className="text-white">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last profile sync: {new Date().toLocaleString()}</p>
          <p className="mt-1">For security reasons, please always log out when using shared devices</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;