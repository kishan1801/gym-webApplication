import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state based on your User model
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '', // For password update
  });

  const [originalData, setOriginalData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to edit user, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && id) {
      fetchUserData();
    }
  }, [id, currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      // console.log(`Fetching user data for ID: ${id}`);
      
      const response = await API.get(`/users/${id}`);
      // console.log("User data response:", response.data);
      
      if (response.data.success) {
        const user = response.data.user;
        setFormData({
          username: user.username || '',
          email: user.email || '',
          role: user.role || 'user',
          password: '', // Don't prefill password
        });
        setOriginalData(user);
      } else {
        setError(response.data.error || 'Failed to load user data');
      }
    } catch (err) {
      // console.error('Error fetching user:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load user data';
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success message when user starts editing
    if (success) setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }));
    setPasswordError('');
  };

  const validateForm = () => {
    setError('');
    setPasswordError('');

    // Required fields validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Prevent changing own role from admin to user
    if (currentUser && originalData && currentUser._id === originalData._id && formData.role !== 'admin') {
      setError('You cannot change your own role from admin to user');
      return false;
    }

    // Password validation (only if password is being changed)
    if (formData.password) {
      if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
      
      if (formData.password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPasswordError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Prepare update data (remove password if empty)
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      // console.log('Sending update data:', updateData);
      const response = await API.put(`/users/${id}`, updateData);
      // console.log('Update response:', response.data);
      
      if (response.data.success) {
        setSuccess('User updated successfully!');
        setOriginalData(response.data.user || formData);
        
        // Clear password fields after successful update
        setFormData(prev => ({ ...prev, password: '' }));
        setConfirmPassword('');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/admin/users');
        }, 3000);
      } else {
        setError(response.data.error || 'Failed to update user');
      }
    } catch (err) {
      // console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.error || 
                          'Failed to update user. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/users/${id}`);
  };

  const hasChanges = () => {
    return (
      formData.username !== originalData.username ||
      formData.email !== originalData.email ||
      formData.role !== originalData.role ||
      formData.password
    );
  };

  // If user is not admin, show unauthorized message
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <ShieldExclamationIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
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
          <p className="mt-4 text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              to={`/admin/users/${id}`}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit User</h1>
              <p className="text-gray-400">Update user information</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">
                  Admin: {currentUser.username}
                </span>
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Editing: {originalData.username}
                </span>
                {originalData._id === currentUser._id && (
                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 text-xs rounded">
                    Editing Own Account
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <Link to="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span className="mx-2">›</span>
            <Link to="/admin/users" className="hover:text-emerald-400 transition-colors">
              Users
            </Link>
            <span className="mx-2">›</span>
            <Link to={`/admin/users/${id}`} className="hover:text-emerald-400 transition-colors">
              {originalData.username}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-emerald-400">Edit</span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700/50 rounded-xl">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-300 font-medium">{success}</p>
                <p className="text-green-400/80 text-sm mt-1">
                  Redirecting to users list in 3 seconds...
                </p>
              </div>
              <button
                onClick={() => setSuccess('')}
                className="text-green-400 hover:text-green-300"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
            <div className="flex items-start">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-300 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-300"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Password Error */}
        {passwordError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
            <p className="text-red-300">{passwordError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <UserIcon className="h-6 w-6 mr-2 text-gray-400" />
              Basic Information
              {originalData._id === currentUser._id && (
                <span className="ml-auto text-sm font-normal text-yellow-400">
                  <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                  Editing your own account
                </span>
              )}
            </h2>

            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter username"
                    required
                    disabled={saving}
                  />
                </div>
                {formData.username !== originalData.username && (
                  <p className="mt-2 text-xs text-emerald-400 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    Changed from "{originalData.username}"
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                    required
                    disabled={saving}
                  />
                </div>
                {formData.email !== originalData.email && (
                  <p className="mt-2 text-xs text-emerald-400 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    Changed from "{originalData.email}"
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                    disabled={saving || (originalData._id === currentUser._id && originalData.role === 'admin')}
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {formData.role !== originalData.role && (
                  <p className="mt-2 text-xs text-emerald-400 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    Changed from "{originalData.role}"
                  </p>
                )}
                {originalData._id === currentUser._id && originalData.role === 'admin' && (
                  <p className="mt-2 text-xs text-yellow-400 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    You cannot change your own role from admin
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password Update Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <KeyIcon className="h-6 w-6 mr-2 text-gray-400" />
              Update Password
              <span className="ml-2 text-sm font-normal text-gray-400">
                (Optional - Leave blank to keep current password)
              </span>
            </h2>

            <div className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter new password"
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    disabled={saving}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password */}
              {formData.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Confirm new password"
                      disabled={saving}
                    />
                  </div>
                </div>
              )}

              {/* Password Change Note */}
              <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-300">
                      <span className="font-medium">Note:</span> If you don't want to change the password, leave these fields blank. The existing password will remain unchanged.
                    </p>
                    {originalData._id === currentUser._id && formData.password && (
                      <p className="text-sm text-yellow-300 mt-2">
                        <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                        Changing your own password will log you out
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center">
                {hasChanges() ? (
                  <div className="flex items-center text-emerald-400">
                    <PencilIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">You have unsaved changes</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">No changes made</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || !hasChanges()}
                  className={`px-6 py-3 font-medium rounded-xl transition-all flex items-center justify-center min-w-[140px] ${
                    saving || !hasChanges()
                      ? 'bg-emerald-800/50 text-emerald-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {saving ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Important Information Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-700/50">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-yellow-300 mb-2">Important Information</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Changing the email address will affect user login credentials.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Setting role to "Administrator" will grant full system access.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>All changes are logged and can be audited.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Users will not be notified of changes made to their account.</span>
                  </li>
                  {originalData._id === currentUser._id && (
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span className="text-yellow-300">
                        <strong>Warning:</strong> You are editing your own account. Be careful with changes as they will affect your access immediately.
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Debug Info - Remove in production */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User ID: {currentUser?._id}</p>
          <p>Editing User ID: {id}</p>
          <p>Is Same User: {originalData._id === currentUser._id ? 'Yes' : 'No'}</p>
          <p>Original Role: {originalData.role}</p>
          <p>New Role: {formData.role}</p>
          <p>Has Changes: {hasChanges() ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;