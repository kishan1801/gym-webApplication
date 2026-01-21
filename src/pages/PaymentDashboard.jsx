import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  WalletIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon,
  TrashIcon,
  ChartBarIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

const PaymentDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    totalAmount: 0,
    revenueToday: 0,
    revenueThisMonth: 0
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access payment dashboard, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchPayments();
    }
  }, [currentUser]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/payment/history');
      
      if (response.data.success) {
        setPayments(response.data.payments || []);
        calculateStats(response.data.payments || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch payment data');
      }
    } catch (err) {
      // console.error('Error fetching payments:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load payment data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const successfulPayments = paymentsData.filter(p => p.status === 'success');
    
    const stats = {
      total: paymentsData.length,
      successful: successfulPayments.length,
      failed: paymentsData.filter(p => p.status === 'failed').length,
      pending: paymentsData.filter(p => p.status === 'pending' || p.status === 'created').length,
      totalAmount: successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      revenueToday: successfulPayments
        .filter(p => {
          const paymentDate = new Date(p.paidAt || p.createdAt);
          return paymentDate >= today;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      revenueThisMonth: successfulPayments
        .filter(p => {
          const paymentDate = new Date(p.paidAt || p.createdAt);
          return paymentDate >= firstDayOfMonth;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0)
    };
    setStats(stats);
  };

  // Helper function to safely get string value from object
  const getStringValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      if (value.name) return value.name;
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Filter and sort payments
  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = 
        getStringValue(payment.customerName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStringValue(payment.customerEmail).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStringValue(payment.orderId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStringValue(payment.razorpayPaymentId).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesMethod = paymentMethodFilter === 'all' || payment.paymentMethod === paymentMethodFilter;

      // Date range filter
      let matchesDate = true;
      if (dateRange.start) {
        const paymentDate = new Date(payment.createdAt);
        const startDate = new Date(dateRange.start);
        matchesDate = matchesDate && paymentDate >= startDate;
      }
      if (dateRange.end) {
        const paymentDate = new Date(payment.createdAt);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && paymentDate <= endDate;
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle nested properties
      if (sortBy === 'customerName') {
        aValue = getStringValue(a.customerName);
        bValue = getStringValue(b.customerName);
      } else if (sortBy === 'amount') {
        aValue = parseFloat(a.amount || 0);
        bValue = parseFloat(b.amount || 0);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const viewPaymentDetails = (payment) => {
    // console.log('Payment details object:', payment);
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      // console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '₹0.00';
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(numAmount);
    } catch (error) {
      // console.error('Error formatting amount:', error);
      return '₹0.00';
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusStr = getStringValue(status).toLowerCase();
    switch (statusStr) {
      case 'success':
        return 'bg-emerald-900/30 text-emerald-300';
      case 'failed':
        return 'bg-red-900/30 text-red-300';
      case 'pending':
      case 'created':
        return 'bg-yellow-900/30 text-yellow-300';
      case 'refunded':
        return 'bg-orange-900/30 text-orange-300';
      default:
        return 'bg-gray-900/30 text-gray-300';
    }
  };

  const getStatusText = (status) => {
    const statusStr = getStringValue(status).toLowerCase();
    switch (statusStr) {
      case 'success': return 'Success';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      case 'created': return 'Created';
      case 'refunded': return 'Refunded';
      default: return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
    }
  };

  const getMethodBadgeClass = (method) => {
    const methodStr = getStringValue(method).toLowerCase();
    switch (methodStr) {
      case 'card':
        return 'bg-blue-900/30 text-blue-300';
      case 'upi':
        return 'bg-purple-900/30 text-purple-300';
      case 'netbanking':
        return 'bg-indigo-900/30 text-indigo-300';
      case 'wallet':
        return 'bg-pink-900/30 text-pink-300';
      default:
        return 'bg-gray-900/30 text-gray-300';
    }
  };

  const getMethodText = (method) => {
    const methodStr = getStringValue(method).toLowerCase();
    switch (methodStr) {
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'netbanking': return 'Net Banking';
      case 'wallet': return 'Wallet';
      default: return methodStr.toUpperCase();
    }
  };

  const getMethodIcon = (method) => {
    const methodStr = getStringValue(method).toLowerCase();
    switch (methodStr) {
      case 'card': return CreditCardIcon;
      case 'upi': return DevicePhoneMobileIcon;
      case 'netbanking': return BanknotesIcon;
      case 'wallet': return WalletIcon;
      default: return CurrencyDollarIcon;
    }
  };

  const renderProperty = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="text-sm text-gray-400 flex items-start">
              <span className="mr-2">•</span>
              <span>{renderProperty(item)}</span>
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === 'object') {
      return (
        <pre className="text-sm text-gray-400 whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return value;
  };

  const getPlanName = (payment) => {
    if (!payment) return 'N/A';
    const planName = payment.planName;
    if (!planName) return 'N/A';
    if (typeof planName === 'string') return planName;
    if (typeof planName === 'object' && planName.name) return planName.name;
    return 'N/A';
  };

  const getDurationInfo = (payment) => {
    if (!payment) return '';
    const duration = payment.duration;
    const durationType = payment.durationType;
    
    if (!duration && !durationType) return '';
    
    const durationStr = duration ? duration.toString() : '';
    const durationTypeStr = durationType ? getStringValue(durationType) : '';
    
    return `${durationStr} ${durationTypeStr}`.trim();
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      const response = await API.get('/payment/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      // console.error('Export error:', err);
      setError('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const sendReceipt = async (paymentId) => {
    try {
      const response = await API.post(`/payment/${paymentId}/resend-receipt`);
      if (response.data.success) {
        alert('Receipt sent successfully!');
      }
    } catch (err) {
      console.error('Error sending receipt:', err);
      alert('Failed to send receipt');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 sm:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-400">Loading payment data...</p>
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
                title="Back to Admin"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Payment Dashboard</h1>
                <p className="text-gray-400">View and manage all payment transactions</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-sm rounded-full">
                    Admin: {currentUser.username || currentUser.email}
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
              <button
                onClick={exportToCSV}
                disabled={exporting || payments.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center text-sm ${
                  exporting || payments.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Export CSV
                  </>
                )}
              </button>
              <button
                onClick={fetchPayments}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors text-sm"
                aria-label="Refresh payments"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl border ${
              'bg-red-500/10 border-red-500/30'
            }`}>
              <p className={`flex items-center text-red-400`}>
                <span className="mr-2">
                  <XCircleIcon className="h-5 w-5" />
                </span> 
                {error}
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-xl mr-4">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Payments</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Revenue: {formatAmount(stats.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-900/30 rounded-xl mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Successful</p>
                  <p className="text-2xl font-bold text-white">{stats.successful}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Success rate: {stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-red-900/30 rounded-xl mr-4">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Failed</p>
                  <p className="text-2xl font-bold text-white">{stats.failed}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.failed > 0 ? 'Needs attention' : 'All good'}
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
                  <p className="text-sm text-gray-400">Revenue (Today)</p>
                  <p className="text-2xl font-bold text-white">{formatAmount(stats.revenueToday)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This month: {formatAmount(stats.revenueThisMonth)}
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
                  placeholder="Search by name, email, order ID..."
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
                onClick={fetchPayments}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              {(searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all' || dateRange.start || dateRange.end) && (
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                    <option value="created">Created</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Methods</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {currentPayments.length} of {filteredPayments.length} payments
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl">
            <div className="flex items-center">
              <span className="text-white font-bold text-lg mr-2">{filteredPayments.length}</span>
              <span className="text-gray-500 text-sm">of {payments.length}</span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <span className="ml-4 text-gray-400 text-sm sm:text-base">Loading payments...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 p-8">
              <div className="text-4xl sm:text-6xl mb-4 text-gray-600">💳</div>
              <p className="text-gray-400 text-lg sm:text-xl mb-2 text-center">No payments found</p>
              <p className="text-gray-500 text-center max-w-md text-sm sm:text-base">
                {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all' || dateRange.start || dateRange.end
                  ? 'Try changing your filters or search term'
                  : 'No payment transactions found.'}
              </p>
              {(searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all') && (
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
                          onClick={() => handleSort('customerName')}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <span>Customer</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">
                        <button
                          onClick={() => handleSort('amount')}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <span>Amount</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="hidden md:table-cell py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">Plan</th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">Method</th>
                      <th className="hidden sm:table-cell py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <span>Status</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="hidden md:table-cell py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center space-x-1 hover:text-white transition-colors"
                        >
                          <span>Date</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentPayments.map((payment) => {
                      const MethodIcon = getMethodIcon(payment.paymentMethod);
                      
                      return (
                        <tr key={payment._id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <div>
                              <p className="font-medium text-white text-xs sm:text-sm">
                                {getStringValue(payment.customerName)}
                              </p>
                              <p className="text-gray-400 text-xs break-all">
                                {getStringValue(payment.customerEmail)}
                              </p>
                              <p className="text-gray-500 text-xs mt-1 sm:hidden">
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <div className="font-medium text-white text-xs sm:text-sm">
                              {formatAmount(payment.amount)}
                            </div>
                          </td>
                          <td className="hidden md:table-cell py-3 sm:py-4 px-3 sm:px-6">
                            <div>
                              <p className="font-medium text-white text-xs sm:text-sm">
                                {getPlanName(payment)}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {getDurationInfo(payment)}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <div className="flex items-center">
                              <MethodIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-300">
                                {getMethodText(payment.paymentMethod)}
                              </span>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell py-3 sm:py-4 px-3 sm:px-6">
                            <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                              {getStatusText(payment.status)}
                            </span>
                          </td>
                          <td className="hidden md:table-cell py-3 sm:py-4 px-3 sm:px-6">
                            <div className="text-xs sm:text-sm">
                              <p className="text-white">{formatDate(payment.createdAt)}</p>
                              {payment.paidAt && (
                                <p className="text-gray-400 text-xs mt-1">Paid: {formatDate(payment.paidAt)}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <button
                                onClick={() => viewPaymentDetails(payment)}
                                className="p-1.5 sm:p-2 bg-gray-700 hover:bg-blue-600 text-white rounded-xl transition-colors"
                                title="View Details"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              {payment.status === 'success' && (
                                <button
                                  onClick={() => sendReceipt(payment._id)}
                                  className="p-1.5 sm:p-2 bg-gray-700 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                                  title="Resend Receipt"
                                >
                                  <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              )}
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
                <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-700 bg-gray-900/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Page {currentPage} of {totalPages} • Showing {currentPayments.length} of {filteredPayments.length} payments
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
            <p>Payments: {payments.length}, Filtered: {filteredPayments.length}</p>
            <p>Total Revenue: {formatAmount(stats.totalAmount)}</p>
            <p>Current User: {currentUser?.email} ({currentUser?.role})</p>
            <p>Status filter: {statusFilter}</p>
            <p>Search term: {searchTerm || '(none)'}</p>
            <p>Page: {currentPage} of {totalPages}</p>
          </div>
        )} */}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900/95 border-b border-gray-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-900/30 rounded-xl">
                    <CurrencyDollarIcon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Payment Details</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      ID: {selectedPayment._id?.substring(0, 12)}...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-xl transition text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-emerald-400" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-medium text-white">{getStringValue(selectedPayment.customerName)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-white">{getStringValue(selectedPayment.customerEmail)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium text-white">{getStringValue(selectedPayment.customerPhone)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="font-medium text-white font-mono text-sm">{getStringValue(selectedPayment.userId || selectedPayment.customerId)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-medium text-white font-mono text-sm">{getStringValue(selectedPayment.orderId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payment ID</p>
                    <p className="font-medium text-white font-mono text-sm">{getStringValue(selectedPayment.razorpayPaymentId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-medium text-white text-lg">{formatAmount(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Currency</p>
                    <p className="font-medium text-white">{getStringValue(selectedPayment.currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payment Method</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodBadgeClass(selectedPayment.paymentMethod)}`}>
                        {getMethodText(selectedPayment.paymentMethod)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedPayment.status)}`}>
                      {getStatusText(selectedPayment.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <ReceiptRefundIcon className="w-5 h-5 mr-2 text-purple-400" />
                  Plan Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Plan Name</p>
                    <p className="font-medium text-white">{getPlanName(selectedPayment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="font-medium text-white">{getDurationInfo(selectedPayment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Plan ID</p>
                    <p className="font-medium text-white font-mono text-sm">{getStringValue(selectedPayment.planId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Receipt</p>
                    <p className="font-medium text-white font-mono text-sm">{getStringValue(selectedPayment.receipt)}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-yellow-400" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-white">Order Created</p>
                      <p className="text-sm text-gray-400">{formatDate(selectedPayment.createdAt)}</p>
                    </div>
                  </div>
                  {selectedPayment.paidAt && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-white">Payment Completed</p>
                        <p className="text-sm text-gray-400">{formatDate(selectedPayment.paidAt)}</p>
                      </div>
                    </div>
                  )}
                  {selectedPayment.verificationDate && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-white">Verified</p>
                        <p className="text-sm text-gray-400">{formatDate(selectedPayment.verificationDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Info */}
              {selectedPayment.verificationError && (
                <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-red-300 mb-2">Verification Error</h4>
                  <p className="text-red-300">{getStringValue(selectedPayment.verificationError)}</p>
                </div>
              )}

              {/* Raw Data Toggle */}
              <details className="bg-gray-900/50 rounded-xl p-4">
                <summary className="text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition">
                  View Raw Payment Data
                </summary>
                <div className="mt-4 p-3 bg-gray-800 rounded-lg overflow-x-auto">
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                    {JSON.stringify(selectedPayment, null, 2)}
                  </pre>
                </div>
              </details>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-900/95 border-t border-gray-700 p-6 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  Last updated: {formatDate(selectedPayment.updatedAt || selectedPayment.createdAt)}
                </div>
                <div className="flex space-x-3">
                  {selectedPayment.razorpayPaymentId && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedPayment.razorpayPaymentId);
                        alert('Payment ID copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm"
                    >
                      Copy Payment ID
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;