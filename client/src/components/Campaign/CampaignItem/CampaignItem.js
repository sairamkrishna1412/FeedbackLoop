import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Campaign.module.css';

function CampaignItem(props) {
  const { details } = props;
  let linkTo = '';
  if (details.launchedAt) {
    linkTo = `/campaign/${details.id}`;
    return (
      <Link
        to={linkTo}
        className={`${styles.campItem} ${styles.campsRow} decor-none text-[18px]`}
      >
        <span>{details.name}</span>
        <span>{details.createdOn}</span>
        <span>
          {details.respondedRecipientCount} out of {details.recipientCount}
        </span>
        <span>Active</span>
      </Link>
    );
  } else {
    linkTo = `/newCampaign/${details.id}`;
    let stepsCompleted = 1;
    if (details.recipientCount > 0) {
      stepsCompleted = 3;
    } else if (details.questionCount > 0) {
      stepsCompleted = 2;
    }
    return (
      <Link
        to={linkTo}
        className={`${styles.campItem} ${styles.campsRow} decor-none text-[18px]`}
      >
        <span>{details.name}</span>
        <span>{details.createdOn}</span>
        <span>{stepsCompleted} out of 4</span>
      </Link>
    );
  }

  // return (
  //   <Link
  //     to={linkTo}
  //     className={`${styles.campItem} ${styles.campsRow} decor-none text-[18px]`}
  //   >
  //     <span>{details.name}</span>
  //     <span>{details.createdOn}</span>
  //     <span>
  //       {details.respondedRecipientCount} out of {details.recipientCount}
  //     </span>
  //     <span>Active</span>
  //   </Link>
  // );
}

export default CampaignItem;
