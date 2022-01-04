import React, { Fragment } from 'react';

import styles from '../Campaign.module.css';

import Container from '../../UI/Container/Container';
import CampaignItem from '../CampaignItem/CampaignItem';

function CampaignCont(props) {
  const campItems = props.items.map((campaign) => {
    const campaignSummary = {
      id: campaign._id,
      name: campaign.campaignName,
      recipientCount: campaign.recipientCount,
      respondedRecipientCount: campaign.respondedRecipientCount,
      createdOn: new Date(campaign.createdAt).toLocaleString(undefined, {
        dateStyle: 'short',
      }),
      lauchedAt: campaign.lauchedAt ? new Date(campaign.lauchedAt) : null,
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
        <div className={styles.campsRow}>
          <span>Name</span>
          <span>Created on</span>
          <span>Responded</span>
        </div>
        <div className={styles.camps}>{campItems}</div>
        {/* </div> */}
      </Container>
    </Fragment>
  );
}

export default CampaignCont;
