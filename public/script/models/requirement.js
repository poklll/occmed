const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema({
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

const User = mongoose.model('Requirements', RequirementSchema);

module.exports = User;