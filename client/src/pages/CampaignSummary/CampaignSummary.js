import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
// import SummaryItem from '../../components/Summary/SummaryItem';
import Header from '../../components/UI/Header/Header';
import Loader from '../../components/UI/Loader/Loader';
import Container from '../../components/UI/Container/Container';
import NavItem from '../../components/UI/NavItem/NavItem';
import QuestionSummary from '../../components/Summary/QuestionSummary/QuestionSummary';
import QuestionResponses from '../../components/Summary/QuestionResponses/QuestionResponses';
import { useEffect, useState } from 'react';

import styles from './CampaignSummary.module.css';
import { userThunks } from '../../store/userSlice';
import Feedback from '../../components/Summary/Feedback/Feedback';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faPaperPlane,
  faComment,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

function CampaignSummary() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const campaign = useSelector((state) => state.user.visibleCampaign);
  const [activeItem, setActiveItem] = useState('Summary');
  // console.log(campaign);
  // console.log(activeItem);

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

  const activeChangeHandler = (title) => {
    setActiveItem(title);
  };
  let summariesJsx = [];
  let questionResponsesJsx = [];
  let feedbacksJsx = [];

  const { feedbackData, campaignQuestions } = campaign;

  // first check if feedback data exists
  if (feedbackData) {
    const { summary, questionResponses, feedbacks } = feedbackData;
    let summaryObj, questionResponsesArr;

    for (let i = 0; i < campaignQuestions.length; i++) {
      const questionObj = campaignQuestions[i];
      const id = questionObj._id;
      summaryObj = summary.hasOwnProperty(`${id}`) ? summary[id] : {};

      questionResponsesArr = questionResponses.hasOwnProperty(`${id}`)
        ? questionResponses[id]
        : [];

      summariesJsx.push(
        <QuestionSummary
          key={i}
          question={questionObj}
          summary={summaryObj}
        ></QuestionSummary>
      );

      questionResponsesJsx.push(
        <QuestionResponses
          key={i}
          question={questionObj}
          responses={questionResponsesArr}
        ></QuestionResponses>
      );
    }

    feedbacksJsx = feedbacks.map((feedback, ind) => (
      <Feedback feedback={feedback} key={ind}></Feedback>
    ));
  } else {
    summariesJsx = (
      <p className="text-center text-3xl mt-20 bg-white py-4">
        No Responses yet
      </p>
    );
    questionResponsesJsx = (
      <p className="text-center text-3xl mt-20 bg-white py-4">
        No Responses yet
      </p>
    );
    feedbacksJsx = (
      <p className="text-center text-3xl mt-20 bg-white py-4">
        No Feedbacks yet
      </p>
    );
  }

  return (
    <div className={`container`}>
      <Header></Header>
      <div className={styles.newBlock}>
        <h2 className="subHeading">Summary</h2>
        <div className={`${styles.quickSummary}`}>
          <div className="flex justify-center items-center mx-auto">
            <div className={`text-5xl font-bold`}>
              <h2>{campaign.campaignName}</h2>
            </div>
          </div>
          <div className="flex justify-around items-center">
            <div
              className={`flex flex-col items-center gap-5 px-16 py-10 rounded-2xl text-5xl bg-slate-100`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-4xl">Questions</span>
                <div className="text-slate-100 p-3 text-center inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-300 text-xl">
                  <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>
                </div>
              </div>
              <span className="text-blueGray-700 font-bold">
                {campaign.campaignQuestions.length}
              </span>
            </div>
            <div
              className={`flex flex-col items-center gap-5 px-16 py-10 rounded-2xl text-4xl bg-slate-100`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-4xl">Last Feedback</span>
                <div className="text-slate-100 p-3 text-center inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-300 text-xl">
                  <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                </div>
              </div>
              <span className="text-[18px]">
                {new Date(campaign.createdAt).toLocaleString(undefined, {
                  dateStyle: 'long',
                })}
              </span>
            </div>
            <div
              className={`flex flex-col items-center gap-5 px-16 py-10 rounded-2xl text-4xl bg-slate-100`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-4xl">Emails sent</span>
                <div className="text-slate-100 p-3 text-center inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-300 text-xl">
                  <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                </div>
              </div>
              <span className="text-blueGray-700 font-bold text-5xl">
                {campaign.recipientCount}
              </span>
            </div>
            <div
              className={`flex flex-col items-center gap-5 px-16 py-10 rounded-2xl text-4xl bg-slate-100`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-4xl">Responses</span>
                <div className="text-slate-100 p-3 text-center inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-300 text-xl">
                  <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>
                </div>
              </div>
              <span className="text-blueGray-700 font-bold text-5xl">
                {campaign.respondedRecipientCount}
              </span>
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
        <div className=" grid grid-cols-3 text-center text-3xl">
          <NavItem
            title="Summary"
            active={activeItem === 'Summary'}
            onClickHandler={activeChangeHandler}
          ></NavItem>
          <NavItem
            title="Feedbacks"
            active={activeItem === 'Feedbacks'}
            onClickHandler={activeChangeHandler}
          ></NavItem>
          <NavItem
            title="Question Responses"
            active={activeItem === 'Question Responses'}
            onClickHandler={activeChangeHandler}
          ></NavItem>
        </div>
        <div>{activeItem === 'Summary' && summariesJsx}</div>
        <div>{activeItem === 'Question Responses' && questionResponsesJsx}</div>
        <div>{activeItem === 'Feedbacks' && feedbacksJsx}</div>
        {/* <div className={styles.whiteBlock}></div>
        <div className={styles.whiteBlock}></div>
        <div className={styles.whiteBlock}></div> */}
      </Container>
    </div>
  );
}

export default CampaignSummary;
