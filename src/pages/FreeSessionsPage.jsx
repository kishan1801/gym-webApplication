import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Set axios baseURL
axios.defaults.baseURL = 'https://fitlyfy.onrender.com:5000';

const FreeSessionsPage = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access free sessions, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchSessions();
      fetchStats();
    }
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/free-sessions');
      setSessions(response.data.data || []);
    } catch (error) {
      // console.error('Error fetching sessions:', error);
      const errorMsg = error.response?.data?.message || 'Failed to load session requests';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/free-sessions/stats/summary');
      setStats(response.data.data || {});
    } catch (error) {
      // console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await axios.put(`/api/free-sessions/${id}`, { status });
      fetchSessions();
      fetchStats();
    } catch (error) {
      // console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteSession = async (id) => {
    if (window.confirm('Are you sure you want to delete this session request?')) {
      try {
        setUpdatingId(id);
        await axios.delete(`/api/free-sessions/${id}`);
        fetchSessions();
        fetchStats();
      } catch (error) {
        // console.error('Error deleting session:', error);
        alert('Failed to delete session request');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert 24h to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

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

  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading session requests...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Free Session Requests</h1>
              <p className="text-gray-400">Manage trial session requests</p>
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
          <button
            onClick={() => {
              fetchSessions();
              fetchStats();
            }}
            className="mt-4 md:mt-0 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-400">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={fetchSessions}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
                <p className="text-sm text-gray-400 mt-1">Total</p>
              </div>
            </div>
            <div className="bg-yellow-900/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-700/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.pending || 0}</p>
                <p className="text-sm text-gray-400 mt-1">Pending</p>
              </div>
            </div>
            <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.confirmed || 0}</p>
                <p className="text-sm text-gray-400 mt-1">Confirmed</p>
              </div>
            </div>
            <div className="bg-green-900/20 backdrop-blur-sm rounded-xl p-4 border border-green-700/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.completed || 0}</p>
                <p className="text-sm text-gray-400 mt-1">Completed</p>
              </div>
            </div>
            <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-purple-700/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.weekly || 0}</p>
                <p className="text-sm text-gray-400 mt-1">This Week</p>
              </div>
            </div>
            <div className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-400">{stats.monthly || 0}</p>
                <p className="text-sm text-gray-400 mt-1">This Month</p>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Session Requests</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {loading ? 'Loading...' : `${sessions.length} request${sessions.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <button
                onClick={fetchSessions}
                className="mt-4 md:mt-0 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh List
              </button>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Session Requests</h3>
              <p className="text-gray-400">No free session requests have been submitted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Contact</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Session Details</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Submitted</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium">{session.name}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {session.experienceLevel} • {session.age || 'N/A'} years
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {session.goals || 'No goals specified'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-white">{session.phone}</p>
                          <p className="text-gray-400 text-sm break-all">{session.email}</p>
                          {session.referral && (
                            <p className="text-gray-500 text-xs">
                              Referral: {session.referral}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white">{formatDate(session.preferredDate)}</p>
                          <p className="text-gray-400 text-sm">{formatTime(session.preferredTime)}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            Duration: {session.duration || '60'} min
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'pending' 
                            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                            : session.status === 'confirmed' 
                            ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50'
                            : session.status === 'completed'
                            ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                            : 'bg-red-900/30 text-red-400 border border-red-700/50'
                        }`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-gray-300">{formatDate(session.submittedAt)}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(session.submittedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateStatus(session._id, 'confirmed')}
                            disabled={session.status === 'confirmed' || updatingId === session._id}
                            className="px-3 py-1 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {updatingId === session._id && session.status === 'pending' ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                            ) : null}
                            Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(session._id, 'completed')}
                            disabled={session.status === 'completed' || updatingId === session._id}
                            className="px-3 py-1 bg-green-900/30 hover:bg-green-800/50 text-green-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {updatingId === session._id && session.status === 'confirmed' ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                            ) : null}
                            Complete
                          </button>
                          <button
                            onClick={() => deleteSession(session._id)}
                            disabled={updatingId === session._id}
                            className="px-3 py-1 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {updatingId === session._id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                            ) : null}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-900/30 rounded-lg mr-3">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Session Management Guide</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Status Workflow</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong>Pending:</strong> New request, needs confirmation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span><strong>Confirmed:</strong> Session scheduled, awaiting completion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span><strong>Completed:</strong> Session has been conducted</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Best Practices</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Confirm sessions within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Follow up with clients after confirmation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Update status promptly after session completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>Total Sessions: {sessions.length}</p>
          <p>Backend URL: {axios.defaults.baseURL}</p>
          <p>Stats Available: {stats ? 'Yes' : 'No'}</p>
        </div> */}
      </div>
    </div>
  );
};

export default FreeSessionsPage;