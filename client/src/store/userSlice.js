import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

import { uiActions } from './uiSlice';

//setting it to empty instead of null will make sure there is no exception with calling its attributes when it is empty
const initialState = {
  campaigns: [],
  visibleCampaign: {},
  newCampaign: {
    campaignName: '',
    emailSubject: '',
    previewText: '',
    emailContent: '',
  },
};

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
    addToCampaigns: (state, action) => {
      const campaign = action.payload;
      state.campaigns.push(campaign);
    },
    updateCampaign: (state, action) => {
      const campaign = action.payload;
      const reqCampIndex = state.campaigns.findIndex(
        (el) => el._id === campaign._id
      );
      // console.log(reqCampIndex);
      if (reqCampIndex !== -1) {
        state.campaigns[reqCampIndex] = campaign;
        // console.log(state.campaigns[reqCampIndex]);
      } else {
        state.campaigns.push(campaign);
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
          // const launched = campaigns.filter((el) => el.launchedAt);
          // const unLaunched = campaigns.filter((el) => !el.launchedAt);
          dispatch(userActions.setCampaigns(campaigns));
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  getCampaign: (id) => {
    return async function (dispatch) {
      try {
        dispatch(uiActions.startLoading());
        let campaign;
        const response = await axios.get(`/api/campaign/${id}`);
        if (response.status === 200 && response.data.success) {
          campaign = response.data.data;
        }
        // dispatch(userActions.setVisibleCampaign(campaign));
        dispatch(userActions.updateCampaign(campaign));
        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  getCampaignSummary: (id) => {
    return async function (dispatch, getState) {
      try {
        dispatch(uiActions.startLoading());
        // double destructuring
        // const {
        //   user: { campaigns },
        // } = getState();

        //here
        // let campaign = { ...campaigns.find((el) => el._id === id) };
        // JSON.parse(
        //   JSON.stringify(campaigns.find((el) => el._id === id))
        // );
        // if (!campaign) {
        let campaign;
        const response = await axios.get(`/api/campaign/${id}`);
        if (response.status === 200 && response.data.success) {
          campaign = response.data.data;
        }
        // }
        // if (campaign) {
        //   const response1 = await axios.get(`/api/campaign/responses/${id}`);
        //   if (response1.status === 200 && response1.data.success) {
        //     campaign.responses = response1.data.data;
        //   }
        // }
        if (campaign) {
          const response1 = await axios
            .get(`/api/campaign/summary/${id}`)
            .catch(() => {
              campaign.feedbackData = null;
              dispatch(userActions.setVisibleCampaign(campaign));
            });

          if (response1.status === 200 && response1.data.success) {
            campaign.feedbackData = response1.data.data;
          }
        }
        console.log(campaign);
        dispatch(userActions.setVisibleCampaign(campaign));
        // dispatch(userActions.updateCampaign(campaign));

        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  newCampaignSetup: (campaign) => {
    return async function (dispatch, getState) {
      try {
        dispatch(uiActions.startLoading());
        let resCampaign = {};
        const response = await axios.post(`/api/campaign/new`, campaign);
        if (response.status === 201 && response.data.success) {
          resCampaign = response.data.data;
          // console.log(resCampaign);
        }
        if (Object.keys(resCampaign).length) {
          if (
            campaign.hasOwnProperty('_id') &&
            campaign._id === resCampaign._id
          ) {
            console.log('updating');
            dispatch(userActions.updateCampaign({ ...resCampaign }));
          } else {
            // console.log('creating new campaign');
            dispatch(userActions.addToCampaigns({ ...resCampaign }));
            dispatch(userActions.setNewCampaign(resCampaign));
          }
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  resetNewCampaign: () => {
    return async function (dispatch) {
      dispatch(
        userActions.setNewCampaign({
          campaignName: '',
          emailSubject: '',
          previewText: '',
          emailContent: '',
        })
      );
    };
  },

  campaignQuestions: (campaignQuestions) => {
    return async function (dispatch) {
      try {
        dispatch(uiActions.startLoading());
        const response = await axios.post(
          `/api/campaign/campaignQuestions`,
          campaignQuestions
        );
        console.log(response);
        if (response.status === 200 && response.data.success) {
          const campaign = response.data.data;
          console.log('updated campaign : ', campaign);
          dispatch(userActions.updateCampaign(campaign));
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        console.log(error);
        dispatch(uiActions.stopLoading());
      }
    };
  },

  campaignEmails: (campaignEmails) => {
    return async function (dispatch, getState) {
      try {
        dispatch(uiActions.startLoading());
        const response = await axios.post(
          `/api/campaign/campaignEmails`,
          campaignEmails
        );
        if (response.status === 200 && response.data.success) {
          // const currentCampaign = JSON.parse(
          //   JSON.stringify(getState().visibleCampaign)
          // );
          // currentCampaign.campaignEmails =
          //   currentCampaign.campaignEmails.concat(response.data.data);
          dispatch(userActions.updateCampaign(response.data.campaign));
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        dispatch(uiActions.stopLoading());
      }
    };
  },

  launchCampaign: (id) => {
    return async function (dispatch, getState) {
      try {
        dispatch(uiActions.startLoading());
        const response = await axios.post(`/api/campaign/launch`, {
          campaign_id: id,
        });
        console.log(id);
        if (response.status === 200 && response.data.success) {
          const state = getState();
          let campaign = state.user.campaigns.find(
            (el) => el._id === String(id)
          );
          campaign = { ...campaign };
          if (campaign) {
            campaign.launchedAt = response.data.data;
          }
          dispatch(userActions.updateCampaign(campaign));
        }
        dispatch(uiActions.stopLoading());
      } catch (error) {
        console.log(error);
        dispatch(uiActions.stopLoading());
      }
    };
  },
};

export default userSlice;
