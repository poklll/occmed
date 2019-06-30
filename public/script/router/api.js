const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
const Sections = require('../models/section');
const { ensureAuthenticated} = require('../config/auth');

app.use(flash());
//form
router.get('/:section',(req,res)=>{
   name = req.params.section;
   Sections.map(section => {
      if(section.name === name)
      {
           res.send(section);
      }
   });
 
});
//item
router.get('/:section/:item',(req,res)=>{
  name = req.params.section;
  hn = req.params.item;
  Sections.map(section => {
     if(section.name === name)
     {    
          section.item.map(item=>{
            if(item.HN == hn)
            {
              res.send(item);
            }
          });
     }
  });
});




module.exports = router;
