const validator = require("validator");
const Campaign = require("../models/campaignModel");
const Question = require("../models/questionModel");
const CampaignEmail = require("../models/campaignEmailModel");
const Response = require("../models/responseModel");
const Feedback = require("../models/feedbackModel");
const sendMail = require("../services/nodemailer");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const createForm = require("../services/createForm");
const Cipher = require("../services/Cipher");

exports.checkCampaignOwner = catchAsync(async (req, res, next) => {
  let campaignId;
  if (req.params.id) {
    campaignId = req.params.id;
  } else if (
    req.body?.campaign_id ||
    req.body?.campaign ||
    req.body?.campaignId
  ) {
    campaignId =
      req.body?.campaign_id ||
      req.body?.campaign?._id ||
      req.body?.campaign?.campaign_id ||
      req.body.campaignId;
  }
  const reqCampaign = await Campaign.findById(campaignId).lean();

  if (!reqCampaign || String(reqCampaign.user) !== req.user.id) {
    return next(
      new AppError(400, "No campaign with that id exists in your campaigns")
    );
  }

  req.checkedCampaign = reqCampaign;
  next();
});

exports.newCampaign = catchAsync(async (req, res, next) => {
  const user = req.user;
  req.body.user = user.id;
  let doc;

  /* check users existing campaigns and see if campaign name is unique to user acc. */
  const userCampaings = await Campaign.find({ id: user.id });

  /* this check is for updating campaign base */
  if (req.body.hasOwnProperty("_id")) {
    const existingInd = userCampaings.findIndex(
      (camp) => String(camp._id) === req.body._id
    );

    if (existingInd === -1) {
      return next(new AppError(400, "No campaign with that id found!"));
    }

    doc = await Campaign.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    }).populate("campaignQuestions");
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
          "Campaign with that name already exists. Please change the campaign name"
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
      .populate("campaignQuestions")
      .lean();

    // console.log(campaign);
    if (!campaign || String(campaign.user) !== user_id) {
      throw new AppError(400, "There is no such campaign in your campaigns");
    }
    return campaign;
  } catch (error) {
    throw error;
  }
};

exports.checkUserFeedback = catchAsync(async (req, res, next) => {
  const { campaign_id: campaign, email } = req.body;
  const user = await CampaignEmail.findOne({ campaign, email });
  if (!user) {
    return next(new AppError(400, "Feedback still pending. please try again!"));
  }
  if (!user.sent) {
    return next(new AppError(400, "Feedback still pending. please try again!"));
  }
  return res.status(200).json({
    success: true,
    message: "",
  });
});

exports.campaignEmails = catchAsync(async (req, res, next) => {
  //check emails
  const { campaign_id: campaign } = req.body;
  const curCampaign = await checkCampaignOwnerWithID(campaign, req.user.id);

  curCampaign.campaignQuestions = curCampaign.campaignQuestions.sort(
    (a, b) => a.index - b.index
  );

  await CampaignEmail.deleteMany({ campaign });

  const dbEmails = [];

  req.body.campaignEmails.forEach((email) => {
    if (!validator.isEmail(email)) {
      return next(
        new AppError(400, `${email} is not an email. please make changes.`)
      );
    }
    dbEmails.push({ campaign, email, sent: false });
  });

  if (!dbEmails.length) {
    return res.status(400).json({
      success: false,
      message: "Emails already exist in campaign",
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

exports.sendMoreEmails = catchAsync(async (req, res, next) => {
  //check emails
  const { campaignId, campaignEmails } = req.body;
  const campaign = await Campaign.findById(campaignId).populate(
    "campaignQuestions"
  );
  const existingEmails = await CampaignEmail.find({
    campaign: campaignId,
  }).select("email");

  const emailsArr = existingEmails.map((el) => el.email);

  const newEmails = [];
  const resendEmails = [];
  campaignEmails.forEach((email) => {
    if (!validator.isEmail(email)) {
      return next(
        new AppError(400, `${email} is not an email. please make changes.`)
      );
    }

    //start here
    if (!emailsArr.includes(email)) {
      newEmails.push({ campaign, email, sent: false });
    } else {
      resendEmails.push(email);
    }
  });

  if (!newEmails.length && !resendEmails.length) {
    return next(new AppError(400, "Emails already exist in campaign"));
  }

  //insert emails
  const docs = await CampaignEmail.insertMany(newEmails);
  const addedMails = docs.map((e) => e.email);
  const unAddedMails = campaignEmails.filter((e) => !addedMails.includes(e));

  //update resend email
  const modifiedData = await CampaignEmail.updateMany(
    {
      $and: [
        {
          campaign: campaignId,
          $expr: {
            $in: ["$email", [...resendEmails]],
          },
        },
      ],
    },
    {
      $set: {
        sent: false,
      },
    }
  );

  console.log(modifiedData);

  const { unSentMails, sentMails } = await sendMails(
    `${req.user.email}`,
    campaign,
    [...addedMails, ...resendEmails]
  );

  if (unSentMails.length) {
    //previously sent emails should not be deleted.
    const shouldDeleteMails = unSentMails.filter(
      (mail) => !resendEmails.includes(mail)
    );
    await CampaignEmail.deleteMany({
      campaign: campaign._id,
      email: {
        $in: [...shouldDeleteMails],
      },
    });
  }

  if (
    unSentMails.length > 0 &&
    unSentMails.length === addedMails.length + resendEmails.length
  ) {
    // this either means error sending mails or means all emails have sent their response (see line 473-476)
    return next(
      new AppError(
        500,
        "Could not send any mails, something went wrong. please try again."
      )
    );
  }

  campaign.recipientCount =
    campaign.recipientCount + (addedMails.length - unSentMails.length);
  await campaign.save();
  // console.log(campaign);

  res.status(200).json({
    success: true,
    data: { campaign, addedMails, unAddedMails, sentMails, unSentMails },
    message: "Mails sent!",
  });
});

exports.campaignQuestions = catchAsync(async (req, res, next) => {
  const body = req.body;

  //get campaign_id to which question belongs to.
  const campaign = await Campaign.findById(body.campaign_id);

  if (!campaign) {
    return next(
      new AppError(400, `Campaign with id : ${body.campaign_id} doesn't exist.`)
    );
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
    (el) => el.hasOwnProperty("index") === false
  );
  if (noIndexItem) {
    return next(
      new AppError(
        400,
        `Question: ${noIndexItem.question}, has no order(index). Please make changes`
      )
    );
  }
  // console.log(bodyQuestions);

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
      feedbackType === "checkbox" ||
      feedbackType === "range" ||
      feedbackType === "radio" ||
      feedbackType === "date" ||
      feedbackType === "number";

    if (hasChoices) {
      let errorMessage;
      if (
        feedbackType === "range" &&
        (!question.choices.length || question.choices.length !== 3)
      ) {
        errorMessage = `Question is of type : ${feedbackType}. Choices should be an array of size 3 (start, stop & step of the range)`;
      }

      if (feedbackType === "date") {
        const start = new Date(question.choices[0]);
        const stop = new Date(question.choices[1]);
        if (start > stop) {
          errorMessage = `Question is of type : ${feedbackType}. Start date is before Stop date. Please make changes`;
        }
      }

      if (
        feedbackType === "number" &&
        (!question.choices.length || question.choices.length !== 2)
      ) {
        errorMessage = `Question is of type : ${feedbackType}. Limits should be an array of size 2 (min & max values allowed)`;
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
    if (question.hasOwnProperty("_id")) {
      const existingQuestionInd = shouldBeDeletedQuestions.findIndex(
        (el) => String(el._id) === question._id
      );

      if (existingQuestionInd !== -1) {
        const updateId = shouldBeDeletedQuestions[existingQuestionInd]._id;
        if (question.hasOwnProperty("isUpdated") && question.isUpdated) {
          await Question.findByIdAndUpdate(updateId, {
            ...question,
          });
        }
        shouldBeDeletedQuestions.splice(existingQuestionInd, 1);
      }
    } else {
      // console.log('creating question');
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

    // console.log(question, ' ', questionIndex);
    if (questionIndex !== -1) {
      campaignQuestions.splice(questionIndex, 1);
    }
  }

  // console.log(campaignQuestions);

  // update campaign questions property of campaign.
  campaign.campaignQuestions = campaignQuestions;
  await campaign.save();

  const updatedCampaign = await Campaign.populate(campaign, {
    path: "campaignQuestions",
  });
  updatedCampaign.toObject();

  updatedCampaign.campaignQuestions = updatedCampaign.campaignQuestions.sort(
    (a, b) => a.index - b.index
  );
  // console.log(updatedCampaign.campaignQuestions);

  res.status(200).json({
    success: true,
    data: updatedCampaign,
  });
});

exports.getCampaign = catchAsync(async (req, res, next) => {
  // get one campaign
  const reqCampaign = await Campaign.findById(req.params.id)
    .populate("campaignQuestions")
    .lean();

  reqCampaign.campaignQuestions = reqCampaign.campaignQuestions.sort(
    (a, b) => a.index - b.index
  );

  if (!reqCampaign || String(reqCampaign.user) !== req.user.id) {
    return next(
      new AppError(400, "No campaign with that id exists in your campaigns")
    );
  }

  const campaignEmails = await CampaignEmail.find({
    campaign: req.params.id,
  }).select("email sent");
  reqCampaign.campaignEmails = campaignEmails;

  return res.status(200).json({
    success: true,
    data: reqCampaign,
  });
});

exports.myCampaigns = catchAsync(async (req, res, next) => {
  // get my campaigns
  const campaigns = await Campaign.find({ user: req.user.id })
    .populate("campaignQuestions")
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

  /*  
    delete un-updatable fields in campaign for now. 
    (so these are the fields that cannot be directly updated as 
    they delete the existing emails and questions in the campaign) 
  */
  const discardProps = ["campaignEmails", "campaignQuestions"];
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
  /* 
    we need to delete feedbacks, responses, 
    [respondedRecipientCount, lastFeedback] in campaign,
    [sent] in campaign emails, campaign doc;
  */
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
  /* 
    we need to delete feedbacks, responses,
    [respondedRecipientCount, lastFeedback] 
    in campaign, [sent] in campaign emails; 
  */
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
  /* get campaign */
  const { campaign_id } = req.body;
  // console.log(campaign_id);

  /* 
    here unable to get correct campaign if findOne({id : campaign_id})
    is used, for me waddup campaign is returned irrespective of 
    campaign_id in req.body; 
  */
  const campaign = await Campaign.findById(campaign_id).populate(
    "campaignQuestions"
  );
  // console.log(campaign);

  if (!campaign) {
    return next(new AppError(400, "Campaign not found."));
  }

  if (!campaign || String(campaign.user) !== req.user.id) {
    throw new AppError(400, "There is no such campaign in your campaigns");
  }

  //find associated emails
  const emails = await CampaignEmail.find({
    campaign: campaign_id,
    sent: false,
  }).select("email");
  // console.log(emails);

  const emailsArr = emails.map((emailObj) => emailObj.email);
  if (emailsArr.length === 0) {
    return next(new AppError(400, "No emails found"));
  }

  const { unSentMails, sentMails } = await sendMails(
    `${req.user.email}`,
    campaign,
    emailsArr
  );

  // this either means error sending mails or means all emails have sent their response (see line 473-476)
  if (unSentMails.length === emailsArr.length) {
    return next(
      new AppError(
        500,
        "Could not send mails, something went wrong. please try again."
      )
    );
  }

  campaign.recipientCount = emailsArr.length - unSentMails.length;
  campaign.launchedAt = Date.now();
  await campaign.save();
  // console.log(campaign);

  res.status(200).json({
    success: true,
    data: { launchedAt: campaign.launchedAt, sentMails, unSentMails },
    message: "Mails were succesfully sent.",
  });
});

const encodeQueryStr = (campaign, email, success, message) => {
  const queryStr = `?campaign=${campaign}&email=${email}&success=${success}&message=${message}`;
  return Cipher.encrypt(queryStr);
};

const encodeEmailFeedbackLink = (campaign, email) => {
  const queryStr = `{"campaign":"${campaign}", "email": "${email}"}`;
  return Cipher.encrypt(queryStr);
};

exports.decodeQuery = (req, res, next) => {
  try {
    const { cipher } = req.body;
    const str = Cipher.decrypt(cipher);

    return res.status(200).json({
      success: true,
      data: str,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

exports.decodeUser = catchAsync(async (req, res, next) => {
  try {
    const { cipher } = req.body;
    let obj = Cipher.decrypt(cipher);
    obj = JSON.parse(obj);
    if (!obj.hasOwnProperty("campaign") || !obj.hasOwnProperty("email")) {
      return next(new AppError(400, "Malformed URL"));
    }
    const campaign = await Campaign.findById(obj.campaign).populate(
      "campaignQuestions"
    );

    if (!campaign) {
      return next(new AppError(400, "No campaign exists with that ID."));
    }

    return res.status(200).json({
      success: true,
      data: { user: obj.email, campaign },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

exports.response = async (req, res) => {
  try {
    //get campaign mails
    const { body } = req;
    const campaign_id = body.campaign_id;
    const email = body.email;

    let message;
    let queryStr;
    // console.log('received!!!');
    // console.log(body);

    const campaignEmails = await CampaignEmail.find({
      campaign: body.campaign_id,
    });

    /* check if user trying to submit form exists in the campaign mails */
    const feedbackUser = campaignEmails.find((el) => el.email === body.email);
    if (!feedbackUser) {
      // return res.status(400).json({
      //   success: false,
      //   message: 'This mail is not eligible for feedback!',
      // });
      message = `Feedback from this mail not yet received`;
      queryStr = encodeQueryStr(campaign_id, email, false, message);
      return res.redirect(`/campaign/response/${queryStr}`);
    }

    /* check if or not this is users first submission (if not send message stating response for this mail already recorded) */
    if (feedbackUser.sent) {
      // res.status(400).json({
      //   success: false,
      //   message: 'Feedback from this mail is already received!',
      // });
      message = `Feedback from this mail is already received.\nThank you!`;
      queryStr = encodeQueryStr(campaign_id, email, true, message);
      return res.redirect(`/campaign/response/${queryStr}`);
    }

    /* get campaign and questions */
    const campaign = await Campaign.findById(body.campaign_id).populate(
      "campaignQuestions"
    );
    const questions = campaign.campaignQuestions;

    /* store answer for each question */
    const responses = [];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const { type } = question;

      if (body.hasOwnProperty(question.id) && body[question.id] !== "") {
        /* make checks for questions with choices */
        const answer = [];

        if (
          type == "checkbox" ||
          type == "range" ||
          type == "radio" ||
          type == "number" ||
          type == "date"
        ) {
          let questionResponse = body[question.id];

          // range
          if (type === "range") {
            questionResponse = parseInt(questionResponse);

            if (
              questionResponse < question.choices[0] ||
              questionResponse > question.choices[1]
            ) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Answer for question : ${question.question} is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`,
              // });
              message = `Answer for question : "${question.question}" is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }
            answer.push(String(questionResponse));
          }

          // radio
          else if (type == "radio") {
            if (!question.choices.find((el) => el === questionResponse)) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Answer for question : ${question.question} is invalid. Choose from ${question.choices}`,
              // });
              message = `Answer for question : "${question.question}" is invalid. Choose from ${question.choices}`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }

            if (questionResponse.split().length > 1) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Question : ${question.question} is of type radio. Select one option only`,
              // });
              message = `Question : "${question.question}" is of type radio. Select one option only`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }

            answer.push(String(questionResponse));
          }

          // checkbox
          else if (type == "checkbox") {
            if (
              typeof questionResponse === "string" ||
              questionResponse instanceof String
            ) {
              questionResponse = [questionResponse];
            }

            questionResponse.forEach((el) => {
              el = String(el);
              if (question.choices.includes(el)) {
                answer.push(el);
              }
            });
          }

          // number
          else if (type === "number") {
            questionResponse = parseInt(questionResponse);

            if (
              question.choices.length === 2 &&
              (questionResponse < question.choices[0] ||
                questionResponse > question.choices[1])
            ) {
              message = `Answer for question : "${question.question}" is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }
            answer.push(String(questionResponse));
          }

          // date
          else {
            if (
              questionResponse < question.choices[0] ||
              questionResponse > question.choices[1]
            ) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Answer for question : ${question.question} is out of range. Enter between (${question.choices[0]} - ${question.choices[0]})`,
              // });
              message = `Answer for question : "${question.question}" is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }

            answer.push(String(questionResponse));
          }
        } else {
          answer.push(String(body[question.id]));
        }

        // create response for each question
        const response = await Response.create({
          answer,
          campaign: body.campaign_id,
          question: question.id,
        });
        responses.push(String(response.id));
      } else if (question.required) {
        // return res.status(400).json({
        //   success: false,
        //   message: `${question.question} is a required question`,
        // });
        message = `Question : "${question.question}" is a required question`;
        queryStr = encodeQueryStr(campaign_id, email, false, message);
        return res.redirect(`/campaign/response/${queryStr}`);
      }
    }

    /* 
      create a feedback doc to store all responses of questions. One whole 
      form will have 1 feedback doc and "n" responses for "n" quesitons in form.
    */
    const feedback = await Feedback.create({
      email: body.email,
      campaign: String(body.campaign_id),
      responses,
    });

    /* update sent prop of campaignEmail doc */
    await CampaignEmail.updateOne(
      { email: body.email, campaign: body.campaign_id },
      { sent: true }
    );

    /* increase responded recipientCount; */
    campaign.respondedRecipientCount += 1;
    campaign.lastFeedback = new Date();
    await campaign.save();

    // res.status(200).json({
    //   success: true,
    //   data: feedback,
    //   message: 'Thank you, your feedback is valuable for us!',
    // });
    message = `Thank You for your valuable feedback!`;
    queryStr = encodeQueryStr(campaign_id, email, true, message);
    return res.redirect(`/campaign/response/${queryStr}`);

    // res.redirect(
    //   `/campaign/response?email=${email}&campaign=${body.campaign_id}&success=true`
    // );
    // you can run others here
    //on the request body we will need (campaign_id, <foreach question we will need question_id>, email_id)
  } catch (error) {
    console.log(error);
    const message = `?message=Sorry, Something went wrong.`;
    const queryStr = Cipher.encrypt(message);
    return res.redirect(`/campaign/response/${queryStr}`);
  }
};

exports.responseGet = catchAsync(async (req, res) => {
  try {
    //get campaign mails
    const body = req.query;
    const campaign_id = body.campaign_id;
    const email = body.email;

    let message;
    let queryStr;
    // console.log('received!!!');
    // console.log(body);

    const campaignEmails = await CampaignEmail.find({
      campaign: body.campaign_id,
    });

    /* check if user trying to submit form exists in the campaign mails */
    const feedbackUser = campaignEmails.find((el) => el.email === body.email);
    if (!feedbackUser) {
      // return res.status(400).json({
      //   success: false,
      //   message: 'This mail is not eligible for feedback!',
      // });
      message = `Feedback from this mail not yet received`;
      queryStr = encodeQueryStr(campaign_id, email, false, message);
      return res.redirect(`/campaign/response/${queryStr}`);
    }

    /* check if or not this is users first submission (if not send message stating response for this mail already recorded) */
    if (feedbackUser.sent) {
      // res.status(400).json({
      //   success: false,
      //   message: 'Feedback from this mail is already received!',
      // });
      message = `Feedback from this mail is already received.\nThank you!`;
      queryStr = encodeQueryStr(campaign_id, email, true, message);
      return res.redirect(`/campaign/response/${queryStr}`);
    }

    /* get campaign and questions */
    const campaign = await Campaign.findById(body.campaign_id).populate(
      "campaignQuestions"
    );
    const questions = campaign.campaignQuestions;

    /* store answer for each question */
    const responses = [];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const { type } = question;

      if (body.hasOwnProperty(question.id) && body[question.id] !== "") {
        /* make checks for questions with choices */
        const answer = [];

        if (
          type == "checkbox" ||
          type == "range" ||
          type == "radio" ||
          type == "number" ||
          type == "date"
        ) {
          let questionResponse = body[question.id];

          // range
          if (type === "range") {
            questionResponse = parseInt(questionResponse);

            if (
              questionResponse < question.choices[0] ||
              questionResponse > question.choices[1]
            ) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Answer for question : ${question.question} is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`,
              // });
              message = `Answer for question : "${question.question}" is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }
            answer.push(String(questionResponse));
          }

          // radio
          else if (type == "radio") {
            if (!question.choices.find((el) => el === questionResponse)) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Answer for question : ${question.question} is invalid. Choose from ${question.choices}`,
              // });
              message = `Answer for question : "${question.question}" is invalid. Choose from ${question.choices}`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }

            if (questionResponse.split().length > 1) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Question : ${question.question} is of type radio. Select one option only`,
              // });
              message = `Question : "${question.question}" is of type radio. Select one option only`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }

            answer.push(String(questionResponse));
          }

          // checkbox
          else if (type == "checkbox") {
            if (
              typeof questionResponse === "string" ||
              questionResponse instanceof String
            ) {
              questionResponse = [questionResponse];
            }

            questionResponse.forEach((el) => {
              el = String(el);
              if (question.choices.includes(el)) {
                answer.push(el);
              }
            });
          }

          // number
          else if (type === "number") {
            questionResponse = parseInt(questionResponse);

            if (
              question.choices.length === 2 &&
              (questionResponse < question.choices[0] ||
                questionResponse > question.choices[1])
            ) {
              message = `Answer for question : "${question.question}" is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }
            answer.push(String(questionResponse));
          }

          // date
          else {
            if (
              questionResponse < question.choices[0] ||
              questionResponse > question.choices[1]
            ) {
              // return res.status(400).json({
              //   success: false,
              //   message: `Answer for question : ${question.question} is out of range. Enter between (${question.choices[0]} - ${question.choices[0]})`,
              // });
              message = `Answer for question : "${question.question}" is out of range. Enter between (${question.choices[0]} - ${question.choices[1]})`;
              queryStr = encodeQueryStr(campaign_id, email, false, message);
              return res.redirect(`/campaign/response/${queryStr}`);
            }

            answer.push(String(questionResponse));
          }
        } else {
          answer.push(String(body[question.id]));
        }

        // create response for each question
        const response = await Response.create({
          answer,
          campaign: body.campaign_id,
          question: question.id,
        });
        responses.push(String(response.id));
      } else if (question.required) {
        // return res.status(400).json({
        //   success: false,
        //   message: `${question.question} is a required question`,
        // });
        message = `Question : "${question.question}" is a required question`;
        queryStr = encodeQueryStr(campaign_id, email, false, message);
        return res.redirect(`/campaign/response/${queryStr}`);
      }
    }

    /* 
      create a feedback doc to store all responses of questions. One whole 
      form will have 1 feedback doc and "n" responses for "n" quesitons in form.
    */
    const feedback = await Feedback.create({
      email: body.email,
      campaign: String(body.campaign_id),
      responses,
    });

    /* update sent prop of campaignEmail doc */
    await CampaignEmail.updateOne(
      { email: body.email, campaign: body.campaign_id },
      { sent: true }
    );

    /* increase responded recipientCount; */
    campaign.respondedRecipientCount += 1;
    campaign.lastFeedback = new Date();
    await campaign.save();

    message = `Thank You for your valuable feedback!`;
    queryStr = encodeQueryStr(campaign_id, email, true, message);
    return res.redirect(`/campaign/response/${queryStr}`);
  } catch (error) {
    console.log(error);
    const message = `?message=Sorry, Something went wrong.`;
    const queryStr = Cipher.encrypt(message);
    return res.redirect(`/campaign/response/${queryStr}`);
  }
});

exports.getResponses = catchAsync(async (req, res) => {
  /* get responses of that campaign */
  const responses = await Response.find({ campaign: req.params.id });
  const results = responses.length ? responses.length : 0;
  res.status(200).json({
    success: true,
    results,
    data: responses,
  });
});

exports.getSummary = catchAsync(async (req, res, next) => {
  /* get campaign */
  const campaign = await Campaign.findById(req.params.id)
    .populate("campaignQuestions")
    .lean();

  if (
    !campaign.launchedAt ||
    campaign.respondedRecipientCount === 0 ||
    campaign.recipientCount === 0
  ) {
    return next(new AppError(400, "No responses for this campaign."));
  }

  /* get reponses for that campaign */
  const campaignResponses = await Response.find({
    campaign: req.params.id,
  }).lean();
  campaign.responses = campaignResponses;
  const questionCount = campaign.campaignQuestions.length;

  /* generate summary */
  // let start = Date.now();
  const summaryObj = {};
  const questionResponsesObj = {};
  for (let i = 0; i < questionCount; i++) {
    const question = campaign.campaignQuestions[i];
    const questionResponses = campaignResponses.filter(
      (el) => String(el.question) === String(question._id)
    );
    // console.log(questionResponses);
    const stats = calcSummary(question, questionResponses);
    questionResponsesObj[question._id] = questionResponses;
    summaryObj[question._id] = stats;
  }
  // console.log('Time elapsed : ', (Date.now() - start) / 1000);
  const feedbacksObj = await Feedback.find({ campaign: req.params.id })
    .populate("responses")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      summary: summaryObj,
      questionResponses: questionResponsesObj,
      feedbacks: feedbacksObj,
    },
  });
});

const calcSummary = (question, responses) => {
  /* takes a question and its corresponding responses to generate summary for it */
  const summary = { ...question };
  delete summary._id;
  delete summary.__v;
  stats = {};

  /* for type = number */
  if (question.type === "number") {
    let max = (min = parseInt(responses[0].answer));
    let sum = min,
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
  } else if (
    /* for type = range, checkbox, radio */
    question.type === "range" ||
    question.type === "checkbox" ||
    question.type === "radio"
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
  } else if (question.type === "date") {
    /* for type = date */
    const daysGap =
      (new Date(question.choices[1]).getTime() -
        new Date(question.choices[0]).getTime()) /
      (1000 * 60 * 60 * 24);

    /* we will calculate for max days gap of 370 days */
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
      stats.valCounts = valCountsAndOrder[0];
      stats.valCountsOrdered = valCountsAndOrder[1];
    }
  }

  // for type = text
  else if (question.type === "text") {
    const valCounts = {};
    for (let i = 0; i < responses.length; i++) {
      // const response = String(responses[i].answer);
      let responseArr = String(responses[i].answer).split(" ");
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

    stats.valCountsOrdered = valCountKeys;
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
async function sendMails(from, campaign, newEmails) {
  const subject = campaign.emailSubject;
  const html = createForm.createForm(campaign);
  const unSentMails = [];
  const sentMails = [];
  let to, mailSent, userHtml, websiteLink;

  for (let i = 0; i < newEmails.length; i++) {
    to = newEmails[i];
    websiteLink = encodeEmailFeedbackLink(campaign._id, newEmails[i]);
    userHtml = html
      .replace("{%EMAIL%}", to)
      .replace("{%WEBSITE-LINK%}", websiteLink);
    mailSent = await sendMail(from, to, subject, userHtml);

    if (!mailSent) {
      unSentMails.push(to);
    } else {
      sentMails.push(to);
    }
  }
  return { unSentMails, sentMails };
}
