const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
 name: String,
 username: String,
 userimage: String, 
 userid: String,
 groupid: String,
 requiremntid: String,
 instructorid: [String],
 completed: Boolean,
 versions: [],
 components: [],
 extensions: [],
 status : {
     type: Number,
     default: 0
 },
 modifieddate: {
   type: Date,
   default: Date.now
 },
},{strict : false});
const Form = mongoose.model('Forms', formSchema);
module.exports = Form;