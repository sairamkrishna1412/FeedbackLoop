// import { useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import NewCampaignBase from './NewCampaignBase/NewCampaignBase';
import NewCampaignQuestions from './NewCampaignQuestions/NewCampaignQuestions';
import NewCampaignRecipients from './NewCampaignRecipients/NewCampaignRecipients';
import NewCampaignPreviewLaunch from './NewCampaignPreviewLaunch/NewCampaignPreviewLaunch';
import NewCampaignNavigate from './NewCampaignNavigate';
import Authenticate from '../../components/Auth/Authenticate';

// import styles from './NewCampaign.module.css';

const NewCampaign = (props) => {
  const { path } = useRouteMatch();
  // const { pathname } = useLocation();
  // console.log('path', path);
  // console.log('pathname', pathname);
  return (
    <Switch>
      <Route path={path} exact>
        <Authenticate>
          <NewCampaignBase></NewCampaignBase>
        </Authenticate>
      </Route>
      <Route path={`${path}/:id`} exact>
        <NewCampaignNavigate></NewCampaignNavigate>
      </Route>

      {/* yet to be implemented */}
      <Route path={`${path}/:id/base`}>
        <Authenticate>
          <NewCampaignBase></NewCampaignBase>
        </Authenticate>
      </Route>
      <Route path={`${path}/:id/questions`}>
        <Authenticate>
          <NewCampaignQuestions></NewCampaignQuestions>
        </Authenticate>
      </Route>
      <Route path={`${path}/:id/recipients`}>
        <NewCampaignRecipients></NewCampaignRecipients>
      </Route>
      <Route path={`${path}/:id/previewLaunch`}>
        <Authenticate>
          <NewCampaignPreviewLaunch></NewCampaignPreviewLaunch>
        </Authenticate>
      </Route>
    </Switch>
  );
};

export default NewCampaign;
