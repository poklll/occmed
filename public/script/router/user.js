const express = require('express');
const router = express.Router();
const groupModel = require('../models/group');
const userModel = require('../models/user');
const userQuery = require('../query/user');
const groupQuery = require('../query/group');
const requirementModel = require('../models/requirement');
const requirementQuery = require('../query/requirement');
const multer = require("multer");
const upload = multer();



router.get('/user', async function (req, res) {
     var userid = req.query.userid;
     var groups = await groupQuery.filter('user', userid);
     var requirements
     for (group of groups) {
          var requirement = await new Promise(resolve => {
               requirementModel.find({ 'group.id': group.id}).then(requirement => {
                    resolve(requirement);
               }
               )
          });
          group.requirement = requirement;
     }
     res.send(groups);
});
//add user to group
router.get('/add', async function (req, res) {
     var userid = req.user._id;
     var groupid = req.query.group;
     var group = await groupQuery.id(groupid);
     group.user.push(userid);
     group.save().then(
          res.redirect(`/group/${groupid}`)
     );
});


router.get('/group_editor', async function (req, res) {
     var groups = await groupQuery.all();
     res.render('group_editor', { layout: '../layouts/group_editor', groups: groups, group: undefined });
});


router.get('/group/:id', async function (req, res) {
     var group = await groupQuery.id(req.params.id);
     var users = await groupQuery.user(req.params.id);
     res.render('group_editor', { layout: '../layouts/group_editor', group: group, users: users });
}
);
router.delete('/group/:id', async function (req, res) {
     const id = req.params.id;
     groupModel.findById(id).then(group => {
          if (group) {
               group.remove().then(res.redirect('/group_editor'));
          }
     });
});

router.post('/group/:id', upload.none(), async function (req, res) {
     var type = req.query.type;
     var id = req.params.id;
     const userID = req.body.id;
     var group = await groupQuery.id(id);
     var user = await userQuery.id(userID);
     console.log(type + " " + user.firstname + " in " + group.name);
     if (type == "add") {
          group.user.push(userID);
          group.save().then(
               res.send(user.firstname + "ถูกเพิ่มเข้ากลุ่มแล้ว")
          );
     }
     else if (type == "delete") {
          var index = group.user.indexOf(userID);
          group.user.splice(index, 1);
          group.save().then(
               res.send(user.firstname + "ถูกลบออกจากกลุ่มแล้ว")
          );
     }

});


router.post('/group', async function (req, res) {
     const { name } = req.body;
     groupModel.findOne({ name: name }).then(group => {
          if (group) {
               console.log("group already exist");
               req.flash('error_msg', 'group already exist');
               res.redirect('/group_editor');
          }
          else {
               var newGroup = new groupModel({
                    name: name
               });
               newGroup.save().then(() => {
                    console.log(name + ' group was successfully created');
                    req.flash('success_msg', 'group was successfully created');
                    res.redirect('/group_editor');
               });
          }
     });
});



router.get('/instructor', async function (req, res) {
     var instructors = await userQuery.filter('position', 'Professor');
     res.send(JSON.stringify(instructors));
});

router.get('/search', async function (req, res) {
     var result;
     if (req.query.keyword) {
          var keyword = req.query.keyword;
          var users = await userQuery.filter('firstname', keyword);
          if (users.length == 0) {
               users = await userQuery.filter('lastname', keyword);
          }
          var groups = await groupQuery.filter('name', keyword);
          for (group of groups) {
               var user = await groupQuery.user(group._id);
               group.user = user;
          }
          result = { users: users, groups: groups };
     }
     else {
          result = await userQuery.all();
     }
     res.send(JSON.stringify(result));
});

module.exports = router;