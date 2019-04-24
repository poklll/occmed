const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Array,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  authlevel: {
      type: String,
      required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;