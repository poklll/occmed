const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
const Sections = require('../models/section');
const { ensureAuthenticated} = require('../config/auth');

app.use(flash());
router.get('/',(req, res) => {
    //res.redirect('/dashboard');
    res.render('dashboard',{layout: '../layouts/dashboard',
    name: "name" ,position: "resident" ,notification: {message: "hello world",type: "success-notification",unread: 20 }, sections: Sections });
});

//dashboard
router.get('/dashboard', ensureAuthenticated,(req, res) => {
    res.render('dashboard',{layout: '../layouts/dashboard',
    name: req.user.firstname ,position: req.user.position ,notification: {message: "hello world",type: "success-notification",unread: 20 }, sections: Sections });
});


module.exports = router;
