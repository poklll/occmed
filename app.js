const express = require('express');
const app = express();
const path = require('path');
const pagerouter = require('./public/script/router/pages');
global.__basedir = __dirname;
//router
app.use('/asset', express.static(path.join(__dirname, '/public/asset')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(pagerouter);



var PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`sever is running on port ${PORT}`);
});


process.on('uncaughtException', (e) => { console.log(e); });