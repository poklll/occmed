const express = require('express');
const router = express.Router();
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

router.get('/component', (req, res) => {
    var filepath = path.join(__basedir, "/public/views/pages/components/", `${req.query.name}.ejs`);
    var str = fs.readFileSync(filepath, 'utf8');
    var rendered;
    if(req.query.props){
        var props = JSON.parse(req.query.props);
        rendered = ejs.render(str,props);
    }
    else
    {
        rendered = ejs.render(str);
    }
    res.send(rendered); 
});

module.exports = router;