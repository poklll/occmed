const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const page = require('./public/script/router/pages');
const form = require('./public/script/router/form');
const login = require('./public/script/router/login');
const register = require('./public/script/router/register');
const file = require('./public/script/router/file');
const user = require('./public/script/router/user');
const DB = require('./public/script/config/keys');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const moment = require('moment');

global.__basedir = __dirname;


//mongoDB
mongoose.connect(DB, {useNewUrlParser: true})
.then(() => console.log('Connected to MongoDB ...'))
.catch(err => console.error('Could not connect to MongoDB:‌', err));


//EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/public/views/pages'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
);

// Passport middleware
require('./public/script/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
require('./public/script/config/auth');

//message
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//router
app.use('/asset', express.static(path.join(__dirname, '/public/asset')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(file);
app.use(page);
app.use(register);
app.use(login);
app.use(form);
app.use(user);



var PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`sever is running on port ${PORT}`);
});


process.on('uncaughtException', (e) => { console.log(e); });