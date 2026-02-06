import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { getUserFromToken } from '../../utils/jwtUtils';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Making login request with:', credentials);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { data: token } = response.data; // JWT token is in data field
      console.log('Extracted token:', token);
      
      if (!token) {
        console.error('No token in response');
        throw new Error('No token received from server');
      }
      
      // Extract user info from JWT token
      const user = getUserFromToken(token);
      console.log('Extracted user from token:', user);
      
      if (!user) {
        console.error('Failed to extract user from token');
        throw new Error('Invalid token received');
      }
      
      console.log('Storing in sessionStorage - token:', token, 'role:', user.role, 'user:', user);
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', user.role);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      console.log('Verification - stored in sessionStorage:', {
        token: sessionStorage.getItem('token'),
        role: sessionStorage.getItem('role'),
        user: sessionStorage.getItem('user')
      });
      
      toast.success('Login successful!');
      return { token, role: user.role, user };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      let message = 'Login failed';
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          message = 'Invalid email or password';
        } else if (error.response.status === 403) {
          message = 'Access denied. Please check your credentials.';
        } else {
          message = error.response.data?.message || error.response.data || 'Login failed';
        }
      } else if (error.request) {
        // Request made but no response
        message = 'Unable to connect to server. Please try again.';
      } else {
        // Other errors
        message = error.message || 'Login failed';
      }
      
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register/customer', userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerProvider = createAsyncThunk(
  'auth/registerProvider',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register/provider', userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  token: sessionStorage.getItem('token') || null,
  role: sessionStorage.getItem('role') || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!sessionStorage.getItem('token'),
};

console.log('Auth initial state:', initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      const userStr = sessionStorage.getItem('user');
      
      console.log('Initializing auth from sessionStorage:', { token, role, userStr });
      
      if (token && role && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.token = token;
          state.role = role;
          state.user = user;
          state.isAuthenticated = true;
          console.log('Auth initialized successfully:', { role, user, isAuthenticated: true });
        } catch (error) {
          console.error('Error parsing user from sessionStorage:', error);
          // Clear corrupted data
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('role');
          sessionStorage.removeItem('user');
        }
      }
    },
    logout: (state) => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login fulfilled, updating state with:', action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        console.log('Updated auth state:', {
          isAuthenticated: state.isAuthenticated,
          role: state.role,
          user: state.user
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register Customer
      .addCase(registerCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register Provider
      .addCase(registerProvider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerProvider.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { initializeAuth, logout, clearError } = authSlice.actions;
export default authSlice.reducer;