import React from 'react';
import { Link } from 'react-router-dom';

import AuthCard from '../UI/Card/AuthCard/AuthCard';
import AuthButton from '../UI/Button/AuthButton/AuthButton';

import styles from './Auth.module.css';
import googleLogo from './google_logo.svg';
import facebookLogo from './facebook_logo.svg';

const Auth = (props) => {
  const { authType } = props;
  let authText;
  let altText;
  let altLink;
  if (authType === 'login') {
    authText = 'Sign In';
    altText = 'Sign Up';
    altLink = '/signup';
  } else {
    authText = 'Sign Up';
    altText = 'Sign In';
    altLink = '/login';
  }
  return (
    <AuthCard>
      <h2 className={`heading-h2`}>{authText}</h2>
      <div className={styles.authAltLinkContainer}>
        <span>Don't have an account? </span>
        <Link to={altLink} className="link">
          {altText}
        </Link>
      </div>
      <div className={styles.authLinks}>
        <AuthButton to="/auth/google">
          <img src={googleLogo} alt="" className={styles.authIcon} />
          {authText} with Google
        </AuthButton>
        <AuthButton to="/auth/facebook">
          <img src={facebookLogo} alt="" className={styles.authIcon} />
          {authText} with Facebook
        </AuthButton>
      </div>
    </AuthCard>
  );
};

export default Auth;
