const Employee = require("../models/employee");
const { validationResult } = require("express-validator");
const {
  hashPassword,
  generateToken,
  comparePasswords,
} = require("../utils/authHelper");
const { generateOTP, generateRandomToken } = require("../utils/functions");

const { sendLoginEmail, sendOTPMail } = require("../utils/nodemailer");

// Check if valid token (Verify Email API)
const verifyEmail = async (req, res) => {
  try {
    const { tempToken } = req.query;

    if (!tempToken) {
      return res.status(400).json({
        success: false,
        message: "Please provide the token.",
      });
    }

    const employee = await Employee.findOne({ tempToken });

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    // if (employee.isVerified) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Employee already verified.",
    //   });
    // }

    if (Date.now() > employee.tempTokenExpire) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired.",
      });
    }

    const setPasswordToken = generateRandomToken(32);
    const setPasswordTokenExpire = Date.now() + 2 * 60 * 60 * 1000; // 2 hours

    // employee.isVerified = true;
    // employee.tempToken = undefined;
    // employee.tempTokenExpire = undefined;
    employee.setPasswordToken = setPasswordToken;
    employee.setPasswordTokenExpire = setPasswordTokenExpire;

    await employee.save();

    return res.status(201).json({
      success: true,
      message: "Employee's email verified successfully.",
      data: {
        setPasswordToken: setPasswordToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Set New Password API
const setNewPassword = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { setPasswordToken, password, confirmPassword } = req.body;

    if (!setPasswordToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide the token and new/confirm password.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const employee = await Employee.findOne({ setPasswordToken });

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (Date.now() > employee.setPasswordTokenExpire) {
      return res.status(400).json({
        success: false,
        message: "Token has expired.",
      });
    }

    if (employee.isPasswordCreated) {
      return res.status(400).json({
        success: false,
        message: "Password already created.",
      });
    }

    if (employee.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Employee already verified.",
      });
    }

    const hashedPassword = await hashPassword(password);

    employee.isVerified = true;
    employee.tempToken = null;
    employee.tempTokenExpire = null;
    employee.isPasswordCreated = true;
    employee.password = hashedPassword;
    employee.setPasswordToken = null;
    employee.setPasswordTokenExpire = null;
    await employee.save();

    if(false){
      true
      doj
    }
    // Generate the verification URL
    const loginUrl = `${process.env.FRONTEND_URL}/`;

    await sendLoginEmail(employee.email, loginUrl);

    return res.status(201).json({
      success: true,
      message: "Employee's password has been created successfully.",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Login API
const login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address and password.",
    });
  }

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (!employee.isPasswordCreated) {
      return res.status(401).json({
        success: false,
        message: "Password has not been created by the employee.",
      });
    }

    if (!employee.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Employee'email is not verified ",
      });
    }

    const result = await comparePasswords(password, employee.password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = generateToken(employee._id);
    return res.status(201).json({
      success: true,
      message: "Login successful.",
      data: {
        token: token,
        fullName: employee.fullName,
        role: employee.role,
        teamName: employee.teamName,
        desgination: employee.designation,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Forgot Password API
const forgotPassword = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email address.",
    });
  }

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // Expires in 10 mins
    const otpToken = generateRandomToken(32);

    employee.otp = otp;
    employee.otpExpire = otpExpire;
    employee.otpToken = otpToken;

    await employee.save();

    await sendOTPMail(employee.email, employee.otp);

    return res.status(201).json({
      success: true,
      message: "OTP sent to the email address.",
      data: {
        otpToken: otpToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { otpToken, otp } = req.body;

  if (!otpToken || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide a token and OTP.",
    });
  }

  try {
    const employee = await Employee.findOne({
      otpToken: otpToken,
      otp: otp,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (Date.now() > employee.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    const resetToken = generateRandomToken(32);
    const resetTokenExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 mins

    employee.otp = null;
    employee.otpExpire = null;
    employee.otpToken = null;
    employee.resetToken = resetToken;
    employee.resetTokenExpire = resetTokenExpire;

    if (!employee.isVerified) {
      employee.isVerified === true;
    }

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      data: {
        resetToken: resetToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { otpToken } = req.body;

  if (!otpToken) {
    return res.status(400).json({
      success: false,
      message: "Please provide a token.",
    });
  }

  try {
    const employee = await Employee.findOne({ otpToken });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // OTP expires in 10 mins

    employee.otp = otp;
    employee.otpExpire = otpExpire;

    await employee.save();

    await sendOTPMail(employee.email, employee.otp);

    return res.status(201).json({
      success: true,
      message: "OTP resent to email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Reset Password API
const resetPassword = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide a token or new/confirm password.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  try {
    const employee = await Employee.findOne({ resetToken });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (Date.now() > employee.resetTokenExpire) {
      return res.status(400).json({
        success: false,
        message: "Token has expired.",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    employee.password = hashedPassword;
    employee.resetToken = null;
    employee.resetTokenExpire = null;

    if (!employee.isPasswordCreated) {
      employee.isPasswordCreated === true;
    }

    await employee.save();

    return res.status(201).json({
      success: true,
      message: "Password successfully reset.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  verifyEmail,
  setNewPassword,
  login,
  forgotPassword,
  resendOTP,
  verifyOTP,
  resetPassword,
};