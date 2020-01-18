const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const userQuery = require('../query/user');
const formQuery = require('../query/form');
const app = express();
const { ensureAuthenticated} = require('../config/auth');


app.use(flash());
router.get('/',(req, res) => {
    res.redirect('/dashboard');
});

//dashboard
router.get('/dashboard', ensureAuthenticated,async(req, res) => {
    if(req.user.position == "Professor"){
        var requests = await formQuery.request(req.user.id);
        res.render('dashboard',{layout: '../layouts/dashboard',user:req.user,requests: requests}); 
    }
    else{
        var groups = await userQuery.requirement(req.user.id);
        res.render('dashboard',{layout: '../layouts/dashboard',user:req.user,groups: groups});
    }
});



module.exports = router;
