import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    membership: 'FITLYF PRO',
    membershipStatus: 'Active',
    membershipExpiry: '2024-12-31',
    joinedDate: '2023-06-15',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff'
  });

  const [stats, setStats] = useState({
    workoutsCompleted: 42,
    caloriesBurned: 12500,
    currentStreak: 7,
    weightProgress: -3.5
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'Workout', activity: 'HIIT Training', time: '2 hours ago', calories: 450 },
    { id: 2, type: 'Payment', activity: 'Monthly Subscription', time: '1 day ago', amount: '₹2999' },
    { id: 3, type: 'Booking', activity: 'Personal Trainer Session', time: '2 days ago', trainer: 'Golden Arif' },
    { id: 4, type: 'Achievement', activity: '10 Workout Streak', time: '3 days ago', badge: '🏆' },
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState([
    { id: 1, type: 'Personal Training', trainer: 'Tabraiz', date: '2024-02-20', time: '10:00 AM' },
    { id: 2, type: 'Yoga Class', trainer: 'Naveed', date: '2024-02-22', time: '6:00 PM' },
    { id: 3, type: 'Strength Training', trainer: 'Golden Arif', date: '2024-02-25', time: '4:00 PM' },
  ]);

  // Check if user is admin
  const isAdmin = userData.email === 'admin@fitlyf.com';

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('fitlyf_token');
    navigate('/');
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userData.name}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right hidden md:block">
              <p className="text-white font-semibold">{userData.name}</p>
              <p className="text-brand-primary text-sm">{userData.membership}</p>
            </div>
            <img 
              src={userData.avatar} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-brand-primary"
            />
            <button 
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Admin Mode
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-t-lg transition duration-300 ${
              activeTab === 'overview' 
                ? 'bg-brand-primary text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-4 py-2 rounded-t-lg transition duration-300 ${
              activeTab === 'workouts' 
                ? 'bg-brand-primary text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2 rounded-t-lg transition duration-300 ${
              activeTab === 'membership' 
                ? 'bg-brand-primary text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Membership
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-t-lg transition duration-300 ${
              activeTab === 'bookings' 
                ? 'bg-brand-primary text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Bookings
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-t-lg transition duration-300 ${
                activeTab === 'admin' 
                  ? 'bg-red-500 text-white' 
                  : 'text-red-400 hover:text-white hover:bg-red-900'
              }`}
            >
              Admin Panel
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-dark-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Workouts Completed</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.workoutsCompleted}</h3>
                  </div>
                  <div className="text-brand-primary">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Calories Burned</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.caloriesBurned.toLocaleString()}</h3>
                  </div>
                  <div className="text-orange-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Streak</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.currentStreak} days</h3>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Weight Progress</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.weightProgress} kg</h3>
                  </div>
                  <div className="text-blue-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Upcoming Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-dark-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-4 ${
                          activity.type === 'Workout' ? 'bg-brand-primary/20' :
                          activity.type === 'Payment' ? 'bg-green-500/20' :
                          activity.type === 'Booking' ? 'bg-blue-500/20' :
                          'bg-yellow-500/20'
                        }`}>
                          {activity.badge || (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              {activity.type === 'Workout' ? (
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                              ) : activity.type === 'Payment' ? (
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2H4v4h12V6z" clipRule="evenodd"></path>
                              ) : activity.type === 'Booking' ? (
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                              )}
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{activity.activity}</p>
                          <p className="text-gray-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                      {activity.calories && (
                        <span className="text-orange-500 font-bold">{activity.calories} cal</span>
                      )}
                      {activity.amount && (
                        <span className="text-green-500 font-bold">{activity.amount}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-dark-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Upcoming Bookings</h2>
                  <button className="text-brand-primary hover:text-brand-secondary transition duration-300">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold">{booking.type}</h3>
                          <p className="text-gray-400 text-sm">with {booking.trainer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{booking.date}</p>
                          <p className="text-brand-primary text-sm">{booking.time}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2 rounded-lg text-sm transition duration-300">
                          Join Session
                        </button>
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition duration-300">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-card rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                  <svg className="w-8 h-8 text-brand-primary mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-white text-sm">Book Class</span>
                </button>

                <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                  <svg className="w-8 h-8 text-green-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2H4v4h12V6z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-white text-sm">Make Payment</span>
                </button>

                <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                  <svg className="w-8 h-8 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                  </svg>
                  <span className="text-white text-sm">View Diet Plan</span>
                </button>

                <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                  <svg className="w-8 h-8 text-purple-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-white text-sm">Support Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Membership Tab */}
        {activeTab === 'membership' && (
          <div className="space-y-8">
            <div className="bg-dark-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Membership Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Current Plan</h3>
                  <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-brand-primary">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-white">{userData.membership}</h4>
                        <p className="text-brand-primary">{userData.membershipStatus}</p>
                      </div>
                      <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expiry Date:</span>
                        <span className="text-white">{userData.membershipExpiry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joined On:</span>
                        <span className="text-white">{userData.joinedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Billing:</span>
                        <span className="text-white">₹2,999 on 31st March</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h5 className="text-white font-semibold mb-3">Plan Features</h5>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-brand-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Unlimited Gym Access
                        </li>
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-brand-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          4 Personal Training Sessions
                        </li>
                        <li className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-brand-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          All Group Classes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Upgrade Plan</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">FITLYF MAX</h4>
                          <p className="text-gray-400 text-sm">₹5,499 / 12 months</p>
                        </div>
                        <button className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-lg transition duration-300">
                          Upgrade
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">FITLYF LITE</h4>
                          <p className="text-gray-400 text-sm">₹1,499 / 3 months</p>
                        </div>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300">
                          Downgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-white font-semibold mb-4">Payment History</h4>
                    <div className="space-y-3">
                      {[
                        { date: '2024-01-31', amount: '₹2,999', status: 'Paid' },
                        { date: '2023-12-31', amount: '₹2,999', status: 'Paid' },
                        { date: '2023-11-30', amount: '₹2,999', status: 'Paid' },
                      ].map((payment, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-white">{payment.date}</p>
                            <p className="text-gray-400 text-sm">Monthly Subscription</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">{payment.amount}</p>
                            <span className="text-green-500 text-sm">{payment.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel Tab */}
        {activeTab === 'admin' && isAdmin && (
          <div className="space-y-8">
            <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Admin Controls</h2>
              <p className="text-gray-300">You have full administrative access to manage the FITLYF system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Manage Members</h3>
                <p className="text-gray-400 mb-4">View, edit, and manage all member accounts</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300">
                  View Members
                </button>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Website Content</h3>
                <p className="text-gray-400 mb-4">Update prices, trainers, and website content</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300">
                  Edit Content
                </button>
              </div>

              <div className="bg-dark-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Analytics</h3>
                <p className="text-gray-400 mb-4">View reports and business analytics</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-300">
                  View Reports
                </button>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">1,250</div>
                  <div className="text-gray-400">Total Members</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">₹3.5L</div>
                  <div className="text-gray-400">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">85%</div>
                  <div className="text-gray-400">Renewal Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">42</div>
                  <div className="text-gray-400">New This Month</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === 'workouts' && (
          <div className="space-y-8">
            <div className="bg-dark-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Workout History</h2>
              {/* Add workout content here */}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            <div className="bg-dark-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Manage Bookings</h2>
              {/* Add bookings content here */}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="mt-8 bg-dark-card rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Personal Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={userData.name}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={userData.email}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <button className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2 rounded-lg transition duration-300">
                  Update Profile
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-300">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;