import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// Async thunks
export const getAdminUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getAdminBuses = createAsyncThunk(
  'admin/getBuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/buses');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch buses';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getAdminBookings = createAsyncThunk(
  'admin/getBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/bookings');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyProvider = createAsyncThunk(
  'admin/verifyProvider',
  async (providerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/providers/${providerId}/verify`);
      toast.success('Provider verified successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to verify provider';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changeUserStatus = createAsyncThunk(
  'admin/changeUserStatus',
  async ({ userId, active }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${userId}/status?active=${active}`);
      toast.success(`User ${active ? 'activated' : 'blocked'} successfully!`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change user status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getAdminAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/analytics/summary');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  users: [],
  buses: [],
  bookings: [],
  analytics: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || [];
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get buses
      .addCase(getAdminBuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminBuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buses = action.payload.data || [];
      })
      .addCase(getAdminBuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get bookings
      .addCase(getAdminBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data || [];
      })
      .addCase(getAdminBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify provider
      .addCase(verifyProvider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyProvider.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Change user status
      .addCase(changeUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get analytics
      .addCase(getAdminAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload.data;
      })
      .addCase(getAdminAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;