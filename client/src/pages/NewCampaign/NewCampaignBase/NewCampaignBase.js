import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userThunks } from '../../../store/userSlice';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';
import CampaignSteps from '../CampaignSteps/CampaignSteps';
import ScrollToTop from '../../../components/UI/ScrollToTop';

import styles from '../NewCampaign.module.css';

const NewCampaignBase = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const newCampaignObj = {
    campaignName: '',
    emailSubject: '',
    previewText: '',
    emailContent: '',
  };
  const { id } = useParams();

  let reqCampaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  const newCampaign = useSelector((state) => state.user.newCampaign);

  useEffect(() => {
    if (newCampaign.hasOwnProperty('_id')) {
      dispatch(userThunks.resetNewCampaign());
      history.push(`/newCampaign/${newCampaign._id}/questions`);
    }
  }, [newCampaign, history, dispatch]);

  if (!reqCampaign) {
    if (!id) {
      reqCampaign = newCampaign;
    } else {
      reqCampaign = newCampaignObj;
    }
  }

  const [campaign, setCampaign] = useState(reqCampaign);
  // console.log(campaign);
  const inputChangeHandler = (e) => {
    setCampaign((state) => {
      return { ...state, [e.target.name]: e.target.value };
    });
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    // const campKeys = Object.keys(campaign);
    const checkFields = ['campaignName', 'emailSubject', 'emailContent'];

    for (let i = 0; i < checkFields.length; i++) {
      const key = checkFields[i];
      if (campaign[key] === '') {
        return alert(`${key.toLowerCase()} is empty. please fill all fields`);
      }
    }
    // console.log(campaign);
    dispatch(userThunks.newCampaignSetup(campaign));
    //   .then((res, err) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('after dispatch new camapign setup');
    //     // for existing campaign
    //     // if campaign already has id field then simply redirect to /campaign/id/questions
    //     if (id) {
    //       history.push(`/newCampaign/${id}/questions`);
    //     }
    //     // else {
    //     //   console.log('new campaign checking _id', newCampaign);
    //     //   if (newCampaign.hasOwnProperty('_id')) {
    //     //     console.log('new campaign redirecting');
    //     //     history.push(`/newCampaign/${newCampaign._id}/questions`);
    //     //   }
    //     //   // setCampaign(newCampaign);
    //     // }
    //   }
    // });

    if (id) {
      history.push(`/newCampaign/${id}/questions`);
    }
    // for new campaign
    // use selector and retrive newCampaign from state. if newCampaign is not empty, then take "id" from newCampaign and redirect to /campaign/"id"/questions

    // redirect using history
  };

  return (
    <div className="container">
      <ScrollToTop />
      <Header></Header>
      <h2 className={`subHeading`}>
        {campaign.campaignName !== '' ? campaign.campaignName : 'New Campaign'}
      </h2>
      <Container className={styles['container-wrapper']}>
        <div className={`${styles['number-box']} ${styles['number-box--top']}`}>
          <div className={`${styles['number']} ${styles['number-big']}`}>1</div>
        </div>
        <PlainCard>
          <form onSubmit={formSubmitHandler}>
            <div
              className={`${styles['form-wrapper']} ${styles['form-wrapper--break']}`}
            >
              <label htmlFor="campaignName">Campaign Name</label>
              <input
                type="text"
                name="campaignName"
                className={`${styles['form-control']} ${styles['form-control--break']}`}
                onChange={inputChangeHandler}
                value={campaign.campaignName}
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
                onChange={inputChangeHandler}
                value={campaign.emailSubject}
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
                onChange={inputChangeHandler}
                value={campaign.previewText}
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
                onChange={inputChangeHandler}
                value={campaign.emailContent}
              />
            </div>
            <div className={styles['separator']}></div>
            <input
              type="submit"
              value="Save & Next"
              className={`btn btn__black ${styles['btn-right']}`}
            />
          </form>
        </PlainCard>
        <CampaignSteps></CampaignSteps>
      </Container>
    </div>
  );
};

export default NewCampaignBase;
