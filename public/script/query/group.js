const Group = require('../models/group');

module.exports = {
  all: () => {
    return new Promise(resolve => {
      let list = [];
      Group.find({}).then(groups => {
        users.map(group => {
          list.push(group);
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
      Group.find(find).then(groups => {
        users.map(group => {
          list.push(group);
        });
        //console.log(list);
        resolve(list);
      }
      ).catch(err => console.log(err));
    });
  },
  id: (id) => {
    return new Promise(resolve => {
      Group.findById(id).then(group => {
        resolve(user);
      }
      ).catch(err => console.log(err));
    });
  }
}