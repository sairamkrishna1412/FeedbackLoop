import { useState } from 'react';
// import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userThunks } from '../../../store/userSlice';
import Authenticate from '../../../components/Auth/Authenticate';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';

import styles from '../NewCampaign.module.css';

const NewCampaignBase = (props) => {
  const dispatch = useDispatch();
  const newCampaignObj = {
    campaignName: '',
    emailSubject: '',
    previewText: '',
    emailContent: '',
  };
  const [campaign, setCampaign] = useState(newCampaignObj);

  const inputChangeHandler = (e) => {
    setCampaign((state) => {
      return { ...state, [e.target.name]: e.target.value };
    });
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const campKeys = Object.keys(campaign);
    for (let i = 0; i < campKeys.length; i++) {
      const key = campKeys[i];
      if (campaign[key] === '') {
        return alert(`${key.toLowerCase()} is empty. please fill all fields`);
      }
    }
    // console.log(campaign);
    dispatch(userThunks.newCampaignSetup(campaign));
    setCampaign(newCampaignObj);
  };

  return (
    <Authenticate className="container">
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
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="campaignName">Campaign Name</label>
              <input
                type="text"
                name="campaignName"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.campaignName}
              />
            </div>
            <div className={styles['separator']}></div>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="emailSubject">Email Subject</label>
              <input
                type="text"
                name="emailSubject"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.emailSubject}
              />
            </div>
            <div className={styles['separator']}></div>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="previewText">Preview text</label>
              <input
                type="text"
                name="previewText"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.previewText}
              />
            </div>
            <div className={styles['separator']}></div>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="emailContent">Email Content</label>
              <textarea
                type="text"
                name="emailContent"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.emailContent}
              />
            </div>
            <div className={styles['separator']}></div>
            <input
              type="submit"
              value="Save & Next"
              className={`btn btn-black ${styles['btn-right']}`}
            />
          </form>
        </PlainCard>
        <div
          className={`${styles['number-box']} ${styles['number-box--bottom']}`}
        >
          <div className={`${styles['number']} ${styles['number-big']}`}>1</div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            2
          </div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            3
          </div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            4
          </div>
        </div>
      </Container>
    </Authenticate>
  );
};

export default NewCampaignBase;
