const Requirement = require('../models/requirement');

module.exports = {
  all: () => {
    return new Promise(resolve => {
      let list = [];
      Requirement.find({}).then(requirements => {
        requirements.map(requirement => {
          list.push(requirement.name);
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
      Requirement.find(find).then(requirements => {
        requirements.map(requirement => {
          list.push(requirement.name);
        });
        //console.log(list);
        resolve(list);
      }
      ).catch(err => console.log(err));
    });
  }, id: (id) => {
    return new Promise(resolve => {
      Requirement.findById(id).then(requirement => {
        resolve(requirement);
      }
      ).catch(err => console.log(err));
    });
  }
}