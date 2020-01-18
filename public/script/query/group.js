const Group = require('../models/group');
const userQuery = require('../query/user');


module.exports = {
  all: () => {
    return new Promise(resolve => {
      let list = [];
      Group.find({}).then(groups => {
        groups.map(group => {
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
      var find = JSON.parse(`{"${field}" : {"$regex": "^${filter}","$options":"i"}}`);
      Group.find(find).then(groups => {
        groups.map(group => {
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
        resolve(group);
      }
      ).catch(err => console.log(err));
    });
  },
  user: async(id) => {
    var userID = await new Promise(resolve => {
      Group.findById(id).then(group => {
        resolve(group.user);
      }
      ).catch(err => console.log(err));
    });
    var users = [];
    for(id of userID){
      await userQuery.id(id).then(user => {
      users.push(user);
    }).catch(err => console.log(err));
    }
    return users;
  }
}