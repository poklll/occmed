var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/', function (req, res) {
    res.sendFile(path.join(__basedir + '/index.html'));
});

router.get('/home', function (req, res) {
    res.sendFile(path.join(__basedir + '/public/page/home.html'));
});

module.exports = router;