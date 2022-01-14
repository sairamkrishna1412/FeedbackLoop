import styles from '../../NewCampaign.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Option = (props) => {
  const { values } = props;

  const onChangeHandler = (e) => {
    props.onOptionChange({ ...values, option: e.target.value });
  };

  const onDeleteHandler = (e) => {
    props.onDeleteOption(values.index);
  };

  return (
    <div className={styles['option-box']}>
      <input
        type="text"
        className={`${styles['form-control--option']}`}
        placeholder="Option"
        onChange={onChangeHandler}
        value={values.option}
      />
      <FontAwesomeIcon
        icon={faTimes}
        size="2x"
        onClick={onDeleteHandler}
        className="pointer"
      ></FontAwesomeIcon>
    </div>
  );
};

export default Option;
