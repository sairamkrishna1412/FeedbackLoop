import React from 'react';

import styles from './AuthCard.module.css';

function AuthCard(props) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardInner}>{props.children}</div>
    </div>
  );
}

export default AuthCard;
