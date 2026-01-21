import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PropTypes from 'prop-types';

// Configure axios with interceptor for authentication
const setupAxiosInterceptors = () => {
  // Set base URL and defaults
  axios.defaults.baseURL = 'https://fitlyfy.onrender.com';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.timeout = 10000; // 10 second timeout

  // Request interceptor to add token to every request
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Initialize axios setup
setupAxiosInterceptors();

// Status options for dropdown
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-900/30 text-blue-400 border border-blue-700/50' },
  { value: 'processing', label: 'Processing', color: 'bg-purple-900/30 text-purple-400 border border-purple-700/50' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-900/30 text-indigo-400 border border-indigo-700/50' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-900/30 text-green-400 border border-green-700/50' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-900/30 text-red-400 border border-red-700/50' },
];

// Payment status options
const PAYMENT_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' },
  completed: { label: 'Completed', color: 'bg-green-900/30 text-green-400 border border-green-700/50' },
  failed: { label: 'Failed', color: 'bg-red-900/30 text-red-400 border border-red-700/50' },
  refunded: { label: 'Refunded', color: 'bg-gray-900/30 text-gray-400 border border-gray-700/50' },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access orders, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  // Fetch orders with error handling
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if token exists
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await axios.get('/api/orders');
      
      if (response.data.success) {
        const ordersData = response.data.data || [];
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      // console.error('Error fetching orders:', error);
      
      let errorMessage = 'Failed to fetch orders. Please check your connection.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        // Auto-redirect to login after showing error
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout, navigate]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      
      // Check if token exists
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await axios.get('/api/orders/stats/summary');
      
      if (response.data.success) {
        setStats(response.data.data || null);
      }
    } catch (error) {
      // console.error('Error fetching stats:', error);
      // Don't show error for stats, as it's not critical
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchOrders();
      fetchStats();
    }
  }, [currentUser, fetchOrders, fetchStats]);

  // Filter orders based on search and filters
  useEffect(() => {
    let result = orders;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderId?.toLowerCase().includes(term) ||
        order.customer?.firstName?.toLowerCase().includes(term) ||
        order.customer?.lastName?.toLowerCase().includes(term) ||
        order.customer?.email?.toLowerCase().includes(term) ||
        order.items?.some(item => 
          item.name?.toLowerCase().includes(term)
        )
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply payment filter
    if (paymentFilter !== 'all') {
      result = result.filter(order => order.payment?.method === paymentFilter);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError('');
      
      // Check if token exists
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await axios.put(`/api/orders/${orderId}`, { status });
      
      if (response.data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId ? { ...order, status } : order
          )
        );
        
        // Show success message
        setError('Order status updated successfully!');
        setTimeout(() => setError(''), 3000);
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      // console.error('Error updating order:', error);
      let errorMessage = 'Failed to update order status';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchStats()]);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? option.color : 'bg-gray-900/30 text-gray-400 border border-gray-700/50';
  };

  // Get payment method display
  const getPaymentMethodDisplay = (payment) => {
    if (!payment) return { text: 'N/A', color: 'bg-gray-900/30 text-gray-400 border border-gray-700/50' };
    
    const method = payment.method === 'cod' ? 'COD' : 'Online';
    const status = payment.status || 'pending';
    const statusInfo = PAYMENT_STATUS[status] || PAYMENT_STATUS.pending;
    
    return { 
      text: `${method} - ${statusInfo.label}`,
      color: statusInfo.color
    };
  };

  // Pagination calculations
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Get unique payment methods for filter
  const paymentMethods = ['all', ...new Set(orders.map(order => order.payment?.method).filter(Boolean))];

  // If user is not admin, show unauthorized message
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-4">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
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

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading orders...</p>
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
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
              <p className="text-gray-400">Manage customer orders and shipments</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Admin: {currentUser.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded hover:bg-red-800/50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 md:mt-0 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh orders"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl ${error.includes('success') ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {error.includes('success') ? (
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={error.includes('success') ? 'text-green-400' : 'text-red-400'}>{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setError('')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${error.includes('success') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-2">
                Search Orders
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by order ID, customer, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="paymentFilter" className="block text-sm font-medium text-gray-400 mb-2">
                Payment Method
              </label>
              <select
                id="paymentFilter"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Methods</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {method === 'cod' ? 'COD' : 
                     method === 'online' ? 'Online' : 
                     method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="w-full bg-gray-900/30 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Showing {currentOrders.length} of {filteredOrders.length} orders</p>
                <p className="text-gray-500 text-xs mt-1">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 animate-pulse">
                  <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-700/50 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats?.totals?.orders || 0}</p>
              </div>
              <div className="bg-yellow-900/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-700/30">
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats?.statusCounts?.pending || 0}</p>
              </div>
              <div className="bg-blue-900/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/30">
                <p className="text-sm text-gray-400">Processing</p>
                <p className="text-2xl font-bold text-blue-400">{stats?.statusCounts?.processing || 0}</p>
              </div>
              <div className="bg-green-900/20 backdrop-blur-sm rounded-2xl p-4 border border-green-700/30">
                <p className="text-sm text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-green-400">{stats?.statusCounts?.delivered || 0}</p>
              </div>
              <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-700/30">
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(stats?.totals?.revenue || 0)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Order List</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {loading ? 'Loading...' : `${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="mt-4 md:mt-0 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'Try changing your filters or search term'
                  : 'Orders will appear here once customers place them.'}
              </p>
              {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPaymentFilter('all');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Order ID</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Customer</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Date</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Amount</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Payment</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentOrders.map((order) => {
                      const paymentDisplay = getPaymentMethodDisplay(order.payment);
                      return (
                        <tr 
                          key={order._id || order.orderId} 
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <p className="text-white font-medium">{order.orderId}</p>
                            <p className="text-gray-400 text-sm">{order.items?.length || 0} items</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-white font-medium">
                              {order.customer?.firstName || ''} {order.customer?.lastName || ''}
                            </p>
                            <p className="text-gray-400 text-sm break-all">{order.customer?.email || 'No email'}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-gray-300 text-sm">{formatDate(order.createdAt)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-white font-bold">
                              {formatCurrency(order.orderTotal?.total || 0)}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentDisplay.color}`}>
                              {paymentDisplay.text}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 bg-gray-700 hover:bg-emerald-600 rounded-lg transition-colors"
                                aria-label={`View details for order ${order.orderId}`}
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <select
                                onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                value={order.status || 'pending'}
                                className="px-3 py-1 bg-gray-900/50 border border-gray-700 text-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label={`Change status for order ${order.orderId}`}
                              >
                                {STATUS_OPTIONS.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-400">
                      Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-8 h-8 rounded-lg transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>Total Orders: {orders.length}</p>
          <p>Filtered Orders: {filteredOrders.length}</p>
          <p>Search Term: "{searchTerm}"</p>
          <p>Status Filter: {statusFilter}</p>
          <p>Payment Filter: {paymentFilter}</p>
          <p>Backend URL: {axios.defaults.baseURL}</p>
          <p>Token Present: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
        </div> */}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={updateOrderStatus}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
          STATUS_OPTIONS={STATUS_OPTIONS}
        />
      )}
    </div>
  );
};

// Separate modal component for better organization
const OrderDetailsModal = ({ order, onClose, onStatusUpdate, formatDate, formatCurrency, getStatusColor, STATUS_OPTIONS }) => {
  const [status, setStatus] = useState(order.status || 'pending');
  const [localOrder, setLocalOrder] = useState(order);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalOrder(order);
    setStatus(order.status || 'pending');
  }, [order]);

  const handleStatusUpdate = async () => {
    if (status === localOrder.status) return;
    
    try {
      setIsUpdating(true);
      await onStatusUpdate(localOrder.orderId, status);
      setLocalOrder(prev => ({ ...prev, status }));
    } catch (error) {
      // console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get payment method display
  const getPaymentMethodDisplay = (payment) => {
    if (!payment) return { text: 'N/A', color: 'bg-gray-900/30 text-gray-400 border border-gray-700/50' };
    
    const method = payment.method === 'cod' ? 'Cash on Delivery' : 'Online';
    const status = payment.status || 'pending';
    
    const color = status === 'completed' 
      ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
      : status === 'pending' 
      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' 
      : 'bg-red-900/30 text-red-400 border border-red-700/50';
    
    return { text: method, color };
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-900/30 rounded-xl">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <p className="text-gray-400 text-sm">ID: {localOrder.orderId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium">
                    {localOrder.customer?.firstName || ''} {localOrder.customer?.lastName || ''}
                  </p>
                  <p className="text-gray-300 text-sm">📧 {localOrder.customer?.email || 'No email'}</p>
                  <p className="text-gray-300 text-sm">📱 {localOrder.customer?.phone || 'No phone'}</p>
                </div>
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-white text-sm font-medium mb-2">Shipping Address:</p>
                  <p className="text-gray-300 text-sm">{localOrder.shipping?.address || 'No address'}</p>
                  <p className="text-gray-300 text-sm">
                    {localOrder.shipping?.city || ''}, {localOrder.shipping?.state || ''} - {localOrder.shipping?.pinCode || ''}
                  </p>
                  <p className="text-gray-300 text-sm">{localOrder.shipping?.country || 'India'}</p>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date:</span>
                  <span className="text-white">{formatDate(localOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(localOrder.status)}`}>
                    {localOrder.status || 'pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white">
                    {localOrder.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payment Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentMethodDisplay(localOrder.payment).color}`}>
                    {localOrder.payment?.status || 'pending'}
                  </span>
                </div>
                {localOrder.shipping?.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tracking Number:</span>
                    <span className="text-white font-mono text-sm">{localOrder.shipping.trackingNumber}</span>
                  </div>
                )}
                {localOrder.shipping?.courier && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Courier:</span>
                    <span className="text-white">{localOrder.shipping.courier}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Items ({localOrder.items?.length || 0})</h3>
            <div className="space-y-3">
              {localOrder.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                  <div className="flex items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-medium">{item.name || 'Unnamed Item'}</h4>
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity || 1}</p>
                      {item.productId && (
                        <p className="text-gray-500 text-xs">
                          Product ID: {typeof item.productId === 'object' ? item.productId._id : item.productId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </p>
                    <p className="text-gray-400 text-sm">{formatCurrency(item.price || 0)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(localOrder.orderTotal?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">
                    {localOrder.orderTotal?.shipping === 0 ? 'FREE' : formatCurrency(localOrder.orderTotal?.shipping || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (18% GST)</span>
                  <span className="text-white">{formatCurrency(localOrder.orderTotal?.tax || 0)}</span>
                </div>
                {localOrder.giftWrap && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gift Wrap</span>
                    <span className="text-white">₹49</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-blue-400">{formatCurrency(localOrder.orderTotal?.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {localOrder.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap">{localOrder.notes}</p>
              </div>
            </div>
          )}

          {/* Status Update Section */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Update Status</h3>
                <p className="text-gray-400 text-sm">Change the current status of this order</p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={status === localOrder.status || isUpdating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for OrderDetailsModal
OrderDetailsModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  STATUS_OPTIONS: PropTypes.array.isRequired,
};

export default OrdersPage;