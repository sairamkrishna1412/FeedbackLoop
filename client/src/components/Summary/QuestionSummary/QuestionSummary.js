import React from 'react';
import styles from '../Summary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import SummaryChart from '../SummaryChart/SummaryChart';

const QuestionSummary = (props) => {
  // console.log(props);
  const { question, summary } = props;
  const summaryKeys = Object.keys(summary);
  const summaryJsx = [];

  // for properties like min, max, average
  for (let i = 0; i < summaryKeys.length; i++) {
    const key = summaryKeys[i];
    if (typeof summary[key] === 'object') {
      continue;
    }
    summaryJsx.push(
      <div className="w-full sm:px-4" key={i}>
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
          <div className="flex-auto p-2 sm:p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full sm:pr-4 max-w-full flex-grow flex-1 text-center">
                <h5 className="text-blueGray-400 uppercase font-bold text-xl">
                  {key}
                </h5>
                <span className="font-semibold text-[16px] sm:text-[18px] md:text-[20px] text-blueGray-700 capitalize">
                  {String(summary[key]).length > 5
                    ? summary[key].toFixed(2)
                    : summary[key]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      // <p className=" text-3xl" key={i}>
      //   <span className="capitalize">{key}</span> : {summary[key]}
      // </p>
    );
  }
  return (
    <div
      className={`${styles.whiteBlock} p-8 flex flex-col gap-5 sm:gap-10 md:gap-20 text-3xl`}
    >
      <div className="text-3xl grid grid-cols-2">
        <div className="w-full px-2 sm:px-4 col-span-2 sm:col-span-1">
          <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
            <div className="flex-auto p-2 sm:p-4">
              <div className="flex flex-wrap justify-between">
                <div className="relative w-full sm:pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xl">
                    Question
                  </h5>
                  <span className="font-semibold text-[16px] sm:text-[18px] lg:text-[20px] text-blueGray-700">
                    {question.question}
                  </span>
                </div>
                <div className="relative w-auto sm:pl-4 flex-initial self-center">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center text-[16px] w-12 h-12 sm:w-16 sm:h-16  shadow-lg rounded-full bg-blue-500">
                    <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-2 sm:px-4 col-span-2 sm:col-span-1">
          <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
            <div className="flex-auto p-2 sm:p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full sm:pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xl">
                    Type
                  </h5>
                  <span className="font-semibold text-[16px] sm:text-[18px] lg:text-[20px] text-blueGray-700 capitalize">
                    {question.type}
                  </span>
                </div>
                <div className="relative w-auto sm:pl-4 flex-initial self-center">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center text-[16px] w-12 h-12 sm:w-16 sm:h-16 shadow-lg rounded-full bg-blue-500">
                    {/* <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon> */}
                    <FontAwesomeIcon icon={faHandPointer} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <p>
          Q {question.index + 1} : {question.question}
        </p> */}
        {/* <p>Type : {question.type}</p> */}
      </div>
      <div
        className={`grid grid-cols-${summaryJsx.length} justify-items-center`}
      >
        {summaryJsx}
      </div>
      <div>
        <SummaryChart question={question} summary={summary}></SummaryChart>
      </div>
    </div>
  );
};

export default QuestionSummary;
