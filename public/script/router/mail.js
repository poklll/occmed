const mailer = require('../utility/email');
const express = require('express');
const router = express.Router();

router.post("/mail",(req,res)=>{
    const {target,subject,message} =  req.body; 
    mailer.send(target,subject,message);           
});

module.exports = router;