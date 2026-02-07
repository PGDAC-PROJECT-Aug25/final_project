import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// Async thunks
export const searchBuses = createAsyncThunk(
  'customer/searchBuses',
  async (searchParams, { rejectWithValue }) => {
    try {
      const params = {
        from: searchParams.source,
        to: searchParams.destination,
        date: searchParams.journeyDate
      };
      console.log('Searching buses with params:', params);
      const response = await axiosInstance.get('/buses/search', { params });
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      const message = error.response?.data?.message || 'Failed to search buses';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getSeats = createAsyncThunk(
  'customer/getSeats',
  async (scheduleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/schedules/${scheduleId}/seats`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch seats';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getCustomerProfile = createAsyncThunk(
  'customer/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/customer-profile');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'customer/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/customer-profile', profileData);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'customer/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/change-password', passwordData);
      toast.success('Password changed successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  buses: [],
  seats: [],
  profile: null,
  selectedBus: null,
  selectedSeats: [],
  isLoading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    selectBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    selectSeat: (state, action) => {
      const seat = action.payload;
      const existingIndex = state.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
      if (existingIndex >= 0) {
        // Remove seat if already selected (toggle off)
        state.selectedSeats.splice(existingIndex, 1);
      } else {
        // Add seat if not selected (toggle on)
        state.selectedSeats.push(seat);
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search buses
      .addCase(searchBuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buses = action.payload.data || [];
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get seats
      .addCase(getSeats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSeats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seats = action.payload.data || [];
      })
      .addCase(getSeats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get profile
      .addCase(getCustomerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCustomerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(getCustomerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateCustomerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { selectBus, selectSeat, clearSelectedSeats, clearError } = customerSlice.actions;
export default customerSlice.reducer;