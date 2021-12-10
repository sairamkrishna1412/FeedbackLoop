const mongoose = require('mongoose');
const validator = require('validator');
// const  = require('../models/userModel');
const Campaign = require('../models/campaignModel');
const Question = require('../models/questionModel');
const CampaignEmail = require('../models/campaignEmailModel');
const sendMail = require('../services/nodemailer');

exports.newCampaign = async (req, res, next) => {
  try {
    const user = req.user;
    // check users existing campaigns and see if campaign name is unique to user acc.
    const userCampaings = await Campaign.find({ id: user.id });

    const campaignExists = userCampaings.find(
      (camp) => camp.campaignName == req.body.campaignName
    );
    if (campaignExists) {
      return res.json({
        success: false,
        message:
          'Campaign with that name already exists. Please change the campaign name',
      });
    }
    // userCampaings.forEach((camp) => {
    //   if (req.body.campaignName === camp.campaignName) {
    //     return res.json({
    //       success: false,
    //       message:
    //         'Campaign with that name already exists. Please change the campaign name',
    //     });
    //   }
    // });

    const doc = await Campaign.create(req.body);

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.campaignEmails = async (req, res, next) => {
  try {
    //check emails
    const { campaign_id: campaign } = req.body;
    const existingEmails = await CampaignEmail.find({ campaign }).select(
      'email'
    );

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
    // // check credits are available
    // if (user.credits < req.body.campaignEmails.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `You don't have enough credits. please buy more credits.`,
    //   });
    // }

    res.status(200).json({
      success: true,
      results: docs.length,
      data: docs,
      message: 'Emails already present have been removed automatically',
    });
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.campaignQuestions = async (req, res, next) => {
  try {
    const body = req.body;
    //get campaign_id to which question belongs to.
    const campaign = await Campaign.findById(body.campaign_id);
    if (!campaign) {
      return res.status(400).json({
        success: false,
        message: `Campaign with id : ${body.campaign_id} doesn't exist.`,
      });
    }

    let campaignQuestions = campaign.campaignQuestions;
    for (const question of body.questions) {
      const feedbackType = question.type;
      const hasChoices =
        feedbackType === 'checkbox' ||
        feedbackType === 'range' ||
        feedbackType === 'radio';

      if (hasChoices) {
        let errorMessage;
        if (
          feedbackType === 'range' &&
          (!question.choices.length || question.choices.length !== 3)
        ) {
          errorMessage = `Question is of type : range. choices should be an array of size 3 (start, stop & step of the range)`;
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
      const questionDoc = await Question.create({
        ...question,
      });
      campaignQuestions.push(String(questionDoc.id));
    }
    // async not working as expected
    // await body.questions.forEach(async (question, ind) => {
    //   console.log(`ran ${ind + 1}`);
    //   //check if it is a choice question
    //   const feedbackType = question.type;
    //   const hasChoices =
    //     feedbackType === 'checkbox' ||
    //     feedbackType === 'range' ||
    //     feedbackType === 'radio';

    //   if (hasChoices) {
    //     let errorMessage;
    //     if (
    //       feedbackType === 'range' &&
    //       (!question.choices.length || question.choices.length !== 3)
    //     ) {
    //       errorMessage = `Question is of type : range. choices should be an array of size 3 (start, stop & step of the range)`;
    //     }
    //     if (!question.choices.length) {
    //       errorMessage = `Question is of type : ${feedbackType} but no choices are given.`;
    //     }
    //     if (errorMessage) {
    //       return res.status(400).json({
    //         success: false,
    //         message: errorMessage,
    //       });
    //     }
    //   }

    //   //save question and add choice id to campaignQuestions array;
    //   const questionDoc = await Question.create({
    //     ...question,
    //   });
    //   console.log(questionDoc.id);
    //   campaignQuestions.push(String(questionDoc.id));
    // });

    campaign.campaignQuestions = campaignQuestions;
    await campaign.save();

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.getCampaign = async (req, res, next) => {
  try {
    const reqCampaign = await Campaign.findById(req.params.id)
      .populate('campaignQuestions')
      .lean();

    if (String(reqCampaign.user) !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No campaign with that id exists in your campaigns',
      });
    }

    const campaignEmails = await CampaignEmail.find({
      campaign: req.params.id,
    }).select('email sent');

    reqCampaign.campaignEmails = campaignEmails;

    return res.status(200).json({
      success: true,
      data: reqCampaign,
    });
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.myCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id });

    return res.status(200).json({
      success: true,
      results: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.updateCampaign = async (req, res, next) => {
  try {
    // console.log('ran c1');
    const { body } = req;
    const campaign = await Campaign.findById(req.params.id);

    if (body.campaignEmails && body.campaignEmails.length) {
      body.campaignEmails.forEach((email) => {
        if (!validator.isEmail(email)) {
          return res.status(400).json({
            success: false,
            message: `${email} is not an email. please make changes.`,
          });
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
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

exports.launchCampaign = async (req, res, next) => {
  try {
    //get campaign
    const { campaign_id } = req.body;

    const campaign = await Campaign.findOne({
      id: campaign_id,
      user: req.user.id,
    }).populate('campaignQuestions');

    if (!campaign) {
      return res.status(400).json({
        success: false,
        message: 'Campaign not found',
      });
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
    const html = `<p>${campaign.emailContent}</p>`;

    const mailSent = await sendMail(from, to, subject, html);
    if (!mailSent) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
    //send nodemail emails
    res.status(200).json({
      success: true,
      message: 'Mails were succesfully sent.',
    });
  } catch (error) {
    console.log(error);
    let message = error.message || 'Something went wrong, please try again!';
    res.status(500).json({
      success: false,
      message,
    });
  }
};
