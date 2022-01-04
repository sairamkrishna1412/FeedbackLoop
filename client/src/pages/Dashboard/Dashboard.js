import React from 'react';
import { useSelector } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import Header from '../../components/UI/Header/Header';
// import Loader from '../../components/UI/Loader/Loader';
import CampaignCont from '../../components/Campaign/CampaignCont/CampaignCont';
import SummaryItem from '../../components/Summary/SummaryItem';
import Container from '../../components/UI/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './Dashboard.module.css';
import Authenticate from '../../components/Auth/Authenticate';

function Dashboard() {
  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  const lauchedCamps = userState.campaigns.filter((el) => el.lauchedAt);
  const unLauchedCamps = userState.campaigns.filter((el) => !el.lauchedAt);
  return (
    <Authenticate>
      <div className={`container`}>
        <Header></Header>
        {/* <h2 className={styles.heading}>Dashboard</h2> */}
        <h2 className="subHeading">Summary</h2>
        <Container>
          <div className={`${styles.quickSummary}`}>
            <SummaryItem
              title="Total Campaigns"
              value={userState.campaigns.length}
            ></SummaryItem>
            <SummaryItem
              title="Active Campaigns"
              value={userState.campaigns.length}
            ></SummaryItem>
            <SummaryItem
              title="Available Credits"
              value={authState.user ? authState.user.credits : 'N/A'}
            ></SummaryItem>
          </div>
        </Container>
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
          heading="Launched Campaigns"
          items={lauchedCamps}
        ></CampaignCont>
        <CampaignCont
          className={styles.newBlock}
          heading="UnLaunched Campaigns"
          items={unLauchedCamps}
        ></CampaignCont>
      </div>
      <div className={styles.newCampaignBtn}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>
    </Authenticate>
  );
}

export default Dashboard;
