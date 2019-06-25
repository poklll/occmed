const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const app = express();
// Load User model
const User = require('../models/user');
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
//form
router.get('/')


//item

// Login Page
router.get('/login', (req, res) => res.render('login',{layout: '../layouts/login'}));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Requirement Editor
router.get('/test', (req, res) => res.render('testitem'));


// Register
router.post('/register', (req, res) => {
  const { firstname,lastname, email, password, password2 ,position,authlevel } = req.body;
  let errors = [];

  if (!firstname || !lastname || !email || !password || !password2 || !position || !authlevel) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstname,
      lastname,
      email,
      password,
      password2,

    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          firstname,
          lastname,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          firstname,
          lastname,
          email,
          password,
          position,
          authlevel,
        });


        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
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
