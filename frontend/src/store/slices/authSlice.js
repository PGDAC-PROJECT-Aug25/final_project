import { createSlice } from "@reduxjs/toolkit";

const token = sessionStorage.getItem("token");
const role = sessionStorage.getItem("role");

const initialState = {
  token: token || null,
  role: role || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { token, role } = action.payload;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
    },

    logout(state) {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      sessionStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
