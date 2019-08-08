const express = require('express');
const router = express.Router();
const userquery = require('../query/user');
const groupquery = require('../query/group');

router.get('/group_editor',async function(req,res){
     res.render('group_editor',{layout: '../layouts/group_editor'});
});


router.get('/instructor',async function(req,res){
     var instructors = await userquery.filter('position','Professor');
     res.send(JSON.stringify(instructors)); 
});

module.exports = router;