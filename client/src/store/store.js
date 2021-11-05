import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import uiSlice from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export default store;
