import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../../components/UI/Header/Header';
import Loader from '../../components/UI/Loader/Loader';
import CampaignCont from '../../components/Campaign/CampaignCont/CampaignCont';
import SummaryItem from '../../components/Summary/SummaryItem';
import Container from '../../components/UI/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './Dashboard.module.css';
// import { userThunks } from '../../store/userSlice';

function Dashboard() {
  // const dispatch = useDispatch();
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(userThunks.getCampaigns());
  // }, [dispatch]);

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
              value={authState.user.credits}
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
          heading="Active Campaigns"
          items={userState.campaigns}
        ></CampaignCont>
        {/* <CampaignCont
          className={styles.newBlock}
          heading="In-Active Campaigns"
          items={[1]}
        ></CampaignCont> */}
      </div>
      <div className={styles.newCampaignBtn}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
