const Requirement = require('../models/requirement');
const groupQuery = require('../query/group');
module.exports = {
  all: () => {
    return new Promise(resolve => {
      let list = [];
      Requirement.find({}).then(requirements => {
        requirements.map(requirement => {
          list.push(requirement);
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
  }, 
  id: (id) => {
    return new Promise(resolve => {
      Requirement.findById(id).then(requirement => {
        resolve(requirement);
      }
      ).catch(err => console.log(err));
    });
  },
  group: async(id) => {
    var status;
    var groupID = await new Promise(resolve => {
      Requirement.findById(id).then(form => {
        status = form.group.map(group => {return group.enabled});
        resolve(form.group.map(group => {return group.id}));
      }
      ).catch(err => console.log(err));
    });
    var groups = [];
    for(const[i,id] of groupID.entries()){
      await groupQuery.id(id).then(group => {
      group.enabled = status[i];
      groups.push(group);
    }).catch(err => console.log(err));
    }
    return groups;
  }
}