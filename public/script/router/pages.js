const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
const { ensureAuthenticated} = require('../config/auth');

app.use(flash());
router.get('/',(req, res) => {
    //res.redirect('/dashboard');
    res.render('dashboard',{layout: '../layouts/dashboard',
    name: "name" ,position: "resident" ,notification: {message: "hello world",type: "success-notification",unread: 20 }});
});

//dashboard
router.get('/dashboard', ensureAuthenticated,(req, res) => {
    res.render('dashboard',{layout: '../layouts/dashboard',
    name: req.user.firstname ,position: req.user.position , profileimg: req.user.image,notification: {message: "hello world",type: "success-notification",unread: 20 }});
});



module.exports = router;
