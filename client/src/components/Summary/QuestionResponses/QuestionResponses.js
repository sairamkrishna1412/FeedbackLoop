import React from 'react';
import styles from '../Summary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faHandPointer } from '@fortawesome/free-solid-svg-icons';

const QuestionResponses = (props) => {
  // console.log(props);
  const { question, responses } = props;

  const responsesJsx = responses.map((el, i) => {
    return (
      <div
        className={`text-2xl py-8 ${
          i < responses.length - 1 && 'border border-b border-gray-100'
        }`}
      >
        <p className=" px-8">{el.answer[0]}</p>
      </div>
    );
  });

  return (
    <div className={`${styles.whiteBlock}`}>
      <div className="text-3xl grid grid-cols-2 rounded-t-[10px] border border-b-blueGray-300">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xl">
                    Question
                  </h5>
                  <span className="font-semibold text-[20px] text-blueGray-700">
                    {question.question}
                  </span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 shadow-lg rounded-full bg-blue-500">
                    <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xl">
                    Type
                  </h5>
                  <span className="font-semibold text-[20px] text-blueGray-700 capitalize">
                    {question.type}
                  </span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 shadow-lg rounded-full bg-blue-500">
                    {/* <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon> */}
                    <FontAwesomeIcon icon={faHandPointer} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" max-h-[380px] overflow-y-auto">{responsesJsx}</div>
    </div>
  );
};

export default QuestionResponses;
