import React from 'react';
import Option from './Option';
import styles from '../../NewCampaign.module.css';
// import { useEffect } from 'react';

// let firstLoad = true;

const Options = (props) => {
  let opts = [...props.options];
  let newOption = {
    option: '',
    index: 0,
  };

  if (opts.length) {
    if (
      !opts.every(
        (el) =>
          typeof el === 'object' &&
          el.hasOwnProperty('option') &&
          el.hasOwnProperty('index')
      )
    ) {
      opts = opts.map((el, ind) => {
        return { option: el, index: ind };
      });
    }
  } else {
    opts = [newOption];
  }

  // const [options, setOptions] = useState(opts);
  const options = opts;

  // let opts = props.options;

  // if (firstLoad) {
  //   firstLoad = false;
  //   if (opts.length) {
  //     const newOptions = opts.map((el, ind) => {
  //       return { option: el, index: ind };
  //     });
  //     setOptions(newOptions);
  //   }
  // } else {
  //   if (opts.length && JSON.stringify(opts) !== JSON.stringify(options)) {
  //     setOptions(opts);
  //   }
  // }

  // if (!options.length) {
  //   setOptions([newOption]);
  //   // props.onOptionsChange([newOption]);
  // }

  const addOption = (e) => {
    newOption.index = options.length;
    // setOptions((prevState) => [...prevState, newOption]);
    props.onOptionsChange([...options, newOption]);
  };

  const optionChange = (updatedOption) => {
    const newOptions = options.map((el) => {
      if (el.index === updatedOption.index) {
        return updatedOption;
      } else {
        return el;
      }
    });
    // console.log('new ', newOptions);
    props.onOptionsChange(newOptions);
    // setOptions(newOptions);
  };

  const deleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    for (let i = index; i < newOptions.length; i++) {
      newOptions[i].index = i;
    }
    props.onOptionsChange(newOptions);
    // setOptions(newOptions);
  };

  const displayOptions = options.map((el, ind) => (
    <Option
      values={el}
      onOptionChange={optionChange}
      onDeleteOption={deleteOption}
      key={ind}
    ></Option>
  ));

  return (
    <React.Fragment>
      <h3 className={styles['question-subhead']}>Options</h3>
      {displayOptions}
      <div className="pointer">
        <span className={styles['add-option']} onClick={addOption}>
          + Add Option
        </span>
      </div>
    </React.Fragment>
  );
};

export default Options;
