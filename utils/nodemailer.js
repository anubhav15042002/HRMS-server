const nodemailer = require("nodemailer");
const Employee = require("../models/employee");

const sendWelcomeEmail = async (email, verificationUrl) => {
  // Fetch employee details from MongoDB
  try {
    const employee = await Employee.findOne({ email }); // Find employee by ID

    if (!employee) {
      throw new Error(`No employee found with the email: ${email}`);
    }

    const { fullName, designation } = employee;

    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail is used for this example, you can configure other providers
      auth: {
        user: process.env.EMAIL_USER, // Your email address (must be a Gmail address)
        pass: process.env.EMAIL_PASS, // Your email password or an app-specific password
      },
    });

    // Email Sending Process
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email
      subject: `[${fullName}]: We Welcome you to 42Works !!!`,
      text: `
    Dear ${fullName},

    We are delighted that you have joined us as ${designation}. Your contribution is important to ensure our sustained success and growth. We hope that your career here will be a gratifying one. You will get maximum support from our team and we look forward to having the best professional relations with you.

    I'd just like you to say that for us, our employees are the most important and greatest asset. We could not accomplish what we do every day without our employees. 
    
    Please reset your password by clicking on the link below:

    Reset Password: ${verificationUrl}

    Once verified, you will be able to set up your password and log in to the HRM Portal.

    If you have any issues, feel free to reach out to our support team.


    Best regards,
    HR Manager
    42 Works 
  `,
    };
    // NOTE:- SEND A PROPER FORMAT FOR THE TEXT AND ALSO SEND A HRM PORTAL LINK LIKE THE LANDING PAGE OF THE LOGIN.
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};

const sendLoginEmail = async (email, loginUrl) => {
  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      throw new Error(`No employee found with the email: ${email}`);
    }

    const { fullName } = employee;

    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail is used for this example, you can configure other providers
      auth: {
        user: process.env.EMAIL_USER, // Your email address (must be a Gmail address)
        pass: process.env.EMAIL_PASS, // Your email password or an app-specific password
      },
    });

    // Email Sending Process
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email
      subject: `[${fullName}]: Your Login Details for 42Works`,
      text: `
    Dear ${fullName},

    Congratulations! Your account has been successfully set up at 42Works. You can now log in to the HRM Portal and begin your journey with us.

    To access the portal, please click the link below:

    Login to the HRM Portal: ${loginUrl}

    Please make sure to use the credentials you set up during the registration process. If you have any trouble logging in or have any questions, feel free to reach out to our support team.

    We're excited to have you onboard and look forward to your contributions!

    If you have any issues, feel free to reach out to our support team.

    Best regards,
    HR Manager
    42 Works 
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Login email sent successfully!");
  } catch (error) {
    console.error("Error sending login email:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};

const sendOTPMail = async (email, OTP) => {
  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      throw new Error(`No employee found with the email: ${email}`);
    }

    const { fullName } = employee;

    // Nodemailer Setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail is used for this example, you can configure other providers
      auth: {
        user: process.env.EMAIL_USER, // Your email address (must be a Gmail address)
        pass: process.env.EMAIL_PASS, // Your email password or an app-specific password
      },
    });

    // Email Sending Process
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Recipient email
      subject: `[${fullName}]: Password reset OTP`,
      text: `
    Dear ${fullName},

    Below is your OTP for resetting the password for the 42 Works HRM Portal:- 

    Please enter the OTP and proceed to the next step:

    OTP: ${OTP}

    (This code will be valid for 10 minutes after request.)

    Thank you!
    **This notice is automatically sent by the system please do not reply to this address

    If you have any issues, feel free to reach out to our support team.

    Best regards,
    42 Works 
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully!");
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP email: " + error.message);
  }
};

module.exports = { sendWelcomeEmail, sendLoginEmail, sendOTPMail };
