const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
 });

const CommentSchema = new mongoose.Schema({
  content: String,
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
 note: [NoteSchema],
 comment: [CommentSchema],
 modifieddate: {
   type: Date,
   default: Date.now
 },
 status: String,
 approved: Boolean

});

const Requirement = mongoose.model('Requirements', RequirementSchema);

module.exports ={
  Requirement : Requirement,
  NoteSchema: NoteSchema,
  CommentSchema:CommentSchema,
  RequirementSchema:RequirementSchema
} ;