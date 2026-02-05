import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/customer/customerSlice';
import providerReducer from '../features/provider/providerSlice';
import adminReducer from '../features/admin/adminSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    provider: providerReducer,
    admin: adminReducer,
    bookings: bookingsReducer,
  },
});

export default store;