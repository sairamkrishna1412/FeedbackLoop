const mongoose = require('mongoose');
const validator = require('validator');

//the custom validation that will get applied to the features attribute.
let notEmpty = function (features) {
  if (features.length === 0) {
    return false;
  } else {
    return true;
  }
};

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is a required field'],
    validate: [validator.isEmail, '{VALUE} is not valid email address'],
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Provide a valid campaign ID'],
  },
  responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Response',
      required: [true, 'A feedback must have atleast one question answered'],
      validate: [
        notEmpty,
        'A feedback must have atleast one question answered',
      ],
      // validate: {
      //   validator: (responses) => responses.length > 0,
      //   message: (props) =>
      //     `${props.value} : A feedback must have atleast one question answered`,
      // },
    },
  ],
});

const feedbackModel = mongoose.model('Feedback', feedbackSchema);
module.exports = feedbackModel;
