const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
// Load Section model
const Section = require('../models/requirement');
const { ensureAuthenticated} = require('../config/auth');

app.use(flash());
//component editor page 
router.get('/form_editor', (req, res) => res.render('form_editor',{layout: '../layouts/form_editor'}));

// Addcomponent
router.post('/form_editor', (req, res) => {
  const { sectionname,form,description,total } = req.body;
  let errors = [];

  if (!sectionname || !description || !total ) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('form_editor',{
     layout: '../layouts/form_editor',
     errors,
     sectionname,
     component,
     description,
     total
    });
  } else {
    Section.findOne({ sectionname: sectionname }).then(section => {
      if (section) {
        errors.push({ msg: 'Requirement is already exist' });
        res.render('form_editor', {
          layout: '../layouts/form_editor',
          errors,
          sectionname,
          description,
          total
         });
      } else {
        const newSection = new Section({
          sectionname,
          description,
          total
        });
        newSection
        .save()
        .then(section => {
          req.flash(
            'success_msg',
            'Requirement is now registered'
          );
          res.redirect('/form_editor');
        })
        .catch(err => console.log(err));
      }
    });
  }
});


module.exports = router;
