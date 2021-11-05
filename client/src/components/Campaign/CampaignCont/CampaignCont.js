import React from 'react';

import styles from '../Campaign.module.css';

import CampaignItem from '../CampaignItem/CampaignItem';

function CampaignCont(props) {
  const campItems = props.items.map((el) => {
    return <CampaignItem></CampaignItem>;
  });
  return (
    <div className={`${props.className}`}>
      <h2 className={styles.heading}>{props.heading}</h2>
      <div className={styles.campsCont}>
        <div className={styles.campsRow}>
          <span>Name</span>
          <span>Responded</span>
          <span>Avg Ratings</span>
        </div>
        <div className={styles.camps}>{campItems}</div>
      </div>
    </div>
  );
}

export default CampaignCont;
