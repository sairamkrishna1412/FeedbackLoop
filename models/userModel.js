const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default: undefined,
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
  },
  oAuth: {
    type: String,
    required: true,
    enum: {
      values: ['Facebook', 'Google'],
      message: 'Only google and facebook autentication is available',
    },
  },
  googleID: {
    type: String,
    default: undefined,
  },
  facebookID: {
    type: String,
    default: undefined,
  },
  credits: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const User = mongoose.model('users', userSchema);

module.exports = User;
