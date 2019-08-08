const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
 sectionname: String,
 completed: Boolean,
 components: [],
 extension: [],
 note: [String],
 comment: [String],
 advisor: String ,
 status : {
     type: String,
     default: "ยังไม่ได้ทำ"
 },
 modifieddate: {
   type: Date,
   default: Date.now
 },
},{strict : false});
const Form = mongoose.model('Forms', formSchema);
module.exports = Form;