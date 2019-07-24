const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const app = express();
// Load Section model
const Section = require('../models/requirement');
const { ensureAuthenticated } = require('../config/auth');

app.use(flash());
//component editor page 
function getRequirementList() {
  return new Promise(resolve=>{
    let list = [];
    Section.find({}).then(sections => {
      sections.map(section => {
        list.push(section.sectionname);
      });
      //console.log(list);
      resolve(list);
    }
    ).catch(err => console.log(err));
  });

}

router.get('/form_editor', async function (req, res) {
  try {
    let requirements = await getRequirementList();
    //console.log(requirements);
    res.render('form_editor', { layout: '../layouts/form_editor', requirements: requirements });
  }
  catch (err) {
    console.log(err);
  }

}
);

// Addcomponent
router.post('/form_editor', async function(req, res) {
try{
  const { sectionname, form, description, total } = req.body;
  let errors = [];
  let requirements = await getRequirementList();
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
    Section.findOne({ sectionname: sectionname }).then(section => {

      if (section) {
        errors.push({ msg: 'Requirement is already exist' });
        res.render('form_editor', {
          layout: '../layouts/form_editor',
          errors,
          sectionname,
          description,
          total,
          requirements: requirements
        });
      } else {
        const newSection = new Section({
          sectionname: sectionname,
          description: description,
          total: total,
          form: JSON.parse(form).components,
        });
        newSection
          .save()
          .then(section => {
            res.render('form_editor', {
              layout: '../layouts/form_editor',
              sectionname: sectionname,
              description: description,
              total: total,
              form: { elements: JSON.parse(form).components },
              requirements: requirements,
              success_msg: 'Requirement is now registered'
            });
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
