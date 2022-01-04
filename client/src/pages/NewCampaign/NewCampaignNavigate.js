import { React } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NewCampaignNavigate = (props) => {
  const { id } = useParams();
  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  if (!campaign) {
    console.log('No campaign found with that ID');
    return <Redirect to="/"></Redirect>;
  }

  const redirectUrl = redirector(campaign);

  return <Redirect to={redirectUrl}></Redirect>;
};

const redirector = (campaign) => {
  let redirectUrl = '/';

  if (campaign.launchedAt) {
    redirectUrl = `/campaign/${campaign._id}`;
  } else {
    if (!campaign.campaignQuestions.length) {
      redirectUrl = `/newCampaign/${campaign._id}/questions`;
    } else if (campaign.recipientCount === 0) {
      redirectUrl = `/newCampaign/${campaign._id}/recipients`;
    } else {
      redirectUrl = `/newCampaign/${campaign._id}/previewLaunch`;
    }
  }
  return redirectUrl;
};

export default NewCampaignNavigate;
