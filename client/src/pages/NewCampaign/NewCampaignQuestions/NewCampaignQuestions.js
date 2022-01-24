import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../../components/UI/Container/Container';
import Header from '../../../components/UI/Header/Header';
import PlainCard from '../../../components/UI/Card/PlainCard/PlainCard';
import QuestionItem from './components/QuestionItem';
import CampaignSteps from '../CampaignSteps/CampaignSteps';
import ScrollToTop from '../../../components/UI/ScrollToTop';
import styles from '../NewCampaign.module.css';
import { useParams, Redirect, useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { userThunks } from '../../../store/userSlice';

const NewCampaignQuestions = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );

  const history = useHistory();

  let newQuestion = {
    question: '',
    type: 'number',
    choices: [],
    required: false,
    index: 0,
  };

  let campaignQuestions;

  if (
    campaign &&
    campaign.hasOwnProperty('campaignQuestions') &&
    campaign.campaignQuestions.length
  ) {
    campaignQuestions = [...campaign.campaignQuestions];
    campaignQuestions.sort((a, b) => a.index - b.index);
  }

  if (!campaignQuestions) {
    campaignQuestions = [newQuestion];
  }

  const [questions, setQuestions] = useState(campaignQuestions);
  // console.log(questions);

  if (
    campaign &&
    campaign.hasOwnProperty('launchedAt') &&
    campaign.launchedAt
  ) {
    return <Redirect to={`/campaign/${id}`}></Redirect>;
  }

  if (!campaign) {
    return <Redirect to="/"></Redirect>;
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
    // const newQuestions = [...questions];
    const newQuestions = JSON.parse(JSON.stringify(questions));
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

  const makeQuestionsSubmitReady = (questions) => {
    const finalQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const question = { ...questions[i] };
      if (question.type === 'checkbox' || question.type === 'radio') {
        if (
          question.choices.length &&
          question.choices[0].hasOwnProperty('option')
        ) {
          const choices = [...question.choices];
          const newChoices = choices.map((choice) => choice.option);
          question.choices = newChoices;
        }
      }
      finalQuestions.push(question);
    }
    const submitObj = { campaign_id: id, questions: finalQuestions };
    return submitObj;
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const submitObj = makeQuestionsSubmitReady(questions);
    dispatch(userThunks.campaignQuestions(submitObj));
    history.push(`/newCampaign/${id}/recipients`);
  };

  // console.log(questions);
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
    <div className="container">
      <ScrollToTop />
      <Header></Header>
      <h2 className={`subHeading`}>
        {campaign.campaignName !== '' ? campaign.campaignName : 'New Campaign'}
      </h2>
      <Container className={styles['container-wrapper']}>
        <div className={`${styles['number-box']} ${styles['number-box--top']}`}>
          <div className={`${styles['number']} ${styles['number-big']}`}>2</div>
        </div>
        <PlainCard>
          <form onSubmit={formSubmitHandler}>
            {/* {console.log('this ran', questionArr)} */}
            {questionArr}
            <div className={styles['add-question']}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                size="4x"
                onClick={addQuestion}
              ></FontAwesomeIcon>
            </div>
            <input
              type="submit"
              value="Save & Next"
              className={`btn btn__black ${styles['btn-right']}`}
            />
          </form>
        </PlainCard>
        <CampaignSteps></CampaignSteps>
      </Container>
    </div>
  );
};

export default NewCampaignQuestions;
