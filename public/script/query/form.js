const Form = require('../models/form');

module.exports = {
  all: () => {
    return new Promise(resolve => {
      let list = [];
      Form.find({}).then(forms => {
        forms.map(form => {
          list.push(form.name);
        });
        resolve(list);
      }
      ).catch(err => console.log(err));
    });
  },
  filter: (field, filter) => {
    return new Promise(resolve => {
      let list = [];
      var find = JSON.parse(`{"${field}" : "${filter}"}`);
      Form.find(find).then(forms => {
        forms.map(form => {
          list.push(form.name);
        });
        //console.log(list);
        resolve(list);
      }
      ).catch(err => console.log(err));
    });
  }, id: (id) => {
    return new Promise(resolve => {
      Form.findById(id).then(form => {
        resolve(form);
      }
      ).catch(err => console.log(err));
    });
  }
}