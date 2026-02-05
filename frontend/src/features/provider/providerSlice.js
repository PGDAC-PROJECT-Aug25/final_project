import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// Async thunks
export const getProviderDashboard = createAsyncThunk(
  'provider/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/provider/dashboard');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addBus = createAsyncThunk(
  'provider/addBus',
  async (busData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/buses', busData);
      toast.success('Bus added successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add bus';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateBus = createAsyncThunk(
  'provider/updateBus',
  async ({ busId, busData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/provider/buses/${busId}`, busData);
      toast.success('Bus updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update bus';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changeBusStatus = createAsyncThunk(
  'provider/changeBusStatus',
  async ({ busId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/provider/buses/${busId}/status`, { status });
      toast.success('Bus status updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update bus status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const addSchedule = createAsyncThunk(
  'provider/addSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/schedules', scheduleData);
      toast.success('Schedule added successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add schedule';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelSchedule = createAsyncThunk(
  'provider/cancelSchedule',
  async (scheduleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/provider/schedules/${scheduleId}/cancel`);
      toast.success('Schedule cancelled successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel schedule';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getProviderAnalytics = createAsyncThunk(
  'provider/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/provider/analytics/summary');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getProviderProfile = createAsyncThunk(
  'provider/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/provider-profile');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProviderProfile = createAsyncThunk(
  'provider/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/provider-profile', profileData);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  dashboard: null,
  buses: [],
  schedules: [],
  analytics: null,
  profile: null,
  isLoading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard
      .addCase(getProviderDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buses = action.payload.data || [];
        state.dashboard = { buses: action.payload.data || [] };
      })
      .addCase(getProviderDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add bus
      .addCase(addBus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buses.push(action.payload);
      })
      .addCase(addBus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update bus
      .addCase(updateBus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.buses.findIndex(b => b.id === action.payload.id);
        if (index >= 0) {
          state.buses[index] = action.payload;
        }
      })
      .addCase(updateBus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Change bus status
      .addCase(changeBusStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeBusStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.buses.findIndex(b => b.id === action.payload.id);
        if (index >= 0) {
          state.buses[index] = action.payload;
        }
      })
      .addCase(changeBusStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add schedule
      .addCase(addSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules.push(action.payload);
      })
      .addCase(addSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel schedule
      .addCase(cancelSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.schedules.findIndex(s => s.id === action.payload.id);
        if (index >= 0) {
          state.schedules[index] = action.payload;
        }
      })
      .addCase(cancelSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get analytics
      .addCase(getProviderAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload.data;
      })
      .addCase(getProviderAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get profile
      .addCase(getProviderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProviderProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(getProviderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProviderProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateProviderProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = providerSlice.actions;
export default providerSlice.reducer;