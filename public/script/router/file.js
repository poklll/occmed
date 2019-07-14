const express = require('express');
const router = express.Router();
const path  = require('path');
const multer = require('multer');
const moment = require('moment');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__basedir+'/uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, moment().format('D')+moment().format('M')+moment().format('YYYY')+
      moment().format('HH')+moment().format('mm')+moment().format('ss')+moment().format('SS')
      +path.extname(file.originalname));
    }
  });

router.post('/upload',multer({storage: fileStorage}).fields([{name:'photo'}]),(req,res)=>{
    var img = req.files['photo'][0];
    console.log(img);
    res.send(img.filename);
});

router.get('/image/:path',(req, res) => {
    res.sendFile(path.join(__basedir,"/uploads/",req.params.path));
});

router.get('/file/:path',(req,res)=>{
    res.sendFile(path.join(__basedir,"/uploads/",req.params.path));  
});

router.get('/testfile',(req, res) => {
    res.sendFile(path.join(__basedir,"/public/test.html"));
});



module.exports = router;
