const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // campaign_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Campaign',
  // },
  question: {
    type: String,
    required: [true, 'Please enter question'],
  },
  type: {
    type: String,
    enum: [
      'text',
      // options
      'checkbox',
      'number',
      'date',
      'file_upload',
      // options
      'range',
      // options
      'radio',
      'url',
    ],
    required: [true, '{VALUE} is not supported'],
  },
  choices: {
    type: Array,
  },
  requiredQuestion: {
    type: Boolean,
    default: false,
  },
});

// questionSchema.pre('save', function (next) {
//   const feedbackType = this.feebackType;
// const hasChoices =
//   feedbackType === 'checkbox' ||
//   feebackType === 'range' ||
//   feedbackType === 'radio';

//   if (!hasChoices) return next();

//   if (feebackType === 'ckeckbox') {

//   }
// });

const questionModel = mongoose.model('Question', questionSchema);

module.exports = questionModel;
