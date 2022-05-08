import React, { Fragment } from 'react';

import styles from '../Campaign.module.css';

import Container from '../../UI/Container/Container';
import CampaignItem from '../CampaignItem/CampaignItem';

function CampaignCont(props) {
  const campItems = props.items.map((campaign) => {
    const campaignSummary = {
      id: campaign._id,
      name: campaign.campaignName,
      questionCount: campaign.campaignQuestions.length,
      recipientCount: campaign.recipientCount,
      respondedRecipientCount: campaign.respondedRecipientCount,
      createdOn: new Date(campaign.createdAt).toLocaleString(undefined, {
        dateStyle: 'long',
      }),
      launchedAt: campaign.launchedAt ? new Date(campaign.launchedAt) : null,
    };
    return (
      <CampaignItem details={campaignSummary} key={campaign._id}></CampaignItem>
    );
  });
  return (
    <Fragment>
      <h2 className="subHeading">{props.heading}</h2>
      <Container>
        {/* <div className={styles.campsCont}> */}
        <div
          className={`${styles.campsRow} text-[20px] font-medium !hidden sm:!flex`}
        >
          {props.heading === 'Launched Campaigns' ? (
            <React.Fragment>
              <span>Name</span>
              <span>Created on</span>
              <span>Responded</span>
              <span>Status</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Name</span>
              <span>Created on</span>
              <span>Steps Completed</span>
            </React.Fragment>
          )}
        </div>
        <div className={styles.camps}>{campItems}</div>
        {/* </div> */}
      </Container>
    </Fragment>
  );
}

export default CampaignCont;
