const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
 sectionname: String,
 description: String,
 total: Number,
 form: [],
 user:[],
 modifieddate: {
   type: Date,
   default: Date.now
 },
},{strict : false});
const Requirement = mongoose.model('Requirements', SectionSchema);
module.exports = Requirement;