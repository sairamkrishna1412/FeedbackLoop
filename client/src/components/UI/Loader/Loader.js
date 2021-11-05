import React from 'react';
// import ContentLoader from 'react-content-loader';

import styles from './Loader.module.css';

const Loader = (props) => (
  <div className={styles.loaderContainer}>
    <div>
      <div className={styles.loaderBox}>
        <span>FeedbackLoop</span>
      </div>
      <div className={styles.loadLine}></div>
    </div>
  </div>
  // <ContentLoader
  //   speed={2}
  //   width={1400}
  //   height={100}
  //   viewBox="0 0 1400 100"
  //   backgroundColor="#a6c2fe"
  //   foregroundColor="#739ffe"
  //   {...props}
  // >
  //   <rect x="0" y="0" rx="0" ry="0" width="1361" height="218" />
  // </ContentLoader>
);

export default Loader;
