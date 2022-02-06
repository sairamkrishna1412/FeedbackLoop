// const mongoose = require('mongoose');
const validator = require('validator');
// const  = require('../models/userModel');
const Campaign = require('../models/campaignModel');
const Question = require('../models/questionModel');
const CampaignEmail = require('../models/campaignEmailModel');
const Response = require('../models/responseModel');
const Feedback = require('../models/feedbackModel');
const sendMail = require('../services/nodemailer');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const dummyEmail = require('../services/dummyEmail');

exports.checkCampaignOwner = catchAsync(async (req, res, next) => {
  const reqCampaign = await Campaign.findById(req.params.id).lean();

  if (!reqCampaign || String(reqCampaign.user) !== req.user.id) {
    return next(
      new AppError(400, 'No campaign with that id exists in your campaigns')
    );
  }
  req.checkedCampaign = reqCampaign;
  next();
});

exports.newCampaign = catchAsync(async (req, res, next) => {
  const user = req.user;
  req.body.user = user.id;
  let doc;
  // check users existing campaigns and see if campaign name is unique to user acc.
  const userCampaings = await Campaign.find({ id: user.id });

  //this check is for updating campaign base
  if (req.body.hasOwnProperty('_id')) {
    const existingInd = userCampaings.findIndex(
      (camp) => String(camp._id) === req.body._id
    );
    if (existingInd === -1) {
      return next(new AppError(400, 'No campaign with that id found!'));
    }
    doc = await Campaign.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    }).populate('campaignQuestions');
  }
  // this is for creating new campapign
  else {
    const existingCampaignWithSameName = userCampaings.findIndex(
      (camp) => camp.campaignName == req.body.campaignName
    );
    if (existingCampaignWithSameName !== -1) {
      // console.log('this is existing campaign', existingCampaign);
      return next(
        new AppError(
          400,
          'Campaign with that name already exists. Please change the campaign name'
        )
      );
    }
    doc = await Campaign.create(req.body);
  }

  return res.status(201).json({
    success: true,
    data: doc,
  });
});

checkCampaignOwnerWithID = async (campaign_id, user_id) => {
  try {
    const campaign = await Campaign.findById(campaign_id)
      .populate('campaignQuestions')
      .lean();

    // console.log(campaign);
    if (!campaign || String(campaign.user) !== user_id) {
      throw new AppError(400, 'There is no such campaign in your campaigns');
    }
    return campaign;
  } catch (error) {
    throw error;
  }
};

exports.campaignEmails = catchAsync(async (req, res, next) => {
  //check emails
  const { campaign_id: campaign } = req.body;
  const curCampaign = await checkCampaignOwnerWithID(campaign, req.user.id);

  await CampaignEmail.deleteMany({ campaign });

  const dbEmails = [];

  req.body.campaignEmails.forEach((email) => {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: `${email} is not an email. please make changes.`,
      });
    }
    dbEmails.push({ campaign, email, sent: false });
  });

  if (!dbEmails.length) {
    return res.status(400).json({
      success: false,
      message: 'Emails already exist in campaign',
    });
  }

  // total valid emails
  const recipientCount = dbEmails.length;
  //insert emails
  const docs = await CampaignEmail.insertMany(dbEmails);
  curCampaign.campaignEmails = docs;
  //update campaign recipients property
  await Campaign.findByIdAndUpdate(campaign, { recipientCount });

  res.status(200).json({
    success: true,
    results: docs.length,
    data: docs,
    campaign: curCampaign,
  });
});

exports.addtionalCampaignEmails = catchAsync(async (req, res, next) => {
  //check emails
  const { campaign_id: campaign } = req.body;
  const curCampaign = await checkCampaignOwnerWithID(campaign, req.user.id);

  const existingEmails = await CampaignEmail.find({ campaign }).select('email');

  const emailsArr = existingEmails.map((el) => el.email);

  let recipientCount = existingEmails.length;

  const dbEmails = [];
  req.body.campaignEmails.forEach((email) => {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: `${email} is not an email. please make changes.`,
      });
    }
    if (!emailsArr.includes(email)) {
      dbEmails.push({ campaign, email, sent: false });
      recipientCount++;
    }
  });

  if (!dbEmails.length) {
    return res.status(400).json({
      success: false,
      message: 'Emails already exist in campaign',
    });
  }

  //insert emails
  const docs = await CampaignEmail.insertMany(dbEmails);
  //update campaign recipients property
  await Campaign.findByIdAndUpdate(campaign, { recipientCount });

  res.status(200).json({
    success: true,
    results: docs.length,
    data: docs,
    message:
      'Emails already present in campaign have been removed automatically',
  });
});

exports.campaignQuestions = catchAsync(async (req, res, next) => {
  const body = req.body;
  //get campaign_id to which question belongs to.
  const campaign = await Campaign.findById(body.campaign_id);
  if (!campaign) {
    return res.status(400).json({
      success: false,
      message: `Campaign with id : ${body.campaign_id} doesn't exist.`,
    });
  }

  if (campaign.launchedAt || campaign.respondedRecipientCount > 0) {
    return next(
      new AppError(
        400,
        `This campaign is already launched. we cannot make changes now.`
      )
    );
  }

  let campaignQuestions = campaign.campaignQuestions;
  const shouldBeDeletedQuestions = [...campaignQuestions];

  const bodyQuestions = body.questions;
  const noIndexItem = bodyQuestions.find(
    (el) => el.hasOwnProperty('index') === false
  );
  if (noIndexItem) {
    return next(
      new AppError(
        400,
        `Question: ${noIndexItem.question}, has no order(index). Please make changes`
      )
    );
  }

  // create new question doc for each question after successful validation.
  const orderedBodyQuestions = bodyQuestions.sort((a, b) => a.index - b.index);
  // console.log(orderedBodyQuestions);
  const improperIndexItem = orderedBodyQuestions.find((el, index) => {
    if (el.index !== index) {
      return true;
    }
  });

  if (improperIndexItem) {
    return next(
      new AppError(
        400,
        `Question: ${improperIndexItem.question}, has improper order(index). please make changes`
      )
    );
  }

  for (const question of orderedBodyQuestions) {
    const feedbackType = question.type;
    const hasChoices =
      feedbackType === 'checkbox' ||
      feedbackType === 'range' ||
      feedbackType === 'radio' ||
      feedbackType === 'date';

    if (hasChoices) {
      let errorMessage;
      if (
        (feedbackType === 'range' || feedbackType === 'date') &&
        (!question.choices.length || question.choices.length !== 3)
      ) {
        errorMessage = `Question is of type : ${feedbackType}. Choices should be an array of size 3 (start, stop & ${
          'step of the range' ? feedbackType === 'range' : 'default date'
        })`;
      }
      if (feedbackType === 'date') {
        const start = new Date(question.choices[0]);
        const stop = new Date(question.choices[1]);
        const defaultVal = new Date(
          question.choices[2] ? question.choices[2] : question.choices[0]
        );
        if (start > stop) {
          errorMessage = `Question is of type : ${feedbackType}. Start date is before Stop date. Please make changes`;
        }
        if (defaultVal < start || defaultVal > stop) {
          errorMessage = `Question is of type : ${feedbackType}. Default value should lie between ${start} and ${stop}`;
        }
      }
      if (!question.choices.length) {
        errorMessage = `Question is of type : ${feedbackType} but no choices are given.`;
      }
      if (errorMessage) {
        return res.status(400).json({
          success: false,
          message: errorMessage,
        });
      }
    }

    //save question and add choice id to campaignQuestions array;
    if (question.hasOwnProperty('_id')) {
      const existingQuestionInd = shouldBeDeletedQuestions.findIndex(
        (el) => String(el._id) === question._id
      );
      if (existingQuestionInd !== -1) {
        const updateId = shouldBeDeletedQuestions[existingQuestionInd]._id;
        await Question.findByIdAndUpdate(updateId, { ...question });
        shouldBeDeletedQuestions.splice(existingQuestionInd, 1);
      }
    } else {
      console.log('creating question');
      const questionDoc = await Question.create({
        ...question,
      });
      campaignQuestions.push(String(questionDoc.id));
    }
  }
  // console.log(campaignQuestions);
  // console.log(shouldBeDeletedQuestions);
  for (let question of shouldBeDeletedQuestions) {
    await Question.findByIdAndDelete(question);
    const questionIndex = campaignQuestions.findIndex(
      (el) => String(el) === String(question)
    );
    console.log(question, ' ', questionIndex);
    if (questionIndex !== -1) {
      campaignQuestions.splice(questionIndex, 1);
    }
  }
  // console.log(campaignQuestions);
  // update campaign questions property of campaign.
  campaign.campaignQuestions = campaignQuestions;
  await campaign.save();
  const updatedCampaign = await Campaign.populate(campaign, {
    path: 'campaignQuestions',
  });

  // console.log(updatedCampaign);

  res.status(200).json({
    success: true,
    data: updatedCampaign,
  });
});

exports.getCampaign = catchAsync(async (req, res, next) => {
  // get one campaign
  const reqCampaign = await Campaign.findById(req.params.id)
    .populate('campaignQuestions')
    .lean();

  if (!reqCampaign || String(reqCampaign.user) !== req.user.id) {
    return next(
      new AppError(400, 'No campaign with that id exists in your campaigns')
    );
  }

  const campaignEmails = await CampaignEmail.find({
    campaign: req.params.id,
  }).select('email sent');

  reqCampaign.campaignEmails = campaignEmails;

  return res.status(200).json({
    success: true,
    data: reqCampaign,
  });
});

exports.myCampaigns = catchAsync(async (req, res, next) => {
  // get my campaigns
  const campaigns = await Campaign.find({ user: req.user.id })
    .populate('campaignQuestions')
    .lean();

  return res.status(200).json({
    success: true,
    results: campaigns.length,
    data: campaigns,
  });
});

exports.updateCampaign = catchAsync(async (req, res, next) => {
  const { body } = req;
  const campaign = await Campaign.findById(req.params.id);

  if (body.campaignEmails && body.campaignEmails.length) {
    body.campaignEmails.forEach((email) => {
      if (!validator.isEmail(email)) {
        return next(
          new AppError(400, `${email} is not an email. please make changes.`)
        );
      }
      campaign.campaignEmails.push({ email, sent: false });
    });
  }
  //delete un-updatable fields in campaign for now. (so these are the fields that cannot be directly updated as they delete the existing emails and questions in the campaign)
  const discardProps = ['campaignEmails', 'campaignQuestions'];
  discardProps.forEach((el) => {
    if (body.hasOwnProperty(el)) {
      delete body[el];
    }
  });

  for (const prop in body) {
    campaign[prop] = body[prop];
  }

  const updatedDoc = await campaign.save();
  // const updatedDoc = await Campaign.findByIdAndUpdate(
  //   req.params.id,
  //   req.body,
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  res.status(200).json({
    success: true,
    data: updatedDoc,
  });
});

exports.deleteCampaign = catchAsync(async (req, res, next) => {
  // we need to delete feedbacks, responses, [respondedRecipientCount, lastFeedback] in campaign, [sent] in campaign emails, campaign doc;
  const campaign = req.checkedCampaign;
  campaign.campaignQuestions.forEach(async (id) => {
    await Question.findByIdAndDelete(id);
  });
  await CampaignEmail.deleteMany({ campaign: campaign._id });
  await Feedback.deleteMany({ campaign: campaign._id });
  await Response.deleteMany({ campaign: campaign._id });
  await Campaign.findByIdAndDelete(campaign._id);

  res.status(204).json({
    success: true,
    message: `Campaign : ${campaign.campaignName} is deleted successfully.`,
  });
});

exports.clearResponses = catchAsync(async (req, res, next) => {
  // we need to delete feedbacks, responses, [respondedRecipientCount, lastFeedback] in campaign, [sent] in campaign emails;
  const campaign = req.checkedCampaign;
  await Feedback.deleteMany({ campaign: campaign._id });
  await Response.deleteMany({ campaign: campaign._id });
  await Campaign.findByIdAndUpdate(campaign._id, {
    respondedRecipientCount: 0,
    lastFeedback: null,
  });
  await CampaignEmail.updateMany(
    { campaign: campaign._id },
    { $set: { sent: false } }
  );
  res.status(204).json({
    success: true,
    message: `Campaign : ${campaign.campaignName}'s data is deleted successfully.'`,
  });
});

exports.launchCampaign = catchAsync(async (req, res, next) => {
  //get campaign
  const { campaign_id } = req.body;
  // console.log(campaign_id);
  // here unable to get correct campaign if findOne({id : campaign_id}) is used, for me waddup campaign is returned irrespective of campaign_id in req.body;
  const campaign = await Campaign.findById(campaign_id).populate(
    'campaignQuestions'
  );
  // console.log(campaign);
  if (!campaign) {
    return next(new AppError(400, 'Campaign not found.'));
  }

  if (!campaign || String(campaign.user) !== req.user.id) {
    throw new AppError(400, 'There is no such campaign in your campaigns');
  }

  //find associated emails
  const emails = await CampaignEmail.find({
    campaign: campaign_id,
    sent: false,
  }).select('email');

  // console.log(emails);
  const emailsArr = emails.map((emailObj) => emailObj.email);

  const from = `${req.user.email}`;
  const to = emailsArr;
  const subject = campaign.emailSubject;
  // const html = `<p>${campaign.emailContent}</p>`;
  const html = `${dummyEmail}`;

  const mailSent = await sendMail(from, to, subject, html);
  if (!mailSent) {
    return next(new AppError(500, 'Something went wrong'));
  }

  campaign.launchedAt = Date.now();
  await campaign.save();
  console.log(campaign);
  //send nodemail emails
  res.status(200).json({
    success: true,
    data: campaign.launchedAt,
    message: 'Mails were succesfully sent.',
  });
});

exports.response = catchAsync(async (req, res) => {
  //get campaign mails
  const { body } = req;
  const campaignEmails = await CampaignEmail.find({
    campaign: body.campaign_id,
  });

  //check if user trying to submit form exists in the campaign mails
  const feedbackUser = campaignEmails.find((el) => el.email === body.email);

  if (!feedbackUser) {
    return res.status(400).json({
      success: false,
      message: 'This mail is not eligible for feedback!',
    });
  }

  //check if or not this is users first submission (if not send message stating response for this mail already recorded)
  if (feedbackUser.sent) {
    return res.status(400).json({
      success: false,
      message: 'Feedback from this mail is already received!',
    });
  }

  //get campaign and questions
  const campaign = await Campaign.findById(body.campaign_id).populate(
    'campaignQuestions'
  );
  const questions = campaign.campaignQuestions;

  const responses = [];

  // store answer for each question
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const { type } = question;
    if (body.hasOwnProperty(question.id)) {
      // make checks for questions with choices
      const answer = [];
      if (
        type == 'checkbox' ||
        type == 'range' ||
        type == 'radio' ||
        type == 'date'
      ) {
        let questionResponse = body[question.id];
        if (type === 'range') {
          questionResponse = parseInt(questionResponse);
          if (
            questionResponse < question.choices[0] ||
            questionResponse > question.choices[1]
          ) {
            return res.status(400).json({
              success: false,
              message: `Answer for question : ${question.question} is out of range. Enter between (${question.choices[0]} - ${question.choices[0]})`,
            });
          }

          answer.push(String(questionResponse));
        } else if (type == 'radio') {
          if (!question.choices.find((el) => el === questionResponse)) {
            return res.status(400).json({
              success: false,
              message: `Answer for question : ${question.question} is invalid. Choose from ${question.choices}`,
            });
          }
          if (questionResponse.split().length > 1) {
            return res.status(400).json({
              success: false,
              message: `Question : ${question.question} is of type radio. Select one option only`,
            });
          }

          answer.push(String(questionResponse));
        } else if (type == 'checkbox') {
          questionResponse.forEach((el) => {
            el = String(el);
            if (question.choices.includes(el)) {
              answer.push(el);
            }
          });
        } else {
          // this is for type == date
          if (
            questionResponse < question.choices[0] ||
            questionResponse > question.choices[1]
          ) {
            return res.status(400).json({
              success: false,
              message: `Answer for question : ${question.question} is out of range. Enter between (${question.choices[0]} - ${question.choices[0]})`,
            });
          }

          answer.push(String(questionResponse));
        }
      } else {
        answer.push(String(body[question.id]));
      }
      // console.log(i);
      // create response for each question
      const response = await Response.create({
        answer,
        campaign: body.campaign_id,
        question: question.id,
      });
      responses.push(String(response.id));
    } else if (question.required) {
      return res.status(400).json({
        success: false,
        message: `${question.question} is a required question`,
      });
    }
  }

  // create a feedback doc to store all responses of questions. One whole form will have 1 feedback doc and "n" responses for "n" quesitons in form.
  const feedback = await Feedback.create({
    email: body.email,
    campaign: String(body.campaign_id),
    responses,
  });

  // update sent prop of campaignEmail doc
  await CampaignEmail.updateOne(
    { email: body.email, campaign: body.campaign_id },
    { sent: true }
  );

  // increase responded recipientCount;
  campaign.respondedRecipientCount += 1;
  campaign.lastFeedback = new Date();
  await campaign.save();

  res.status(200).json({
    success: true,
    data: feedback,
    message: 'Thank you, your feedback is valuable for us!',
  });
  // you can run others here
  //on the request body we will need (campaign_id, <foreach question we will need question_id>, email_id)
});

exports.getResponses = catchAsync(async (req, res) => {
  // get responses of that campaign
  const responses = await Response.find({ campaign: req.params.id });
  const results = responses.length ? responses.length : 0;
  res.status(200).json({
    success: true,
    results,
    data: responses,
  });
});

exports.getSummary = catchAsync(async (req, res) => {
  // get campaign
  const campaign = await Campaign.findById(req.params.id)
    .populate('campaignQuestions')
    .lean();

  // get reponses for that campaign
  const campaignResponses = await Response.find({
    campaign: req.params.id,
  }).lean();
  campaign.responses = campaignResponses;
  const questionCount = campaign.campaignQuestions.length;

  //generate summary
  // let start = Date.now();
  const summaryObj = {};
  for (let i = 0; i < questionCount; i++) {
    const question = campaign.campaignQuestions[i];
    const questionResponses = campaignResponses.filter(
      (el) => String(el.question) === String(question._id)
    );
    console.log(questionResponses);
    const stats = calcSummary(question, questionResponses);
    summaryObj[question._id] = stats;
  }
  // console.log('Time elapsed : ', (Date.now() - start) / 1000);

  res.status(200).json({
    success: true,
    data: summaryObj,
  });
});

const calcSummary = (question, responses) => {
  //takes a question and its corresponding responses to generate summary for it
  const summary = { ...question };
  delete summary._id;
  delete summary.__v;
  stats = {};

  // for type = number
  if (question.type === 'number') {
    let max = (min = parseInt(responses[0].answer));
    let sum = 0,
      valCounts = {};

    valCounts[responses[0].answer] = 1;
    for (let i = 1; i < responses.length; i++) {
      const val = parseInt(responses[i].answer);
      max = Math.max(max, val);
      min = Math.min(min, val);
      sum += val;

      if (Object.keys(valCounts).length <= 100) {
        if (!valCounts.hasOwnProperty(val)) {
          valCounts[val] = 1;
        } else {
          valCounts[val] += 1;
        }
      } else {
        valCounts = {};
      }
    }

    stats.max = max;
    stats.min = min;
    stats.average = sum / responses.length;

    let valCountKeys = Object.keys(valCounts);

    valCountKeys.sort((a, b) => {
      return valCounts[a] - valCounts[b];
    });

    stats.valCountOrdered = valCountKeys;
    stats.valCounts = valCounts;
  }

  // for type = range, checkbox, radio
  else if (
    question.type === 'range' ||
    question.type === 'checkbox' ||
    question.type === 'radio'
  ) {
    let responsesArr = [];
    for (let i = 0; i < responses.length; i++) {
      const answers = responses[i].answer;
      responsesArr = responsesArr.concat(answers);
    }
    const valCountsAndOrder = calcValCountsAndOrder(
      responsesArr,
      responses.length
    );
    stats.valCounts = valCountsAndOrder[0];
    stats.valCountOrdered = valCountsAndOrder[1];
  }

  // for type = date
  else if (question.type === 'date') {
    const daysGap =
      (new Date(question.choices[1]).getTime() -
        new Date(question.choices[0]).getTime()) /
      (1000 * 60 * 60 * 24);
    //we will calculate for max days gap of 370 days
    if (daysGap < 370) {
      let responsesArr = [];
      for (let i = 0; i < responses.length; i++) {
        const answers = responses[i].answer;
        responsesArr = responsesArr.concat(answers);
      }
      const valCountsAndOrder = calcValCountsAndOrder(
        responsesArr,
        responses.length
      );
      stats.valCountOrdered = valCountsAndOrder[0];
      stats.valCounts = valCountsAndOrder[1];
    }
  }

  // for type = text
  else if (question.type === 'text') {
    const valCounts = {};
    for (let i = 0; i < responses.length; i++) {
      // const response = String(responses[i].answer);
      let responseArr = String(responses[i].answer).split(' ');
      responseArr = responseArr.filter((el) => el.length > 4);

      if (responseArr.length > 40) {
        responseArr = responseArr.slice(20).concat(responseArr.slice(-20));
      }

      responseArr.forEach((str) => {
        if (!valCounts.hasOwnProperty(str)) {
          valCounts[str] = 1;
        } else {
          valCounts[str] += 1;
        }
      });
    }
    let valCountKeys = Object.keys(valCounts);
    valCountKeys.sort((a, b) => {
      return valCounts[a] - valCounts[b];
    });

    stats.orderValCounts = valCountKeys;
    stats.valCounts = valCounts;
  }
  return stats;
};

const calcValCountsAndOrder = (responsesArr, responesCount = 0) => {
  const valCounts = {};
  for (let i = 0; i < responsesArr.length; i++) {
    const val = responsesArr[i];
    if (!valCounts.hasOwnProperty(val)) {
      valCounts[val] = 1;
    } else {
      valCounts[val] += 1;
    }
  }
  let valCountKeys = Object.keys(valCounts);

  valCountKeys.sort((a, b) => {
    return valCounts[a] - valCounts[b];
  });
  return [valCounts, valCountKeys];
};

// const calcValCountsAndOrder = (responses) => {
//   const valCounts = {};
//   for (let i = 0; i < responses.length; i++) {
//     const val = responses[i].answer;
//     if (!valCounts.hasOwnProperty(val)) {
//       valCounts[val] = 1;
//     } else {
//       valCounts[val] += 1;
//     }
//   }

//   let valCountKeys = Object.keys(valCounts);

//   // console.log(valCountKeys);
//   valCountKeys.sort((a, b) => {
//     return valCounts[a] - valCounts[b];
//   });
//   // console.log(valCountKeys);
//   return [valCounts, valCountKeys];
// };

const orderValCounts = (valCounts) => {
  let valCountKeys = Object.keys(valCounts);
  const n = valCountKeys.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i; j++) {
      const valCountA = valCounts[valCountKeys[j]];
      const valCountB = valCounts[valCountKeys[j + 1]];
      if (valCountA > valCountB) {
        const temp = valCountKeys[j];
        valCountKeys[j] = valCountKeys[j + 1];
        valCountKeys[j + 1] = temp;
      }
    }
  }

  return valCountKeys;
};
