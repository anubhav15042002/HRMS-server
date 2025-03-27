const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 100,
  },
  contactNumber: {
    type: String,
    minLength: 10,
    maxLength: 10,
  },
  emergencyContactNumber: {
    type: String,
    // required: true,
    minLength: 10,
    maxLength: 10,
  },
  currentAddress: {
    type: String,
    // required: true,
    maxLength: 300,
  },
  permanentAddress: {
    type: String,
    // required: true,
    maxLength: 300,
  },
  role: {
    type: String,
    enum: ["Employee", "Manager", "HR"],
    required: true,
  },
  teamName: {
    type: String,
    required: true,
    maxLength: 30,
  },
  designation: {
    type: String,
    required: true,
    maxLength: 30,
  },
  password: {
    type: String,
    // required: true,
    minLength: 8,
  },
  tempToken: {
    type: String,
  },
  tempTokenExpire: {
    type: Date,
  },
  setPasswordToken: {
    type: String,
  },
  setPasswordTokenExpire: {
    type: Date,
  },
  dateOfJoining: {
    type: Date,
  },
  isPasswordCreated: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isFormFilled: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
  },
  otpExpire: {
    type: Date,
  },
  otpToken: {
    type: String,
  },
  resetToken:{
    type:String,
  },
  resetTokenExpire:{
    type: Date,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
