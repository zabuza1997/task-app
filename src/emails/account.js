const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "anhquang54321@yahoo.com.vn", // Change to your verified sender
    subject: "Welcome to Task Manager",
    text: `Welcome to the app, ${name}. Let us know how you get along with it!`,
  });
};

module.exports = {
  sendWelcomeEmail,
};
