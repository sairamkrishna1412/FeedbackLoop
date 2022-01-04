// import { useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import NewCampaignBase from './NewCampaignBase/NewCampaignBase';
import NewCampaignQuestions from './NewCampaignQuestions/NewCampaignQuestions';
import NewCampaignRecipients from './NewCampaignRecipients/NewCampaignRecipients';
import NewCampaignPreviewLaunch from './NewCampaignPreviewLaunch/NewCampaignPreviewLaunch';
import NewCampaignNavigate from './NewCampaignNavigate';

// import styles from './NewCampaign.module.css';

const NewCampaign = (props) => {
  const { path } = useRouteMatch();
  // console.log(path);
  return (
    <Switch>
      <Route path={path} exact>
        <NewCampaignBase></NewCampaignBase>
      </Route>
      <Route path={`${path}/:id`} exact>
        <NewCampaignNavigate></NewCampaignNavigate>
      </Route>

      {/* yet to be implemented */}
      <Route path={`${path}/:id/questions`}>
        <NewCampaignQuestions></NewCampaignQuestions>
      </Route>
      <Route path={`${path}/:id/recipients`}>
        <NewCampaignRecipients></NewCampaignRecipients>
      </Route>
      <Route path={`${path}/:id/previewLaunch`}>
        <NewCampaignPreviewLaunch></NewCampaignPreviewLaunch>
      </Route>
    </Switch>
  );
};

export default NewCampaign;
