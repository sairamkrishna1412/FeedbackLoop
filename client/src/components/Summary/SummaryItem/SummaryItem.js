import React from 'react';

import styles from './SummaryItem.module.css';

function SummaryItem(props) {
  return (
    <div className={styles.quickSummaryItem}>
      <h2 className={`${styles.summaryHeading}`}>{props.title}</h2>
      <h2 className={styles.summaryVal}>{props.value}</h2>
    </div>
  );
}

export default SummaryItem;
