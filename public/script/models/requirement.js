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
  author: String,
  date: {
    type: Date,
    default: Date.now
  }
 });

const SectionSchema = new mongoose.Schema({
 name: String,
 description: String,
 type: String,
 completed: Boolean,
 totalrequirement: Number,
 currentrequirement: Number,
 requirement: [],
 note: [NoteSchema],
 comment: [CommentSchema],
 lastmodifieddate: {
   type: Date,
   default: Date.now
 },
 status: String,
 approved: Boolean

});

module.exports ={
  NoteSchema: NoteSchema,
  CommentSchema:CommentSchema
} ;