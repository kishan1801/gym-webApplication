import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_BASE_URL = 'https://fitlyfy.onrender.com/api';

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const currentToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // Try to use stored user data first for immediate display
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          // console.error('Error parsing stored user:', error);
        }
      }

      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { 
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.user) {
          // console.log('✅ AuthContext: User authenticated', response.data.user);
          setUser(response.data.user);
          setToken(currentToken);
          // Update stored user
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          // console.log('❌ AuthContext: Invalid response');
          logout();
        }
      } catch (error) {
        // console.error('❌ AuthContext: Authentication failed', error);
        // Don't logout immediately for minor network issues
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Function to update user data
  const updateUser = (userData, newToken = null) => {
    // console.log('🔄 AuthContext: Updating user data', userData);
    
    // Update state
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update token if provided
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    }
  };

  // Function to refresh user data from server
  const refreshUser = async () => {
    const currentToken = localStorage.getItem('token');
    
    if (!currentToken) {
      logout();
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success && response.data.user) {
        // console.log('🔄 AuthContext: Refreshed user data', response.data.user);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      // console.error('❌ AuthContext: Failed to refresh user data', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setUser(response.data.user);
        setToken(response.data.token);
        
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      // console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setUser(response.data.user);
        setToken(response.data.token);
        
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      // console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    // console.log('👋 AuthContext: Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    // Optional: Redirect to login page
    // window.location.href = '/login';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context itself if needed elsewhere
export default AuthContext;