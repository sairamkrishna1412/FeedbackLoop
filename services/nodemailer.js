const nodemailer = require('nodemailer');
const keys = require('../config/keys');

let transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  pool: true,
  port: 587,
  auth: {
    user: keys.sendMailEmail,
    pass: keys.sendMailPassword,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const sendMail = async (from, to, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: `${from}`, // sender address
      to: `${to}`, // list of receivers
      subject: `${subject}`, // Subject line
      html: `${html}`, // html body
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// sendMail(
//   'sai@gmail.com',
//   ['rabb.rabitto@gmail.com', 'narsingraodurgi@gmail.com'],
//   'Test',
//   '<p>what up?</p>'
// );

module.exports = sendMail;

// transporter
//   .verify()
//   .then(() => console.log('Connected aaa succesfully'))
//   .catch((err) => console.log('Could not connect to SMTP', err));
