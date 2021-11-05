import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../../components/UI/Header/Header';
import Loader from '../../components/UI/Loader/Loader';
import CampaignCont from '../../components/Campaign/CampaignCont/CampaignCont';
import SummaryItem from '../../components/Summary/SummaryItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './Dashboard.module.css';

function Dashboard() {
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isPageLoading) {
    return <Loader></Loader>;
  }
  if (!isPageLoading && !isLoggedIn) {
    return <Redirect to="/login"></Redirect>;
  }

  return (
    <React.Fragment>
      <div className={`container`}>
        <Header></Header>
        <h2 className={styles.heading}>Dashboard</h2>
        <div className={styles.newBlock}>
          <h2 className={styles.subHeading}>Summary</h2>
          <div className={`${styles.quickSummary}`}>
            <SummaryItem title="Total Campaigns" value={10}></SummaryItem>
            <SummaryItem title="Active Campaigns" value={5}></SummaryItem>
            <SummaryItem title="Available Credits" value={4}></SummaryItem>
          </div>
        </div>
        {/* <div className={`${styles.newBlock} ${styles.activeCampsCont}`}>
          <h2 className={styles.subHeading}>Active Campaigns</h2>
          <div className={styles.activeCamps}>
            <div className={styles.activeCampItem}></div>
            <div className={styles.activeCampItem}></div>
            <div className={styles.activeCampItem}></div>
          </div>
        </div> */}
        <CampaignCont
          className={styles.newBlock}
          heading="Active Campaigns"
          items={[1, 2, 3, 4, 5]}
        ></CampaignCont>
        <CampaignCont
          className={styles.newBlock}
          heading="In-Active Campaigns"
          items={[1, 2, 3]}
        ></CampaignCont>
      </div>
      <div className={styles.newCampaignBtn}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
