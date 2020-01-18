const User = require('../models/user');
const Group = require('../models/group');
const Requiremnt = require('../models/requirement');
const Form = require('../models/form');
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
      //var find = JSON.parse(`{"${field}" : {"$regex": "^"+"${filter}","$options":"i"}}`);
      var find = JSON.parse(`{"${field}" : {"$regex": "^${filter}","$options":"i"}}`);
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
  },
  requirement: (id) => {
    return new Promise((resolve) => {
      Group.find({ 'user': id }).then(async function (groups) {
        var requirements = [];
        for (group of groups) {
          group.requirement = await new Promise(resolve => {
            Requiremnt.find({ 'group': { $elemMatch: { id: group.id, enabled: true } } }).then(requirement => {
              resolve(requirement);
            }
            );
          });
          var forms = [];
          for(requirement of group.requirement){
              var allform = await new Promise(resolve=>{
              Form.find({'userid':id,'groupid':group.id,'requirementid':requirement.id}).sort({_id: 1}).then(form=>{
                  resolve(form);
              });
            });
              forms.push({template: requirement,forms: allform}); 
          }
          
          requirements.push({ groupid: group.id, groupname: group.name, requirement: forms });
        }
        resolve(requirements);
      });

    }
    ).catch(err => console.log(err));
  }
}