import React from 'react';

import styles from './PlainCard.module.css';

function PlainCard(props) {
  return (
    <div className={`${styles.cardContainer} ${props.className}`}>
      <div className={styles.cardInner}>{props.children}</div>
    </div>
  );
}

export default PlainCard;
