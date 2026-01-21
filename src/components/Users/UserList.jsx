import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ChevronUpDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access user list, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
  }, [currentPage, roleFilter, currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', limit);
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);

      // console.log("Fetching users with params:", params.toString());
      
      const response = await API.get(`/users?${params.toString()}`);
      // console.log("API Response:", response.data);
      
      if (response.data.success) {
        setUsers(response.data.users || []);
        setTotalPages(response.data.pages || 1);
        setTotalUsers(response.data.total || 0);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err);
      setError(err.response?.data?.error || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await API.delete(`/users/${userId}`);
        if (response.data.success) {
          alert('User deleted successfully');
          fetchUsers();
        } else {
          alert(response.data.error || 'Failed to delete user');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setCurrentPage(1);
    fetchUsers();
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'createdAt') {
      const aDate = new Date(aValue || 0);
      const bDate = new Date(bValue || 0);
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (aValue.toLowerCase() < bValue.toLowerCase()) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue.toLowerCase() > bValue.toLowerCase()) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

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

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 sm:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Back to Admin Dashboard"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-gray-400">Manage all registered users</p>
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
                to="/admin/users/create"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New User
              </Link>
              <button
                onClick={fetchUsers}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors text-sm"
                aria-label="Refresh users"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-900/30 rounded-xl mr-4">
                  <UserIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Admins</p>
                  <p className="text-2xl font-bold text-white">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-xl mr-4">
                  <UserCircleIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Regular Users</p>
                  <p className="text-2xl font-bold text-white">
                    {users.filter(u => u.role === 'user').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by username or email..."
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
                onClick={fetchUsers}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              {(searchTerm || roleFilter) && (
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
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      fetchUsers();
                    }}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
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
            Showing {Math.min(users.length, limit)} of {totalUsers} users
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl">
            <div className="flex items-center">
              <span className="text-white font-bold text-lg mr-2">{users.length}</span>
              <span className="text-gray-500 text-sm">of {totalUsers}</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <span className="ml-4 text-gray-400 text-sm sm:text-base">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 p-8">
              <div className="text-4xl sm:text-6xl mb-4 text-gray-600">👥</div>
              <p className="text-gray-400 text-lg sm:text-xl mb-2 text-center">No users found</p>
              <p className="text-gray-500 text-center max-w-md text-sm sm:text-base">
                {searchTerm || roleFilter
                  ? 'Try changing your filters or search term'
                  : 'No users found in the system.'}
              </p>
              {(searchTerm || roleFilter) && (
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900/50">
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">
                        <button
                          onClick={() => handleSort('username')}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <span>User</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">
                        <span>Email</span>
                      </th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">Role</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <span>Joined</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sortedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-gray-700 mr-3 sm:mr-4">
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-900/30 to-green-900/30">
                                {user.role === 'admin' ? (
                                  <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                                ) : (
                                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-white text-xs sm:text-sm">{user.username}</p>
                              <p className="text-gray-400 text-xs">ID: {user._id?.substring(0, 8) || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center text-sm">
                            <EnvelopeIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-300 truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-900/30 text-purple-300' 
                              : 'bg-blue-900/30 text-blue-300'
                          }`}>
                            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="text-xs sm:text-sm">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-gray-300">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  }) : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Link
                              to={`/admin/users/${user._id}`}
                              className="p-1.5 sm:p-2 bg-gray-700 hover:bg-blue-600 text-white rounded-xl transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                            <Link
                              to={`/admin/users/edit/${user._id}`}
                              className="p-1.5 sm:p-2 bg-gray-700 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                              title="Edit"
                            >
                              <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                            {/* Don't allow deleting own account */}
                            {user._id !== currentUser._id ? (
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-1.5 sm:p-2 bg-gray-700 hover:bg-red-600 text-white rounded-xl transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            ) : (
                              <span className="text-xs text-gray-500 hidden sm:inline">Cannot delete yourself</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-gray-900/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Page {currentPage} of {totalPages} • Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs sm:text-sm"
                      >
                        <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
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
                        <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Debug Info - Remove in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
            <p>Debug Info:</p>
            <p>Current User Role: {currentUser?.role}</p>
            <p>Users Count: {users.length}</p>
            <p>Total Pages: {totalPages}</p>
            <p>Current Page: {currentPage}</p>
            <p>Sort: {sortConfig.key} ({sortConfig.direction})</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserList;