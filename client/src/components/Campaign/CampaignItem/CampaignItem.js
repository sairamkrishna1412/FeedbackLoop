import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Campaign.module.css';

function CampaignItem(props) {
  const { details } = props;
  return (
    <Link
      to={`/campaign/${details.id}`}
      className={`${styles.campItem} ${styles.campsRow} decor-none`}
    >
      <span>{details.name}</span>
      <span>{details.createdOn}</span>
      <span>
        {details.respondedRecipientCount}/{details.recipientCount}
      </span>
    </Link>
  );
}

export default CampaignItem;
