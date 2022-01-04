const mongoose = require('mongoose');
const validator = require('validator');

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please metion campaign owner'],
  },
  campaignName: {
    type: String,
    required: [true, 'A campaign should have a name'],
  },
  // campaignEmails: {
  //   type: [
  //     {
  //       email: {
  //         type: String,
  //         required: [true, 'A campaign must have atleast one mail'],
  //         unique: true,
  //       },
  //       sent: {
  //         type: Boolean,
  //         default: false,
  //       },
  //     },
  //   ],
  //   required: [true, 'A campaign must have atleast one mail'],
  //   validate: {
  //     validator: (emailsArr) => {
  //       emailsArr.forEach((emailObj) => {
  //         const email = emailObj.email;
  //         if (!validator.isEmail(String(email))) {
  //           return false;
  //         }
  //       });
  //       return true;
  //     },
  //     message: 'Please enter valid emails.',
  //   },
  // },
  // campaignEmails: {
  //   type: [String],
  //   required: [true, 'A campaign must have atleast one mail'],
  //   validate: {
  //     validator: (emails) => {
  //       emails.forEach((el) => {
  //         if (!validator.isEmail(String(el))) {
  //           return false;
  //         }
  //       });
  //       return true;
  //     },
  //     message: 'Please enter valid emails.',
  //   },
  //   // validate: [validator.isEmail, 'please enter valid emails'],
  // },
  emailSubject: {
    type: String,
    required: [true, 'Please enter the title/subject of the email.'],
  },
  previewText: {
    type: String,
  },
  emailContent: {
    type: String,
    required: [true, 'Please enter campaign email content.'],
  },
  campaignQuestions: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Question',
    },
  ],
  respondedRecipientCount: {
    type: Number,
    default: 0,
  },
  recipientCount: {
    type: Number,
    default: 0,
  },
  lastFeedback: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lauchedAt: {
    type: Date,
    default: null,
  },
});

const campaignModel = mongoose.model('Campaign', campaignSchema);

module.exports = campaignModel;
