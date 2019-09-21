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
        cb(null, moment().format('D') + moment().format('M') + moment().format('YYYY') +
            moment().format('HH') + moment().format('mm') + moment().format('ss') + moment().format('SS')
            + file.originalname);
    }
});



router.post('/upload', multer({ storage: fileStorage }).fields([{ name: 'file', maxCount: 10 }]), async (req, res) => {
    var files = req.files['file'];
    var log = [];
    for(file of files) {
        var id = await drive.run("upload",file);
        var newFile = new filemanager({
            filename: file.filename,
            originalname: file.originalname,
            filetype: file.mimetype,
            driveid: id,
            path: `https://drive.google.com/uc?export=download&id=${id}`,
            image: `https://drive.google.com/uc?export=view&id=${id}`,
            userid: "test"//req.user._id,
        });
        newFile.save();
        console.log(`${file.filename} was uploaded`);
        log.push({ name: file.originalname, path: `https://drive.google.com/uc?export=download&id=${id}`, type: file.mimetype, date: moment().format('lll') });
    };
    res.send(JSON.stringify({ files: log }));
});

router.get('/file/:path', (req, res) => {
    var filepath = path.join(__basedir, "/uploads/", req.params.path);
    filemanager.findOne({ filename: req.params.path }).then(file => {
        if (file) {
            res.download(filepath, file.originalname);
            // console.log(`${file.filename} was downloaded`);
        }
        else {
            console.log("file not found");
            res.send("file not found");
        }
    });
});

router.delete('/file/:path', (req, res) => {
    var filepath = path.join(__basedir, "/uploads/", req.params.path);
    //console.log(filepath);
    filemanager.findOne({ filename: req.params.path }).then(file => {
        if (file) {
            file.remove();
            fs.unlinkSync(filepath);
            console.log(`${file.filename} was deleted`);
            res.send('done');
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
