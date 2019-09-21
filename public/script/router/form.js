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
app.use(flash());

router.get('/form_editor', async function (req, res) {
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
router.get('/userform/:id', async function (req, res) {
  var requirement = await requirementQuery.id(req.params.id);
  res.send(JSON.stringify(requirement));
});
router.post('/userform/:id', upload.none(), async function (req, res) {
  const [components, extensions,instructorid] = req.body;
  var newForm = new Form({
    components: components,
    extension: extensions,
    userid: req.user._id,
    instructorid: instructorid
  });
  newForm.save()
         .then(()=> res.send('done'))
         .catch(err=> console.log(err));
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
    var requirements = await requirementQuery.all();
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
              res.redirect(`/form/${section._id}`)
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
