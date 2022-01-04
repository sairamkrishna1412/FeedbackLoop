import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Loader from '../../components/UI/Loader/Loader';

const Authenticate = (props) => {
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isPageLoading) {
    return <Loader></Loader>;
  }
  if (!isPageLoading && !isLoggedIn) {
    return <Redirect to="/login"></Redirect>;
  }

  return <div className={`${props.className}`}>{props.children}</div>;
};

export default Authenticate;
