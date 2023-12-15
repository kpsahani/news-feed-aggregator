import { combineReducers } from '@reduxjs/toolkit';
import auth from './authSlice';
import feed from './feedSlice';

const rootReducer = combineReducers({
  // Add your reducers here
  auth,
  feed
});

export default rootReducer;
