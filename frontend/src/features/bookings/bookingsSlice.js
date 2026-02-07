import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// Async thunks
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/bookings', bookingData);
      toast.success('Booking created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create booking';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const processPayment = createAsyncThunk(
  'bookings/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payments/pay', paymentData);
      toast.success('Payment processed successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Payment failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getMyBookings = createAsyncThunk(
  'bookings/getMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/bookings/my');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelMultipleBookings = createAsyncThunk(
  'bookings/cancelMultiple',
  async (bookingIds, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/bookings/cancel', { bookingIds });
      toast.success('Bookings cancelled successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel bookings';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  paymentStatus: null,
  isLoading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentStatus = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload.data;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentStatus = action.payload.data;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my bookings
      .addCase(getMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data || [];
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the booking status in the list
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index >= 0) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel multiple bookings
      .addCase(cancelMultipleBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelMultipleBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update multiple bookings status
        action.payload.forEach(updatedBooking => {
          const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
          if (index >= 0) {
            state.bookings[index] = updatedBooking;
          }
        });
      })
      .addCase(cancelMultipleBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBooking, clearPaymentStatus, clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;