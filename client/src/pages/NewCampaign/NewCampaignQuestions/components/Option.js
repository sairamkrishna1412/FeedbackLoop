import styles from '../../NewCampaign.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Option = (props) => {
  return (
    <div className={styles['option-box']}>
      <input
        type="text"
        className={styles['form-control--option']}
        placeholder="Option"
      />
      <FontAwesomeIcon icon={faTimes} size="2x"></FontAwesomeIcon>
    </div>
  );
};

export default Option;
