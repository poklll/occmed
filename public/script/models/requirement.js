const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema({
  name: String,
  description: String,
  completed: Boolean,
  totalrequirement: Number,
  currentrequirement: Number,
  comment: [],
  date: {
    type: Date,
    default: Date.now
  }
 });
 
const RequirementSchema = new mongoose.Schema({
 name: String,
 description: String,
 completed: Boolean,
 totalrequirement: Number,
 currentrequirement: Number,
 comment: [],
 date: {
   type: Date,
   default: Date.now
 }

});

const User = mongoose.model('Requirements', RequirementSchema);

module.exports = User;