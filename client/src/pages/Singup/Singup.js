import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../../components/Auth/Auth';

import styles from './Singup.module.css';

function Signup() {
  return (
    <div className={styles.signupContainer}>
      <div className={styles.logo}>
        <Link to="/" className="link logoLink">
          FeedbackLoop
        </Link>
      </div>
      <Auth authType="signup"></Auth>
    </div>
  );
}

export default Signup;
