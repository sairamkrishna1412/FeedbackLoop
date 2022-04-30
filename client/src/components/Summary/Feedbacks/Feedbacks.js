import React from 'react';
import styles from '../Summary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Feedbacks = (props) => {
  // console.log(props);
  const { feedbacks, questions } = props;
  const feedbacksJsx = feedbacks.map((feedback, i) => {
    const feebackQuestionJsx = feedback.responses.map((response) => {
      const question = questions.find((el) => el._id === response.question);
      if (!question) {
        return '';
      }
      return (
        <div className="grid grid-cols-2 text-2xl py-8 px-8 border border-b border-gray-100">
          <p>
            <span className=" font-medium">Question</span> : {question.question}
          </p>
          <p>
            <span className=" font-medium">Answer</span> : {response.answer[0]}
          </p>
        </div>
      );
    });

    return (
      <div className={`${styles.whiteBlock} min-h-0`} key={i}>
        <div className="text-3xl grid grid-cols-1 rounded-t-[10px] border border-b-blueGray-300">
          <div className="w-full px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xl">
                      Email
                    </h5>
                    <span className="font-semibold text-[20px] text-blueGray-700">
                      {feedback.email}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 shadow-lg rounded-full bg-blue-500">
                      <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">{feebackQuestionJsx}</div>
      </div>
    );
  });

  return <React.Fragment>{feedbacksJsx}</React.Fragment>;
};

export default Feedbacks;
