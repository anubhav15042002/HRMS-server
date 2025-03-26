const express = require("express");

const {
  verifyEmail,
  setNewPassword,
  login,
  forgotPassword,
  resendOTP,
  verifyOTP,
  resetPassword,
} = require("../controllers/employeeController");

const {
  validateLogin,
  validateSetNewPassword,
  validateEmail,
  validateOTP,
  validateResetPassword,
} = require("../middleware/validationChecks");


const router = express.Router();

router.post("/verifyEmail", verifyEmail);
router.post("/setNewPassword", validateSetNewPassword, setNewPassword);
router.post("/login", validateLogin, login);
router.post("/forgot-password" , validateEmail , forgotPassword);
router.post("/resendOTP" , resendOTP);
router.post("/verifyOTP" , validateOTP , verifyOTP);
router.post("/resetPassword" , validateResetPassword , resetPassword);


module.exports = router;
