const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const filemanager = require('../models/file');
const fs = require('fs');
const drive = require('../config/drive');

let fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__basedir + '/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});



router.post('/upload', multer({ storage: fileStorage }).fields([{ name: 'file', maxCount: 10 }]), async (req, res) => {
    var files = req.files['file'];
    var log = [];
    for(file of files) {
        var id = await drive.push(file);
        const filepath = `https://drive.google.com/uc?export=download&id=${id}`;
        const imgpath = `https://drive.google.com/thumbnail?id=${id}`;
        var newFile = new filemanager({
            filename: file.filename,
            originalname: file.originalname,
            filetype: file.mimetype,
            driveid: id,
            path: filepath,
            image: imgpath,
            userid: req.user._id,
        });
        var savedFile = await new Promise(resolve=>{
            newFile.save().then(()=>{
                resolve(newFile);
            }
            ); 
        });
        log.push(savedFile);
        console.log(`${file.filename} was uploaded`);
    };
    res.json(log);
});

router.get('/file/:path', (req, res) => {
    var filepath = path.join(__basedir, "/uploads/", req.params.path);
    filemanager.findOne({ filename: req.params.path }).then(file => {
        if (file) {
            res.download(filepath, file.originalname);
        }
        else {
            console.log("file not found");
            res.send("file not found");
        }
    });
});

router.delete('/file/:driveid', (req, res) => {
    var driveid = req.params.driveid;
    filemanager.findOne({driveid: driveid}).then(file => {
        if (file) {
            drive.del(driveid).then(()=>{
                file.remove();
                res.send(`${file.filename} is deleted`);
            });
        }
        else {
            console.log("file not found");
            res.send('file not found');
        }
    });
});


router.get('/testfile', (req, res) => {
    res.sendFile(path.join(__basedir, "/public/test.html"));
});



module.exports = router;
