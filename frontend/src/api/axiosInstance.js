import axios from 'axios';
import { toast } from 'react-toastify';
import { isTokenExpired } from '../utils/jwtUtils';

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'https://enjoy-travelling-with-us-bckend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    console.log('Request interceptor - Token exists:', !!token);
    
    // Skip token validation for login requests
    const isLoginRequest = config.url?.includes('/auth/login');
    
    if (token && !isLoginRequest) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        console.log('Token expired, clearing session');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      console.log('Adding token to request header');
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isLoginRequest) {
      console.log('No token found in sessionStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Only handle 401/403 if user is already logged in (has token)
    // Don't handle these errors during login attempt
    const token = sessionStorage.getItem('token');
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if ((error.response?.status === 401 || error.response?.status === 403) && token && !isLoginRequest) {
      console.log('Unauthorized/Forbidden - clearing session');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;