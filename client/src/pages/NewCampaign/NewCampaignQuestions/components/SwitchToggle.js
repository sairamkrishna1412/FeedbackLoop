import { useState } from 'react';
import styles from './SwitchToggle.module.css';

const SwitchToggle = (props) => {
  return (
    <label className={styles['switch']}>
      <input
        type="checkbox"
        checked={props.required}
        onChange={props.onRequiredChange}
      />
      <div className={`${styles['slider']} ${styles['round']}`}>
        {/* <span class={styles['on']}>ON</span>
        <span class={styles['off']}>OFF</span> */}
      </div>
    </label>
  );
};

export default SwitchToggle;
