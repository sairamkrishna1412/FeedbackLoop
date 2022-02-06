import React from 'react';
import styles from '../NewCampaign.module.css';
import { useLocation, useHistory } from 'react-router-dom';

const NewCampaignPreviewButton = (props) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const types = ['base', 'questions', 'recipients'];

  const moveToStep = () => {
    const path = pathname.split('/').slice(0, 3).join('/');
    const extension = types[props.value - 1];
    history.push(`${path}/${extension}`);
  };

  return (
    <div className={`${styles['number-box']} ${styles['number-box--preview']}`}>
      <div
        className={`pointer ${styles['number']} ${styles['number-small']}`}
        onClick={moveToStep}
      >
        {props.value}
      </div>
    </div>
  );
};

export default NewCampaignPreviewButton;
