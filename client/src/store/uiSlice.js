import { createSlice } from '@reduxjs/toolkit';

const initialState = { pageLoading: true };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.pageLoading = true;
    },
    stopLoading: (state, action) => {
      state.pageLoading = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
