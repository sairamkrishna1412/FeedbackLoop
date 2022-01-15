import { React } from 'react';
import { useSelector } from 'react-redux';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';
import CampaignSteps from '../CampaignSteps/CampaignSteps';
import ScrollToTop from '../../../components/UI/ScrollToTop';
import styles from '../NewCampaign.module.css';
import { useParams, Redirect } from 'react-router';

const NewCampaignPreviewLaunch = (props) => {
  const { id } = useParams();
  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  if (!campaign) {
    return <Redirect to="/"></Redirect>;
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
        <PlainCard></PlainCard>
        <CampaignSteps></CampaignSteps>
      </Container>
    </div>
  );
};

export default NewCampaignPreviewLaunch;
