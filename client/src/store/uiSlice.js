import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  initLoad: true,
  pageLoading: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.pageLoading += 1;
    },
    stopLoading: (state, action) => {
      if (state.initLoad && state.pageLoading === 2) {
        state.pageLoading = 0;
        state.initLoad = false;
      } else {
        state.pageLoading -= 1;
      }
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
