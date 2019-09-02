const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
 userid: String ,
 sectionname: String,
 completed: Boolean,
 components: [],
 extension: [],
 note: [String],
 comment: [String],
 instructorid: [String] ,
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