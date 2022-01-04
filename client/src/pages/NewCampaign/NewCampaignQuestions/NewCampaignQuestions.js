import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Authenticate from '../../../components/Auth/Authenticate';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';
import QuestionItem from './QuestionItem';
import styles from '../NewCampaign.module.css';
import { useParams, Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

let firstLoad = true;

const NewCampaignQuestions = (props) => {
  const { id } = useParams();
  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  const [questions, setQuestions] = useState([]);
  // console.log(questions);
  if (!campaign) {
    return <Redirect to="/"></Redirect>;
  }
  const campaignQuestions = campaign.campaignQuestions;

  if (firstLoad && campaignQuestions.length) {
    firstLoad = false;
    setQuestions(campaignQuestions);
  }

  let newQuestion = {
    question: '',
    type: 'number',
    choices: [],
    required: false,
    index: 0,
  };
  if (!questions.length) {
    setQuestions([newQuestion]);
  }

  const addQuestion = (e) => {
    newQuestion.index = questions.length;
    setQuestions((prevState) => [...prevState, newQuestion]);
  };

  const changeQuestion = (updatedQuestion) => {
    const { index } = updatedQuestion;
    const newQuestions = questions.map((question, ind) => {
      if (ind !== index) {
        return question;
      } else {
        return updatedQuestion;
      }
    });

    // newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const changeOrder = (curInd, desInd) => {
    const newQuestions = [...questions];
    const movingQuestion = newQuestions[curInd];
    const n = newQuestions.length;
    if (desInd > n - 1) {
      desInd = n - 1;
    } else if (desInd < 0) {
      desInd = 0;
    }

    if (desInd < curInd) {
      for (let i = curInd - 1; i >= desInd; i--) {
        const current = newQuestions[i];
        current.index += 1;
        newQuestions[i + 1] = current;
      }
    } else {
      for (let i = curInd + 1; i <= desInd; i++) {
        const current = newQuestions[i];
        current.index -= 1;
        newQuestions[i - 1] = current;
      }
    }
    movingQuestion.index = desInd;
    newQuestions[desInd] = movingQuestion;

    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    for (let i = index; i < newQuestions.length; i++) {
      const question = newQuestions[i];
      question.index = i;
    }
    setQuestions(newQuestions);
  };

  const questionArr = questions.map((question, index) => {
    return (
      <QuestionItem
        values={question}
        onQuestionChange={changeQuestion}
        onDeleteQuestion={deleteQuestion}
        onOrderChange={changeOrder}
        key={index}
      ></QuestionItem>
    );
  });

  return (
    <Authenticate className="container">
      <Header></Header>
      <h2 className={`subHeading`}>
        {campaign.campaignName !== '' ? campaign.campaignName : 'New Campaign'}
      </h2>
      <Container className={styles['container-wrapper']}>
        <div className={`${styles['number-box']} ${styles['number-box--top']}`}>
          <div className={`${styles['number']} ${styles['number-big']}`}>2</div>
        </div>
        <PlainCard>
          <form>
            {questionArr}
            <div className={styles['add-question']}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                size="4x"
                onClick={addQuestion}
              ></FontAwesomeIcon>
            </div>
          </form>
          {/* <form onSubmit={'sai'}>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="campaignName">Campaign Name</label>
              <input
                type="text"
                name="campaignName"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.campaignName}
              />
            </div>
            <div className={styles['separator']}></div>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="emailSubject">Email Subject</label>
              <input
                type="text"
                name="emailSubject"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.emailSubject}
              />
            </div>
            <div className={styles['separator']}></div>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="previewText">Preview text</label>
              <input
                type="text"
                name="previewText"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.previewText}
              />
            </div>
            <div className={styles['separator']}></div>
            <div className={`${styles['form-wrapper']}`}>
              <label htmlFor="emailContent">Email Content</label>
              <textarea
                type="text"
                name="emailContent"
                className={`${styles['form-control']}`}
                onChange={inputChangeHandler}
                value={campaign.emailContent}
              />
            </div>
            <div className={styles['separator']}></div>
            <input
              type="submit"
              value="Save & Next"
              className={`btn btn-black ${styles['btn-right']}`}
            />
          </form> */}
        </PlainCard>
        <div
          className={`${styles['number-box']} ${styles['number-box--bottom']}`}
        >
          <div className={`${styles['number']} ${styles['number-small']}`}>
            1
          </div>
          <div className={`${styles['number']} ${styles['number-big']}`}>2</div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            3
          </div>
          <div className={`${styles['number']} ${styles['number-small']}`}>
            4
          </div>
        </div>
      </Container>
    </Authenticate>
  );
};

export default NewCampaignQuestions;
