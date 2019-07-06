const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pok.trbk@gmail.com', // your email
      pass: 'pokredblanket' // your email password
    }
  });

  
var target = 'poki0009@hotmail.com';
var subjec = 'hi';
var message = 'hello';
 var send = (target,subject,message) => {
    let mailOptions = {
        from: 'pok.trbk@gmail.com',                // sender
        to: target,                // list of receivers
        subject: subject ,              // Mail subject
        text: message   // HTML body
      };
    
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
 }

 send(target,subjec,message);