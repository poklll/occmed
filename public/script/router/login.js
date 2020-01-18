const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
// Load User model
const User = require('../models/user');



app.use(flash());

// Login Page
router.get('/login', (req, res) => res.render('login',{layout: '../layouts/login'}));

// Login
router.post('/login', (req, res, next) => {
  var url;
  if(req.session.redirectTo){
    url = req.session.redirectTo;
  }
  else{
    url = '/dashboard';
  }
  passport.authenticate('local', {
    successRedirect: url,
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;
