import { React, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';
import CampaignSteps from '../CampaignSteps/CampaignSteps';
import PreviewQuestionItem from '../NewCampaignQuestions/components/PreviewQuestionItem';
import NewCampaignPreviewButton from './NewCampaignPreviewButton';
import ScrollToTop from '../../../components/UI/ScrollToTop';
import Loader from '../../../components/UI/Loader/Loader';
import styles from '../NewCampaign.module.css';
import { userThunks } from '../../../store/userSlice';
import { useParams, Redirect, useHistory } from 'react-router-dom';

const NewCampaignPreviewLaunch = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  console.log(campaign);
  let recipients = '';
  useEffect(() => {
    // console.log('fired');
    if (!campaign || !campaign.hasOwnProperty('campaignEmails')) {
      console.log('calling');
      dispatch(userThunks.getCampaign(id));
    }
  }, [dispatch, id, campaign]);

  if (campaign && campaign.hasOwnProperty('campaignEmails')) {
    recipients = campaign.campaignEmails.map((el) => el.email).join(',');
  }

  if (
    campaign &&
    campaign.hasOwnProperty('launchedAt') &&
    campaign.launchedAt
  ) {
    return <Redirect to={`/campaign/${id}`}></Redirect>;
  }

  if (isPageLoading) {
    return <Loader></Loader>;
  }

  if (!isPageLoading && !isLoggedIn) {
    return <Redirect to="/login"></Redirect>;
  }

  const launchCampaignHandler = () => {
    dispatch(userThunks.launchCampaign(id)).then(() => {
      console.log('Campaign launched sucessfully');
      history.push(`/campaign/${id}`);
    });
  };

  // if (!campaign) {
  //   return <Redirect to="/"></Redirect>;
  // }

  let questionsArr = [];
  if (campaign && campaign.hasOwnProperty('campaignQuestions')) {
    const questions = campaign.campaignQuestions;
    console.log('preview question : ', questions);
    questionsArr = questions.map((question, index) => {
      return (
        <PreviewQuestionItem
          values={question}
          key={index}
        ></PreviewQuestionItem>
      );
    });
  }

  return (
    <div className="container">
      <ScrollToTop />
      <Header></Header>
      <h2 className={`subHeading`}>
        {campaign.campaignName !== '' ? campaign.campaignName : 'New Campaign'}
      </h2>
      <Container className={styles['container-wrapper']}>
        <div className={`${styles['number-box']} ${styles['number-box--top']}`}>
          <div className={`${styles['number']} ${styles['number-big']}`}>4</div>
        </div>
        <PlainCard innerClassName={styles['plainCard_preview']}>
          <div className={`${styles['preview-section']}`}>
            <NewCampaignPreviewButton value={1}></NewCampaignPreviewButton>
            <div
              className={`${styles['form-wrapper']} ${styles['form-wrapper--break']}`}
            >
              <label htmlFor="campaignName">Campaign Name</label>
              <input
                type="text"
                name="campaignName"
                className={`${styles['form-control']} ${styles['form-control--break']}`}
                value={campaign.campaignName}
                readOnly
              />
            </div>
            <div className={styles['separator']}></div>
            <div
              className={`${styles['form-wrapper']} ${styles['form-wrapper--break']}`}
            >
              <label htmlFor="emailSubject">Email Subject</label>
              <input
                type="text"
                name="emailSubject"
                className={`${styles['form-control']} ${styles['form-control--break']}`}
                value={campaign.emailSubject}
                readOnly
              />
            </div>
            <div className={styles['separator']}></div>
            <div
              className={`${styles['form-wrapper']} ${styles['form-wrapper--break']}`}
            >
              <label htmlFor="previewText">Preview text</label>
              <input
                type="text"
                name="previewText"
                className={`${styles['form-control']} ${styles['form-control--break']}`}
                value={campaign.previewText}
                readOnly
              />
            </div>
            <div className={styles['separator']}></div>
            <div
              className={`${styles['form-wrapper']} ${styles['form-wrapper--break']}`}
            >
              <label htmlFor="emailContent">Email Content</label>
              <textarea
                type="text"
                name="emailContent"
                className={`${styles['form-control']} ${styles['form-control--break']}`}
                value={campaign.emailContent}
                readOnly
              />
            </div>
            <div className={styles['separator']}></div>
          </div>
          {/* new section */}
          <div className={styles['preview-section']}>
            <NewCampaignPreviewButton value={2}></NewCampaignPreviewButton>
            {questionsArr}
          </div>
          {/* new section */}
          <div className={styles['preview-section']}>
            <NewCampaignPreviewButton value={3}></NewCampaignPreviewButton>

            <div className={styles['form-wrapper']}>
              <label htmlFor="recipients">Recipients</label>
              <textarea
                name="recipents"
                id="recipients"
                className={`${styles['form-control']} ${styles['form-control--break']} ${styles['form-control__emails']}`}
                cols="30"
                rows="10"
                value={recipients}
                readOnly
              ></textarea>
            </div>
          </div>
          <input
            type="submit"
            value={'Launch !'}
            className={`btn btn__black ${styles['btn-right']}`}
            onClick={launchCampaignHandler}
          />
        </PlainCard>
        <CampaignSteps></CampaignSteps>
      </Container>
    </div>
  );
};

export default NewCampaignPreviewLaunch;
