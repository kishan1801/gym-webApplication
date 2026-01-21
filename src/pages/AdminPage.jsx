import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../../src/api';
import {
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserPlusIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const AdminPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    activeMembers: 0,
    revenue: 0,
    recentUsers: [],
    recentActivity: [],
    checkinsToday: 0,
    activeSessions: 0,
    equipmentUsage: 0,
  });
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check if user is admin on component mount
  useEffect(() => {
    if (user && user.role !== 'admin') {
      // console.log('Non-admin user trying to access admin page, redirecting...');
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users data
      const usersResponse = await API.get('/users', {
        params: { limit: 100, page: 1 }
      });

      // Fetch trainers data
      const trainersResponse = await API.get('/trainers', {
        params: { limit: 100, page: 1 }
      }).catch(() => ({ data: { trainers: [], total: 0 } }));

      const users = usersResponse.data.users || [];
      const trainers = trainersResponse.data.trainers || [];
      
      // Calculate stats
      const totalUsers = users.length;
      const totalTrainers = trainers.length;
      const activeMembers = users.filter(user => user.isActive).length;
      
      // Mock revenue calculation
      const revenue = totalUsers * 29.99;
      
      // Get recent users (last 5)
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Generate recent activity from users
      const recentActivity = generateRecentActivity(users);
      
      // Mock other stats
      const checkinsToday = Math.floor(Math.random() * 50) + 100;
      const activeSessions = Math.floor(Math.random() * 20) + 10;
      const equipmentUsage = Math.floor(Math.random() * 30) + 70;

      setDashboardData({
        totalUsers,
        totalTrainers,
        activeMembers,
        revenue,
        recentUsers,
        recentActivity,
        checkinsToday,
        activeSessions,
        equipmentUsage,
      });
    } catch (error) {
      // console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (users) => {
    const activities = [];
    const now = new Date();
    
    users.slice(0, 8).forEach((user, index) => {
      const hoursAgo = index + 1;
      const activityTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      const activitiesPool = [
        { type: 'join', action: 'joined the gym', icon: UserPlusIcon },
        { type: 'update', action: 'updated profile', icon: UsersIcon },
        { type: 'login', action: 'logged in', icon: CheckCircleIcon },
        { type: 'renewal', action: 'renewed membership', icon: DocumentTextIcon },
      ];
      
      const randomActivity = activitiesPool[Math.floor(Math.random() * activitiesPool.length)];
      
      activities.push({
        user: user.username || `User ${index + 1}`,
        action: randomActivity.action,
        time: `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`,
        type: randomActivity.type,
        icon: randomActivity.icon,
      });
    });
    
    return activities;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBorderColor = () => darkMode ? 'border-gray-700' : 'border-gray-200';
  const getBgColor = () => darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const getCardBg = () => darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200';
  const getTextColor = (isPrimary = true) => darkMode ? (isPrimary ? 'text-white' : 'text-gray-300') : (isPrimary ? 'text-gray-900' : 'text-gray-600');
  const getHoverBg = () => darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  // Stats cards data with real data
  const stats = [
    { 
      name: 'Total Users', 
      value: dashboardData.totalUsers.toLocaleString(), 
      change: '+12%', 
      icon: UsersIcon, 
      color: 'bg-blue-500',
      description: 'Registered users'
    },
    { 
      name: 'Active Members', 
      value: dashboardData.activeMembers.toLocaleString(), 
      change: '+8%', 
      icon: UserGroupIcon, 
      color: 'bg-emerald-500',
      description: 'Active subscriptions'
    },
    { 
      name: 'Total Trainers', 
      value: dashboardData.totalTrainers.toLocaleString(), 
      change: '+5%', 
      icon: AcademicCapIcon, 
      color: 'bg-purple-500',
      description: 'Certified trainers'
    },
    { 
      name: 'Monthly Revenue', 
      value: `₹${dashboardData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      change: '+23%', 
      icon: CurrencyDollarIcon, 
      color: 'bg-amber-500',
      description: 'This month'
    },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className={`min-h-screen ${getBgColor()} transition-colors duration-200 flex items-center justify-center`}>
        <div className="text-center">
          <ShieldCheckIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className={`text-2xl font-bold ${getTextColor()} mb-4`}>Admin Access Required</h1>
          <p className={`${getTextColor(false)} mb-6`}>You need administrator privileges to access this page.</p>
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
      <div className={`min-h-screen ${getBgColor()} transition-colors duration-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className={`${getTextColor()}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getBgColor()} transition-colors duration-200 p-4 md:p-8`} >
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 " >
          <div>
            <h1 className={`text-3xl font-bold ${getTextColor()}`}>
              Welcome back, {user?.username} 👑
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's what's happening with your gym today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </span>
            <button
              onClick={fetchDashboardData}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium transition-all bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className={`rounded-2xl p-4 md:p-6 ${getCardBg()} backdrop-blur-sm hover:transform hover:scale-[1.02] transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.name}
                </p>
                <p className={`text-xl md:text-2xl font-bold mt-2 ${getTextColor()}`}>
                  {stat.value}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {stat.description}
                </p>
              </div>
              <div className={`p-2 md:p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="mt-3 md:mt-4">
              <span className="text-xs font-medium text-emerald-500">
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Recent Users & Activity */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Recent Users */}
          <div className={`rounded-2xl p-4 md:p-6 ${getCardBg()}`}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className={`text-lg font-bold ${getTextColor()}`}>
                Recent Users
              </h2>
              <button 
                onClick={() => navigate('/admin/users')}
                className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              {dashboardData.recentUsers.map((userItem, index) => (
                <div key={userItem._id || index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl ${darkMode ? 'bg-gray-900/30' : 'bg-gray-100'} ${getHoverBg()} transition-colors gap-3 sm:gap-0`}>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {userItem.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className={`font-medium ${getTextColor()}`}>
                        {userItem.username || `User ${index + 1}`}
                      </p>
                      <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                        {userItem.email || 'No email provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userItem.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userItem.role || 'user'}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/users/${userItem._id || index}`)}
                      className="px-3 md:px-4 py-1.5 md:py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity */}
          <div className={`rounded-2xl p-4 md:p-6 ${getCardBg()}`}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className={`text-lg font-bold ${getTextColor()}`}>
                Recent Activity
              </h2>
              <button 
                onClick={fetchDashboardData}
                className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              {dashboardData.recentActivity.map((activity, index) => {
                const ActivityIcon = activity.icon || UsersIcon;
                return (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'join' ? 'bg-blue-900/30 text-blue-400' :
                      activity.type === 'update' ? 'bg-green-900/30 text-green-400' :
                      activity.type === 'login' ? 'bg-purple-900/30 text-purple-400' :
                      'bg-amber-900/30 text-amber-400'
                    }`}>
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className={`text-sm ${getTextColor(false)} truncate`}>
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats & Admin Actions */}
        <div className="space-y-6 md:space-y-8">
          {/* Quick Stats */}
          <div className={`rounded-2xl p-4 md:p-6 ${darkMode ? 'bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-700/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'}`}>
            <h2 className={`text-lg font-bold mb-4 md:mb-6 ${getTextColor()}`}>
              Today's Overview
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/10">
                <span className={getTextColor(false)}>Today's Check-ins</span>
                <span className="font-bold text-white text-xl">{dashboardData.checkinsToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/10">
                <span className={getTextColor(false)}>Active Sessions</span>
                <span className="font-bold text-white text-xl">{dashboardData.activeSessions}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/10">
                <span className={getTextColor(false)}>Equipment Usage</span>
                <span className="font-bold text-white text-xl">{dashboardData.equipmentUsage}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl p-4 md:p-6 ${getCardBg()}`}>
            <h2 className={`text-lg font-bold mb-4 md:mb-6 ${getTextColor()}`}>
              Quick Actions
            </h2>
            <div className="space-y-2 md:space-y-3">
              <button
                onClick={() => navigate('/admin/users')}
                className={`flex items-center p-3 rounded-lg transition-all ${getHoverBg()} w-full text-left`}
              >
                <UsersIcon className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={getTextColor()}>Manage Users</span>
              </button>
              <button
                onClick={() => navigate('/admin/trainers')}
                className={`flex items-center p-3 rounded-lg transition-all ${getHoverBg()} w-full text-left`}
              >
                <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-3" />
                <span className={getTextColor()}>View Trainers</span>
              </button>
              <button
                onClick={() => navigate('/admin/memberships')}
                className={`flex items-center p-3 rounded-lg transition-all ${getHoverBg()} w-full text-left`}
              >
                <UserGroupIcon className="h-5 w-5 text-purple-500 mr-3" />
                <span className={getTextColor()}>Membership Plans</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className={`rounded-2xl p-4 md:p-6 ${getCardBg()}`}>
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-emerald-400 mr-2" />
              <h3 className={`font-bold ${getTextColor()}`}>System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={getTextColor(false)}>Authentication</span>
                <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={getTextColor(false)}>User Role</span>
                <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full">{user?.role || 'user'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={getTextColor(false)}>Last Updated</span>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content - This is where nested routes will render */}
      <div className="mt-6 md:mt-8">
        <Outlet />
      </div>

      {/* Simple Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-700">
        <div className={`text-sm text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          © {new Date().getFullYear()} Admin Dashboard v1.0
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;