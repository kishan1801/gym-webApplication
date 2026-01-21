import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  CreditCardIcon, 
  CogIcon, 
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
  CalendarIcon,
  TrophyIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  ShoppingBagIcon as ShoppingBagIconSolid, 
  ShoppingCartIcon as ShoppingCartIconSolid, 
  UserIcon as UserIconSolid, 
  CreditCardIcon as CreditCardIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import API from '../api';

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 5,
    pendingOrders: 2,
    cartItems: 3,
    totalSpent: 24999,
    workouts: 27,
    activeStreak: 14
  });

  useEffect(() => {
    fetchUserData();
    
    // Set active tab based on URL
    const path = location.pathname.split('/').pop();
    if (path === 'user-dashboard') setActiveTab('dashboard');
    else if (path === 'orders') setActiveTab('orders');
    else if (path === 'cart') setActiveTab('cart');
    else if (path === 'profile') setActiveTab('profile');
    else if (path === 'payments') setActiveTab('payments');
    else setActiveTab('dashboard');
  }, [location]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await API.get('/auth/me');
      setUser(response.data.user);
      
      // Fetch user stats
      const statsResponse = await API.get('/users/stats');
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      // console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    navigate('/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: activeTab === 'dashboard' ? HomeIconSolid : HomeIcon,
      href: '/user-dashboard',
      badge: null
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: activeTab === 'orders' ? ShoppingBagIconSolid : ShoppingBagIcon,
      href: '/user-dashboard/orders',
      badge: stats.pendingOrders
    },
    {
      id: 'cart',
      label: 'My Cart',
      icon: activeTab === 'cart' ? ShoppingCartIconSolid : ShoppingCartIcon,
      href: '/user-dashboard/cart',
      badge: stats.cartItems
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: activeTab === 'profile' ? UserIconSolid : UserIcon,
      href: '/user-dashboard/profile',
      badge: null
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: activeTab === 'payments' ? CreditCardIconSolid : CreditCardIcon,
      href: '/user-dashboard/payments',
      badge: null
    }
  ];

  const secondaryNavItems = [
    {
      id: 'workouts',
      label: 'My Workouts',
      icon: FireIcon,
      href: '/user-dashboard/workouts',
      count: stats.workouts
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: HeartIcon,
      href: '/user-dashboard/wishlist',
      count: 7
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: CalendarIcon,
      href: '/user-dashboard/schedule'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: CogIcon,
      href: '/user-dashboard/settings'
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: QuestionMarkCircleIcon,
      href: '/user-dashboard/help'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Header */}
       

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 p-6">
              {/* User Profile Card */}
              <div className="text-center mb-8 pb-8 border-b border-gray-800">
                <div className="relative inline-block mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <h3 className="text-lg font-bold text-white">{user?.name || user?.username || 'User'}</h3>
                <p className="text-sm text-gray-400 mt-1">{user?.email || 'user@example.com'}</p>
                <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-900/40 to-cyan-900/40 text-blue-300 border border-blue-800/30">
                  <ShieldCheckIcon className="w-3.5 h-3.5 mr-1.5" />
                  {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                </div>
              </div>

              {/* Main Navigation */}
              <nav className="space-y-2 mb-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-white border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700 border border-transparent'
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Secondary Navigation */}
              <div className="mb-8">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
                  More Features
                </h4>
                <nav className="space-y-2">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700 border border-transparent transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      {item.count && (
                        <span className="bg-gray-800/50 text-gray-300 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Streak Card */}
              <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-4 border border-amber-800/30">
                <div className="flex items-center mb-3">
                  <FireIcon className="w-5 h-5 text-amber-400 mr-2" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-200">🔥 {stats.activeStreak} Day Streak</h4>
                    <p className="text-xs text-amber-300/70 mt-1">Keep going! You're on fire!</p>
                  </div>
                </div>
                <div className="flex space-x-1 mb-3">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 h-2 rounded-full ${i < stats.activeStreak % 7 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gray-800'}`}
                    />
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-amber-700/30 to-yellow-700/30 hover:from-amber-700/50 hover:to-yellow-700/50 text-amber-200 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 border border-amber-800/30">
                  View Progress
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Dashboard Stats */}
            {activeTab === 'dashboard' && (
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
                    <p className="text-gray-400">Here's what's happening with your fitness journey today.</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <span className="text-sm text-gray-500">Last updated: Today</span>
                    <button 
                      onClick={fetchUserData}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-800/30">
                        <ShoppingBagIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-800/30">
                        +12%
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</h3>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                  </div>

                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-xl border border-amber-800/30">
                        <ShoppingCartIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-sm font-medium text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-800/30">
                        {stats.cartItems} items
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.cartItems}</h3>
                    <p className="text-gray-400 text-sm">Items in Cart</p>
                  </div>

                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-800/30">
                        <CreditCardIcon className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-800/30">
                        Saved
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalSpent)}</h3>
                    <p className="text-gray-400 text-sm">Total Spent</p>
                  </div>

                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl border border-red-800/30">
                        <FireIcon className="w-6 h-6 text-red-400" />
                      </div>
                      <span className="text-sm font-medium text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800/30">
                        {stats.activeStreak} days
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.workouts}</h3>
                    <p className="text-gray-400 text-sm">Workouts Completed</p>
                  </div>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        <button className="text-sm bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent hover:text-white font-medium transition-colors duration-300">
                          View All
                        </button>
                      </div>
                      <div className="space-y-6">
                        {[
                          { id: 1, type: 'workout', message: 'Completed "Full Body Blast" workout', time: '2 hours ago', status: 'completed', color: 'green' },
                          { id: 2, type: 'payment', message: 'Monthly membership payment processed', time: 'Yesterday', status: 'success', color: 'blue' },
                          { id: 3, type: 'order', message: 'Ordered "Protein Powder"', time: '2 days ago', status: 'shipped', color: 'amber' },
                          { id: 4, type: 'achievement', message: 'Unlocked "Consistency King" badge', time: '1 week ago', status: 'achieved', color: 'purple' },
                        ].map((activity) => (
                          <div key={activity.id} className="flex items-start pb-6 border-b border-gray-800 last:border-0 last:pb-0">
                            <div className={`p-2.5 rounded-xl mr-4 border ${
                              activity.color === 'green' ? 'bg-green-900/20 border-green-800/30' :
                              activity.color === 'blue' ? 'bg-blue-900/20 border-blue-800/30' :
                              activity.color === 'amber' ? 'bg-amber-900/20 border-amber-800/30' :
                              'bg-purple-900/20 border-purple-800/30'
                            }`}>
                              {activity.type === 'workout' && <FireIcon className="w-5 h-5 text-green-400" />}
                              {activity.type === 'payment' && <CreditCardIcon className="w-5 h-5 text-blue-400" />}
                              {activity.type === 'order' && <ShoppingBagIcon className="w-5 h-5 text-amber-400" />}
                              {activity.type === 'achievement' && <TrophyIcon className="w-5 h-5 text-purple-400" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{activity.message}</p>
                              <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                            </div>
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                              activity.color === 'green' ? 'bg-green-900/30 text-green-300 border border-green-800/50' :
                              activity.color === 'blue' ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50' :
                              activity.color === 'amber' ? 'bg-amber-900/30 text-amber-300 border border-amber-800/50' :
                              'bg-purple-900/30 text-purple-300 border border-purple-800/50'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                      <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                      <div className="space-y-4">
                        <Link to="/services" className="block w-full">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-800/30 rounded-xl hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/50 transition-all duration-300">
                            <div className="flex items-center">
                              <ShoppingBagIcon className="w-5 h-5 text-blue-400 mr-3" />
                              <span className="font-medium text-blue-200">Shop Supplements</span>
                            </div>
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-blue-400" />
                          </div>
                        </Link>
                        
                        <Link to="/user-dashboard/payments" className="block w-full">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800/30 rounded-xl hover:shadow-xl hover:shadow-green-500/5 hover:border-green-500/50 transition-all duration-300">
                            <div className="flex items-center">
                              <CreditCardIcon className="w-5 h-5 text-green-400 mr-3" />
                              <span className="font-medium text-green-200">Manage Payments</span>
                            </div>
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-green-400" />
                          </div>
                        </Link>
                        
                        <Link to="/user-dashboard/wishlist" className="block w-full">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-800/30 rounded-xl hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-500/50 transition-all duration-300">
                            <div className="flex items-center">
                              <HeartIcon className="w-5 h-5 text-purple-400 mr-3" />
                              <span className="font-medium text-purple-200">Wishlist Items</span>
                            </div>
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-purple-400" />
                          </div>
                        </Link>
                        
                        <Link to="/user-dashboard/help" className="block w-full">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-800/30 rounded-xl hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/50 transition-all duration-300">
                            <div className="flex items-center">
                              <QuestionMarkCircleIcon className="w-5 h-5 text-amber-400 mr-3" />
                              <span className="font-medium text-amber-200">Get Help</span>
                            </div>
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-amber-400" />
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Special Offer */}
                    <div className="mt-6 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-2xl p-6 border border-brand-primary/30">
                      <div className="flex items-start mb-4">
                        <div className="p-2 bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30 rounded-lg mr-3">
                          <StarIcon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">Special Offer! 🎉</h3>
                          <p className="text-sm text-gray-300">Get 20% off on your next purchase with code: <span className="font-mono font-bold text-brand-primary">FITLYF20</span></p>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-medium py-2.5 px-4 rounded-lg hover:shadow-xl hover:shadow-brand-primary/20 transition-all duration-300">
                        Claim Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Render child routes */}
            <div className={`${activeTab !== 'dashboard' ? 'block' : 'hidden'}`}>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <Outlet />
              </div>
            </div>

            {/* Empty State for Child Routes */}
            {activeTab !== 'dashboard' && location.pathname === '/user-dashboard' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                  <ChartBarIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Select a section to get started</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Choose from the sidebar menu to view your orders, cart, profile, payments, or other account information.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-40">
        <div className="flex justify-around py-3">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.href}
                className="flex flex-col items-center relative"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20' : ''}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-brand-primary font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

       
    </div>
  );
};

export default UserDashboard;