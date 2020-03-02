async function startAuthentication(uname, pword, email) {
    try {
        try {
            console.log(email);
            await sendEmail(uname, pword, email);
        } catch (ex) {
        }
        } finally {

    }
}

async function sendEmail(uname, pword, email) {
    console.log(email);
//     var nodemailer = require('nodemailer');

    // var transporter = nodemailer.createTransport({
    // service: 'gmail',
    // auth: {
    //     user: 'secretkeepercapstone@gmail.com',
    //     pass: '$ecret*Keeper#Capstone2020'
    // }
    // });

    // var mailOptions = {
    // from: 'secretkeepercapstone@gmail.com',
    // to: email,
    // subject: 'Sending Email using Node.js',
    // text: 'That was easy!'
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    // if (error) {
    //     console.log(error);
    // } else {
    //     console.log('Email sent: ' + info.response);
    // }
    // });
}