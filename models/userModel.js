const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: {
    type: String,
    default: undefined,
  },
  facebookID: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    default: undefined,
  },
});

const User = mongoose.model('users', userSchema);

module.exports = User;
