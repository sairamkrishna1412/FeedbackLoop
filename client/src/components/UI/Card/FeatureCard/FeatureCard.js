import React from 'react';

import styles from './FeatureCard.module.css';

function FeatureCard(props) {
  return (
    <div className={styles.cardContainer}>
      <h2>{props.cardTitle}</h2>
      <p>{props.cardContent}</p>
    </div>
  );
}

export default FeatureCard;
