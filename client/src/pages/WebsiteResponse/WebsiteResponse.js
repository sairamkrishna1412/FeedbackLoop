import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from '../../store/uiSlice';
import axios from 'axios';
import Loader from '../../components/UI/Loader/Loader';

const Response = (props) => {
  const dispatch = useDispatch();
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const { query } = useParams();
  // const [queryStr, setQueryStr] = useState('');
  const [campaignData, setCampaignData] = useState({});
  console.log('client hit 1');

  useEffect(() => {
    dispatch(uiActions.startLoading());
    const decoder = async () => {
      const response = await axios.post('/api/campaign/response/toWebsite', {
        cipher: query,
      });
      console.log('client hit 2');
      if (response.status === 200 && response.data.success) {
        console.log('client hit 3');
        console.log(response.data.data);
        setCampaignData(response.data.data);
      }
    };
    decoder().catch((err) => console.log(err));
    dispatch(uiActions.stopLoading());
  }, [query, dispatch]);
  if (isPageLoading) {
    return <Loader></Loader>;
  }

  const generateChoicesMarkup = (id, choices, type) => {
    const choicesMarkupArr = choices.map((choice, index) => {
      return (
        <div
          style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}
          className="div-9"
          key={index}
        >
          <input
            style={{
              width: '5%',
              height: '18px',
              padding: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            type={type}
            name={id}
            id={`${id}_${index}`}
            value={choice}
          />
          <label htmlFor={`${id}_${index}`}>{choice}</label>
        </div>
      );
    });
    return choicesMarkupArr;
  };

  const getQuestionMarkup = (question, index) => {
    let markup = '';
    switch (question.type) {
      case 'number':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}
              {question.required
                ? '<span style={{fontSize: "18px", color: "#FF0000"}}>*</span>'
                : ''}
            </div>
            <div style={{ marginTop: '15px' }}>
              <input
                name={String(question._id)}
                style={{
                  width: '97%',
                  height: '30px',
                  padding: '5px',
                  outline: 'none',
                }}
                type="number"
                min={
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 0
                    ? question.choices[0]
                    : ''
                }
                max={
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 1
                    ? question.choices[1]
                    : ''
                }
                placeholder={`Enter a number ${
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 1
                    ? `between ${question.choices[0]} and ${question.choices[1]}`
                    : ''
                }`}
              />
            </div>
          </div>
        );
        break;

      case 'text':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}
              {question.required ? (
                <span style={{ fontSize: '18px', color: '#FF0000' }}>*</span>
              ) : (
                ''
              )}
            </div>
            <div style={{ marginTop: '15px' }}>
              <input
                name={String(question._id)}
                style={{
                  width: '97%',
                  height: '30px',
                  padding: '5px',
                  outline: 'none',
                }}
                type="text"
                maxLength={
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 0
                    ? question.choices[0]
                    : ''
                }
                placeholder={`Enter text ${
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 0
                    ? `of maximum ${question.choices[0]} characters`
                    : ''
                }`}
              />
            </div>
          </div>
        );
        break;

      case 'checkbox':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}{' '}
              {question.required
                ? '<span style={{fontSize: "18px", color:"#FF0000"}}>*</span>'
                : ''}
            </div>
            {generateChoicesMarkup(
              String(question._id),
              question.choices,
              'checkbox'
            )}
          </div>
        );
        break;

      case 'radio':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}
              {question.required
                ? '<span style={{fontSize: "18px", color: "#FF0000"}}>*</span>'
                : ''}
            </div>
            {generateChoicesMarkup(
              String(question._id),
              question.choices,
              'radio'
            )}
          </div>
        );
        break;

      case 'range':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}
              {question.required ? (
                <span style={{ fontSize: '18px', color: '#FF0000' }}>*</span>
              ) : (
                ''
              )}
            </div>
            <div style={{ margin: '25px auto 20px' }}>
              <input
                name={String(question._id)}
                style={{
                  width: '100%',
                  height: '30px',
                  padding: '5px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                type="range"
                min={question.choices[0]}
                max={question.choices[1]}
                step={question.choices[2]}
                defaultValue={question.choices[1]}
              />
            </div>
          </div>
        );

        break;

      case 'date':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}
              {question.required ? (
                <span style={{ fontSize: '18px', color: '#FF0000' }}>*</span>
              ) : (
                ''
              )}
            </div>
            <div style={{ marginTop: '15px' }} className="div-9">
              <input
                name={String(question._id)}
                style={{
                  width: '97%',
                  height: '30px',
                  padding: '5px',
                  outline: 'none',
                }}
                type="date"
                min={
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 0
                    ? question.choices[0]
                    : ''
                }
                max={
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 1
                    ? question.choices[1]
                    : ''
                }
              />
            </div>
          </div>
        );
        break;

      case 'url':
        markup = (
          <div
            key={index}
            style={{
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '30px',
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: '20px' }}>
              Q{question.index + 1}. {question.question}{' '}
              {question.required ? (
                <span style={{ fontSize: '18px', color: '#FF0000' }}>*</span>
              ) : (
                ''
              )}
            </div>
            <div style={{ marginTop: '15px' }} className="div-9">
              <input
                name={String(question._id)}
                style={{
                  width: '97%',
                  height: '30px',
                  padding: '5px',
                  outline: 'none',
                }}
                placeholder={`http://www.abc.com ${
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 0
                    ? `, max length : ${question.choices[0]}`
                    : ''
                }`}
                type="url"
                maxLength={
                  question.hasOwnProperty('choices') &&
                  question.choices.length > 0
                    ? question.choices[0]
                    : '200'
                }
              />
            </div>
          </div>
        );

        break;

      default:
        break;
    }
    return markup;
  };

  const emailSubject = campaignData?.campaign?.emailSubject;
  const emailContent = campaignData?.campaign?.emailContent;
  const campaignId = String(campaignData?.campaign?._id);
  const user = campaignData?.user;

  const campaignQuestions = campaignData?.campaign?.campaignQuestions.sort(
    (a, b) => a.index - b.index
  );
  const questionsMarkupArr = campaignQuestions?.map((question, index) => {
    return getQuestionMarkup(question, index);
  });

  return (
    <table
      style={{ fontFamily: '"Montserrat", sans-serif' }}
      width="100%"
      border={0}
      cellPadding={0}
      cellSpacing={0}
      align="center"
      valign="top"
    >
      <tbody>
        <tr>
          <td>
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              valign="top"
              bgcolor="#ffffff"
              style={{
                padding: '0 10px !important',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <tbody>
                <tr>
                  <td align="center" style={{ padding: '10px 0 0px 0' }}>
                    <table
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      width="100%"
                      style={{
                        maxWidth: '500px',
                        borderBottom: '1px solid #e4e4e4',
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            valign="middle"
                            bgcolor="#739ffe"
                            style={{
                              padding: '15px',
                              color: '#111111',
                              fontSize: '48px',
                              fontWeight: 400,
                              lineHeight: '60px',
                            }}
                          >
                            <Link
                              to="https://feedbackloop-dev.herokuapp.com/"
                              target="_blank"
                              data-saferedirecturl="https://feedbackloop-dev.herokuapp.com/"
                              style={{
                                fontSize: '16px',
                                color: '#333',
                                fontWeight: 400,
                                textDecoration: 'none',
                              }}
                            >
                              FeedbackLoop
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#ffffff" align="center" style={{ padding: 0 }}>
                    <table
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      width="100%"
                      style={{
                        maxWidth: '500px',
                        borderBottom: '1px solid #e4e4e4',
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            bgcolor="#ffffff"
                            align="left"
                            style={{
                              padding: '40px 20px 10px',
                              fontSize: '32px',
                              fontWeight: 400,
                            }}
                          >
                            <h1
                              style={{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: '#3d3d3d',
                                marginBottom: '2px',
                                lineHeight: '30px',
                              }}
                            >
                              {emailSubject}
                            </h1>
                            <p style={{ fontSize: '16px', lineHeight: '24px' }}>
                              {emailContent}
                            </p>
                            <hr
                              style={{
                                width: '30px',
                                float: 'left',
                                height: '1.5px',
                                background: 'black',
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#ffffff" align="center" style={{ padding: 0 }}>
                    <table
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      width="100%"
                      style={{
                        maxWidth: '500px',
                        borderBottom: '1px solid #e4e4e4',
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            bgcolor="#ffffff"
                            align="left"
                            style={{
                              padding: '40px 20px 10px',
                              fontSize: '32px',
                              fontWeight: 400,
                            }}
                          >
                            <div
                              style={{
                                margin: '20px auto 120px',
                                fontSize: '16px',
                              }}
                              className="div-6"
                            >
                              <form
                                action={`${window.location.origin}/api/campaign/response`}
                                method="post"
                                target="_blank"
                              >
                                {questionsMarkupArr}
                                <input
                                  type="hidden"
                                  name="campaign_id"
                                  defaultValue={campaignId}
                                />
                                <input
                                  type="hidden"
                                  name="email"
                                  defaultValue={user}
                                />
                                <input
                                  style={{
                                    display: 'block',
                                    width: '50%',
                                    padding: '10px 25px',
                                    backgroundColor: '#739ffe',
                                    border: 'none',
                                    margin: '10px auto',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: '#333',
                                  }}
                                  type="submit"
                                  defaultValue="Submit"
                                />
                              </form>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Response;
