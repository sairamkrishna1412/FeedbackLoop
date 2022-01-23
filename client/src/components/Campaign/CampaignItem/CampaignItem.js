import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Campaign.module.css';

function CampaignItem(props) {
  const { details } = props;
  let linkTo = '';
  if (details.launchedAt) {
    linkTo = `/campaign/${details.id}`;
  } else {
    linkTo = `/newCampaign/${details.id}`;
  }

  return (
    <Link
      to={linkTo}
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
