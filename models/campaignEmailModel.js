const mongoose = require('mongoose');
const validator = require('validator');

const campaignEmailSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Enter a valid campaign id'],
  },
  email: {
    type: String,
    required: [true, 'Email is a required field'],
    validate: [validator.isEmail, 'Enter a valid email'],
  },
  sent: {
    type: Boolean,
    default: false,
  },
});
campaignEmailSchema.index({ campaign: 1, email: 1 }, { unique: true });
const campaignEmailModel = mongoose.model('CampaignEmail', campaignEmailSchema);

module.exports = campaignEmailModel;
