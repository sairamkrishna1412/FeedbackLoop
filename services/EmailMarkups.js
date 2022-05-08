const keys = require('../config/keys');

exports.getQuestionMarkup = (question) => {
  let markup = '';
  switch (question.type) {
    case 'number':
      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
        <div style="margin-top: 15px">
          <input
            name="${String(question._id)}"
            style="
              width: 97%;
              height: 30px;
              padding: 5px;
              outline: none;
            "
            type="number"
            min=${
              question.hasOwnProperty('choices') && question.choices.length > 0
                ? question.choices[0]
                : ''
            }
            max=${
              question.hasOwnProperty('choices') && question.choices.length > 1
                ? question.choices[1]
                : ''
            }
            placeholder="Enter a number ${
              question.hasOwnProperty('choices') && question.choices.length > 1
                ? `between ${question.choices[0]} and ${question.choices[1]}`
                : ''
            }"
          />
        </div>
      </div>`;
      break;

    case 'text':
      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
        <div style="margin-top: 15px">
          <input
            name="${String(question._id)}"
            style="
              width: 97%;
              height: 30px;
              padding: 5px;
              outline: none;
            "
            type="text"
            maxlength=${
              question.hasOwnProperty('choices') && question.choices.length > 0
                ? question.choices[0]
                : ''
            }
            placeholder="Enter text ${
              question.hasOwnProperty('choices') && question.choices.length > 0
                ? `of maximum ${question.choices[0]} characters`
                : ''
            }"
          />
          </div>
        </div>`;
      break;

    case 'checkbox':
      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
          ${generateChoicesMarkup(
            String(question._id),
            question.choices,
            'checkbox'
          )}
      </div>`;
      break;

    case 'radio':
      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
          ${generateChoicesMarkup(
            String(question._id),
            question.choices,
            'radio'
          )}  
      </div>`;
      break;

    case 'range':
      const min =
        question.hasOwnProperty('choices') && question.choices.length > 0
          ? parseFloat(question.choices[0])
          : 0;
      const max =
        question.hasOwnProperty('choices') && question.choices.length > 1
          ? parseFloat(question.choices[1])
          : 5;
      const step =
        question.hasOwnProperty('choices') && question.choices.length > 2
          ? parseFloat(question.choices[2])
          : 1;
      const id = String(question._id);
      let labels = ``;
      let radios = ``;
      let isDoubleDigitOccured = false;
      let marginLeft = '5px';
      let valLength = 1;
      for (let i = min; i <= max; i += step) {
        valLength = String(i).length;
        if (valLength > 1 && !isDoubleDigitOccured) {
          isDoubleDigitOccured = true;
        }
        if (isDoubleDigitOccured) {
          if (valLength > 2) {
            marginLeft = '12px';
          } else if (valLength > 1) {
            marginLeft = '12px';
          } else {
            marginLeft = '9.5px';
          }
        }

        if (!isDoubleDigitOccured) {
          if (String(i).length > 1) {
            marginLeft = '10px';
            isDoubleDigitOccured = true;
          }
        } else {
        }
        labels = labels.concat(
          `<span style="margin: 5px 12px 5px 5px"><label for="${id}_${i}">${i}</label></span>`
        );
        radios =
          radios.concat(`<input style="margin: 5px 8px 5px ${marginLeft};"
            type="radio"
            name="${id}"
            id="${id}_${i}"
            value="${i}"/>`);
      }
      labels = `<div class="">${labels}</div>`;
      radios = `<div class="" style="margin-top: 15px">${radios}</div>`;

      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
        <div
        style="margin: 25px auto 20px"
        >
        ${labels}
        ${radios}
        </div>
      </div>`;

      // markup = `<div
      //   style="
      //     border-radius: 5px;
      //     padding: 15px;
      //     margin-bottom: 30px;
      //     border-color: rgba(0, 0, 0, 1);
      //     border-width: 1px;
      //     border-style: solid;
      //   "
      // >
      //   <div
      //     style="font-size: 16px; line-height: 20px"
      //   >
      //     Q${question.index + 1}. ${question.question} ${question.required ? '<span style="font-size: 18px; color: #FF0000;">*</span>' : ''}
      //   </div>
      //   <div style="margin-top: 15px" class="div-9">
      //     <input
      //       name="${String(question._id)}"
      //       style="
      //         width: 97%;
      //         height: 30px;
      //         padding: 5px;
      //         outline: none;
      //         cursor: pointer;
      //       "
      //       type="range"
      //       min="${
      //         question.hasOwnProperty('choices') && question.choices.length > 0
      //           ? question.choices[0]
      //           : 1
      //       }"
      //       max="${
      //         question.hasOwnProperty('choices') && question.choices.length > 1
      //           ? question.choices[1]
      //           : 5
      //       }"
      //       step="${
      //         question.hasOwnProperty('choices') && question.choices.length > 2
      //           ? question.choices[2]
      //           : '1'
      //       }"
      //     />
      //   </div>
      // </div>`;
      break;

    case 'date':
      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
        <div style="margin-top: 15px" class="div-9">
          <input
            name="${String(question._id)}"
            style="width: 97%; height: 30px; padding: 5px; outline: none"
            type="date"
            min=${
              question.hasOwnProperty('choices') && question.choices.length > 0
                ? question.choices[0]
                : ''
            }
            max=${
              question.hasOwnProperty('choices') && question.choices.length > 1
                ? question.choices[1]
                : ''
            }
          />
        </div>
      </div>`;
      break;

    case 'url':
      markup = `<div
        style="
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          border-color: rgba(0, 0, 0, 1);
          border-width: 1px;
          border-style: solid;
        "
      >
        <div
          style="font-size: 16px; line-height: 20px"
        >
          Q${question.index + 1}. ${question.question} ${
        question.required
          ? '<span style="font-size: 18px; color: #FF0000;">*</span>'
          : ''
      }
        </div>
        <div style="margin-top: 15px" class="div-9">
          <input
            name="${String(question._id)}"
            style="width: 97%; height: 30px; padding: 5px; outline: none"
            placeholder="http://www.abc.com ${
              question.hasOwnProperty('choices') && question.choices.length > 0
                ? `, max length : ${question.choices[0]}`
                : ''
            }"
            type="url"
            maxlength=${
              question.hasOwnProperty('choices') && question.choices.length > 0
                ? question.choices[0]
                : '200'
            }
          />
        </div>
      </div>`;
      break;

    default:
      break;
  }
  return markup;
};

const generateChoicesMarkup = (id, choices, type) => {
  const choicesMarkupArr = choices.map((choice, index) => {
    return `
      <div style="margin-top: 15px; display: flex; align-items: center" class="div-9">
        <input
          style="
            width: 5%;
            height: 18px;
            padding: 5px;
            cursor: pointer;
            margin-right: 10px;
          "
          type="${type}"
          name="${id}"
          id="${id}_${index}"
          value="${choice}"
        />
        <label for="${id}_${index}">${choice}</label>
      </div>
    `;
  });
  return choicesMarkupArr.join(' ');
};

exports.getCampaignMarkup = (opts) => `<html>
  <head>
    <title>${opts.campaign.emailSubject}</title>
  </head>
  <body>
    <center>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
      </style>
      <table
        style="font-family: 'Montserrat', sans-serif"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        align="center"
        valign="top"
      >
        <tbody>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                valign="top"
                bgcolor="#ffffff"
                style="padding: 0 10px !important; max-width: 500px; width: 100%"
              >
                <tbody>
                  <!-- common -->
                  <tr>
                    <td align="center" style="padding: 10px 0 0px 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <!-- the line height propertry is used to set the height of the blue box -->
                            <td
                              valign="middle"
                              bgcolor="#739ffe"
                              style="
                                padding: 0px;
                                color: #111111;
                                font-size: 48px;
                                font-weight: 400;
                                line-height: 60px;
                                padding: 15px;
                              "
                            >
                              <a
                                href="https://feedbackloop-dev.herokuapp.com/"
                                target="_blank"
                                data-saferedirecturl="https://feedbackloop-dev.herokuapp.com/"
                                style="
                                  font-size: 16px;
                                  color: #333;
                                  font-weight: 400;
                                  text-decoration: none;
                                "
                                >FeedbackLoop</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="left"
                              style="
                                padding: 40px 20px 10px;
                                font-size: 32px;
                                font-weight: 400;
                              "
                            >
                              <h1
                                style="
                                  font-style: normal;
                                  font-weight: bold;
                                  font-size: 18px;
                                  color: #3d3d3d;
                                  margin-bottom: 2px;
                                  line-height: 30px;
                                "
                              >
                                ${opts.campaign.emailSubject}
                              </h1>
                              <p style="font-size : 16px; line-height : 24px;">
                                ${opts.campaign.emailContent}
                              </p>
                              <hr
                                style="
                                  width: 30px;
                                  float: left;
                                  height: 1.5px;
                                  background: black;
                                "
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="left"
                              style="
                                padding: 40px 20px 10px;
                                font-size: 32px;
                                font-weight: 400;
                              "
                            >
                              <div
                                style="margin: 20px auto 120px; font-size: 16px"
                                class="div-6"
                              >
                              <!-- continue here -->
                                <form action="${keys.API_ENDPOINT}/campaign/response" method="get">
                                  ${opts.questionsMarkup}
                                  <input type="hidden" name="campaign_id" value="${opts.campaign.campaignId}"/>
                                  <input type="hidden" name="email" value="{%EMAIL%}"/>

                                  <input
                                    style="
                                      display: block;
                                      width: 50%;
                                      padding: 10px 25px;
                                      background-color: #739ffe;
                                      border: none;
                                      margin: 10px auto;
                                      border-radius: 10px;
                                      cursor: pointer;
                                      color: #333;
                                    "
                                    type="submit"
                                    value="Submit"
                                  />
                                </form>
                                <hr style="margin-top: 50px;color: 4b5563;">
                                <div style="margin-top: 20px;">
                                  <p style="font-size : 12px; color: #4b5563;">Unable to submit form? <br><br> First, Please check if you have answered all required questions with a (<span style="font-size: 12px; color: #FF0000;">*</span>) after question.<br><br> Second, Check if all your answers are within the question contraints i.e some questions have limits like minimum and maximum value. If any of your answers are out of limits a message will be shown on the new browser window after you click submit. The message indicates what went wrong. Please make changes accordingly. <br><br>If you are still not able to submit. Sorry. Could you please click the button below.</p>
                                  <a style="text-decoration: none; color: #333  ; padding: 5px 10px; border: 1px solid #8db1ff; font-size : 12px;" href="${keys.WEBSITE_ENDPOINT}/campaign/redirect/{%WEBSITE-LINK%}">Try different way!</a>
                                </div>
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
    </center>
  </body>
</html>`;
