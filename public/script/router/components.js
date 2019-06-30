const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
// Load Section model
const Section = require('../models/requirement');
const { ensureAuthenticated} = require('../config/auth');

app.use(flash());
//component editor page 
router.get('/component_editor', (req, res) => res.render('component_editor',{layout: '../layouts/component_editor'}));

// Addcomponent
router.post('/component_editor', (req, res) => {
  const { sectionname,component,description,total } = req.body;
  let errors = [];

  if (!sectionname || !description || !total ) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('component_editor',{
     layout: '../layouts/component_editor',
     errors,
     sectionname,
     component,
     description,
     total
    });
  } else {
    Section.findOne({ name: name }).then(section => {
      if (section) {
        errors.push({ msg: 'Requirement is already exist' });
        res.render('component_editor', {
          layout: '../layouts/component_editor',
          errors,
          sectionname,
          component,
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
          res.redirect('/component_editor');
        })
        .catch(err => console.log(err));
      }
    });
  }
});


module.exports = router;
