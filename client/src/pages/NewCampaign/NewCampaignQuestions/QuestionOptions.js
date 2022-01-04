import styles from '../NewCampaign.module.css';
import { useState } from 'react';
import SwitchToggle from './SwitchToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const QuestionOptions = (props) => {
  const { required, index } = props.values;
  const { funcs } = props;
  const [order, setOrder] = useState(index + 1);

  const orderChangeHandler = (e) => {
    setOrder(e.target.value);
  };
  // console.log(order, index);
  const orderUpdateHandler = () => {
    funcs.onOrderChange(order);
    setOrder(index + 1);
  };

  return (
    <div className={styles['question-opts__block']}>
      <div className={styles['opt-item']}>
        <span className={styles['opt-label']}>Required</span>
        <SwitchToggle
          onRequiredChange={funcs.onRequiredChange}
          required={required}
        ></SwitchToggle>
      </div>
      <div className={styles['opt-item']}>
        <span className={styles['opt-label']}>Order</span>
        <input
          type="number"
          className={`${styles['form-control']} ${styles['form-control--small']}`}
          value={order}
          onChange={orderChangeHandler}
        />
        <FontAwesomeIcon
          icon={faSyncAlt}
          size="2x"
          className="pointer"
          onClick={orderUpdateHandler}
        ></FontAwesomeIcon>
      </div>
      <div className={styles['opt-item']} onClick={funcs.onDeleteQuestion}>
        <span className={styles['opt-label']}>Delete</span>
        <FontAwesomeIcon icon={faTrashAlt} size="2x" />
      </div>
    </div>
  );
};

export default QuestionOptions;
