const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
const { ensureAuthenticated} = require('../config/auth');

app.use(flash());
router.get('/',(req, res) => {
    res.redirect('/dashboard');
});

//dashboard
router.get('/dashboard', ensureAuthenticated,(req, res) => {
    res.render('dashboard',{layout: '../layouts/dashboard',user:req.user});
});



module.exports = router;
