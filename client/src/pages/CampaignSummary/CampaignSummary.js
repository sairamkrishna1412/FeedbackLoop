import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
// import SummaryItem from '../../components/Summary/SummaryItem';
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
  console.log(campaign);

  useEffect(() => {
    dispatch(userThunks.getCampaignSummary(id));
  }, [dispatch, id]);
  // const campaign = useSelector((state) =>
  //   state.user.campaigns.find((el) => el._id === id)
  // );
  // console.log(id);
  // console.log(campaign);

  if (isPageLoading || !Object.keys(campaign).length) {
    return <Loader></Loader>;
  }

  if (!isPageLoading && !isLoggedIn) {
    // console.log(isPageLoading, isLoggedIn);
    return <Redirect to="/login"></Redirect>;
  }

  if (
    campaign &&
    campaign.hasOwnProperty('launchedAt') &&
    !campaign.launchedAt
  ) {
    if (campaign.hasOwnProperty('_id')) {
      return <Redirect to={`/newCampaign/${campaign._id}`}></Redirect>;
    }
  }

  return (
    <div className={`container`}>
      <Header></Header>
      <div className={styles.newBlock}>
        <h2 className="subHeading">Summary</h2>
        <div className={`${styles.quickSummary}`}>
          <div className="flex justify-around items-center md:w-11/12 mx-auto">
            <div
              className={`${styles['summary-item']} ${styles['summary-item__big']}`}
            >
              <span className="font-medium">Questions</span>
              <span>{campaign.campaignQuestions.length}</span>
            </div>
            <div
              className={`${styles['summary-item']} ${styles['summary-item__small']} font-bold`}
            >
              {campaign.campaignName}
            </div>
            <div
              className={`${styles['summary-item']} ${styles['summary-item__big']}`}
            >
              <span className="font-medium">Last Feedback</span>
              <span className="text-[18px]">
                {new Date(campaign.createdAt).toLocaleString(undefined, {
                  dateStyle: 'long',
                })}
              </span>
            </div>
          </div>
          <div className="flex justify-around items-center md:w-2/3 mx-auto">
            <div
              className={`${styles['summary-item']} ${styles['summary-item__medium']}`}
            >
              <span className="font-medium">Emails sent</span>
              <span>{campaign.recipientCount}</span>
            </div>
            <div
              className={`${styles['summary-item']} ${styles['summary-item__medium']}`}
            >
              <span className="font-medium">Responses</span>
              <span>{campaign.respondedRecipientCount}</span>
            </div>
          </div>
        </div>
        {/* <div className={`${styles.quickSummary}`}>
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
        </div> */}
      </div>
      <h2 className="subHeading">Stats</h2>
      <Container>
        <div className={styles.blueBlock}></div>
        <div className={styles.blueBlock}></div>
        <div className={styles.blueBlock}></div>
        <div className={styles.blueBlock}></div>
      </Container>
    </div>
  );
}

export default CampaignSummary;
