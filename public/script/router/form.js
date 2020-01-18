const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
const Requirement = require('../models/requirement');
const Form = require('../models/form');
const requirementQuery = require('../query/requirement');
const userQuery = require('../query/user');
const groupQuery = require('../query/group');
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const upload = multer();
const drive = require('../config/drive');

app.use(flash());

router.get('/form_editor',ensureAuthenticated, async function (req, res) {
  try {
    let requirements = await requirementQuery.all();
    res.render('form_editor', { layout: '../layouts/form_editor', requirements: requirements });
  }
  catch (err) {
    console.log(err);
  }
}
);

router.get('/requirement/:id', async function (req, res) {
  var requirement = await requirementQuery.id(req.params.id);
  res.send(JSON.stringify(requirement));
});

router.get('/newform/',ensureAuthenticated, async function (req, res) {
  try {
    Form.find({
      userid: req.user.id,
      groupid: req.query.group,
      requirementid: req.query.requirement
    })
      .then(forms => {
          Requirement.findById(req.query.requirement)
          .then(requirement=>{
              res.render('form', {
                layout: '../layouts/dashboard',
                form: {components: requirement.form, extensions: [],
                  groupid: req.query.group , requirementid: req.query.requirement},
                requirement: requirement,
                forms: forms,
                user: req.user
              });
          });
      });
  }
  catch (err) {
    console.log(err);
  }
});

router.get('/user/form/:id',ensureAuthenticated, async function (req, res) {
  try {
    Form.findById(req.params.id)
      .then(form => {
        if (form) {
          form = form.toObject();
          Form.find({userid: form.userid,
            groupid: form.groupid,
            requirementid: form.requirementid
          }).sort({_id: 1}).then(forms=>{
            Requirement.findById(form.requirementid)
            .then(requirement =>{
              res.render('form', {
                layout: '../layouts/dashboard',
                form: form,
                requirement: requirement,
                forms: forms,
                user: req.user
              });
            }); 
          });         
        }
        else {
          res.send('form not found');
        }
      })
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/user/form', upload.none(), function (req, res) {
  const data = JSON.parse(req.body.form);
  const requirementid = req.body.requirementid;
  const groupid = req.body.groupid;
  const name = req.body.name;

  if (req.query.id != undefined) {
    try {
      Form.findById(req.query.id).then(form => {
        if (form) {
          form.name = name;
          form.components = data.components;
          form.extensions = data.extensions;
          form.status = 1;
          form.versions.push({components: data.components,extensions: data.extensions});
          form.instructorid = data.instructorid;
          form.save();
          res.send({ id: req.query.id , msg: 'บันทึกฟอร์มสำเร็จ' });
        }
        else {
          res.send('form not found');
        }
      });
    }
    catch (err) {
      console.log(err);
    } 
  } else {
    var newForm = new Form({
      name: name,
      components: data.components,
      extension: data.extensions,
      userid: req.user._id,
      username: req.user.firstname,
      userimage: req.user.image,
      groupid: groupid,  
      requirementid: requirementid,
      instructorid: data.instructorid,
      status: 1,
      versions: [{components: data.components,extensions: data.extensions}]
    });
    newForm.save()
      .then(() => res.json({ id: newForm.id, msg: 'บันทึกฟอร์มสำเร็จ' }))
      .catch(err => console.log(err));
  }
});

router.put('/user/form', upload.none(), function (req, res) {
  const data = JSON.parse(req.body.form);
  const requirementid = req.body.requirementid;
  const groupid = req.body.groupid;
  const status = req.body.status;
    try {
      Form.findById(req.query.id).then(form => {
        if (form) {
          form.components = data.components;
          form.extensions = data.extensions;
          form.status = status;
          form.versions[form.versions.length-1] = {components: data.components,extensions: data.extensions};
          form.markModified('versions');
          form.instructorid = data.instructorid;
          form.save();
          res.send({ id: req.query.id , msg: 'บันทึกฟอร์มสำเร็จ' });
        }
        else {
          res.send('form not found');
        }
      });
    }
    catch (err) {
      console.log(err);
    } 
});


router.get('/form/:id', async function (req, res) {
  try {
    var requirements = await requirementQuery.all();
    var instructors = await userQuery.filter('position', 'Professor');
    var groups = await requirementQuery.group(req.params.id);
    Requirement.findById(req.params.id).then(form => {
      res.render('form_editor', {
        layout: '../layouts/form_editor',
        _id: form._id,
        sectionname: form.name,
        description: form.description,
        total: form.total,
        form: { components: form.form, extensions: form.extension },
        requirements: requirements,
        instructors: instructors,
        groups: groups,
      });
    })
  }
  catch (err) {
    console.log(err);
  }
});

router.delete('/form/:id', async function (req, res) {
  try {
    Requirement.findById(req.params.id).then(form => {
      form.remove();
      res.redirect('/form_editor');
    })
  }
  catch (err) {
    console.log(err);
  }
});


router.post('/form/:id', upload.none(), async (req, res) => {
  var action = req.query.action;
  var group = await groupQuery.id(req.body.group);
  var form = await requirementQuery.id(req.params.id);
  switch (action) {
    case "adduser": console.log(group.name + " was added to " + form.name);
      form.group.push({ id: req.body.group, enabled: true });
      form.save().then(
        res.redirect(`/form/${req.params.id}`)
      );
      break;
    case "deleteuser": console.log(group.name + " was remove from  " + form.name);
      var index = form.group.findIndex(item => item.id == group._id);
      form.group.splice(index, 1);
      form.save().then(
        res.redirect(`/form/${req.params.id}`)
      );
      break;
    case "enableuser": console.log(group.name + " was enabled for " + form.name);
      var index;
      for (const [i, item] of form.group.entries()) {
        if (item.id == req.body.group) {
          index = i;
        }
      }
      form.group[index].enabled = true;
      form.markModified('group');
      form.save().then(() => {
        res.send(`${group.name} เปิดใช้งานแบบฟอร์ม ${form.name} แล้ว`);
      }
      );
      break;
    case "disableuser": console.log(group.name + " was disabled for  " + form.name);
      var index;
      for (const [i, item] of form.group.entries()) {
        if (item.id == req.body.group) {
          index = i;
        }
      }
      form.group[index].enabled = false;
      form.markModified('group');
      form.save().then(
        res.send(`${group.name} ปิดใช้งานแบบฟอร์ม ${form.name} แล้ว`)
      );
      break;
  }
});


// Addcomponent
router.post('/form_editor', async function (req, res) {
  try {
    const { sectionname, form, description, total } = req.body;
    let errors = [];
    let requirements = await requirementQuery.all();
    //console.log(form);
    if (!sectionname || !description || !total || !form) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
      res.render('form_editor', {
        layout: '../layouts/form_editor',
        errors,
        sectionname,
        description,
        total,
        requirements: requirements
      });
    } else {
      Requirement.findOne({ name: sectionname }).then(section => {

        if (section) {
          section.name = sectionname;
          section.description = description;
          section.total = total;
          section.form = JSON.parse(form).components;
          section.extension = JSON.parse(form).extensions;
          section.save();
          res.render('form_editor', {
            layout: '../layouts/form_editor',
            errors,
            sectionname,
            description,
            total,
            requirements: requirements,
            form: { components: section.form, extensions: section.extension },
            success_msg: 'Requirement has been edited'
          });
        } else {
          const newSection = new Requirement({
            name: sectionname,
            description: description,
            total: total,
            form: JSON.parse(form).components,
            extension: JSON.parse(form).extensions
          });
          newSection
            .save()
            .then(section => {
              drive.createFolder(section.name);
              res.redirect(`/form/${section._id}`);
            })
            .catch(err => console.log(err));
        }
      });
    }
  }
  catch (err) {
    console.log(err);
  }
});


module.exports = router;
