import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../../components/Auth/Auth';

import styles from './Login.module.css';

function Login() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.logo}>
        <Link to="/" className="link logoLink">
          FeedbackLoop
        </Link>
      </div>
      <Auth authType="login"></Auth>
    </div>
  );
}

export default Login;
