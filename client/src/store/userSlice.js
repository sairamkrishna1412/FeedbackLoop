import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

import { uiActions } from './uiSlice';

//setting it to empty instead of null will make sure there is no exception with calling its attributes when it is empty
const initialState = { campaigns: [], visibleCampaign: {}, newCampaign: {} };

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
    setNewCampaign: (state, action) => {
      const campaign = action.payload;
      state.newCampaign = campaign;
    },
  },
});

export const userActions = userSlice.actions;

export const userThunks = {
  getCampaigns: () => {
    return async function (dispatch) {
      try {
        dispatch(uiActions.startLoading());
        const response = await axios.get('/api/campaign/myCampaigns');
        if (response.status === 200 && response.data.success) {
          // divide the campaigns into lauched, unlaunched. (active, inactive : later)
          const campaigns = response.data.data;
          // const launched = campaigns.filter((el) => el.lauchedAt);
          // const unLaunched = campaigns.filter((el) => !el.lauchedAt);
          dispatch(userActions.setCampaigns(campaigns));
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  getCampaign: (id) => {
    return async function (dispatch, getState) {
      try {
        dispatch(uiActions.startLoading());
        // double destructuring
        const {
          user: { campaigns },
        } = getState();

        //here
        let campaign = { ...campaigns.find((el) => el._id === id) };
        // JSON.parse(
        //   JSON.stringify(campaigns.find((el) => el._id === id))
        // );
        if (!campaign) {
          const response = await axios.get(`/api/campaign/${id}`);
          if (response.status === 200 && response.data.success) {
            campaign = response.data.data;
          }
        }
        if (campaign) {
          const response1 = await axios.get(`/api/campaign/responses/${id}`);
          if (response1.status === 200 && response1.data.success) {
            campaign.responses = response1.data.data;
          }
        }

        dispatch(userActions.setVisibleCampaign(campaign));

        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  newCampaignSetup: (campaign) => {
    return async function (dispatch) {
      try {
        dispatch(uiActions.startLoading());
        let resCampaign = {};
        const response = await axios.post(`/api/campaign/new`, campaign);
        if (response.status === 201 && response.data.success) {
          resCampaign = response.data.data;
        }
        if (Object.keys(resCampaign).length) {
          dispatch(userActions.setNewCampaign(resCampaign));
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },
};

export default userSlice;
