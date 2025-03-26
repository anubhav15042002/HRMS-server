const Employee = require("../models/employee");
const { validationResult } = require("express-validator");
const { generateRandomToken } = require("../utils/functions");
const { sendWelcomeEmail } = require("../utils/nodemailer");

// Add New Employee API for HR
const addNewEmployee = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { fullName, email, role, teamName, designation } = req.body;

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists.",
      });
    }

    const employee = await Employee.create({
      fullName,
      email,
      role,
      teamName,
      designation,
    });

    const tempToken = generateRandomToken(32);
    const tempTokenExpire = Date.now() + 48 * 60 * 60 * 1000; // 48 hours

    employee.tempToken = tempToken;
    employee.tempTokenExpire = tempTokenExpire;

    await employee.save();

    // Generate the verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${tempToken}`;

    await sendWelcomeEmail(employee.email, verificationUrl);

    return res.status(201).json({
      success: true,
      message: "New employee added successfully.",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = { addNewEmployee };
