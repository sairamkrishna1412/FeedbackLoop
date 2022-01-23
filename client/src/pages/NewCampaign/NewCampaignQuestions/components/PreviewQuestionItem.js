import React from 'react';
import styles from '../../NewCampaign.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const PreviewQuestionItem = (props) => {
  // const [type, setType] = useState('number');
  let { values } = props;

  const renderExtra = () => {
    let content;
    if (values.type === 'number') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="min">Min</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--small']}`}
            name="min"
            type="number"
            value={values.choices[0] || ''}
            max={values.choices[1] || ''}
          />
          <label htmlFor="max">Max</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--small']}`}
            name="max"
            type="number"
            value={values.choices[1] || ''}
            min={values.choices[0] || ''}
          />
        </div>
      );
    } else if (values.type === 'text') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="maxChars">Max characters</label>
          <input
            readOnly
            className={styles['form-control']}
            name="maxChars"
            type="number"
            value={values.choices[0] || ''}
          />
        </div>
      );
    } else if (values.type === 'checkbox' || values.type === 'radio') {
      const choices = values.choices;
      const choicesArr = choices.map((el, ind) => (
        <div className={styles['option-box']} key={ind}>
          <input
            readOnly
            type="text"
            className={`${styles['form-control--option']}`}
            placeholder="Option"
            value={el}
          />
        </div>
      ));

      content = (
        <React.Fragment>
          <h3 className={styles['question-subhead']}>Options</h3>
          {choicesArr}
        </React.Fragment>
      );
      // content = <Options options={values.choices}></Options>;
    } else if (values.type === 'range') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="min">Min</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--number']}`}
            name="min"
            type="number"
            value={values.choices[0] || ''}
            max={values.choices[1] || ''}
          />
          <label htmlFor="max">Max</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--number']}`}
            name="max"
            type="number"
            value={values.choices[1] || ''}
            min={values.choices[0] || ''}
          />
          <label htmlFor="step">Step</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--number']}`}
            name="step"
            type="number"
            value={values.choices[2] || ''}
            max={values.choices[1] || ''}
          />
        </div>
      );
    } else if (values.type === 'url') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="maxChars">Max length</label>
          <input
            readOnly
            className={styles['form-control']}
            name="maxChars"
            type="text"
            value={values.choices[0] || ''}
          />
        </div>
      );
    }
    // for date
    else {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="min">Min</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--small']}`}
            name="min"
            type="date"
            value={values.choices[0] || ''}
            max={values.choices[1] || ''}
          />
          <label htmlFor="max">Max</label>
          <input
            readOnly
            className={`${styles['form-control']} ${styles['form-control--small']}`}
            name="max"
            type="date"
            value={values.choices[1] || ''}
            min={values.choices[0] || ''}
          />
        </div>
      );
    }
    return content;
  };

  return (
    <div className={styles['question-box']}>
      <div className={styles['form-wrapper']}>
        <label htmlFor="question">Question</label>
        <input
          readOnly
          type="text"
          className={styles['form-control']}
          name="question"
          value={values.question}
        />
      </div>
      <div className={styles['form-wrapper']}>
        <label htmlFor="type">Type</label>
        <select
          readOnly
          name="type"
          id="type"
          form="main"
          className={styles['form-control']}
          value={values.type}
        >
          <optgroup>
            <option value="number">Number</option>
            <option value="text">Text</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="range">Range</option>
            <option value="date">Date</option>
            <option value="url">URL</option>
          </optgroup>
        </select>
      </div>
      {/* add extra content based on type here */}
      {renderExtra()}
    </div>
  );
};

export default PreviewQuestionItem;
