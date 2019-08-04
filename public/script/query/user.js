const User = require('../models/user');

module.exports = {
  all: () => {
    return new Promise(resolve => {
      let list = [];
      User.find({}).then(users => {
        users.map(user => {
          list.push(user);
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
      User.find(find).then(users => {
        users.map(user => {
          list.push(user);
        });
        //console.log(list);
        resolve(list);
      }
      ).catch(err => console.log(err));
    });
  },
  id: (id) => {
    return new Promise(resolve => {
      User.findById(id).then(user => {
        resolve(user);
      }
      ).catch(err => console.log(err));
    });
  }
}