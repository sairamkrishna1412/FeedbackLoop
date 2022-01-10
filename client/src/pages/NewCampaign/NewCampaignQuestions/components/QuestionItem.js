import React, { useState } from 'react';
import styles from '../../NewCampaign.module.css';
import QuestionOptions from './QuestionOptions';
import Option from './Option';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const QuestionItem = (props) => {
  // const [type, setType] = useState('number');
  const { values } = props;
  // const vals = {};
  // const values = Object.assign(vals, props.values);
  // const values = { ...props.values };

  // things that can change = question, type, choices, required, order, delete
  const questionChangeHandler = (e) => {
    props.onQuestionChange({ ...values, question: e.target.value });
  };

  const typeChangeHandler = (e) => {
    props.onQuestionChange({ ...values, type: e.target.value, choices: [] });
  };

  const choicesChangeHandler = (e) => {
    // const newChoices = values.choices;
    const value = e.target.value;

    if (values.type === 'number') {
      if (e.target.name.includes('min')) {
        values.choices[0] = value;
      } else {
        values.choices[1] = value;
      }
    } else if (values.type === 'text') {
      values.choices[0] = value;
    } else if (values.type === 'checkbox' || values.type === 'radio') {
      values.choices.push(value);
    } else if (values.type === 'range') {
      const target = e.target.name;
      if (target.includes('min')) {
        values.choices[0] = value;
      } else if (target.includes('max')) {
        values.choices[1] = value;
      } else {
        values.choices[2] = value;
      }
    } else if (values.type === 'url') {
      values.choices[0] = value;
    }
    props.onQuestionChange({ ...values });
  };

  const requiredChangeHandler = (e) => {
    props.onQuestionChange({ ...values, required: e.target.checked });
  };

  const orderChangeHandler = (desiredVal) => {
    if (values.index !== desiredVal - 1) {
      props.onOrderChange(values.index, desiredVal - 1);
    }
  };

  const questionDeleteHandler = () => {
    props.onDeleteQuestion(values.index);
  };

  const questionOptFuncs = {
    onRequiredChange: requiredChangeHandler,
    onOrderChange: orderChangeHandler,
    onDeleteQuestion: questionDeleteHandler,
  };

  const renderExtra = () => {
    let content;
    if (values.type === 'number') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="min">Min</label>
          <input
            className={`${styles['form-control']} ${styles['form-control--small']}`}
            name="min"
            type="number"
            onChange={choicesChangeHandler}
            value={values.choices[0] || ''}
          />
          <label htmlFor="max">Max</label>
          <input
            className={`${styles['form-control']} ${styles['form-control--small']}`}
            name="max"
            type="number"
            onChange={choicesChangeHandler}
            value={values.choices[1] || ''}
          />
        </div>
      );
    } else if (values.type === 'text') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="maxChars">Max characters</label>
          <input
            className={styles['form-control']}
            name="maxChars"
            type="number"
            onChange={choicesChangeHandler}
            value={values.choices[0] || ''}
          />
        </div>
      );
    } else if (values.type === 'checkbox' || values.type === 'radio') {
      content = (
        <React.Fragment>
          <h3 className={styles['question-subhead']}>Options</h3>
          <Option></Option>
          <div className="pointer">
            <span className={styles['add-option']}>Add Option</span>
          </div>
        </React.Fragment>
      );
    } else if (values.type === 'range') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="min">Min</label>
          <input
            className={`${styles['form-control']} ${styles['form-control--number']}`}
            name="min"
            type="number"
            onChange={choicesChangeHandler}
            value={values.choices[0] || ''}
          />
          <label htmlFor="max">Max</label>
          <input
            className={`${styles['form-control']} ${styles['form-control--number']}`}
            name="max"
            type="number"
            onChange={choicesChangeHandler}
            value={values.choices[1] || ''}
          />
          <label htmlFor="step">Step</label>
          <input
            className={`${styles['form-control']} ${styles['form-control--number']}`}
            name="step"
            type="number"
            onChange={choicesChangeHandler}
            value={values.choices[2] || ''}
          />
        </div>
      );
    } else if (values.type === 'url') {
      content = (
        <div className={styles['form-wrapper']}>
          <label htmlFor="maxChars">Max length</label>
          <input
            className={styles['form-control']}
            name="maxChars"
            type="text"
            onChange={choicesChangeHandler}
            value={values.choices[0] || ''}
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
          type="text"
          className={styles['form-control']}
          name="question"
          onChange={questionChangeHandler}
          value={values.question}
        />
      </div>
      <div className={styles['form-wrapper']}>
        <label htmlFor="type">Type</label>
        <select
          name="type"
          id="type"
          form="main"
          className={styles['form-control']}
          onChange={typeChangeHandler}
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
      <QuestionOptions
        values={values}
        funcs={questionOptFuncs}
      ></QuestionOptions>
    </div>
  );
};

export default QuestionItem;
