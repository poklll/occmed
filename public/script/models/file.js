const mongoose = require('mongoose');
const moment = require('moment');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  filetype: String,
  path: String,
  userid: String,
  date: {
      type: String,
      default: moment().format('lll')
  }
});

const file = mongoose.model('Files', fileSchema);

module.exports = file;