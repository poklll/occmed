const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
 sectionname: String,
 description: String,
 completed: Boolean,
 total: Number,
 current: {
   type: Number,
   default: 0
 },
 component: [],
 value: [],
 note: [String],
 comment: [String],
 status : {
     type: String,
     default: "ยังไม่ได้ทำ"
 },
 modifieddate: {
   type: Date,
   default: Date.now
 },
},{strict : false});
const Requirement = mongoose.model('Requirements', SectionSchema);
module.exports = Requirement;