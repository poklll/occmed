const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pok.trbk@gmail.com', // your email
      pass: 'pokredblanket' // your email password
    }
  });

 

 module.exports ={
     send: (target,subject,message) =>{
        let mailOptions = {
            from: 'OCCMEDKKU<pok.trbk@gmail.com>',                // sender
            to: target ,                // list of receivers
            subject: subject,              // Mail subject
            html: message  // HTML body
          };
        
          transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
     }
 }