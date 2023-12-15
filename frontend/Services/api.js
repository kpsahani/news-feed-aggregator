// src/services/api.js
import axios from 'axios';
import store from '@/store';
import { logout } from '@/store/reducers/authSlice';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
});

api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Add a response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error.response);
    }
  );
  export default api;