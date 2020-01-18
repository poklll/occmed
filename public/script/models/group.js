const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
 name: String,
 description: String,
 user:[],
 enabled: Boolean,
 date: {
   type: Date,
   default: Date.now
 },
},{strict : false});
const Requirement = mongoose.model('Groups', GroupSchema);
module.exports = Requirement;