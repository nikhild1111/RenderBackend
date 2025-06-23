const nodemailer = require("nodemailer");
require("dotenv").config();


// ✅ Purpose of This Code
// This code defines a function (mailSender) that sends emails using Gmail via Nodemailer, and it exports that function for use anywhere in your app.

// const mailSender = async (to, subject, text, html = null) => {
// This function is async because sending an email is asynchronous. it is a arraow funtion
// Accepts 4 arguments:
// to: recipient email
// subject: subject of the email
// text: plain text content
// html: optional HTML content (default is null)



// 7. Export the function
// module.exports = mailSender;
// So you can use it like this anywhere:
// const mailSender = require("../utils/mailSender");
//   try {
//     const info = await mailSender("domadenikhil@gmail.com", "Test", "Hi from Node.js!");// Reusable
//     res.status(200).json({ message: "Email sent", info });
//   } catch (error) {
//     res.status(500).json({ message: "Email sending failed", error: error.message });
//   }

const mailSender = async (to, subject, text, html = null) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"Ecomzy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Optional HTML
    if (html) {
      mailOptions.html = html;
    }

    // Send the mail
    const info = await transporter.sendMail(mailOptions);
console.log(`📧 Email successfully sent to ${to}`);

    return info;
  } catch (error) {
    console.error("❌ Error sending mail:", error.message);
    throw error;
  }
};

module.exports = mailSender;
