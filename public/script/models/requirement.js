const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema({
 name: String,
 description: String,
 total: Number,
 form: [],
 group:[],
 date: {
   type: Date,
   default: Date.now
 },
},{strict : false});
const Requirement = mongoose.model('Requirements', RequirementSchema);
module.exports = Requirement;