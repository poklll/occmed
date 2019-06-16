const mongoose = require('mongoose');

const Event = new mongoose.Schema({
    content: String,
    date: {
      type: Date,
      default: Date.now
    }
   });
  
const CaseReport = new mongoose.Schema({
    
}   
)