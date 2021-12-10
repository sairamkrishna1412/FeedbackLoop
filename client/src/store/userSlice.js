import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

import { uiActions } from './uiSlice';

//setting it to empty instead of null will make sure there is no exception with calling its attributes when it is empty
const initialState = { campaigns: [], visibleCampaign: {} };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCampaigns: (state, action) => {
      const campaigns = action.payload;
      if (campaigns) {
        state.campaigns = campaigns;
      } else {
        state.campaigns = [];
      }
    },
    setVisibleCampaign: (state, action) => {
      const campaign = action.payload;
      if (campaign) {
        state.visibleCampaign = campaign;
      } else {
        state.visibleCampaign = {};
      }
    },
  },
});

export const userActions = userSlice.actions;

export const userThunks = {
  getCampaigns: () => {
    return async function (dispatch) {
      dispatch(uiActions.startLoading());
      const response = await axios.get('/api/campaign/myCampaigns');
      if (response.status === 200 && response.data.success) {
        const campaigns = response.data.data;
        dispatch(userActions.setCampaigns(campaigns));
      }
      dispatch(uiActions.stopLoading());
    };
  },

  getCampaign: (id) => {
    return async function (dispatch, getState) {
      dispatch(uiActions.startLoading());
      // double destructuring
      const {
        user: { campaigns },
      } = getState();

      let campaign = campaigns.find((el) => el._id === id);
      if (!campaign) {
        const response = await axios.get(`/api/campaign/${id}`);
        if (response.status === 200 && response.data.success) {
          campaign = response.data.data;
        }
      }

      dispatch(userActions.setVisibleCampaign(campaign));

      dispatch(uiActions.stopLoading());
    };
  },
};

export default userSlice;
