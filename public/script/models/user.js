const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
  ,
  image: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  authlevel: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  activated: {
    type: Boolean,
    default: false
  },
  requirements: []
});

const User = mongoose.model('User', UserSchema);

module.exports = User;