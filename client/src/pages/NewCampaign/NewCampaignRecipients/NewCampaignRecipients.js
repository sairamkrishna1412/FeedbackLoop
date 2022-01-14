import { React } from 'react';
import { useSelector } from 'react-redux';
import Authenticate from '../../../components/Auth/Authenticate';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';
import styles from '../NewCampaign.module.css';
import { useParams, Redirect } from 'react-router';

const NewCampaignRecipients = (props) => {
  const { id } = useParams();
  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  if (!campaign) {
    return <Redirect to="/"></Redirect>;
  }
  return (
    <Authenticate className="container">
      <Header></Header>
      <h2 className={`subHeading`}>
        {campaign.campaignName !== '' ? campaign.campaignName : 'New Campaign'}
      </h2>
      <Container className={styles['container-wrapper']}>
        <div className={`${styles['number-box']} ${styles['number-box--top']}`}>
          <div className={`${styles['number']} ${styles['number-big']}`}>3</div>
        </div>
        <PlainCard></PlainCard>
        <div
          className={`${styles['number-box']} ${styles['number-box--bottom']}`}
        >
          <div className={`${styles['number']} ${styles['number-small']}`}>
            1
          </div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            2
          </div>
          <div className={`${styles['number']} ${styles['number-big']}`}>3</div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            4
          </div>
        </div>
      </Container>
    </Authenticate>
  );
};

export default NewCampaignRecipients;
