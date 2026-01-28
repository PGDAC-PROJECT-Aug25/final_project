import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import customerReducer from "./slices/customerSlice";
import providerReducer from "./slices/providerSlice";
import adminReducer from "./slices/adminSlice";
import bookingReducer from "./slices/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    provider: providerReducer,
    admin: adminReducer,
    bookings: bookingReducer,
  },
});
