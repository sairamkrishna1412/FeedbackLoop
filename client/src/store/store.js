import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import uiSlice from './uiSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
