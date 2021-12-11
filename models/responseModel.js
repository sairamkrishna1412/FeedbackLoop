const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Provide a valid question ID'],
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Provide a valid campaign ID'],
  },
  answer: {
    type: String,
    required: [true, 'Please provide your answer'],
  },
  // feedback: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Feedback',
  // },
});

const responseModel = mongoose.model('Response', responseSchema);
module.exports = responseModel;
