const express = require('express');
const router = express.Router();
const userquery = require('../query/user');
const groupquery = require('../query/group');

router.get('/group_editor',async function(req,res){
     res.render('group_editor',{layout: '../layouts/group_editor'});
});


router.get('/user/:id',async function(req,res){
     
});

module.exports = router;