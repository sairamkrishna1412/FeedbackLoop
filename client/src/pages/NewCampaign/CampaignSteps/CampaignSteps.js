import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import styles from '../NewCampaign.module.css';

const CampaignSteps = (props) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const pathArr = pathname.split('/');
  let pageType = pathArr[pathArr.length - 1];

  const types = ['base', 'questions', 'recipients', 'previewLaunch'];
  const numberItems = [];

  const moveToStep = (step) => {
    let mainPath = pathArr.slice(0, 3).join('/');
    history.push(`${mainPath}/${step}`);
  };

  for (let i = 0; i < 4; i++) {
    const content = (
      <div
        key={i}
        className={`pointer ${styles['number']} ${
          pageType === types[i] ? styles['number-big'] : styles['number-small']
        }`}
        onClick={() => moveToStep(types[i])}
        title={`${types[i]}`}
      >
        {i + 1}
      </div>
    );
    numberItems.push(content);
  }
  return (
    <div className={`${styles['number-box']} ${styles['number-box--bottom']}`}>
      {numberItems}
    </div>
  );
};

export default CampaignSteps;
