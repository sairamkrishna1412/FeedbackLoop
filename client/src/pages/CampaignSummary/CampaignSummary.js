import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import SummaryItem from '../../components/Summary/SummaryItem';
import Header from '../../components/UI/Header/Header';
import Loader from '../../components/UI/Loader/Loader';
import Container from '../../components/UI/Container/Container';
import { useEffect } from 'react';

import styles from './CampaignSummary.module.css';
import { userThunks } from '../../store/userSlice';

function CampaignSummary() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const campaign = useSelector((state) => state.user.visibleCampaign);

  useEffect(() => {
    dispatch(userThunks.getCampaign(id));
  }, [dispatch, id]);
  // const campaign = useSelector((state) =>
  //   state.user.campaigns.find((el) => el._id === id)
  // );
  // console.log(id);
  // console.log(campaign);

  if (isPageLoading) {
    return <Loader></Loader>;
  }

  if (!isPageLoading && !isLoggedIn) {
    // console.log(isPageLoading, isLoggedIn);
    return <Redirect to="/login"></Redirect>;
  }
  return (
    <div className={`container`}>
      <Header></Header>
      <div className={styles.newBlock}>
        <h2 className="subHeading">{campaign.campaignName}</h2>
        <div className={`${styles.quickSummary}`}>
          <SummaryItem
            title="Mails Sent"
            value={campaign.recipientCount}
          ></SummaryItem>
          <SummaryItem
            title="Responses Received"
            value={campaign.respondedRecipientCount}
          ></SummaryItem>
          <SummaryItem
            title="Last Feedback"
            value={campaign.lastFeedback || 'No responses received'}
          ></SummaryItem>
        </div>
      </div>
      <h2 className="subHeading">Stats</h2>
      <Container></Container>
    </div>
  );
}

export default CampaignSummary;
