// // routes/mail.js


//  for the direct mail send we can use this 
// const express = require('express');
// const nodemailer = require('nodemailer');
// const router = express.Router();

// router.post('/send', async (req, res) => {
//   const { to, subject, text } = req.body;

//   try {


// //     🔍 What is createTransport?
// // nodemailer.createTransport() is a function used to set up a mail transporter, which is like a "mailman" that knows how to send emails from your app using an email service like Gmail.
// //  service: 'gmail'
// // This tells Nodemailer to use Gmail’s SMTP (mail server) to send the emails.
// // Gmail is easy to set up and free for testing.
// // ✅ Alternative: You can also use service: 'hotmail', or use custom SMTP like:
// // auth: { user, pass }
// // This is the authentication required to log in to the Gmail account you want to send email from.
// // This reads the email address from your .env file.
// // user: process.env.EMAIL_USER
// // pass: process.env.EMAIL_PASS
// // This reads the password (or app-specific password) from your .env file.


//     // Create reusable transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // or use smtp
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });


// //     🔍 What is transporter.sendMail()?
// // This line sends the actual email using the mail transporter you created earlier with nodemailer.createTransport().
// // It sends a mail with the details you provide in the object.

// // 📦 Breakdown of Parameters:
// // ✅ from: \"YourApp" <${process.env.EMAIL_USER}>``
// // This sets the sender's email address.
// // "YourApp" is the display name.
// // ${process.env.EMAIL_USER} is the actual email address (like youremail@gmail.com).
// // ✅ to
// // The recipient's email address — passed from the frontend or hardcoded.
// // ✅ subject
// // The subject line of the email.
// // ✅ text
// // The body content of the email in plain text.

// // 🔁 What is info?
// // After sending the email, nodemailer returns an info object that contains:

// // {
// //   messageId: 'abc123@nodemailer.com',
// //   response: '250 Message accepted ...',
// //   envelope: { from, to },
// //   accepted: ['user@gmail.com'],
// //   rejected: []
// // }


// //  "info": {
// //         "accepted": [
// //             "domadenikhil@gmail.com"
// //         ],
// //         "rejected": [],
// //         "ehlo": [
// //             "SIZE 35882577",
// //             "8BITMIME",
// //             "AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH",
// //             "ENHANCEDSTATUSCODES",
// //             "PIPELINING",
// //             "CHUNKING",
// //             "SMTPUTF8"
// //         ],
// //         "envelopeTime": 1123,
// //         "messageTime": 867,
// //         "messageSize": 400,
// //         "response": "250 2.0.0 OK  1750198043 98e67ed59e1d1-313c1b4993fsm11240690a91.30 - gsmtp",
// //         "envelope": {
// //             "from": "domadenikhil52@gmail.com",
// //             "to": [
// //                 "domadenikhil@gmail.com"
// //             ]
// //         },
// //         "messageId": "<42d33ff8-3116-66f8-d49c-e8b7aaaca119@gmail.com>"


//     // Send mail
//     const info = await transporter.sendMail({
//       from: `"Stopper" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     });

//     res.status(200).json({ success: true, message: 'Email sent', info });
//   } catch (err) {
//     console.error('Email sending error:', err.message);
//     res.status(500).json({ success: false, message: 'Email failed', error: err.message });
//   }
// });

// module.exports = router;





// it is using the mailsender

const express = require('express');
const router = express.Router();
const mailSender = require("../utils/mailSender");

router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const info = await mailSender(to, subject, text); // Reusable
    res.status(200).json({ message: "Email sent", info });
  } catch (error) {
    res.status(500).json({ message: "Email sending failed", error: error.message });
  }
});

module.exports = router;
