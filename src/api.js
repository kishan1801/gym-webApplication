import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fitlyfy.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('Adding token to request:', token.substring(0, 20) + '...');
    } else {
      // console.log('No token found for request');
    }
    return config;
  },
  (error) => {
    // console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => {
    // console.log('Response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      // console.log('Unauthorized, clearing tokens...');
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;