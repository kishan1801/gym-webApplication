import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  HomeIcon,
  UserGroupIcon,
  PhotoIcon,
  InformationCircleIcon,
  ShoppingBagIcon,
  CalendarIcon,
  PhoneIcon,
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  CubeIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Header = ({ scrolled = false, user = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Check if a route is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    
    // Close all menus
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    // Navigate to home page
    navigate('/');
    
    // Force a hard refresh after a short delay to clear any cached state
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (showMoreMenu && moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, showMoreMenu, isMobileMenuOpen]);

  // ========== ADMIN HEADER ==========
  if (user?.role === 'admin') {
    
    const adminNavItems = [
      { path: "/admin", label: "Dashboard", icon: ChartBarIcon },
      { path: "/admin/users", label: "Users", icon: UsersIcon },
      { path: "/admin/trainers", label: "Trainers", icon: UserGroupIcon },
      { path: "/admin/memberships", label: "Memberships", icon: CreditCardIcon },
      { path: "/admin/contact", label: "Contacts", icon: EnvelopeIcon },
      { path: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
      { path: "/admin/products", label: "Products", icon: CubeIcon },
      { path: "/admin/payments", label: "Payments", icon: BanknotesIcon },
      { path: "/admin/free-sessions", label: "Free Sessions", icon: CalendarDaysIcon },
      { path: "/admin/coach-applications", label: "Coach Apps", icon: ClipboardDocumentListIcon },
    ];

    return (
      <>
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl py-3 shadow-2xl border-b border-gray-800/50' 
            : 'bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-lg py-4'
        }`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Admin Logo */}
              <Link to="/admin" className="flex items-center space-x-3 group flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-brand-primary/30 transition-all duration-300">
                    <ShieldCheckIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-gray-950"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-tight">
                    FITLYF<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"> ADMIN</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium tracking-wider hidden sm:block">CONTROL PANEL</span>
                </div>
              </Link>

              {/* Admin Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center mx-4">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-3 rounded-xl transition-all duration-300 group min-w-[95px] text-center ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-brand-primary/20 to-brand-secondary/10 border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50'
                    } border border-transparent`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <item.icon className={`h-5 w-5 ${
                        isActive(item.path) ? 'text-brand-primary' : 'text-gray-400 group-hover:text-brand-primary'
                      }`} />
                      <span className="font-semibold text-xs">{item.label}</span>
                    </div>
                    {isActive(item.path) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Admin User Menu */}
              <div className="flex items-center space-x-3">
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-800/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-gray-950"
                    aria-expanded={isUserMenuOpen}
                    aria-label="Admin menu"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-white font-bold text-xl">
                          {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-gray-950"></div>
                    </div>
                    <div className="hidden lg:block text-left max-w-[160px]">
                      <p className="text-white font-bold text-sm truncate">
                        {user?.name || user?.username || 'Admin'}
                      </p>
                      <p className="text-gray-400 text-xs truncate">Administrator</p>
                    </div>
                    <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden animate-fadeIn z-50">
                      <div className="p-4 border-b border-gray-800/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-white font-bold text-xl">
                              {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-bold truncate">{user?.name || user?.username}</p>
                            <p className="text-gray-400 text-sm truncate">{user?.email || 'No email'}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary text-xs rounded-xl font-medium">
                              Administrator
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 max-h-[400px] overflow-y-auto">
                        <Link
                          to="/admin/profile"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-300 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                          <span className="truncate">My Profile</span>
                        </Link>

                        {/* <Link
                          to="/admin/settings"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-300 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                          <span>Settings</span>
                        </Link> */}

                        <div className="border-t border-gray-800/50 my-2"></div>

                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-all duration-300 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HomeIcon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                          <span>Back to Website</span>
                        </Link>

                        <div className="border-t border-gray-800/50 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-300 group"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  ref={mobileMenuButtonRef}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Admin Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className={`lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 min-h-[85px] group ${
                      isActive(item.path)
                        ? 'bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 text-white border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50'
                    } border border-transparent`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300 ${
                      isActive(item.path) ? 'text-brand-primary' : 'text-gray-400'
                    }`} />
                    <span className="font-semibold text-sm text-center">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-800/50 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-2xl">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold truncate">{user?.name || user?.username}</p>
                      <p className="text-gray-400 text-sm truncate">Administrator</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary text-xs rounded-xl font-medium">
                        {user?.email || 'Admin Account'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/admin/profile"
                      className="flex flex-col items-center justify-center p-3 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-xs font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex flex-col items-center justify-center p-3 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-xs font-medium">Settings</span>
                    </Link>
                  </div>

                  <Link
                    to="/"
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 hover:text-blue-300 rounded-xl transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HomeIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Back to Website</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-red-500/20 to-pink-600/20 hover:from-red-500/30 hover:to-pink-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 group"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Header Spacer */}
        <div className={`transition-all duration-300 ${scrolled ? 'h-20' : 'h-24'}`}></div>
      </>
    );
  }

  // ========== LOGGED-IN USER HEADER (Non-admin) ==========
  if (user) {
    const userNavItems = [
      { path: '/', label: 'Home', icon: HomeIcon },
      { path: '/services', label: 'Services', icon: ShoppingBagIcon },
      { path: '/membership', label: 'Membership', icon: CalendarIcon },
      { path: '/trainers', label: 'Trainers', icon: UserGroupIcon },
      { path: '/gallery', label: 'Gallery', icon: PhotoIcon },
      { path: '/profile', label: 'Profile', icon: UserCircleIcon },
      { path: '/store', label: 'Store', icon: CalendarIcon },
    ];

    return (
      <>
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl py-3 shadow-2xl border-b border-gray-800/50' 
            : 'bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-lg py-4'
        }`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-brand-primary/30 transition-all duration-300">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-gray-950"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-tight">
                    FITLYF<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"> GYM</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium tracking-wider hidden sm:block">PREMIUM FITNESS</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center mx-4">
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-3 rounded-xl transition-all duration-300 group min-w-[95px] text-center ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-brand-primary/20 to-brand-secondary/10 border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50'
                    } border border-transparent`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <item.icon className={`h-5 w-5 ${
                        isActive(item.path) ? 'text-brand-primary' : 'text-gray-400 group-hover:text-brand-primary'
                      }`} />
                      <span className="font-semibold text-xs">{item.label}</span>
                    </div>
                    {isActive(item.path) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-800/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-expanded={isUserMenuOpen}
                    aria-label="User menu"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center shadow-2xl">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.username} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-gray-950"></div>
                    </div>
                    <div className="hidden lg:block text-left max-w-[160px]">
                      <p className="text-white font-bold text-sm truncate">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-gray-400 text-xs truncate">Member</p>
                    </div>
                    <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden animate-fadeIn z-50">
                      <div className="p-4 border-b border-gray-800/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.username} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="h-7 w-7 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-bold truncate">{user?.username || 'User'}</p>
                            <p className="text-gray-400 text-sm truncate">{user?.email || 'Member'}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary text-xs rounded-xl font-medium">
                              Member
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/user/profile"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all duration-300 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>My Profile</span>
                        </Link>

                        <div className="border-t border-gray-800/50 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-300 group"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  ref={mobileMenuButtonRef}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className={`lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 min-h-[85px] group ${
                      isActive(item.path)
                        ? 'bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 text-white border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50'
                    } border border-transparent`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300 ${
                      isActive(item.path) ? 'text-brand-primary' : 'text-gray-400'
                    }`} />
                    <span className="font-semibold text-sm text-center">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-800/50 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-2xl">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold truncate">{user?.username || 'User'}</p>
                      <p className="text-gray-400 text-sm truncate">Member</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 text-brand-primary text-xs rounded-xl font-medium">
                        {user?.email || 'Logged In'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/profile"
                      className="flex flex-col items-center justify-center p-3 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-xs font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/schedule"
                      className="flex flex-col items-center justify-center p-3 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CalendarIcon className="h-5 w-5 mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-xs font-medium">Schedule</span>
                    </Link>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-red-500/20 to-pink-600/20 hover:from-red-500/30 hover:to-pink-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 group"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className={`transition-all duration-300 ${scrolled ? 'h-20' : 'h-24'}`}></div>
      </>
    );
  }

  // ========== PUBLIC HEADER (Not logged in) ==========
  const publicNavItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/services', label: 'Services', icon: ShoppingBagIcon },
    { path: '/membership', label: 'Membership', icon: CalendarIcon },
    { path: '/trainers', label: 'Trainers', icon: UserGroupIcon },
    { path: '/gallery', label: 'Gallery', icon: PhotoIcon },
    { path: '/about', label: 'About', icon: InformationCircleIcon },
    { path: '/contact', label: 'Contact', icon: PhoneIcon },
    { path: '/store', label: 'Store', icon: ShoppingBagIcon },
    { path: '/coach', label: 'Become A Coach', icon: UserGroupIcon }
  ];

  const mainNavItems = publicNavItems.slice(0, 6);
  const moreNavItems = publicNavItems.slice(6);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl py-3 shadow-2xl border-b border-gray-800/50' 
          : 'bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-lg py-4'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-brand-primary/30 transition-all duration-300">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-gray-950"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">
                  FITLYF<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"> GYM</span>
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wider hidden sm:block">PREMIUM FITNESS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center mx-4">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-3 rounded-xl transition-all duration-300 group min-w-[95px] text-center ${
                    isActive(item.path)
                      ? 'text-white bg-gradient-to-r from-brand-primary/20 to-brand-secondary/10 border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50'
                  } border border-transparent`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <item.icon className={`h-5 w-5 ${
                      isActive(item.path) ? 'text-brand-primary' : 'text-gray-400 group-hover:text-brand-primary'
                    }`} />
                    <span className="font-semibold text-xs">{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
                  )}
                </Link>
              ))}
              
              {moreNavItems.length > 0 && (
                <div className="relative" ref={moreMenuRef}>
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`relative px-4 py-3 rounded-xl transition-all duration-300 group min-w-[95px] text-center border ${
                      moreNavItems.some(item => isActive(item.path))
                        ? 'text-white bg-gradient-to-r from-brand-primary/20 to-brand-secondary/10 border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50 border-transparent'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <svg className={`h-5 w-5 ${
                        moreNavItems.some(item => isActive(item.path)) 
                          ? 'text-brand-primary' 
                          : 'text-gray-400 group-hover:text-brand-primary'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      <span className="font-semibold text-xs">More</span>
                    </div>
                    <ChevronDownIcon className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform duration-300 ${
                      showMoreMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showMoreMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden animate-fadeIn z-50">
                      <div className="py-2">
                        {moreNavItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all duration-300 group ${
                              isActive(item.path) ? 'bg-brand-primary/10' : ''
                            }`}
                            onClick={() => {
                              setShowMoreMenu(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* User Actions - Sign In/Join Now buttons removed */}
            <div className="flex items-center space-x-3">
              <button
                ref={mobileMenuButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 min-h-[85px] group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 text-white border border-brand-primary/30 shadow-lg shadow-brand-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50'
                  } border border-transparent`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={`h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300 ${
                    isActive(item.path) ? 'text-brand-primary' : 'text-gray-400'
                  }`} />
                  <span className="font-semibold text-sm text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={`transition-all duration-300 ${scrolled ? 'h-20' : 'h-24'}`}></div>
    </>
  );
};

export default Header;