import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    token: null,
    userDetails: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      state.userDetails = action.payload.data;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userDetails = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
