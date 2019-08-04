const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
// Load Requirement model
const Requirement = require('../models/requirement');
const RequiremntQuery = require('../query/requirement');
const UserQuery = require('../query/user');
const { ensureAuthenticated } = require('../config/auth');

app.use(flash());
//component editor page 



router.get('/form_editor', async function (req, res) {
  try {
    let requirements = await RequiremntQuery.all();
    //console.log(requirements);
    res.render('form_editor', { layout: '../layouts/form_editor', requirements: requirements });
  }
  catch (err) {
    console.log(err);
  }

}
);

router.get('/form/:name',async function(req,res){
   try{ 
     var requirements = await RequiremntQuery.all();
     var users = await UserQuery.all();
     Requirement.findOne({name: req.params.name}).then(form=>{
      res.render('form_editor', {
        layout: '../layouts/form_editor',
        _id: form._id,
        sectionname: form.name,
        description: form.description,
        total: form.total,
        form: { elements: form.form },
        requirements: requirements,
        groups : form.group,
        alluser: users
      });
     })
   }
   catch (err){
       console.log(err);
   }
});

router.delete('/form/:name',async function(req,res){
  try{ 
    var requirements = await RequiremntQuery.all();
    Requirement.findOne({name: req.params.name}).then(form=>{
         form.remove();
         res.redirect('/form_editor');
    })
  }
  catch (err){
      console.log(err);
  }
});



// Addcomponent
router.post('/form_editor', async function(req, res) {
try{
  const { sectionname, form, description, total } = req.body;
  let errors = [];
  let requirements = await RequiremntQuery.all();
  console.log(form);
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
        section.save();
        res.render('form_editor', {
          layout: '../layouts/form_editor',
          errors,
          sectionname,
          description,
          total,
          requirements: requirements,
          form: { elements: JSON.parse(form).components },
          success_msg: 'Requirement has been edited'
        });
      } else {
        const newSection = new Requirement({
          name: sectionname,
          description: description,
          total: total,
          form: JSON.parse(form).components,
        });
        newSection
          .save()
          .then(section => {
               res.redirect(`/form/${section.name}`)
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
