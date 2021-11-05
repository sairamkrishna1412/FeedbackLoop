import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './uiSlice';

const initialState = { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      const user = action.payload;
      if (user) {
        state.isLoggedIn = true;
        state.user = user;
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
    },
    login: (state, action) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});
export const authActions = authSlice.actions;

export const authThunks = {
  getUser: () => {
    return async function (dispatch) {
      dispatch(uiActions.startLoading());
      const response = await axios.get('/api/user');
      if (response.status === 200 && response.data.success) {
        dispatch(authActions.fetchUser(response.data.data));
      } else {
        dispatch(authActions.fetchUser());
      }
      dispatch(uiActions.stopLoading());
    };
  },
};

export default authSlice;
