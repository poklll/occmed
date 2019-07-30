const Requirement = require('../models/requirement');

module.exports= {
    all : ()=>{
        return new Promise(resolve=>{
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
   filter : (field,filter)=>{
    return new Promise(resolve=>{
        let list = [];
        Requirement.find({field : filter}).then(requirements => {
        requirements.map(requirement => {
            list.push(requirement.name);
          });
          //console.log(list);
          resolve(list);
        }
        ).catch(err => console.log(err));
      });
  }
   

}