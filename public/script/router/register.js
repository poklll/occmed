const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mailer = require('../utility/email');
const flash = require('connect-flash');
const app = express();
// Load User model
const User = require('../models/user');


app.use(flash());
// Register Page
router.get('/register', (req, res) => res.render('register'));

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
                .then( () => {
                  mailer.send(newUser.email,'verify your email','hello world');
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

  module.exports = router;