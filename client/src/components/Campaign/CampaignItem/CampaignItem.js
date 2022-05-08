import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Campaign.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function CampaignItem(props) {
  const { details } = props;
  let linkTo = '';
  if (details.launchedAt) {
    linkTo = `/campaign/${details.id}`;
    return (
      <Link
        to={linkTo}
        className={`${styles.campItem} ${styles.campsRow} decor-none text-[16px] sm:text-[18px] py-4`}
      >
        <div className="w-full hidden sm:flex sm:justify-around sm:items-center">
          <span>{details.name}</span>
          <span>{details.createdOn}</span>
          <span>
            {details.respondedRecipientCount} out of {details.recipientCount}
          </span>
          <span>Active</span>
        </div>
        <div className="sm:hidden flex flex-col gap-4">
          <span className=" self-center text-center font-bold">
            {details.name}
          </span>
          <div className="flex justify-between px-8">
            <span>Created</span>
            <span>{details.createdOn}</span>
          </div>
          <div className="flex justify-between px-8">
            <span>Responded</span>
            <span>
              {details.respondedRecipientCount} out of {details.recipientCount}
            </span>
          </div>
          <div className="flex justify-between px-8">
            <span>Status</span>
            <span>Active</span>
          </div>
          <button>
            <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
          </button>
        </div>
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
        className={`${styles.campItem} ${styles.campsRow} decor-none text-[16px] sm:text-[18px] py-4`}
      >
        <div className="w-full hidden sm:flex sm:justify-around sm:items-center">
          <span>{details.name}</span>
          <span>{details.createdOn}</span>
          <span>{stepsCompleted} out of 4</span>
        </div>
        <div className="sm:hidden flex flex-col gap-4">
          <span className=" self-center text-center font-bold">
            {details.name}
          </span>
          <div className="flex justify-between px-8">
            <span>Created</span>
            <span>{details.createdOn}</span>
          </div>
          <div className="flex justify-between px-8">
            <span>Steps Completed</span>
            <span>{stepsCompleted} out of 4</span>
          </div>
          <button>
            <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
          </button>
        </div>
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
