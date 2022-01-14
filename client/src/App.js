import React, { Fragment, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { authThunks } from './store/authSlice';
import { userThunks } from './store/userSlice';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Singup/Singup';
// import Loader from './components/UI/Loader/Loader';
import Dashboard from './pages/Dashboard/Dashboard';
import CampaignSummary from './pages/CampaignSummary/CampaignSummary';
import NewCampaign from './pages/NewCampaign/NewCampaign';

import './App.css';

library.add(fas);

function App() {
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const isPageLoading = useSelector((state) => state.ui.pageLoading);

  useEffect(() => {
    dispatch(authThunks.getUser());
    dispatch(userThunks.getCampaigns());
  }, [dispatch]);

  return (
    <Fragment>
      <Switch>
        <Route path="/" exact>
          <Dashboard></Dashboard>
        </Route>
        <Route path="/home" exact>
          <Home></Home>
        </Route>
        <Route path="/newCampaign">
          <NewCampaign></NewCampaign>
        </Route>
        <Route path="/campaign/:id">
          <CampaignSummary></CampaignSummary>
        </Route>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/signup">
          <Signup></Signup>
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
