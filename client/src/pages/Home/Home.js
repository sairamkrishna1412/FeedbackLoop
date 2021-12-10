import React from 'react';
import { useSelector } from 'react-redux';

import LinkButton from '../../components/UI/Button/LinkButton/LinkButton';
import Features from '../../components/Features/Features';
import Header from '../../components/UI/Header/Header';

// import arrowBlack from './arrowBlack.svg';
// import arrowBlue from './arrowBlue.svg';
import styles from './Home.module.css';
import Loader from '../../components/UI/Loader/Loader';

function Home() {
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  if (isPageLoading) {
    return <Loader></Loader>;
  }

  return (
    <React.Fragment>
      <div className={`container`}>
        <Header></Header>
      </div>
      <div className={styles.home_container}>
        <div>
          <div className={styles.homeIntro}>
            <h1>
              Send A Message
              <br />
              To The World At Once
            </h1>
            <p>Send Infinite emails to Infinite accounts at once.</p>
          </div>
          <div className={styles.linkButtonsContainer}>
            <LinkButton className={styles.linkButton} to="/login" type="black">
              Log In
            </LinkButton>
            <LinkButton className={styles.linkButton} to="/signup" type="white">
              Sign Up
            </LinkButton>
          </div>
        </div>
      </div>
      <div className="container">
        <Features></Features>
      </div>
    </React.Fragment>
  );
}

export default Home;
