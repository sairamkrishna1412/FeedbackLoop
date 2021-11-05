import React from 'react';
import styles from '../Campaign.module.css';

function CampaignItem() {
  return (
    <div className={styles.campItem}>
      <span>Sacred Feedback</span>
      <span>243/759</span>
      <span></span>
    </div>
  );
}

export default CampaignItem;
