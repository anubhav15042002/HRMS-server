const { body } = require("express-validator");
const emailValidator = require("email-validator");

// Validation Checks for registration
const nameValidation = (name) => /^[A-Za-z\s]+$/.test(name);
const passwordValidation = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*()_+={}\[\]|\\:;"<>,.?/`~\-_]).{8,20}$/.test(
    password
  );
  

// Add New Employee Validation Middleware
const validateAddNewEmployee = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .trim()
    .escape()
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 to 50 characters")
    .custom((value) => {
      if (!nameValidation(value)) {
        throw new Error("Full name must only contain alphabets.");
      }
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Email address is required")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Email address should not exceed 100 characters")
    .custom((value) => {
      if (!emailValidator.validate(value)) {
        throw new Error("Invalid email format.");
      }
      return true;
    }),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Employee", "Manager", "HR"])
    .withMessage("Role must be either 'Employee','Manager' or 'HR'")
    .trim()
    .escape(),

  body("teamName")
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ max: 30 })
    .withMessage("Team name must be less than or equal to 30 characters")
    .trim()
    .escape(),

  body("designation")
    .notEmpty()
    .withMessage("Designation is required")
    .isLength({ max: 30 })
    .withMessage("Designation must be less than or equal to 30 characters")
    .trim()
    .escape(),
];

// Set New Password Validation Middleware
const validateSetNewPassword = [

  body("setPasswordToken")
  .notEmpty()
  .withMessage(" Password Token is required")
  .isLength({ min: 64, max: 64 })
  .withMessage("Password Token's length must be exactly 64")
  .trim()
  .escape(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .escape()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters.")
    .custom((value) => {
      if (!passwordValidation(value)) {
        throw new Error(
          "Password must contain one uppercase, one lowercase, and one special character or number."
        );
      }
      return true;
    }),

    body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .trim()
    .escape()
    .isLength({ min: 8, max: 20 })
    .withMessage("Confirm Password must be between 8 and 20 characters.")
    .custom((value) => {
      if (!passwordValidation(value)) {
        throw new Error(
          "Confirm Password must contain one uppercase, one lowercase, and one special character or number."
        );
      }
      return true;
    }),


];

// Login Validation Middleware
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email address is required")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Email address should not exceed 100 characters")
    .custom((value) => {
      if (!emailValidator.validate(value)) {
        throw new Error("Invalid email format.");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .escape()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters.")
    .custom((value) => {
      if (!passwordValidation(value)) {
        throw new Error(
          "Password must contain one uppercase, one lowercase, and one special character or number."
        );
      }
      return true;
    }),
];

// Forgot Password Email Validation Middleware
const validateEmail = [ 
  body("email")
  .notEmpty()
  .withMessage("Email address is required")
  .trim()
  .escape()
  .isLength({ max: 100 })
  .withMessage("Email address should not exceed 100 characters")
  .custom((value) => {
    if (!emailValidator.validate(value)) {
      throw new Error("Invalid email format.");
    }
    return true;
  }),
]

// Verify OTP Validation Middleware
const validateOTP = [

  body("otpToken")
  .notEmpty()
  .withMessage("OTP Token is required")
  .isLength({ min: 64, max: 64 })
  .withMessage("OTP Token's length must be exactly 64")
  .trim()
  .escape(),

  body('otp')
  .notEmpty()
  .withMessage('OTP is required')
  .isNumeric()
  .withMessage('OTP should contain only numbers')
  .isLength({ min: 6, max: 6 })
  .withMessage('OTP should be exactly 6 digits')
  .trim()
  .escape(),

]

// Reset Password Validation Middleware
const validateResetPassword = [

  body("resetToken")
  .notEmpty()
  .withMessage(" Reset Token is required")
  .isLength({ min: 64, max: 64 })
  .withMessage("Reset Token's length must be exactly 64")
  .trim()
  .escape(),

  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .trim()
    .escape()
    .isLength({ min: 8, max: 20 })
    .withMessage(" New Password must be between 8 and 20 characters.")
    .custom((value) => {
      if (!passwordValidation(value)) {
        throw new Error(
          "New Password must contain one uppercase, one lowercase, and one special character or number."
        );
      }
      return true;
    }),

    body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .trim()
    .escape()
    .isLength({ min: 8, max: 20 })
    .withMessage("Confirm Password must be between 8 and 20 characters.")
    .custom((value) => {
      if (!passwordValidation(value)) {
        throw new Error(
          "Confirm Password must contain one uppercase, one lowercase, and one special character or number."
        );
      }
      return true;
    }),


];

module.exports = {
  validateAddNewEmployee,
  validateSetNewPassword,
  validateLogin,
  validateEmail,
  validateOTP,
  validateResetPassword
};
