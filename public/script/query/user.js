const User = require('../models/user');

module.exports= {
    all : ()=>{
        return new Promise(resolve=>{
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
   filter : (field,filter)=>{
    return new Promise(resolve=>{
        let list = [];
        User.find({field : filter}).then(users => {
        users.map(user => {
            list.push(user);
          });
          //console.log(list);
          resolve(list);
        }
        ).catch(err => console.log(err));
      });
  }
   

}